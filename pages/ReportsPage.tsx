
import React from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { ChartBarIcon, DocumentTextIcon } from '../components/icons/Icons';

const ReportsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-pns-text-dark dark:text-pns-text-light">Reportes Avanzados</h1>
      
      <Card title="Generación de Informes Ejecutivos">
        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-pns-border-light dark:border-pns-border-dark rounded-lg">
          <ChartBarIcon className="w-16 h-16 text-pns-gray-300 dark:text-pns-gray-600 mb-4" />
          <p className="text-pns-gray-500 dark:text-pns-gray-400 mb-2">
            Genere informes personalizados y automáticos.
          </p>
          <p className="text-xs text-pns-gray-400 dark:text-pns-gray-500">
            Este módulo permitirá la creación y exportación de reportes detallados.
          </p>
        </div>
      </Card>

      <Card title="Tipos de Reportes Disponibles (Ejemplo)">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
                "Informe Mensual de Siniestralidad",
                "Resumen de Cumplimiento Normativo",
                "Estado de Avance de Planes de Control",
                "Informe de Auditorías Realizadas",
                "Análisis de Tendencias de Incidentes",
                "Reporte de Capacitaciones Completadas"
            ].map(reportName => (
                <div key={reportName} className="p-4 border border-pns-border-light dark:border-pns-border-dark rounded-lg hover:shadow-md transition-shadow bg-pns-card-bg-light dark:bg-pns-card-bg-dark">
                    <DocumentTextIcon className="w-8 h-8 text-pns-blue dark:text-pns-blue-light mb-2" />
                    <h3 className="font-semibold text-pns-text-dark dark:text-pns-text-light">{reportName}</h3>
                    <Button size="sm" variant="outline" className="mt-3 w-full">Generar Reporte</Button>
                </div>
            ))}
        </div>
      </Card>
    </div>
  );
};

export default ReportsPage;
