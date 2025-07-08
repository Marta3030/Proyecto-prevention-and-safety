import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    const users = await this.usersRepository.find({
      where: { isActive: true },
      select: ['id', 'name', 'email', 'role', 'avatarUrl', 'isActive', 'lastLogin', 'createdAt', 'updatedAt'],
    });
    
    return users;
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id, isActive: true },
      select: ['id', 'name', 'email', 'role', 'avatarUrl', 'isActive', 'lastLogin', 'createdAt', 'updatedAt'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email, isActive: true },
    });
  }

  async update(id: string, updateData: Partial<User>): Promise<User> {
    const user = await this.findOne(id);
    
    // Remove sensitive fields that shouldn't be updated directly
    const { password, ...allowedUpdateData } = updateData;
    
    Object.assign(user, allowedUpdateData);
    
    const updatedUser = await this.usersRepository.save(user);
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = updatedUser;
    
    return userWithoutPassword as User;
  }

  async deactivate(id: string): Promise<void> {
    const user = await this.findOne(id);
    
    user.isActive = false;
    await this.usersRepository.save(user);
  }

  async activate(id: string): Promise<void> {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.isActive = true;
    await this.usersRepository.save(user);
  }
}