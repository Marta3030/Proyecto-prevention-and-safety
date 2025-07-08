import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Award,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  Plus,
  Download,
  Upload,
  Target,
  Activity,
  Star,
  AlertTriangle,
  Clock,
  Eye,
  Edit,
  Search,
  Filter,
  BarChart3,
  PieChart
} from 'lucide-react';
import EvidenceUploadSystem from '../../components/evidence/EvidenceUploadSystem';

// Mock data para ISO 9001
const qualityKpis = [
  {
    title: 'Satisfacción Cliente',
    value: '4.7',
    unit: '/5.0',
    target: '> 4.5',
    trend: 'up',
    trendValue: '+0.2',
    icon: Star,
    color: 'text-yellow-500',
    description: 'Calificación promedio de satisfacción'
  },
  {
    title: 'No Conformidades',
    value: '5',
    unit: 'activas',
    target: '< 10',
    trend: 'down',
    trendValue: '-3',
    icon: XCircle,
    color: 'text-red-500',
    description: 'No conformidades abiertas este mes'
  },
  {
    title: 'Acc. Correctivas',
    value: '12',
    unit: 'en curso',
    target: '< 15',
    trend: 'down',
    trendValue: '-2',
    icon: Target,
    color: 'text-blue-500',
    description: 'Acciones correctivas en proceso'
  },
  {
    title: 'Eficacia Procesos',
    value: '94%',
    unit: '',
    target: '> 90%',
    trend: 'up',
    trendValue: '+2%',
    icon: BarChart3,
    color: 'text-green-500',
    description: 'Eficacia global de procesos'
  }
];

const nonConformities = [
  {
    id: 'NC-2024-001',
    title: 'Producto no conforme en lote L-5423',
    description: 'Defectos en acabado superficial detectados en control final',
    type: 'Producto',
    severity: 'Mayor',
    area: 'Producción',
    responsible: 'Juan Pérez',
    dueDate: '2024-02-15',
    status: 'Abierta',
    createdDate: '2024-01-10',
    source: 'Control de Calidad'
  },
  {
    id: 'NC-2024-002',
    title: 'Procedimiento no seguido en área de embalaje',
    description: 'No se siguió el procedimiento de etiquetado estándar',
    type: 'Proceso',
    severity: 'Menor',
    area: 'Embalaje',
    responsible: 'Ana García',
    dueDate: '2024-02-10',
    status: 'En Análisis',
    createdDate: '2024-01-12',
    source: 'Auditoría Interna'
  },
  {
    id: 'NC-2024-003',
    title: 'Queja de cliente por tiempo de entrega',
    description: 'Cliente reporta retrasos en entrega de pedido #4521',
    type: 'Servicio',
    severity: 'Mayor',
    area: 'Logística',
    responsible: 'Carlos López',
    dueDate: '2024-02-08',
    status: 'Acción Correctiva',
    createdDate: '2024-01-08',
    source: 'Cliente'
  }
];

const correctiveActions = [
  {
    id: 'AC-2024-001',
    ncId: 'NC-2024-001',
    title: 'Mejora en proceso de control de calidad',
    description: 'Implementar checkpoint adicional antes del empaque',
    responsible: 'Ing. Calidad',
    dueDate: '2024-02-20',
    progress: 65,
    status: 'En Progreso',
    effectiveness: 'Pendiente'
  },
  {
    id: 'AC-2024-002',
    ncId: 'NC-2024-002',
    title: 'Capacitación en procedimientos',
    description: 'Reforzar capacitación en procedimiento PE-EMB-001',
    responsible: 'Supervisor Embalaje',
    dueDate: '2024-02-12',
    progress: 90,
    status: 'Casi Completa',
    effectiveness: 'Pendiente'
  },
  {
    id: 'AC-2024-003',
    ncId: 'NC-2024-003',
    title: 'Optimización de proceso logístico',
    description: 'Revisar y mejorar tiempos de procesamiento',
    responsible: 'Jefe Logística',
    dueDate: '2024-02-15',
    progress: 25,
    status: 'Iniciada',
    effectiveness: 'Pendiente'
  }
];

