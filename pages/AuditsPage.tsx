
import React from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { PlusCircleIcon, CheckBadgeIcon } from '../components/icons/Icons';

const AuditsPage: React.FC = () => {
  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-pns-text-dark dark:text-pns-text-light">Auditorías e Inspecciones</h1>
        <Button>
          <PlusCircleIcon className="w-5 h-5 mr-2" />
          Nueva Auditoría/Inspección
        </Button>
      </div>

      <Card title="Planificación y Checklists Digitales">
         <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-pns-border-light dark:border-pns-border-dark rounded-lg">
          <CheckBadgeIcon className="w-16 h-16 text-pns-gray-300 dark:text-pns-gray-600 mb-4" />
          <p className="text-pns-gray-500 dark:text-pns-gray-400 mb-2">
            Gestione sus auditorías e inspecciones aquí.
          </p>
          <p className="text-xs text-pns-gray-400 dark:text-pns-gray-500">
            Funcionalidades para planificación, checklists digitales y gestión de hallazgos serán implementadas.
          </p>
        </div>
      </Card>
      
       <Card title="Auditorías Programadas (Ejemplo)">
          <ul className="space-y-2">
            {[
                {name: "Auditoría Interna ISO 45001 - Anual", area: "Toda la planta", date:"2024-09-15", status: "Programada"},
                {name: "Inspección de Seguridad - Taller Mecánico", area: "Taller Mecánico", date:"2024-08-10", status: "En Progreso"},
                {name: "Auditoría de Cumplimiento Legal Ambiental", area: "Planta de Tratamiento", date:"2024-07-05", status: "Completada"},
            ].map(audit => (
                 <li key={audit.name} className="flex justify-between items-center p-3 rounded-md hover:bg-pns-gray-50 dark:hover:bg-pns-gray-800 border border-pns-border-light dark:border-pns-border-dark">
                    <div>
                        <p className="font-medium text-pns-text-dark dark:text-pns-text-light">{audit.name}</p>
                        <p className="text-xs text-pns-gray-500 dark:text-pns-gray-400">Área: {audit.area} - Fecha: {audit.date}</p>
                    </div>
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                        audit.status === 'Programada' ? 'bg-pns-blue-light dark:bg-pns-blue-dark text-pns-blue-dark dark:text-pns-blue-light' :
                        audit.status === 'En Progreso' ? 'bg-yellow-100 dark:bg-yellow-800 text-yellow-700 dark:text-yellow-300' :
                        'bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300'
                    }`}>
                        {audit.status}
                    </span>
                 </li>
            ))}
          </ul>
      </Card>
    </div>
  );
};

export default AuditsPage;
