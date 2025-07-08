import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import { User } from '../users/entities/user.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { LoginDto, RegisterDto, RefreshTokenDto, ChangePasswordDto } from './dto/auth.dto';

interface AuthResult {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
}

interface TokenPayload {
  sub: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private refreshTokensRepository: Repository<RefreshToken>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto, ipAddress?: string, userAgent?: string): Promise<AuthResult> {
    const { email, password, name, role, avatarUrl } = registerDto;

    // Check if user already exists
    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const saltRounds = parseInt(this.configService.get('BCRYPT_SALT_ROUNDS')) || 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
      name,
      role,
      avatarUrl,
      isActive: true,
    });

    const savedUser = await this.usersRepository.save(user);

    // Generate tokens
    const tokens = await this.generateTokens(savedUser, ipAddress, userAgent);

    // Remove password from response
    delete savedUser.password;

    return {
      user: savedUser,
      tokens,
    };
  }

  async login(loginDto: LoginDto, ipAddress?: string, userAgent?: string): Promise<AuthResult> {
    const { email, password, rememberMe } = loginDto;

    // Find user by email
    const user = await this.usersRepository.findOne({
      where: { email },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update last login
    user.lastLogin = new Date();
    await this.usersRepository.save(user);

    // Generate tokens
    const tokens = await this.generateTokens(user, ipAddress, userAgent, rememberMe);

    // Remove password from response
    delete user.password;

    return {
      user,
      tokens,
    };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto, ipAddress?: string, userAgent?: string): Promise<AuthResult> {
    const { refreshToken } = refreshTokenDto;

    // Find refresh token in database
    const storedToken = await this.refreshTokensRepository.findOne({
      where: { token: refreshToken, revoked: false },
      relations: ['user'],
    });

    if (!storedToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Check if token is expired
    if (storedToken.expiresAt < new Date()) {
      // Revoke expired token
      storedToken.revoked = true;
      await this.refreshTokensRepository.save(storedToken);
      throw new UnauthorizedException('Refresh token expired');
    }

    // Verify JWT
    try {
      this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });
    } catch (error) {
      // Revoke invalid token
      storedToken.revoked = true;
      await this.refreshTokensRepository.save(storedToken);
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Check if user is still active
    if (!storedToken.user.isActive) {
      throw new UnauthorizedException('User account is inactive');
    }

    // Revoke old token
    storedToken.revoked = true;
    await this.refreshTokensRepository.save(storedToken);

    // Generate new tokens
    const tokens = await this.generateTokens(storedToken.user, ipAddress, userAgent);

    // Remove password from response
    delete storedToken.user.password;

    return {
      user: storedToken.user,
      tokens,
    };
  }

  async logout(refreshToken: string): Promise<void> {
    const storedToken = await this.refreshTokensRepository.findOne({
      where: { token: refreshToken },
    });

    if (storedToken) {
      storedToken.revoked = true;
      await this.refreshTokensRepository.save(storedToken);
    }
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<void> {
    const { currentPassword, newPassword } = changePasswordDto;

    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    // Hash new password
    const saltRounds = parseInt(this.configService.get('BCRYPT_SALT_ROUNDS')) || 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    user.password = hashedNewPassword;
    await this.usersRepository.save(user);

    // Revoke all refresh tokens for this user (force re-login on all devices)
    await this.refreshTokensRepository.update(
      { userId: user.id },
      { revoked: true }
    );
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({
      where: { email },
    });

    if (user && user.isActive) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        delete user.password;
        return user;
      }
    }

    return null;
  }

  async findUserById(userId: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({
      where: { id: userId, isActive: true },
    });

    if (user) {
      delete user.password;
    }

    return user;
  }

  private async generateTokens(
    user: User,
    ipAddress?: string,
    userAgent?: string,
    rememberMe = false
  ): Promise<{ accessToken: string; refreshToken: string; expiresIn: number }> {
    const payload: TokenPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    // Generate access token
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get('JWT_ACCESS_EXPIRES_IN'),
    });

    // Generate refresh token
    const refreshTokenExpiry = rememberMe ? '30d' : this.configService.get('JWT_REFRESH_EXPIRES_IN');
    const refreshToken = this.jwtService.sign(
      { sub: user.id, type: 'refresh' },
      {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: refreshTokenExpiry,
      }
    );

    // Save refresh token to database
    const expiresAt = new Date();
    const expiryDays = rememberMe ? 30 : 7;
    expiresAt.setDate(expiresAt.getDate() + expiryDays);

    const refreshTokenEntity = this.refreshTokensRepository.create({
      token: refreshToken,
      userId: user.id,
      expiresAt,
      ipAddress,
      userAgent,
    });

    await this.refreshTokensRepository.save(refreshTokenEntity);

    // Parse access token expiry
    const accessTokenExpiry = this.configService.get('JWT_ACCESS_EXPIRES_IN');
    const expiresIn = this.parseExpiry(accessTokenExpiry);

    return {
      accessToken,
      refreshToken,
      expiresIn,
    };
  }

  private parseExpiry(expiry: string): number {
    const unit = expiry.slice(-1);
    const value = parseInt(expiry.slice(0, -1));

    switch (unit) {
      case 's':
        return value;
      case 'm':
        return value * 60;
      case 'h':
        return value * 60 * 60;
      case 'd':
        return value * 60 * 60 * 24;
      default:
        return 900; // 15 minutes default
    }
  }

  // Clean up expired refresh tokens (should be called periodically)
  async cleanupExpiredTokens(): Promise<void> {
    await this.refreshTokensRepository
      .createQueryBuilder()
      .delete()
      .where('expiresAt < :now OR revoked = :revoked', {
        now: new Date(),
        revoked: true,
      })
      .execute();
  }
}