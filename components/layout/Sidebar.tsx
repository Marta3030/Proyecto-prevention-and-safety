import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Home,
  Shield,
  AlertTriangle,
  Users,
  FileText,
  Bell,
  Search,
  GraduationCap,
  Award,
  BarChart3,
  Settings,
  ChevronRight,
  Leaf,
  ClipboardCheck,
  Eye,
  TreePine,
  Recycle,
  HardHat,
  Star,
  Target,
  Gauge
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import useUIStore from '../../store/uiStore';
import { UserRole } from '../../types';

// Estructura del menú con submódulos
const navigationStructure = [
  {
    id: 'dashboard',
    title: 'Panel Principal',
    path: '/dashboard',
    icon: Home,
    roles: [UserRole.ADMIN, UserRole.GERENCIA, UserRole.RRHH, UserRole.PREVENCION, UserRole.COMITE, UserRole.OPERACIONES]
  },
  {
    id: 'environmental',
    title: 'Gestión Ambiental',
    icon: Leaf,
    roles: [UserRole.ADMIN, UserRole.GERENCIA, UserRole.PREVENCION],
    children: [
      {
        id: 'environmental-aspects',
        title: 'Aspectos Ambientales', 
        path: '/environmental/aspects',
        icon: TreePine,
        roles: [UserRole.ADMIN, UserRole.GERENCIA, UserRole.PREVENCION]
      },
      {
        id: 'waste-management',
        title: 'Gestión de Residuos',
        path: '/environmental/waste',
        icon: Recycle,
        roles: [UserRole.ADMIN, UserRole.GERENCIA, UserRole.PREVENCION]
      },
      {
        id: 'environmental-monitoring',
        title: 'Monitoreo Ambiental',
        path: '/environmental/monitoring',
        icon: Eye,
        roles: [UserRole.ADMIN, UserRole.GERENCIA, UserRole.PREVENCION]
      },
      {
        id: 'legal-compliance',
        title: 'Compliance Legal',
        path: '/environmental/compliance',
        icon: ClipboardCheck,
        roles: [UserRole.ADMIN, UserRole.GERENCIA, UserRole.PREVENCION]
      },
      {
        id: 'environmental-impact',
        title: 'Impacto Ambiental',
        path: '/environmental/impact',
        icon: AlertTriangle,
        roles: [UserRole.ADMIN, UserRole.GERENCIA, UserRole.PREVENCION]
      }
    ]
  },
  {
    id: 'iso-quality',
    title: 'Gestión de Calidad',
    icon: Award,
    roles: [UserRole.ADMIN, UserRole.GERENCIA, UserRole.PREVENCION],
    children: [
      {
        id: 'non-conformities',
        title: 'No Conformidades',
        path: '/quality/non-conformities',
        icon: AlertTriangle,
        roles: [UserRole.ADMIN, UserRole.GERENCIA, UserRole.PREVENCION],
        badge: '5' // Ejemplo de badge
      },
      {
        id: 'corrective-actions',
        title: 'Acciones Correctivas',
        path: '/quality/corrective-actions',
        icon: ClipboardCheck,
        roles: [UserRole.ADMIN, UserRole.GERENCIA, UserRole.PREVENCION]
      },
      {
        id: 'customer-satisfaction',
        title: 'Satisfacción del Cliente',
        path: '/quality/satisfaction',
        icon: Users,
        roles: [UserRole.ADMIN, UserRole.GERENCIA, UserRole.PREVENCION]
      },
      {
        id: 'internal-audits',
        title: 'Auditorías Internas',
        path: '/quality/audits',
        icon: Search,
        roles: [UserRole.ADMIN, UserRole.GERENCIA, UserRole.PREVENCION]
      },
      {
        id: 'continuous-improvement',
        title: 'Mejora Continua',
        path: '/quality/improvement',
        icon: BarChart3,
        roles: [UserRole.ADMIN, UserRole.GERENCIA, UserRole.PREVENCION]
      }
    ]
  },
  {
    id: 'risk-management',
    title: 'Gestión de Riesgos',
    path: '/risk-management',
    icon: Shield,
    roles: [UserRole.ADMIN, UserRole.GERENCIA, UserRole.PREVENCION, UserRole.OPERACIONES]
  },
  {
    id: 'incidents',
    title: 'Gestión de Incidentes',
    path: '/incidents',
    icon: AlertTriangle,
    roles: [UserRole.ADMIN, UserRole.GERENCIA, UserRole.PREVENCION, UserRole.RRHH, UserRole.OPERACIONES]
  },
  {
    id: 'committee',
    title: 'Comité Paritario',
    path: '/committee',
    icon: HardHat,
    roles: [UserRole.ADMIN, UserRole.GERENCIA, UserRole.PREVENCION, UserRole.COMITE, UserRole.RRHH],
    // Mostrar que es subcredencial de Prevención
    parentRole: UserRole.PREVENCION
  },
  {
    id: 'documents',
    title: 'Gestión Documental',
    path: '/documents',
    icon: FileText,
    roles: [UserRole.ADMIN, UserRole.GERENCIA, UserRole.PREVENCION, UserRole.RRHH, UserRole.COMITE, UserRole.OPERACIONES]
  },
  {
    id: 'alerts',
    title: 'Alertas',
    path: '/alerts',
    icon: Bell,
    roles: [UserRole.ADMIN, UserRole.GERENCIA, UserRole.PREVENCION]
  },
  {
    id: 'audits',
    title: 'Auditorías e Inspecciones',
    path: '/audits',
    icon: Search,
    roles: [UserRole.ADMIN, UserRole.GERENCIA, UserRole.PREVENCION]
  },
  {
    id: 'training',
    title: 'Capacitaciones',
    path: '/training',
    icon: GraduationCap,
    roles: [UserRole.ADMIN, UserRole.RRHH, UserRole.PREVENCION]
  },
  {
    id: 'compliance',
    title: 'Cumplimiento ISO',
    path: '/compliance',
    icon: Award,
    roles: [UserRole.ADMIN, UserRole.GERENCIA, UserRole.PREVENCION]
  },
  {
    id: 'iso-standards',
    title: 'Estándares ISO',
    icon: Award,
    roles: [UserRole.ADMIN, UserRole.GERENCIA, UserRole.PREVENCION, UserRole.OPERACIONES],
    children: [
      {
        id: 'iso-45001',
        title: 'ISO 45001 - SST',
        path: '/iso/45001',
        icon: Shield,
        roles: [UserRole.ADMIN, UserRole.GERENCIA, UserRole.PREVENCION]
      },
      {
        id: 'iso-14001',
        title: 'ISO 14001 - Ambiental',
        path: '/iso/14001',
        icon: Leaf,
        roles: [UserRole.ADMIN, UserRole.GERENCIA, UserRole.PREVENCION, UserRole.OPERACIONES]
      },
      {
        id: 'iso-9001',
        title: 'ISO 9001 - Calidad',
        path: '/iso/9001',
        icon: Star,
        roles: [UserRole.ADMIN, UserRole.GERENCIA, UserRole.PREVENCION, UserRole.OPERACIONES]
      }
    ]
  },
  {
    id: 'reports',
    title: 'Reportes y Analytics',
    path: '/reports',
    icon: BarChart3,
    roles: [UserRole.ADMIN, UserRole.GERENCIA, UserRole.PREVENCION, UserRole.RRHH]
  },
  {
    id: 'training-docs',
    title: 'Capacitación y Documentación',
    path: '/training-docs',
    icon: FileText,
    roles: [UserRole.ADMIN, UserRole.RRHH, UserRole.PREVENCION]
  },
  {
    id: 'document-management',
    title: 'Gestión Documental',
    path: '/document-management',
    icon: FileText,
    roles: [UserRole.ADMIN, UserRole.GERENCIA, UserRole.PREVENCION, UserRole.RRHH, UserRole.COMITE, UserRole.OPERACIONES]
  },
  {
    id: 'settings',
    title: 'Configuración',
    path: '/settings',
    icon: Settings,
    roles: [UserRole.ADMIN, UserRole.GERENCIA, UserRole.RRHH, UserRole.PREVENCION, UserRole.COMITE, UserRole.OPERACIONES]
  }
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { sidebarOpen } = useUIStore();
  const { t } = useTranslation();

  // Filtrar elementos según el rol del usuario
  const getVisibleItems = () => {
    if (!user) return [];
    
    return navigationStructure.filter(item => {
      // Si el item tiene parentRole, verificar si el usuario actual es ese parent o tiene el rol específico
      if (item.parentRole) {
        return user.role === item.parentRole || item.roles.includes(user.role);
      }
      return item.roles.includes(user.role);
    });
  };

  const hasPermission = (roles: UserRole[]) => {
    return user && roles.includes(user.role);
  };

  const isActiveItem = (path?: string, children?: any[]) => {
    if (path) {
      return location.pathname === path;
    }
    if (children) {
      return children.some(child => location.pathname === child.path);
    }
    return false;
  };

  const visibleItems = getVisibleItems();

  return (
    <div className={`${
      sidebarOpen ? 'translate-x-0' : '-translate-x-full'
    } fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-pns-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
      
      {/* Header del Sidebar */}
      <div className="flex items-center justify-center h-16 px-4 border-b border-pns-gray-200 dark:border-pns-gray-700">
        <div className="text-center">
          <h2 className="text-sm font-bold text-pns-orange uppercase tracking-wide">
            Prevention & Safety
          </h2>
          <p className="text-xs text-pns-gray-500 dark:text-pns-gray-400">
            {user?.role} Dashboard
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        {visibleItems.map((item) => (
          <div key={item.id}>
            {item.children ? (
              // Item con submenu
              <div className="space-y-1">
                <div className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
                  isActiveItem(undefined, item.children)
                    ? 'bg-pns-orange text-white'
                    : 'text-pns-gray-700 dark:text-pns-gray-300 hover:bg-pns-gray-100 dark:hover:bg-pns-gray-700'
                }`}>
                  <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  <span className="flex-1">{item.title}</span>
                  <ChevronRight className="h-4 w-4" />
                </div>
                
                {/* Submenu items */}
                <div className="ml-4 space-y-1">
                  {item.children
                    .filter(child => hasPermission(child.roles))
                    .map((child) => (
                      <NavLink
                        key={child.id}
                        to={child.path}
                        className={({ isActive }) =>
                          `flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                            isActive
                              ? 'bg-pns-orange text-white'
                              : 'text-pns-gray-600 dark:text-pns-gray-400 hover:bg-pns-gray-100 dark:hover:bg-pns-gray-700 hover:text-pns-gray-900 dark:hover:text-white'
                          }`
                        }
                      >
                        <child.icon className="mr-3 h-4 w-4 flex-shrink-0" />
                        <span className="flex-1">{child.title}</span>
                        {child.badge && (
                          <span className="ml-2 px-2 py-1 text-xs bg-red-500 text-white rounded-full">
                            {child.badge}
                          </span>
                        )}
                      </NavLink>
                    ))}
                </div>
              </div>
            ) : (
              // Item simple
              <NavLink
                to={item.path || '#'}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-pns-orange text-white'
                      : 'text-pns-gray-700 dark:text-pns-gray-300 hover:bg-pns-gray-100 dark:hover:bg-pns-gray-700'
                  }`
                }
              >
                <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                <span className="flex-1">{item.title}</span>
                
                {/* Indicador de subcredencial */}
                {item.parentRole && user?.role === UserRole.COMITE && (
                  <span className="text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-1 rounded">
                    Sub
                  </span>
                )}
              </NavLink>
            )}
          </div>
        ))}
      </nav>

      {/* Footer del Sidebar */}
      <div className="p-4 border-t border-pns-gray-200 dark:border-pns-gray-700">
        <div className="text-center">
          <div className="text-xs text-pns-gray-500 dark:text-pns-gray-400">
            Conectado como
          </div>
          <div className="text-sm font-medium text-pns-gray-900 dark:text-white truncate">
            {user?.name}
          </div>
          <div className="text-xs text-pns-orange">
            {user?.role}
            {user?.role === UserRole.COMITE && (
              <span className="ml-1 text-pns-gray-500">
                (Prevención)
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
