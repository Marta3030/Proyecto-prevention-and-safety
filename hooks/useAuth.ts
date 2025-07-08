
import useAuthStore from '../store/authStore';
import { UserRole } from '../types';

export const useAuth = () => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const tokens = useAuthStore((state) => state.tokens);
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const clearError = useAuthStore((state) => state.clearError);
  const setCurrentUser = useAuthStore((state) => state.setCurrentUser);
  const setTokens = useAuthStore((state) => state.setTokens);

  const hasRole = (roles: UserRole[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    tokens,
    login,
    logout,
    refreshToken,
    clearError,
    setCurrentUser,
    setTokens,
    userRole: user?.role,
    hasRole,
  };
};
