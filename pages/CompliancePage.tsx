
import React from 'react';
import Card from '../components/ui/Card';
import { ScaleIcon } from '../components/icons/Icons';

const CompliancePage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-pns-text-dark dark:text-pns-text-light">Cumplimiento Legal</h1>
      
      <Card title="Seguimiento Normativo ISO 45001, 14001, 9001">
         <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-pns-border-light dark:border-pns-border-dark rounded-lg">
          <ScaleIcon className="w-16 h-16 text-pns-gray-300 dark:text-pns-gray-600 mb-4" />
          <p className="text-pns-gray-500 dark:text-pns-gray-400 mb-2">
            Monitoree el cumplimiento de las normativas y estándares.
          </p>
          <p className="text-xs text-pns-gray-400 dark:text-pns-gray-500">
            Este módulo ayudará a rastrear requisitos legales y el estado de cumplimiento.
          </p>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="ISO 45001 (SST)">
            <p className="text-2xl font-bold text-green-500">95%</p>
            <p className="text-sm text-pns-gray-500 dark:text-pns-gray-400">Cumplimiento Estimado</p>
            <div className="w-full bg-pns-gray-200 dark:bg-pns-gray-700 rounded-full h-2.5 mt-2">
                <div className="bg-green-500 h-2.5 rounded-full" style={{width: "95%"}}></div>
            </div>
        </Card>
         <Card title="ISO 14001 (Ambiental)">
            <p className="text-2xl font-bold text-pns-blue">88%</p>
            <p className="text-sm text-pns-gray-500 dark:text-pns-gray-400">Cumplimiento Estimado</p>
             <div className="w-full bg-pns-gray-200 dark:bg-pns-gray-700 rounded-full h-2.5 mt-2">
                <div className="bg-pns-blue h-2.5 rounded-full" style={{width: "88%"}}></div>
            </div>
        </Card>
         <Card title="ISO 9001 (Calidad)">
            <p className="text-2xl font-bold text-pns-orange">92%</p>
            <p className="text-sm text-pns-gray-500 dark:text-pns-gray-400">Cumplimiento Estimado</p>
             <div className="w-full bg-pns-gray-200 dark:bg-pns-gray-700 rounded-full h-2.5 mt-2">
                <div className="bg-pns-orange h-2.5 rounded-full" style={{width: "92%"}}></div>
            </div>
        </Card>
      </div>
    </div>
  );
};

export default CompliancePage;