const customerSatisfaction = [
  {
    id: 1,
    client: 'Empresa ABC',
    rating: 4.8,
    feedback: 'Excelente calidad y tiempo de entrega',
    date: '2024-01-15',
    category: 'Producto'
  },
  {
    id: 2,
    client: 'Corporación XYZ',
    rating: 4.2,
    feedback: 'Buena calidad, mejorar comunicación',
    date: '2024-01-12',
    category: 'Servicio'
  },
  {
    id: 3,
    client: 'Industrias DEF',
    rating: 4.9,
    feedback: 'Superó nuestras expectativas',
    date: '2024-01-10',
    category: 'Producto'
  }
];

const auditSchedule = [
  {
    id: 1,
    type: 'Interna',
    area: 'Producción',
    auditor: 'María Rodríguez',
    date: '2024-02-05',
    status: 'Programada'
  },
  {
    id: 2,
    type: 'Externa',
    area: 'Sistema Completo',
    auditor: 'Ente Certificador',
    date: '2024-03-15',
    status: 'Programada'
  },
  {
    id: 3,
    type: 'Interna',
    area: 'Almacén',
    auditor: 'Carlos Méndez',
    date: '2024-01-28',
    status: 'Completada'
  }
];

// Categorías de evidencia para ISO 9001
const iso9001Categories = [
  { id: 'quality-policy', name: 'Política de Calidad', icon: Award, color: 'text-blue-500', isoStandard: 'ISO9001' as const, requiredDocuments: ['Política de calidad', 'Objetivos de calidad'] },
  { id: 'procedures', name: 'Procedimientos', icon: FileText, color: 'text-green-500', isoStandard: 'ISO9001' as const, requiredDocuments: ['Procedimientos documentados', 'Instrucciones de trabajo'] },
  { id: 'quality-records', name: 'Registros de Calidad', icon: CheckCircle, color: 'text-purple-500', isoStandard: 'ISO9001' as const, requiredDocuments: ['Registros de calidad', 'Controles de proceso'] },
  { id: 'nonconformities', name: 'No Conformidades', icon: XCircle, color: 'text-red-500', isoStandard: 'ISO9001' as const, requiredDocuments: ['Reportes de NC', 'Análisis de causas'] },
  { id: 'corrective-actions', name: 'Acciones Correctivas', icon: Target, color: 'text-orange-500', isoStandard: 'ISO9001' as const, requiredDocuments: ['Planes de acción', 'Verificación de eficacia'] },
  { id: 'customer-satisfaction', name: 'Satisfacción Cliente', icon: Star, color: 'text-yellow-500', isoStandard: 'ISO9001' as const, requiredDocuments: ['Encuestas de satisfacción', 'Análisis de quejas'] }
];

