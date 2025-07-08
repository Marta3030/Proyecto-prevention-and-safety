
import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  Users, 
  FileText,
  Calendar,
  Award,
  Activity,
  Target
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

// Mock data for the dashboard
const riskData = [
  { level: 'Bajo', value: 45, color: '#10b981' },
  { level: 'Moderado', value: 30, color: '#f59e0b' },
  { level: 'Alto', value: 20, color: '#ef4444' },
  { level: 'Muy Alto', value: 5, color: '#dc2626' },
];

const complianceData = [
  { standard: 'ISO 45001 (SST)', percentage: 92, color: '#f97316' },
  { standard: 'ISO 14001 (Ambiental)', percentage: 88, color: '#f97316' },
  { standard: 'ISO 9001 (Calidad)', percentage: 95, color: '#f97316' },
];

const recentActivities = [
  { 
    id: 1, 
    type: 'risk', 
    title: 'Nuevo riesgo identificado', 
    description: 'Área de Laboratorio - hace 1 hora',
    icon: AlertTriangle,
    color: 'text-red-500'
  },
  { 
    id: 2, 
    type: 'training', 
    title: 'Capacitación completada', 
    description: 'Manejo de EPP - 15 empleados',
    icon: CheckCircle,
    color: 'text-green-500'
  },
  { 
    id: 3, 
    type: 'audit', 
    title: 'Auditoría programada', 
    description: 'ISO 9001 - próximo lunes',
    icon: Calendar,
    color: 'text-blue-500'
  },
  { 
    id: 4, 
    type: 'action', 
    title: 'Acción correctiva vencida', 
    description: 'Departamento de Producción',
    icon: Target,
    color: 'text-orange-500'
  },
];

const quickActions = [
  { 
    title: 'Reportar Riesgo', 
    description: 'Identificar nuevo riesgo', 
    icon: AlertTriangle, 
    color: 'bg-red-500 hover:bg-red-600',
    path: '/risk-management'
  },
  { 
    title: 'Registrar Incidente', 
    description: 'Crear nuevo reporte', 
    icon: FileText, 
    color: 'bg-orange-500 hover:bg-orange-600',
    path: '/incidents'
  },
  { 
    title: 'Programar Auditoría', 
    description: 'Nueva inspección', 
    icon: Calendar, 
    color: 'bg-blue-500 hover:bg-blue-600',
    path: '/audits'
  },
  { 
    title: 'Nueva Capacitación', 
    description: 'Programar entrenamiento', 
    icon: Users, 
    color: 'bg-green-500 hover:bg-green-600',
    path: '/training'
  },
];

const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-pns-gray-50 dark:bg-pns-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-pns-gray-800 shadow-sm border-b border-pns-gray-200 dark:border-pns-gray-700">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-pns-gray-900 dark:text-white">
                {t('dashboard.welcome')}
              </h1>
              <p className="text-pns-gray-600 dark:text-pns-gray-300">
                Bienvenido, {user?.name}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-pns-gray-500 dark:text-pns-gray-400">
                  {new Date().toLocaleDateString('es-ES', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <div
              key={index}
              className={`${action.color} rounded-lg p-4 text-white cursor-pointer transform hover:scale-105 transition-all duration-200 shadow-lg`}
            >
              <div className="flex items-center space-x-3">
                <action.icon className="h-8 w-8" />
                <div>
                  <h3 className="font-semibold text-sm">{action.title}</h3>
                  <p className="text-xs opacity-90">{action.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Risk Distribution Chart */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-pns-gray-900 dark:text-white mb-4">
              Por nivel de riesgo
            </h3>
            <div className="space-y-3">
              {riskData.map((risk, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: risk.color }}
                    ></div>
                    <span className="text-sm text-pns-gray-700 dark:text-pns-gray-300">
                      {risk.level}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-pns-gray-900 dark:text-white">
                    {risk.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-pns-gray-900 dark:text-white">
                Actividades Recientes
              </h3>
              <Activity className="h-5 w-5 text-pns-gray-400" />
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`p-1 rounded-full ${activity.color.replace('text-', 'bg-').replace('500', '100')}`}>
                    <activity.icon className={`h-4 w-4 ${activity.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-pns-gray-900 dark:text-white">
                      {activity.title}
                    </p>
                    <p className="text-xs text-pns-gray-500 dark:text-pns-gray-400">
                      {activity.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Control Percentage */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-pns-gray-900 dark:text-white mb-4">
              Porcentaje de riesgos controlados
            </h3>
            <div className="space-y-3">
              <div className="text-center">
                <div className="text-3xl font-bold text-pns-orange">87%</div>
                <div className="text-sm text-pns-gray-500 dark:text-pns-gray-400">
                  Riesgos bajo control
                </div>
              </div>
              <div className="w-full bg-pns-gray-200 dark:bg-pns-gray-700 rounded-full h-2">
                <div 
                  className="bg-pns-orange h-2 rounded-full transition-all duration-300"
                  style={{ width: '87%' }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Compliance Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ISO Compliance */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-pns-gray-900 dark:text-white">
                🔒 Cumplimiento por Norma ISO
              </h3>
              <Award className="h-5 w-5 text-pns-orange" />
            </div>
            <div className="space-y-4">
              {complianceData.map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-pns-gray-700 dark:text-pns-gray-300">
                      {item.standard}
                    </span>
                    <span className="text-sm font-semibold text-pns-gray-900 dark:text-white">
                      {item.percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-pns-gray-200 dark:bg-pns-gray-700 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${item.percentage}%`,
                        backgroundColor: item.color
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Trends */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-pns-gray-900 dark:text-white">
                Últimos 6 meses
              </h3>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-green-800 dark:text-green-200">
                    Incidentes reducidos
                  </div>
                  <div className="text-xs text-green-600 dark:text-green-300">
                    Vs. período anterior
                  </div>
                </div>
                <div className="text-lg font-bold text-green-600">
                  -23%
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    Capacitaciones completadas
                  </div>
                  <div className="text-xs text-blue-600 dark:text-blue-300">
                    Este mes
                  </div>
                </div>
                <div className="text-lg font-bold text-blue-600">
                  +45%
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-orange-800 dark:text-orange-200">
                    Cumplimiento general
                  </div>
                  <div className="text-xs text-orange-600 dark:text-orange-300">
                    Promedio ISO
                  </div>
                </div>
                <div className="text-lg font-bold text-orange-600">
                  91.7%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
