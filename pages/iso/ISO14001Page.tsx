import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Leaf,
  Droplets,
  Zap,
  Trash2,
  TreePine,
  Factory,
  Plus,
  Download,
  Upload,
  Target,
  Activity,
  TrendingUp,
  TrendingDown,
  Gauge,
  Calendar,
  FileText,
  Eye,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import EvidenceUploadSystem from '../../components/evidence/EvidenceUploadSystem';

// Mock data para ISO 14001
const environmentalKpis = [
  {
    title: 'Consumo de Agua',
    value: '1,240',
    unit: 'L/día',
    target: '< 1,500',
    trend: 'down',
    trendValue: '-8%',
    icon: Droplets,
    color: 'text-blue-500',
    description: 'Consumo diario promedio de agua'
  },
  {
    title: 'Consumo Energético',
    value: '340',
    unit: 'kWh/día',
    target: '< 400',
    trend: 'down',
    trendValue: '-12%',
    icon: Zap,
    color: 'text-yellow-500',
    description: 'Consumo energético diario'
  },
  {
    title: 'Generación de Residuos',
    value: '85',
    unit: 'kg/día',
    target: '< 100',
    trend: 'down',
    trendValue: '-5%',
    icon: Trash2,
    color: 'text-green-500',
    description: 'Residuos sólidos generados'
  },
  {
    title: 'Huella de Carbono',
    value: '2.4',
    unit: 'tCO2/mes',
    target: '< 3.0',
    trend: 'down',
    trendValue: '-15%',
    icon: Factory,
    color: 'text-orange-500',
    description: 'Emisiones de CO2 equivalente'
  }
];

const environmentalAspects = [
  {
    id: 1,
    aspect: 'Consumo de agua potable',
    impact: 'Agotamiento de recursos hídricos',
    significance: 'Moderado',
    controls: ['Medidores inteligentes', 'Programas de ahorro'],
    area: 'Producción',
    lastReview: '2024-01-10'
  },
  {
    id: 2,
    aspect: 'Generación de residuos químicos',
    impact: 'Contaminación del suelo',
    significance: 'Significativo',
    controls: ['Clasificación', 'Disposición especializada'],
    area: 'Laboratorio',
    lastReview: '2024-01-15'
  },
  {
    id: 3,
    aspect: 'Emisiones de gases',
    impact: 'Calentamiento global',
    significance: 'Alto',
    controls: ['Filtros', 'Monitoreo continuo'],
    area: 'Planta',
    lastReview: '2024-01-12'
  }
];

const environmentalObjectives = [
  {
    id: 1,
    objective: 'Reducir consumo de agua 10%',
    indicator: 'L/día por empleado',
    baseline: 150,
    target: 135,
    current: 142,
    deadline: '2024-06-30',
    progress: 53,
    responsible: 'Comité Ambiental'
  },
  {
    id: 2,
    objective: 'Aumentar reciclaje 25%',
    indicator: '% de residuos reciclados',
    baseline: 60,
    target: 75,
    current: 68,
    deadline: '2024-08-31',
    progress: 53,
    responsible: 'Gestión de Residuos'
  },
  {
    id: 3,
    objective: 'Reducir emisiones CO2 15%',
    indicator: 'tCO2 mensuales',
    baseline: 2.8,
    target: 2.4,
    current: 2.5,
    deadline: '2024-12-31',
    progress: 75,
    responsible: 'Ing. Ambiental'
  }
];

const monitoringData = [
  {
    parameter: 'pH Agua Residual',
    value: '7.2',
    unit: '',
    limit: '6.0 - 9.0',
    status: 'Conforme',
    date: '2024-01-15'
  },
  {
    parameter: 'DBO5',
    value: '25',
    unit: 'mg/L',
    limit: '< 60',
    status: 'Conforme',
    date: '2024-01-15'
  },
  {
    parameter: 'Ruido Ambiental',
    value: '62',
    unit: 'dB',
    limit: '< 70',
    status: 'Conforme',
    date: '2024-01-14'
  },
  {
    parameter: 'Material Particulado',
    value: '45',
    unit: 'μg/m³',
    limit: '< 50',
    status: 'Advertencia',
    date: '2024-01-14'
  }
];

