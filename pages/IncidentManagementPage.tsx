
import React from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { PlusCircleIcon, EyeIcon, PencilIcon, TrashIcon } from '../components/icons/Icons';

interface Incident {
  id: string;
  date: string;
  type: 'Accidente' | 'Casi Accidente' | 'Enfermedad Laboral';
  description: string;
  area: string;
  status: 'Abierto' | 'En Investigación' | 'Cerrado';
}

const mockIncidents: Incident[] = [
  { id: 'INC001', date: '2024-07-15', type: 'Accidente', description: 'Caída al mismo nivel en pasillo', area: 'Almacén', status: 'En Investigación' },
  { id: 'INC002', date: '2024-07-20', type: 'Casi Accidente', description: 'Caja cae de estantería sin golpear a nadie', area: 'Almacén', status: 'Cerrado' },
  { id: 'INC003', date: '2024-06-10', type: 'Accidente', description: 'Corte leve en mano con herramienta', area: 'Taller Mecánico', status: 'Cerrado' },
];

const IncidentManagementPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-pns-text-dark dark:text-pns-text-light">Gestión de Incidentes</h1>
        <Button>
          <PlusCircleIcon className="w-5 h-5 mr-2" />
          Registrar Incidente
        </Button>
      </div>

      <Card title="Listado de Incidentes Registrados">
         <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-pns-border-light dark:divide-pns-border-dark">
            <thead className="bg-pns-gray-50 dark:bg-pns-gray-800">
              <tr>
                {['ID', 'Fecha', 'Tipo', 'Descripción', 'Área', 'Estado', 'Acciones'].map(header => (
                  <th key={header} scope="col" className="px-4 py-3 text-left text-xs font-medium text-pns-gray-500 dark:text-pns-gray-400 uppercase tracking-wider">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-pns-card-bg-light dark:bg-pns-card-bg-dark divide-y divide-pns-border-light dark:divide-pns-border-dark">
              {mockIncidents.map((incident) => (
                <tr key={incident.id} className="hover:bg-pns-gray-50 dark:hover:bg-pns-gray-700 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-pns-gray-500 dark:text-pns-gray-400">{incident.id}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-pns-text-dark dark:text-pns-text-light">{incident.date}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-pns-text-dark dark:text-pns-text-light">{incident.type}</td>
                  <td className="px-4 py-3 text-sm text-pns-text-dark dark:text-pns-text-light max-w-md truncate" title={incident.description}>{incident.description}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-pns-text-dark dark:text-pns-text-light">{incident.area}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      incident.status === 'Abierto' ? 'bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200' :
                      incident.status === 'En Investigación' ? 'bg-pns-blue-light dark:bg-pns-blue-dark text-pns-blue-dark dark:text-pns-blue-light' :
                      'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200'
                    }`}>
                      {incident.status}
                    </span>
                  </td>
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
        {mockIncidents.length === 0 && (
           <p className="py-10 text-center text-pns-gray-500 dark:text-pns-gray-400">No hay incidentes registrados.</p>
        )}
      </Card>
      <p className="text-center text-pns-gray-500 dark:text-pns-gray-400">
        Funcionalidades completas de investigación, acciones correctivas y seguimiento serán implementadas aquí.
      </p>
    </div>
  );
};

export default IncidentManagementPage;
