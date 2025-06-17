
import React from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { PlusCircleIcon, AcademicCapIcon } from '../components/icons/Icons';

const TrainingPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-pns-text-dark dark:text-pns-text-light">Gestión de Capacitación</h1>
        <Button>
          <PlusCircleIcon className="w-5 h-5 mr-2" />
          Nuevo Programa
        </Button>
      </div>

      <Card title="Programas de Formación y Certificaciones">
        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-pns-border-light dark:border-pns-border-dark rounded-lg">
          <AcademicCapIcon className="w-16 h-16 text-pns-gray-300 dark:text-pns-gray-600 mb-4" />
          <p className="text-pns-gray-500 dark:text-pns-gray-400 mb-2">
            Administre los programas de capacitación, certificaciones y cronogramas.
          </p>
          <p className="text-xs text-pns-gray-400 dark:text-pns-gray-500">
            El seguimiento detallado de la formación de empleados será implementado aquí.
          </p>
        </div>
      </Card>
      
       <Card title="Capacitaciones Activas (Ejemplo)">
          <ul className="space-y-2">
            {[
                {name: "Inducción General de Seguridad", type: "Obligatoria", nextSession:"2024-08-05", enrolled: 15},
                {name: "Manejo Defensivo", type: "Específica", nextSession:"2024-08-12", enrolled: 8},
                {name: "Primeros Auxilios Nivel Básico", type: "Voluntaria", nextSession:"2024-09-02", enrolled: 12},
            ].map(training => (
                 <li key={training.name} className="flex justify-between items-center p-3 rounded-md hover:bg-pns-gray-50 dark:hover:bg-pns-gray-800 border border-pns-border-light dark:border-pns-border-dark">
                    <div>
                        <p className="font-medium text-pns-text-dark dark:text-pns-text-light">{training.name}</p>
                        <p className="text-xs text-pns-gray-500 dark:text-pns-gray-400">Tipo: {training.type} - Próxima: {training.nextSession} - Inscritos: {training.enrolled}</p>
                    </div>
                    <Button variant="outline" size="sm">Ver Detalles</Button>
                 </li>
            ))}
          </ul>
      </Card>
    </div>
  );
};

export default TrainingPage;