const ISO9001Page: React.FC = () => {
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
              {kpi.unit}
            </span>
          </div>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-xs text-pns-gray-500 dark:text-pns-gray-400">
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
          {kpi.trend === 'up' ? (
            <TrendingUp className="h-4 w-4" />
          ) : (
            <TrendingDown className="h-4 w-4" />
          )}
          <span className="text-sm font-medium">{kpi.trendValue}</span>
        </div>
      </div>
    </div>
  );

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Mayor': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'Menor': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Crítica': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completada': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'En Progreso': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'Casi Completa': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'Abierta': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'En Análisis': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Acción Correctiva': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'Programada': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'Iniciada': return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300 dark:text-gray-600'
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-pns-gray-50 dark:bg-pns-gray-900 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
              <Award className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-pns-gray-900 dark:text-white">
                ISO 9001 - Gestión de Calidad
              </h1>
              <p className="text-pns-gray-600 dark:text-pns-gray-300">
                Sistema de gestión de calidad y mejora continua
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
              <span>Nueva NC</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 border-b border-pns-gray-200 dark:border-pns-gray-700">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'dashboard', name: 'Dashboard', icon: Activity },
              { id: 'nonconformities', name: 'No Conformidades', icon: XCircle },
              { id: 'actions', name: 'Acciones Correctivas', icon: Target },
              { id: 'satisfaction', name: 'Satisfacción Cliente', icon: Star },
              { id: 'audits', name: 'Auditorías', icon: CheckCircle },
              { id: 'evidence', name: 'Evidencias', icon: FileText }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
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
            {qualityKpis.map(renderKPICard)}
          </div>

          {/* Charts and Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quality Trends */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-pns-gray-900 dark:text-white">
                  Tendencias de Calidad
                </h3>
                <BarChart3 className="h-5 w-5 text-blue-500" />
              </div>
              <div className="space-y-4">
                {[
                  { name: 'Satisfacción Cliente', value: 94, trend: 'up' },
                  { name: 'Conformidad Producto', value: 96, trend: 'up' },
                  { name: 'Eficacia Procesos', value: 92, trend: 'stable' },
                  { name: 'Tiempo Resolución', value: 88, trend: 'down' }
                ].map((item) => (
                  <div key={item.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-pns-gray-900 dark:text-white">
                        {item.name}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-pns-gray-500 dark:text-pns-gray-400">
                          {item.value}%
                        </span>
                        {item.trend === 'up' && <TrendingUp className="h-3 w-3 text-green-500" />}
                        {item.trend === 'down' && <TrendingDown className="h-3 w-3 text-red-500" />}
                      </div>
                    </div>
                    <div className="bg-pns-gray-200 dark:bg-pns-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${item.value}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Non-conformities */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-pns-gray-900 dark:text-white">
                  No Conformidades Recientes
                </h3>
                <XCircle className="h-5 w-5 text-red-500" />
              </div>
              <div className="space-y-3">
                {nonConformities.slice(0, 3).map((nc) => (
                  <div key={nc.id} className="p-3 border border-pns-gray-200 dark:border-pns-gray-700 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-pns-gray-900 dark:text-white">
                          {nc.id}
                        </p>
                        <p className="text-xs text-pns-gray-600 dark:text-pns-gray-300">
                          {nc.title}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(nc.severity)}`}>
                        {nc.severity}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-pns-gray-500 dark:text-pns-gray-400">
                        {nc.area} • Vence: {nc.dueDate}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(nc.status)}`}>
                        {nc.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'nonconformities' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-pns-gray-900 dark:text-white">
              Gestión de No Conformidades
            </h2>
            <div className="flex space-x-3">
              <button className="btn-secondary flex items-center space-x-2">
                <Filter className="h-4 w-4" />
                <span>Filtrar</span>
              </button>
              <button className="btn-primary flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Nueva NC</span>
              </button>
            </div>
          </div>

          {/* NC Table */}
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-pns-gray-200 dark:divide-pns-gray-700">
                <thead className="bg-pns-gray-50 dark:bg-pns-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-pns-gray-500 dark:text-pns-gray-400 uppercase tracking-wider">
                      No Conformidad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-pns-gray-500 dark:text-pns-gray-400 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-pns-gray-500 dark:text-pns-gray-400 uppercase tracking-wider">
                      Severidad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-pns-gray-500 dark:text-pns-gray-400 uppercase tracking-wider">
                      Responsable
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
                  {nonConformities.map((nc) => (
                    <tr key={nc.id}>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-pns-gray-900 dark:text-white">
                            {nc.id}
                          </div>
                          <div className="text-sm text-pns-gray-500 dark:text-pns-gray-400">
                            {nc.title}
                          </div>
                          <div className="text-xs text-pns-gray-400 dark:text-pns-gray-500">
                            {nc.area} • {nc.createdDate}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-pns-gray-900 dark:text-white">
                        {nc.type}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(nc.severity)}`}>
                          {nc.severity}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-pns-gray-900 dark:text-white">
                        {nc.responsible}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(nc.status)}`}>
                          {nc.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-pns-gray-500">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            <Edit className="h-4 w-4" />
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

      {activeTab === 'actions' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-pns-gray-900 dark:text-white">
              Acciones Correctivas y Preventivas
            </h2>
            <button className="btn-primary flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Nueva Acción</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {correctiveActions.map((action) => (
              <div key={action.id} className="card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-pns-gray-900 dark:text-white">
                        {action.id}
                      </h3>
                      <span className="text-sm text-pns-gray-500 dark:text-pns-gray-400">
                        (Relacionada: {action.ncId})
                      </span>
                    </div>
                    <p className="text-sm font-medium text-pns-gray-700 dark:text-pns-gray-300">
                      {action.title}
                    </p>
                    <p className="text-sm text-pns-gray-600 dark:text-pns-gray-400 mt-1">
                      {action.description}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(action.status)}`}>
                    {action.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-pns-gray-600 dark:text-pns-gray-300">Responsable</div>
                    <div className="text-sm font-medium text-pns-gray-900 dark:text-white">
                      {action.responsible}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-pns-gray-600 dark:text-pns-gray-300">Fecha Límite</div>
                    <div className="text-sm font-medium text-pns-gray-900 dark:text-white">
                      {action.dueDate}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-pns-gray-600 dark:text-pns-gray-300">Eficacia</div>
                    <div className="text-sm font-medium text-pns-gray-900 dark:text-white">
                      {action.effectiveness}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-pns-gray-600 dark:text-pns-gray-300">
                      Progreso
                    </span>
                    <span className="text-sm font-medium text-pns-gray-900 dark:text-white">
                      {action.progress}%
                    </span>
                  </div>
                  <div className="bg-pns-gray-200 dark:bg-pns-gray-700 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full"
                      style={{ width: `${action.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 mt-4">
                  <button className="btn-secondary text-sm py-1">
                    Ver Detalles
                  </button>
                  <button className="btn-primary text-sm py-1">
                    Actualizar Progreso
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'satisfaction' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-pns-gray-900 dark:text-white">
              Satisfacción del Cliente
            </h2>
            <button className="btn-primary flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Nueva Encuesta</span>
            </button>
          </div>

          {/* Satisfaction Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card p-6 text-center">
              <div className="text-3xl font-bold text-pns-gray-900 dark:text-white mb-2">
                4.7
              </div>
              <div className="flex justify-center space-x-1 mb-2">
                {getRatingStars(4.7)}
              </div>
              <p className="text-sm text-pns-gray-600 dark:text-pns-gray-300">
                Calificación Promedio
              </p>
            </div>
            <div className="card p-6 text-center">
              <div className="text-3xl font-bold text-pns-gray-900 dark:text-white mb-2">
                156
              </div>
              <p className="text-sm text-pns-gray-600 dark:text-pns-gray-300">
                Encuestas Este Mes
              </p>
            </div>
            <div className="card p-6 text-center">
              <div className="text-3xl font-bold text-pns-gray-900 dark:text-white mb-2">
                94%
              </div>
              <p className="text-sm text-pns-gray-600 dark:text-pns-gray-300">
                Clientes Satisfechos
              </p>
            </div>
          </div>

          {/* Recent Feedback */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-pns-gray-900 dark:text-white mb-4">
              Comentarios Recientes
            </h3>
            <div className="space-y-4">
              {customerSatisfaction.map((feedback) => (
                <div key={feedback.id} className="border border-pns-gray-200 dark:border-pns-gray-700 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-medium text-pns-gray-900 dark:text-white">
                          {feedback.client}
                        </span>
                        <span className="text-sm text-pns-gray-500 dark:text-pns-gray-400">
                          • {feedback.date}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          feedback.category === 'Producto' 
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                            : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        }`}>
                          {feedback.category}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="flex space-x-1">
                          {getRatingStars(feedback.rating)}
                        </div>
                        <span className="text-sm font-medium text-pns-gray-900 dark:text-white">
                          {feedback.rating}/5.0
                        </span>
                      </div>
                      <p className="text-sm text-pns-gray-600 dark:text-pns-gray-300">
                        "{feedback.feedback}"
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'audits' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-pns-gray-900 dark:text-white">
              Programa de Auditorías
            </h2>
            <button className="btn-primary flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Programar Auditoría</span>
            </button>
          </div>

          {/* Audit Schedule */}
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-pns-gray-200 dark:divide-pns-gray-700">
                <thead className="bg-pns-gray-50 dark:bg-pns-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-pns-gray-500 dark:text-pns-gray-400 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-pns-gray-500 dark:text-pns-gray-400 uppercase tracking-wider">
                      Área
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-pns-gray-500 dark:text-pns-gray-400 uppercase tracking-wider">
                      Auditor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-pns-gray-500 dark:text-pns-gray-400 uppercase tracking-wider">
                      Fecha
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
                  {auditSchedule.map((audit) => (
                    <tr key={audit.id}>
                      <td className="px-6 py-4 text-sm font-medium text-pns-gray-900 dark:text-white">
                        {audit.type}
                      </td>
                      <td className="px-6 py-4 text-sm text-pns-gray-900 dark:text-white">
                        {audit.area}
                      </td>
                      <td className="px-6 py-4 text-sm text-pns-gray-900 dark:text-white">
                        {audit.auditor}
                      </td>
                      <td className="px-6 py-4 text-sm text-pns-gray-600 dark:text-pns-gray-300">
                        {audit.date}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(audit.status)}`}>
                          {audit.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-pns-gray-500">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            <Edit className="h-4 w-4" />
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

             {activeTab === 'evidence' && (
         <EvidenceUploadSystem 
           isoStandard="ISO9001"
           categories={iso9001Categories}
         />
       )}
    </div>
  );
};

export default ISO9001Page;