import { ReactNode, FC } from 'react';

export enum UserRole {
  ADMIN = 'Admin',
  GERENCIA = 'Gerencia',
  RRHH = 'RRHH',
  PREVENCION = 'Prevencion',
  COMITE = 'Comite',
  OPERACIONES = 'Operaciones',
  PUBLIC = 'Public' // For non-authenticated users or common views
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt?: string;
  lastLogin?: string;
  isActive?: boolean;
}

// JWT Token structure
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// API Response interfaces
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Auth DTOs
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

// Component types
export type IconType = FC<{ className?: string }>;

export interface NavigationItem {
  path: string;
  name: string;
  icon: IconType;
  allowedRoles: UserRole[];
  children?: NavigationItem[]; // For nested navigation
}

export interface KPI {
  title: string;
  value: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon: IconType;
  colorClass: string;
}

export interface Meeting {
  id: string;
  date: string;
  title: string;
  attendees: number;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
}

export enum RiskLevel {
  LOW = 'Bajo',
  MEDIUM = 'Medio',
  HIGH = 'Alto',
  CRITICAL = 'Crítico'
}

export interface RiskItem {
  id: string;
  area: string;
  hazard: string;
  risk: string;
  level: RiskLevel;
  controls: string;
}

// Enhanced Auth State for Zustand
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  tokens: AuthTokens | null;
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  setCurrentUser: (user: User | null) => void;
  setTokens: (tokens: AuthTokens | null) => void;
  clearError: () => void;
}

export interface UIState {
  darkMode: boolean;
  sidebarOpen: boolean;
  language: 'es' | 'en';
  notifications: Notification[];
  
  // Actions
  toggleDarkMode: () => void;
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  setLanguage: (language: 'es' | 'en') => void;
  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
}

// Notification system
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  timestamp: Date;
}

// Form validation
export interface FormError {
  field: string;
  message: string;
}

// Protected Route props
export interface ProtectedRouteProps {
  children?: ReactNode;
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

// API Error structure
export interface ApiError {
  status: number;
  message: string;
  details?: any;
}