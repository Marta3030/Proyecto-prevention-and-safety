
import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { RiskItem, RiskLevel } from '../types';
import { PlusCircleIcon, EyeIcon, PencilIcon, TrashIcon } from '../components/icons/Icons';

const mockRiskData: RiskItem[] = [
  { id: 'R001', area: 'Taller Mecánico', hazard: 'Ruido excesivo', risk: 'Hipoacusia inducida por ruido', level: RiskLevel.HIGH, controls: 'EPP auditivo, Aislamiento fuente' },
  { id: 'R002', area: 'Almacén', hazard: 'Manipulación manual de cargas', risk: 'Trastornos musculoesqueléticos', level: RiskLevel.MEDIUM, controls: 'Capacitación, Ayudas mecánicas' },
  { id: 'R003', area: 'Oficinas', hazard: 'Trabajo prolongado con PVD', risk: 'Fatiga visual, Problemas posturales', level: RiskLevel.LOW, controls: 'Pausas activas, Mobiliario ergonómico' },
  { id: 'R004', area: 'Área Soldadura', hazard: 'Humos metálicos', risk: 'Enfermedades respiratorias', level: RiskLevel.CRITICAL, controls: 'Extracción localizada, EPP respiratorio' },
];

const getRiskLevelColor = (level: RiskLevel): string => {
  switch (level) {
    case RiskLevel.CRITICAL: return 'bg-red-600 dark:bg-red-400 text-white dark:text-pns-text-dark';
    case RiskLevel.HIGH: return 'bg-red-400 dark:bg-red-500 text-white dark:text-pns-text-dark';
    case RiskLevel.MEDIUM: return 'bg-yellow-400 dark:bg-yellow-500 text-pns-text-dark';
    case RiskLevel.LOW: return 'bg-green-400 dark:bg-green-500 text-pns-text-dark';
    default: return 'bg-pns-gray-200 dark:bg-pns-gray-600 text-pns-text-dark dark:text-pns-text-light';
  }
};


const RiskManagementPage: React.FC = () => {
  const [risks, setRisks] = useState<RiskItem[]>(mockRiskData);
  // Add state for filters, modals, etc.

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-pns-text-dark dark:text-pns-text-light">Gestión de Riesgos (IPER)</h1>
        <Button>
          <PlusCircleIcon className="w-5 h-5 mr-2" />
          Nuevo Riesgo
        </Button>
      </div>

      <Card title="Matriz de Identificación de Peligros y Evaluación de Riesgos">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-pns-border-light dark:divide-pns-border-dark">
            <thead className="bg-pns-gray-50 dark:bg-pns-gray-800">
              <tr>
                {['ID', 'Área/Proceso', 'Peligro', 'Riesgo', 'Nivel', 'Controles', 'Acciones'].map(header => (
                  <th key={header} scope="col" className="px-4 py-3 text-left text-xs font-medium text-pns-gray-500 dark:text-pns-gray-400 uppercase tracking-wider">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-pns-card-bg-light dark:bg-pns-card-bg-dark divide-y divide-pns-border-light dark:divide-pns-border-dark">
              {risks.map((item) => (
                <tr key={item.id} className="hover:bg-pns-gray-50 dark:hover:bg-pns-gray-700 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-pns-gray-500 dark:text-pns-gray-400">{item.id}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-pns-text-dark dark:text-pns-text-light">{item.area}</td>
                  <td className="px-4 py-3 text-sm text-pns-text-dark dark:text-pns-text-light">{item.hazard}</td>
                  <td className="px-4 py-3 text-sm text-pns-text-dark dark:text-pns-text-light">{item.risk}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRiskLevelColor(item.level)}`}>
                      {item.level}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-pns-text-dark dark:text-pns-text-light max-w-xs truncate" title={item.controls}>{item.controls}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium space-x-2">
                    <Button variant="ghost" size="icon" title="Ver Detalles">
                      <EyeIcon className="w-4 h-4 text-pns-blue dark:text-pns-blue-light" />
                    </Button>
                    <Button variant="ghost" size="icon" title="Editar">
                      <PencilIcon className="w-4 h-4 text-pns-teal dark:text-pns-teal-light" />
                    </Button>
                     <Button variant="ghost" size="icon" title="Eliminar">
                      <TrashIcon className="w-4 h-4 text-red-500 dark:text-red-400" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {risks.length === 0 && (
          <p className="py-10 text-center text-pns-gray-500 dark:text-pns-gray-400">No hay riesgos registrados.</p>
        )}
      </Card>

      {/* TODO: Add heatmap component here */}
      <Card title="Mapa de Calor de Riesgos (Placeholder)">
        <div className="h-64 flex items-center justify-center bg-pns-gray-100 dark:bg-pns-gray-800 rounded-md">
          <p className="text-pns-gray-500 dark:text-pns-gray-400">Visualización de Mapa de Calor Próximamente</p>
        </div>
      </Card>
    </div>
  );
};

export default RiskManagementPage;