// Categorías de evidencia para ISO 14001
const iso14001Categories = [
  { id: 'environmental-policy', name: 'Política Ambiental', icon: Leaf, color: 'text-green-500', isoStandard: 'ISO14001' as const, requiredDocuments: ['Política ambiental', 'Objetivos ambientales'] },
  { id: 'procedures', name: 'Procedimientos', icon: FileText, color: 'text-blue-500', isoStandard: 'ISO14001' as const, requiredDocuments: ['Procedimientos ambientales', 'Instrucciones de trabajo'] },
  { id: 'monitoring', name: 'Registros de Monitoreo', icon: Gauge, color: 'text-purple-500', isoStandard: 'ISO14001' as const, requiredDocuments: ['Registros de monitoreo', 'Calibraciones de equipos'] },
  { id: 'objectives', name: 'Objetivos y Metas', icon: Target, color: 'text-orange-500', isoStandard: 'ISO14001' as const, requiredDocuments: ['Objetivos ambientales', 'Programas ambientales'] },
  { id: 'audits', name: 'Auditorías', icon: CheckCircle, color: 'text-teal-500', isoStandard: 'ISO14001' as const, requiredDocuments: ['Programas de auditoría', 'Informes de auditoría'] },
  { id: 'certificates', name: 'Certificados', icon: AlertCircle, color: 'text-yellow-500', isoStandard: 'ISO14001' as const, requiredDocuments: ['Certificados ambientales', 'Permisos ambientales'] }
];

