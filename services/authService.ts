import { api, apiRequest, TokenManager } from './api';
import { 
  LoginCredentials, 
  RegisterData, 
  AuthResponse, 
  User, 
  AuthTokens, 
  ApiResponse 
} from '../types';

export class AuthService {
  // Login user
  static async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    return apiRequest<AuthResponse>(() =>
      api.post('/auth/login', credentials)
    );
  }

  // Register user (admin only in production)
  static async register(userData: RegisterData): Promise<ApiResponse<User>> {
    return apiRequest<User>(() =>
      api.post('/auth/register', userData)
    );
  }

  // Refresh token
  static async refreshToken(): Promise<ApiResponse<AuthTokens>> {
    const refreshToken = TokenManager.getRefreshToken();
    
    if (!refreshToken) {
      return {
        success: false,
        error: 'No refresh token available',
      };
    }

    return apiRequest<AuthTokens>(() =>
      api.post('/auth/refresh', { refreshToken })
    );
  }

  // Get current user profile
  static async getCurrentUser(): Promise<ApiResponse<User>> {
    return apiRequest<User>(() =>
      api.get('/auth/me')
    );
  }

  // Update user profile
  static async updateProfile(userData: Partial<User>): Promise<ApiResponse<User>> {
    return apiRequest<User>(() =>
      api.patch('/auth/profile', userData)
    );
  }

  // Change password
  static async changePassword(
    currentPassword: string, 
    newPassword: string
  ): Promise<ApiResponse<void>> {
    return apiRequest<void>(() =>
      api.patch('/auth/change-password', {
        currentPassword,
        newPassword,
      })
    );
  }

  // Logout (call backend to invalidate token)
  static async logout(): Promise<ApiResponse<void>> {
    const refreshToken = TokenManager.getRefreshToken();
    
    try {
      await api.post('/auth/logout', { refreshToken });
    } catch (error) {
      // Continue with local logout even if backend call fails
      console.warn('Logout API call failed:', error);
    }
    
    // Always clear local tokens
    TokenManager.clearTokens();
    
    return {
      success: true,
      message: 'Sesión cerrada correctamente',
    };
  }

  // Forgot password
  static async forgotPassword(email: string): Promise<ApiResponse<void>> {
    return apiRequest<void>(() =>
      api.post('/auth/forgot-password', { email })
    );
  }

  // Reset password
  static async resetPassword(
    token: string, 
    newPassword: string
  ): Promise<ApiResponse<void>> {
    return apiRequest<void>(() =>
      api.post('/auth/reset-password', {
        token,
        newPassword,
      })
    );
  }

  // Verify email (if email verification is implemented)
  static async verifyEmail(token: string): Promise<ApiResponse<void>> {
    return apiRequest<void>(() =>
      api.post('/auth/verify-email', { token })
    );
  }

  // Check if user is authenticated locally
  static isAuthenticated(): boolean {
    const token = TokenManager.getAccessToken();
    return token !== null && !TokenManager.isTokenExpired(token);
  }

  // Mock login for development (until backend is ready)
  static async mockLogin(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock users for development
    const mockUsers: Record<string, any> = {
      'admin@pns.com': { 
        id: '1', 
        name: 'Administrador', 
        email: 'admin@pns.com', 
        role: 'Admin',
        isActive: true,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      },
      'gerencia@pns.com': { 
        id: '2', 
        name: 'Director General', 
        email: 'gerencia@pns.com', 
        role: 'Gerencia',
        isActive: true,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      },
      'rrhh@pns.com': { 
        id: '3', 
        name: 'Jefe RRHH', 
        email: 'rrhh@pns.com', 
        role: 'RRHH',
        isActive: true,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      },
    };

    const user = mockUsers[credentials.email];
    
    if (user && credentials.password === 'password123') {
      const mockTokens: AuthTokens = {
        accessToken: 'mock-access-token-' + Date.now(),
        refreshToken: 'mock-refresh-token-' + Date.now(),
        expiresIn: 3600, // 1 hour
      };

      return {
        success: true,
        data: {
          user,
          tokens: mockTokens,
        },
        message: 'Login exitoso',
      };
    } else {
      return {
        success: false,
        error: 'Credenciales inválidas',
      };
    }
  }
}

export default AuthService;