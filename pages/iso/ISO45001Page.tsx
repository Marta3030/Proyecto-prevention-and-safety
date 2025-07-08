import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Shield,
  AlertTriangle,
  TrendingDown,
  Users,
  Calendar,
  FileText,
  Plus,
  Download,
  Upload,
  Target,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  Eye
} from 'lucide-react';
import EvidenceUploadSystem from '../../components/evidence/EvidenceUploadSystem';

// Mock data para ISO 45001
const sstKpis = [
  {
    title: 'Índice de Frecuencia',
    value: '0.85',
    target: '< 1.0',
    trend: 'down',
    trendValue: '-15%',
    icon: TrendingDown,
    color: 'text-green-500',
    description: 'Accidentes por millón de horas trabajadas'
  },
  {
    title: 'Días Sin Accidentes',
    value: '127',
    target: '> 100',
    trend: 'up',
    trendValue: '+12 días',
    icon: Calendar,
    color: 'text-blue-500',
    description: 'Días consecutivos sin accidentes con tiempo perdido'
  },
  {
    title: 'Capacitaciones SST',
    value: '96%',
    target: '95%',
    trend: 'up',
    trendValue: '+3%',
    icon: Users,
    color: 'text-purple-500',
    description: 'Personal capacitado en seguridad'
  },
  {
    title: 'Cumplimiento',
    value: '92%',
    target: '90%',
    trend: 'up',
    trendValue: '+2%',
    icon: Shield,
    color: 'text-orange-500',
    description: 'Cumplimiento de requisitos ISO 45001'
  }
];

const recentIncidents = [
  {
    id: 1,
    type: 'Incident',
    severity: 'Low',
    title: 'Corte menor en área de producción',
    area: 'Producción',
    date: '2024-01-15',
    status: 'Investigado',
    investigator: 'Juan Pérez'
  },
  {
    id: 2,
    type: 'Near Miss',
    severity: 'Medium',
    title: 'Casi caída por piso mojado',
    area: 'Almacén',
    date: '2024-01-14',
    status: 'En Investigación',
    investigator: 'Ana García'
  },
  {
    id: 3,
    type: 'Hazard',
    severity: 'High',
    title: 'Equipo con mantenimiento vencido',
    area: 'Laboratorio',
    date: '2024-01-13',
    status: 'Acción Correctiva',
    investigator: 'Carlos López'
  }
];

const trainingPrograms = [
  {
    id: 1,
    name: 'Uso de EPP',
    completed: 45,
    total: 50,
    dueDate: '2024-02-15',
    status: 'En Progreso'
  },
  {
    id: 2,
    name: 'Trabajo en Altura',
    completed: 12,
    total: 15,
    dueDate: '2024-02-20',
    status: 'En Progreso'
  },
  {
    id: 3,
    name: 'Manejo de Químicos',
    completed: 8,
    total: 8,
    dueDate: '2024-01-30',
    status: 'Completado'
  }
];

// Categorías de evidencia para ISO 45001
const iso45001Categories = [
  { id: 'policies', name: 'Políticas de Seguridad', icon: Shield, color: 'text-blue-500', isoStandard: 'ISO45001' as const, requiredDocuments: ['Política SST', 'Objetivos SST'] },
  { id: 'procedures', name: 'Procedimientos', icon: FileText, color: 'text-green-500', isoStandard: 'ISO45001' as const, requiredDocuments: ['Procedimientos operacionales', 'Procedimientos de emergencia'] },
  { id: 'training', name: 'Registros de Capacitación', icon: Users, color: 'text-purple-500', isoStandard: 'ISO45001' as const, requiredDocuments: ['Registros de capacitación', 'Certificados de competencia'] },
  { id: 'investigations', name: 'Investigaciones', icon: AlertTriangle, color: 'text-red-500', isoStandard: 'ISO45001' as const, requiredDocuments: ['Informes de investigación', 'Análisis de causas'] },
  { id: 'audits', name: 'Auditorías', icon: Target, color: 'text-orange-500', isoStandard: 'ISO45001' as const, requiredDocuments: ['Programas de auditoría', 'Informes de auditoría'] },
  { id: 'certificates', name: 'Certificados', icon: CheckCircle, color: 'text-teal-500', isoStandard: 'ISO45001' as const, requiredDocuments: ['Certificados de calibración', 'Certificados médicos'] }
];