const ISO14001Page: React.FC = () => {
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
          kpi.trend === 'up' ? 'text-green-600' : 'text-green-600'
        }`}>
          <TrendingDown className="h-4 w-4" />
          <span className="text-sm font-medium">{kpi.trendValue}</span>
        </div>
      </div>
    </div>
  );

  const getSignificanceColor = (significance: string) => {
    switch (significance) {
      case 'Alto': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'Significativo': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Moderado': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Conforme': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'Advertencia': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'No Conforme': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-pns-gray-50 dark:bg-pns-gray-900 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-pns-gray-900 dark:text-white">
                ISO 14001 - Gestión Ambiental
              </h1>
              <p className="text-pns-gray-600 dark:text-pns-gray-300">
                Sistema de gestión ambiental y sostenibilidad
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
              <span>Nuevo Registro</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 border-b border-pns-gray-200 dark:border-pns-gray-700">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'dashboard', name: 'Dashboard', icon: Activity },
              { id: 'aspects', name: 'Aspectos e Impactos', icon: TreePine },
              { id: 'objectives', name: 'Objetivos', icon: Target },
              { id: 'monitoring', name: 'Monitoreo', icon: Gauge },
              { id: 'evidence', name: 'Evidencias', icon: FileText }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
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
            {environmentalKpis.map(renderKPICard)}
          </div>

          {/* Charts and Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Environmental Performance Chart */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-pns-gray-900 dark:text-white">
                  Desempeño Ambiental
                </h3>
                <Leaf className="h-5 w-5 text-green-500" />
              </div>
              <div className="space-y-4">
                {[
                  { name: 'Agua', percentage: 78, color: 'blue' },
                  { name: 'Energía', percentage: 85, color: 'yellow' },
                  { name: 'Residuos', percentage: 92, color: 'green' },
                  { name: 'Emisiones', percentage: 88, color: 'orange' }
                ].map((item) => (
                  <div key={item.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-pns-gray-900 dark:text-white">
                        {item.name}
                      </span>
                      <span className="text-sm text-pns-gray-500 dark:text-pns-gray-400">
                        {item.percentage}%
                      </span>
                    </div>
                    <div className="bg-pns-gray-200 dark:bg-pns-gray-700 rounded-full h-2">
                      <div 
                        className={`bg-${item.color}-500 h-2 rounded-full`}
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Monitoring */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-pns-gray-900 dark:text-white">
                  Monitoreo Reciente
                </h3>
                <Gauge className="h-5 w-5 text-blue-500" />
              </div>
              <div className="space-y-3">
                {monitoringData.slice(0, 4).map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-pns-gray-200 dark:border-pns-gray-700 rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-pns-gray-900 dark:text-white">
                        {item.parameter}
                      </p>
                      <p className="text-xs text-pns-gray-500 dark:text-pns-gray-400">
                        {item.value} {item.unit} • Límite: {item.limit}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'aspects' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-pns-gray-900 dark:text-white">
              Aspectos e Impactos Ambientales
            </h2>
            <button className="btn-primary flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Nuevo Aspecto</span>
            </button>
          </div>

          {/* Aspects Table */}
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-pns-gray-200 dark:divide-pns-gray-700">
                <thead className="bg-pns-gray-50 dark:bg-pns-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-pns-gray-500 dark:text-pns-gray-400 uppercase tracking-wider">
                      Aspecto Ambiental
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-pns-gray-500 dark:text-pns-gray-400 uppercase tracking-wider">
                      Impacto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-pns-gray-500 dark:text-pns-gray-400 uppercase tracking-wider">
                      Significancia
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-pns-gray-500 dark:text-pns-gray-400 uppercase tracking-wider">
                      Controles
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-pns-gray-500 dark:text-pns-gray-400 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-pns-gray-800 divide-y divide-pns-gray-200 dark:divide-pns-gray-700">
                  {environmentalAspects.map((aspect) => (
                    <tr key={aspect.id}>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-pns-gray-900 dark:text-white">
                            {aspect.aspect}
                          </div>
                          <div className="text-sm text-pns-gray-500 dark:text-pns-gray-400">
                            {aspect.area}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-pns-gray-900 dark:text-white">
                        {aspect.impact}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSignificanceColor(aspect.significance)}`}>
                          {aspect.significance}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {aspect.controls.map((control, index) => (
                            <div key={index} className="text-xs text-pns-gray-600 dark:text-pns-gray-300">
                              • {control}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-pns-gray-500">
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

      {activeTab === 'objectives' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-pns-gray-900 dark:text-white">
              Objetivos Ambientales
            </h2>
            <button className="btn-primary flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Nuevo Objetivo</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
            {environmentalObjectives.map((objective) => (
              <div key={objective.id} className="card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-pns-gray-900 dark:text-white">
                      {objective.objective}
                    </h3>
                    <p className="text-sm text-pns-gray-600 dark:text-pns-gray-300">
                      Indicador: {objective.indicator}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-pns-gray-900 dark:text-white">
                      {objective.current}
                    </div>
                    <div className="text-sm text-pns-gray-500 dark:text-pns-gray-400">
                      Meta: {objective.target}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-pns-gray-600 dark:text-pns-gray-300">Línea Base</div>
                    <div className="text-lg font-semibold text-pns-gray-900 dark:text-white">
                      {objective.baseline}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-pns-gray-600 dark:text-pns-gray-300">Actual</div>
                    <div className="text-lg font-semibold text-pns-gray-900 dark:text-white">
                      {objective.current}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-pns-gray-600 dark:text-pns-gray-300">Fecha Límite</div>
                    <div className="text-lg font-semibold text-pns-gray-900 dark:text-white">
                      {objective.deadline}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-pns-gray-600 dark:text-pns-gray-300">
                      Progreso
                    </span>
                    <span className="text-sm font-medium text-pns-gray-900 dark:text-white">
                      {objective.progress}%
                    </span>
                  </div>
                  <div className="bg-pns-gray-200 dark:bg-pns-gray-700 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full"
                      style={{ width: `${objective.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-pns-gray-600 dark:text-pns-gray-300">
                    Responsable: {objective.responsible}
                  </div>
                  <div className="flex space-x-2">
                    <button className="btn-secondary text-sm py-1">
                      Ver Detalles
                    </button>
                    <button className="btn-primary text-sm py-1">
                      Actualizar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'monitoring' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-pns-gray-900 dark:text-white">
              Monitoreo Ambiental
            </h2>
            <button className="btn-primary flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Nuevo Registro</span>
            </button>
          </div>

          {/* Monitoring Table */}
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-pns-gray-200 dark:divide-pns-gray-700">
                <thead className="bg-pns-gray-50 dark:bg-pns-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-pns-gray-500 dark:text-pns-gray-400 uppercase tracking-wider">
                      Parámetro
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-pns-gray-500 dark:text-pns-gray-400 uppercase tracking-wider">
                      Valor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-pns-gray-500 dark:text-pns-gray-400 uppercase tracking-wider">
                      Límite
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-pns-gray-500 dark:text-pns-gray-400 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-pns-gray-500 dark:text-pns-gray-400 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-pns-gray-500 dark:text-pns-gray-400 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-pns-gray-800 divide-y divide-pns-gray-200 dark:divide-pns-gray-700">
                  {monitoringData.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 text-sm font-medium text-pns-gray-900 dark:text-white">
                        {item.parameter}
                      </td>
                      <td className="px-6 py-4 text-sm text-pns-gray-900 dark:text-white">
                        {item.value} {item.unit}
                      </td>
                      <td className="px-6 py-4 text-sm text-pns-gray-600 dark:text-pns-gray-300">
                        {item.limit}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-pns-gray-600 dark:text-pns-gray-300">
                        {item.date}
                      </td>
                      <td className="px-6 py-4 text-sm text-pns-gray-500">
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

             {activeTab === 'evidence' && (
         <EvidenceUploadSystem 
           isoStandard="ISO14001"
           categories={iso14001Categories}
         />
       )}
    </div>
  );
};

export default ISO14001Page;