
import { UserRole, NavigationItem, User } from './types';
import { HomeIcon, ShieldCheckIcon, UserGroupIcon, DocumentTextIcon, BellAlertIcon, CheckBadgeIcon, AcademicCapIcon, ScaleIcon, ChartBarIcon, CogIcon, UsersIcon, BriefcaseIcon, FireIcon, ClipboardDocumentListIcon, CalendarDaysIcon, WrenchScrewdriverIcon } from './components/icons/Icons';

export const APP_NAME = "Prevention & Safety Suite";
export const API_BASE_URL = "/api"; // Example, not used in this mock

export const ROLES = UserRole; // UserRole is imported and aliased to ROLES

export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/',
  RISK_MANAGEMENT: '/risks',
  INCIDENT_MANAGEMENT: '/incidents',
  COMMITTEE_MEETINGS: '/committee',
  DOCUMENT_MANAGEMENT: '/documents',
  ALERTS: '/alerts',
  AUDITS_INSPECTIONS: '/audits',
  TRAINING: '/training',
  COMPLIANCE: '/compliance',
  REPORTS: '/reports',
  SETTINGS: '/settings',
  ADMIN: '/admin', // Added for clarity
  ADMIN_USERS: '/admin/users',
  ADMIN_ROLES: '/admin/roles',
};

export const SIDEBAR_NAV_ITEMS: NavigationItem[] = [
  {
    path: ROUTES.DASHBOARD,
    name: 'Dashboard Ejecutivo',
    icon: HomeIcon,
    allowedRoles: [ROLES.GERENCIA, ROLES.RRHH, ROLES.PREVENCION, ROLES.COMITE, ROLES.OPERACIONES],
  },
  {
    path: ROUTES.RISK_MANAGEMENT,
    name: 'Gestión de Riesgos',
    icon: ShieldCheckIcon,
    allowedRoles: [ROLES.GERENCIA, ROLES.PREVENCION, ROLES.OPERACIONES],
  },
  {
    path: ROUTES.INCIDENT_MANAGEMENT,
    name: 'Gestión de Incidentes',
    icon: FireIcon,
    allowedRoles: [ROLES.GERENCIA, ROLES.PREVENCION, ROLES.RRHH, ROLES.OPERACIONES],
  },
  {
    path: ROUTES.COMMITTEE_MEETINGS,
    name: 'Comité Paritario',
    icon: UserGroupIcon,
    allowedRoles: [ROLES.GERENCIA, ROLES.PREVENCION, ROLES.COMITE, ROLES.RRHH],
  },
  {
    path: ROUTES.DOCUMENT_MANAGEMENT,
    name: 'Gestión Documental',
    icon: DocumentTextIcon,
    allowedRoles: [ROLES.GERENCIA, ROLES.PREVENCION, ROLES.RRHH, ROLES.COMITE, ROLES.OPERACIONES],
  },
  {
    path: ROUTES.ALERTS,
    name: 'Alertas Inteligentes',
    icon: BellAlertIcon,
    allowedRoles: [ROLES.GERENCIA, ROLES.PREVENCION],
  },
  {
    path: ROUTES.AUDITS_INSPECTIONS,
    name: 'Auditorías e Inspecciones',
    icon: CheckBadgeIcon,
    allowedRoles: [ROLES.GERENCIA, ROLES.PREVENCION],
  },
  {
    path: ROUTES.TRAINING,
    name: 'Capacitación',
    icon: AcademicCapIcon,
    allowedRoles: [ROLES.RRHH, ROLES.PREVENCION],
  },
  {
    path: ROUTES.COMPLIANCE,
    name: 'Cumplimiento Legal',
    icon: ScaleIcon,
    allowedRoles: [ROLES.GERENCIA, ROLES.PREVENCION],
  },
  {
    path: ROUTES.REPORTS,
    name: 'Reportes Avanzados',
    icon: ChartBarIcon,
    allowedRoles: [ROLES.GERENCIA, ROLES.PREVENCION, ROLES.RRHH],
  },
  // Example for role-specific sections
  {
    path: ROUTES.ADMIN, // Added path for the parent item
    name: 'Administración',
    icon: CogIcon,
    allowedRoles: [ROLES.GERENCIA], // Only Gerencia
    children: [
      { path: ROUTES.ADMIN_USERS, name: 'Gestión de Usuarios', icon: UsersIcon, allowedRoles: [ROLES.GERENCIA] },
      { path: ROUTES.ADMIN_ROLES, name: 'Gestión de Roles', icon: BriefcaseIcon, allowedRoles: [ROLES.GERENCIA] },
    ]
  },
];

export const MOCK_USERS: Record<string, Omit<User, 'id'>> = {
  'gerencia@preventionandsafety.com': { email: 'gerencia@preventionandsafety.com', name: 'Ana Gerente', role: ROLES.GERENCIA, avatarUrl: 'https://picsum.photos/seed/gerente/100/100' },
  'rrhh@preventionandsafety.com': { email: 'rrhh@preventionandsafety.com', name: 'Carlos RRHH', role: ROLES.RRHH, avatarUrl: 'https://picsum.photos/seed/rrhh/100/100' },
  'prevencion@preventionandsafety.com': { email: 'prevencion@preventionandsafety.com', name: 'Laura Prevención', role: ROLES.PREVENCION, avatarUrl: 'https://picsum.photos/seed/prevencion/100/100' },
  'comite@preventionandsafety.com': { email: 'comite@preventionandsafety.com', name: 'Pedro Comité', role: ROLES.COMITE, avatarUrl: 'https://picsum.photos/seed/comite/100/100' },
  'operaciones@preventionandsafety.com': { email: 'operaciones@preventionandsafety.com', name: 'Sofía Operaciones', role: ROLES.OPERACIONES, avatarUrl: 'https://picsum.photos/seed/operaciones/100/100' },
};