const ISO45001Page: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderKPICard = (kpi: any) => (
    <div key={kpi.title} className="card p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
            <h3 className="text-sm font-medium text-pns-gray-500 dark:text-pns-gray-400">
              {kpi.title}
            </h3>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-pns-gray-900 dark:text-white">
              {kpi.value}
            </span>
            <span className="text-sm text-pns-gray-500 dark:text-pns-gray-400">
              Meta: {kpi.target}
            </span>
          </div>
          <p className="text-xs text-pns-gray-500 dark:text-pns-gray-400 mt-1">
            {kpi.description}
          </p>
        </div>
        <div className={`flex items-center space-x-1 ${
          kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
        }`}>
          <span className="text-sm font-medium">{kpi.trendValue}</span>
        </div>
      </div>
    </div>
  );

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completado': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'En Progreso': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'Investigado': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-pns-gray-50 dark:bg-pns-gray-900 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-pns-gray-900 dark:text-white">
                ISO 45001 - Seguridad y Salud Ocupacional
              </h1>
              <p className="text-pns-gray-600 dark:text-pns-gray-300">
                Sistema de gestión de seguridad y salud en el trabajo
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button className="btn-secondary flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Exportar</span>
            </button>
            <button className="btn-primary flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Nuevo Reporte</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 border-b border-pns-gray-200 dark:border-pns-gray-700">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'dashboard', name: 'Dashboard', icon: Activity },
              { id: 'incidents', name: 'Incidentes', icon: AlertTriangle },
              { id: 'training', name: 'Capacitaciones', icon: Users },
              { id: 'evidence', name: 'Evidencias', icon: FileText }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-pns-orange text-pns-orange'
                    : 'border-transparent text-pns-gray-500 hover:text-pns-gray-700 hover:border-pns-gray-300 dark:text-pns-gray-400 dark:hover:text-pns-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sstKpis.map(renderKPICard)}
          </div>

          {/* Charts and Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Incidents */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-pns-gray-900 dark:text-white">
                  Incidentes Recientes
                </h3>
                <AlertTriangle className="h-5 w-5 text-orange-500" />
              </div>
              <div className="space-y-3">
                {recentIncidents.map((incident) => (
                  <div key={incident.id} className="flex items-start space-x-3 p-3 border border-pns-gray-200 dark:border-pns-gray-700 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(incident.severity)}`}>
                          {incident.severity}
                        </span>
                        <span className="text-xs text-pns-gray-500 dark:text-pns-gray-400">
                          {incident.type}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-pns-gray-900 dark:text-white">
                        {incident.title}
                      </p>
                      <p className="text-xs text-pns-gray-500 dark:text-pns-gray-400">
                        {incident.area} • {incident.date}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(incident.status)}`}>
                      {incident.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Training Progress */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-pns-gray-900 dark:text-white">
                  Progreso de Capacitaciones
                </h3>
                <Users className="h-5 w-5 text-blue-500" />
              </div>
              <div className="space-y-4">
                {trainingPrograms.map((program) => (
                  <div key={program.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-pns-gray-900 dark:text-white">
                        {program.name}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(program.status)}`}>
                        {program.status}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-pns-gray-200 dark:bg-pns-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${(program.completed / program.total) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-pns-gray-500 dark:text-pns-gray-400">
                        {program.completed}/{program.total}
                      </span>
                    </div>
                    <p className="text-xs text-pns-gray-500 dark:text-pns-gray-400">
                      Vence: {program.dueDate}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'incidents' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-pns-gray-900 dark:text-white">
              Gestión de Incidentes
            </h2>
            <button className="btn-primary flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Reportar Incidente</span>
            </button>
          </div>

          {/* Incident Table */}
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-pns-gray-200 dark:divide-pns-gray-700">
                <thead className="bg-pns-gray-50 dark:bg-pns-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-pns-gray-500 dark:text-pns-gray-400 uppercase tracking-wider">
                      Incidente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-pns-gray-500 dark:text-pns-gray-400 uppercase tracking-wider">
                      Severidad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-pns-gray-500 dark:text-pns-gray-400 uppercase tracking-wider">
                      Área
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-pns-gray-500 dark:text-pns-gray-400 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-pns-gray-500 dark:text-pns-gray-400 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-pns-gray-800 divide-y divide-pns-gray-200 dark:divide-pns-gray-700">
                  {recentIncidents.map((incident) => (
                    <tr key={incident.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-pns-gray-900 dark:text-white">
                            {incident.title}
                          </div>
                          <div className="text-sm text-pns-gray-500 dark:text-pns-gray-400">
                            {incident.type} • {incident.date}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(incident.severity)}`}>
                          {incident.severity}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-pns-gray-900 dark:text-white">
                        {incident.area}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(incident.status)}`}>
                          {incident.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-pns-gray-500">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'training' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-pns-gray-900 dark:text-white">
              Capacitaciones en Seguridad
            </h2>
            <button className="btn-primary flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Nueva Capacitación</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {trainingPrograms.map((program) => (
              <div key={program.id} className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-pns-gray-900 dark:text-white">
                    {program.name}
                  </h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(program.status)}`}>
                    {program.status}
                  </span>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-pns-gray-600 dark:text-pns-gray-300">
                        Progreso
                      </span>
                      <span className="text-sm font-medium text-pns-gray-900 dark:text-white">
                        {Math.round((program.completed / program.total) * 100)}%
                      </span>
                    </div>
                    <div className="bg-pns-gray-200 dark:bg-pns-gray-700 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
                        style={{ width: `${(program.completed / program.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-pns-gray-600 dark:text-pns-gray-300">
                      Completados: {program.completed}/{program.total}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-pns-gray-500 dark:text-pns-gray-400">
                    <Clock className="h-4 w-4" />
                    <span>Vence: {program.dueDate}</span>
                  </div>

                  <div className="flex space-x-2">
                    <button className="btn-secondary flex-1 text-sm py-2">
                      Ver Detalles
                    </button>
                    <button className="btn-primary flex-1 text-sm py-2">
                      Gestionar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'evidence' && (
        <EvidenceUploadSystem 
          isoStandard="ISO45001"
          categories={iso45001Categories}
        />
      )}
    </div>
  );
};

export default ISO45001Page;