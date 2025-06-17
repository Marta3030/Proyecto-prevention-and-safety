
import React from 'react';
import Card from '../components/ui/Card';
import { BellAlertIcon } from '../components/icons/Icons';

const AlertsPage: React.FC = () => {
  const alerts = [
    { id: 1, type: 'Riesgo Crítico', message: 'Nuevo riesgo crítico detectado en Área de Producción.', time: 'Hace 5 minutos', severity: 'Alta' },
    { id: 2, type: 'Vencimiento Capacitación', message: 'Capacitación de "Manejo de Químicos" para Juan Pérez vence en 7 días.', time: 'Hace 2 horas', severity: 'Media' },
    { id: 3, type: 'Incidente Reportado', message: 'Nuevo incidente leve reportado en Almacén.', time: 'Ayer', severity: 'Baja' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-pns-text-dark dark:text-pns-text-light">Alertas Inteligentes</h1>
      
      <Card title="Notificaciones Recientes">
        {alerts.length > 0 ? (
          <ul className="divide-y divide-pns-border-light dark:divide-pns-border-dark">
            {alerts.map(alert => (
              <li key={alert.id} className="py-4">
                <div className="flex items-start space-x-3">
                  <div className={`p-1.5 rounded-full mt-1 ${
                    alert.severity === 'Alta' ? 'bg-red-100 dark:bg-red-800' :
                    alert.severity === 'Media' ? 'bg-yellow-100 dark:bg-yellow-800' :
                    'bg-pns-blue-light dark:bg-pns-blue-dark'
                  }`}>
                    <BellAlertIcon className={`w-5 h-5 ${
                      alert.severity === 'Alta' ? 'text-red-500 dark:text-red-300' :
                      alert.severity === 'Media' ? 'text-yellow-500 dark:text-yellow-300' :
                      'text-pns-blue dark:text-pns-blue-light'
                    }`} />
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-pns-text-dark dark:text-pns-text-light">{alert.type}</p>
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                            alert.severity === 'Alta' ? 'bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-300' :
                            alert.severity === 'Media' ? 'bg-yellow-100 dark:bg-yellow-800 text-yellow-700 dark:text-yellow-300' :
                            'bg-pns-blue-light dark:bg-pns-blue-dark text-pns-blue-dark dark:text-pns-blue-light'
                        }`}>
                            {alert.severity}
                        </span>
                    </div>
                    <p className="text-sm text-pns-gray-600 dark:text-pns-gray-300">{alert.message}</p>
                    <p className="text-xs text-pns-gray-400 dark:text-pns-gray-500 mt-1">{alert.time}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center py-10 text-pns-gray-500 dark:text-pns-gray-400">No hay alertas recientes.</p>
        )}
      </Card>
      <p className="text-center text-pns-gray-500 dark:text-pns-gray-400">
        Este módulo mostrará notificaciones automáticas basadas en niveles de riesgo, vencimientos, etc.
      </p>
    </div>
  );
};

export default AlertsPage;
