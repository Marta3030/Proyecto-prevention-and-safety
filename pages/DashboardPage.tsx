
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuth } from '../hooks/useAuth';
import Card from '../components/ui/Card';
import { KPI } from '../types';
import { ShieldCheckIcon, FireIcon, UserGroupIcon, CheckBadgeIcon, ArrowUpIcon, ArrowDownIcon } from '../components/icons/Icons';
import useUIStore from '../store/uiStore'; // Import useUIStore

const kpiData: KPI[] = [
  { title: 'Índice de Accidentabilidad', value: '0.85', trend: 'down', trendValue: '-5%', icon: FireIcon, colorClass: 'text-red-500 dark:text-red-400' },
  { title: 'Riesgos Críticos Activos', value: '3', trend: 'neutral', icon: ShieldCheckIcon, colorClass: 'text-yellow-500 dark:text-yellow-400' },
  { title: 'Cumplimiento Normativo', value: '92%', trend: 'up', trendValue: '+2%', icon: CheckBadgeIcon, colorClass: 'text-green-500 dark:text-green-400' },
  { title: 'Participación Comité', value: '88%', trend: 'up', trendValue: '+3%', icon: UserGroupIcon, colorClass: 'text-pns-blue dark:text-pns-blue-light' },
];

const monthlyIncidentsData = [
  { name: 'Ene', incidentes: 4, },
  { name: 'Feb', incidentes: 3, },
  { name: 'Mar', incidentes: 5, },
  { name: 'Abr', incidentes: 2, },
  { name: 'May', incidentes: 6, },
  { name: 'Jun', incidentes: 3, },
  { name: 'Jul', incidentes: 4, },
];

const KpiCard: React.FC<{ kpi: KPI }> = ({ kpi }) => (
  <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
    <div className="flex items-start justify-between">
      <div>
        <h3 className="text-sm font-medium text-pns-gray-500 dark:text-pns-gray-400 truncate">{kpi.title}</h3>
        <p className="mt-1 text-3xl font-semibold text-pns-text-dark dark:text-pns-text-light">{kpi.value}</p>
      </div>
      <div className={`p-2 rounded-full bg-opacity-20 ${
          kpi.colorClass.includes('red') ? 'bg-red-100 dark:bg-red-800' : 
          kpi.colorClass.includes('yellow') ? 'bg-yellow-100 dark:bg-yellow-800' :
          kpi.colorClass.includes('green') ? 'bg-green-100 dark:bg-green-800' :
          'bg-pns-blue-light dark:bg-pns-blue-dark'
        }`}>
        <kpi.icon className={`h-6 w-6 ${kpi.colorClass}`} />
      </div>
    </div>
    {kpi.trend && kpi.trendValue && (
      <div className={`mt-2 flex items-center text-xs ${
        kpi.trend === 'up' ? 'text-green-600 dark:text-green-400' :
        kpi.trend === 'down' ? 'text-red-600 dark:text-red-400' :
        'text-pns-gray-500 dark:text-pns-gray-400'
      }`}>
        {kpi.trend === 'up' && <ArrowUpIcon className="w-4 h-4 mr-1" />}
        {kpi.trend === 'down' && <ArrowDownIcon className="w-4 h-4 mr-1" />}
        <span>{kpi.trendValue}</span>
        <span className="ml-1">vs mes anterior</span>
      </div>
    )}
  </Card>
);

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const storeDarkMode = useUIStore((state) => state.darkMode); // Use darkMode from the UI store

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-pns-text-dark dark:text-pns-text-light">
        Bienvenido, {user?.name || 'Usuario'}!
      </h1>
      <p className="text-pns-gray-600 dark:text-pns-gray-300">
        Este es su panel ejecutivo con el resumen del estado del sistema de gestión de riesgos.
      </p>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi) => (
          <KpiCard key={kpi.title} kpi={kpi} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Incidentes Mensuales" className="shadow-lg">
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={monthlyIncidentsData}>
                <CartesianGrid strokeDasharray="3 3" stroke={storeDarkMode ? '#374151' : '#E5E7EB'} />
                <XAxis dataKey="name" tick={{ fill: storeDarkMode ? '#9CA3AF' : '#6B7280', fontSize: 12 }} />
                <YAxis tick={{ fill: storeDarkMode ? '#9CA3AF' : '#6B7280', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: storeDarkMode ? '#1F2937' : '#FFFFFF', 
                    borderColor: storeDarkMode ? '#374151' : '#E5E7EB',
                    color: storeDarkMode ? '#F3F4F6' : '#1F2937'
                  }}
                  cursor={{ fill: storeDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', color: storeDarkMode ? '#9CA3AF' : '#6B7280' }}/>
                <Bar dataKey="incidentes" fill={storeDarkMode ? "#F7931E" : "#0A4F8A"} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Acciones Pendientes Prioritarias" className="shadow-lg">
          <ul className="divide-y divide-pns-border-light dark:divide-pns-border-dark">
            {[
              { id: 1, text: 'Revisar evaluación de riesgo: Área Soldadura', priority: 'Alta', dueDate: '2024-08-15' },
              { id: 2, text: 'Implementar control: Ruido en Taller Mecánico', priority: 'Alta', dueDate: '2024-08-20' },
              { id: 3, text: 'Seguimiento capacitación: Trabajos en Altura', priority: 'Media', dueDate: '2024-09-01' },
            ].map(action => (
              <li key={action.id} className="py-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-pns-text-dark dark:text-pns-text-light">{action.text}</p>
                  <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                    action.priority === 'Alta' ? 'bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-300' :
                    'bg-yellow-100 dark:bg-yellow-800 text-yellow-700 dark:text-yellow-300'
                  }`}>
                    {action.priority}
                  </span>
                </div>
                <p className="text-xs text-pns-gray-500 dark:text-pns-gray-400">Vence: {action.dueDate}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
