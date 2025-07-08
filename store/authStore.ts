
import { create } from 'zustand';
import { AuthState, User, LoginCredentials, AuthTokens } from '../types';
import AuthService from '../services/authService';
import { TokenManager } from '../services/api';

const useAuthStore = create<AuthState>((set, get: () => AuthState) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  tokens: null,

  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true, error: null });
    
    try {
      // Use mock login for development, switch to real API when backend is ready
      const response = await AuthService.mockLogin(credentials);
      
      if (response.success && response.data) {
        const { user, tokens } = response.data;
        
        // Store tokens
        TokenManager.setTokens(tokens);
        
        // Update state
        set({ 
          user, 
          tokens,
          isAuthenticated: true, 
          isLoading: false,
          error: null 
        });
        
        // Store user in localStorage for persistence
        localStorage.setItem('currentUser', JSON.stringify(user));
      } else {
        set({ 
          error: response.error || 'Error de autenticación', 
          isLoading: false,
          user: null,
          isAuthenticated: false,
          tokens: null
        });
        TokenManager.clearTokens();
        localStorage.removeItem('currentUser');
      }
    } catch (error) {
      console.error('Login error:', error);
      set({ 
        error: 'Error de conexión. Intenta nuevamente.', 
        isLoading: false,
        user: null,
        isAuthenticated: false,
        tokens: null
      });
      TokenManager.clearTokens();
      localStorage.removeItem('currentUser');
    }
  },

  refreshToken: async () => {
    try {
      const response = await AuthService.refreshToken();
      
      if (response.success && response.data) {
        const tokens = response.data;
        TokenManager.setTokens(tokens);
        set({ tokens, error: null });
      } else {
        // Refresh failed, logout user
        get().logout();
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      get().logout();
    }
  },

  logout: async () => {
    set({ isLoading: true });
    
    try {
      await AuthService.logout();
    } catch (error) {
      console.warn('Logout API error:', error);
    }
    
    // Clear all auth state
    set({ 
      user: null, 
      isAuthenticated: false, 
      isLoading: false, 
      error: null,
      tokens: null 
    });
    
    // Clear local storage
    localStorage.removeItem('currentUser');
    TokenManager.clearTokens();
  },

  setCurrentUser: (user: User | null) => {
    if (user) {
      set({ 
        user, 
        isAuthenticated: true, 
        isLoading: false,
        error: null 
      });
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false 
      });
      localStorage.removeItem('currentUser');
      TokenManager.clearTokens();
    }
  },

  setTokens: (tokens: AuthTokens | null) => {
    if (tokens) {
      TokenManager.setTokens(tokens);
      set({ tokens });
    } else {
      TokenManager.clearTokens();
      set({ tokens: null });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));

// Initialize auth state from localStorage and tokens
const initializeAuth = () => {
  const storedUser = localStorage.getItem('currentUser');
  const accessToken = TokenManager.getAccessToken();
  
  if (storedUser && accessToken) {
    try {
      const user: User = JSON.parse(storedUser);
      
      // Check if token is still valid
      if (!TokenManager.isTokenExpired(accessToken)) {
        const refreshToken = TokenManager.getRefreshToken();
        const tokens = refreshToken ? {
          accessToken,
          refreshToken,
          expiresIn: 3600 // This should be parsed from token
        } : null;
        
        useAuthStore.setState({ 
          user, 
          isAuthenticated: true, 
          tokens,
          isLoading: false 
        });
      } else {
        // Token expired, try to refresh
        useAuthStore.getState().refreshToken();
      }
    } catch (error) {
      console.error("Failed to parse stored user:", error);
      localStorage.removeItem('currentUser');
      TokenManager.clearTokens();
    }
  }
};

// Initialize on store creation
initializeAuth();

export default useAuthStore;
