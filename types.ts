import { ReactNode, FC } from 'react';

export enum UserRole {
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
}

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

// For Zustand stores
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  setCurrentUser: (user: User | null) => void; 
}

export interface UIState {
  darkMode: boolean;
  sidebarOpen: boolean;
  toggleDarkMode: () => void;
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
}