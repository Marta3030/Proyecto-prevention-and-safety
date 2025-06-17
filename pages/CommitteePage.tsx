
import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Meeting } from '../types';
import { PlusCircleIcon, CalendarDaysIcon, ClipboardDocumentListIcon, EyeIcon, PencilIcon } from '../components/icons/Icons';

const mockMeetings: Meeting[] = [
  { id: 'M001', date: '2024-08-01', title: 'Reunión Ordinaria Agosto', attendees: 5, status: 'Scheduled' },
  { id: 'M002', date: '2024-07-15', title: 'Reunión Extraordinaria: Análisis Incidente X', attendees: 6, status: 'Completed' },
  { id: 'M003', date: '2024-07-01', title: 'Reunión Ordinaria Julio', attendees: 5, status: 'Completed' },
];

const CommitteePage: React.FC = () => {
  const [meetings, setMeetings] = useState<Meeting[]>(mockMeetings);
  // Add state for modals, forms, etc.

  return (
    <div className="space-y-6">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-pns-text-dark dark:text-pns-text-light">Comité Paritario</h1>
        <div className="flex space-x-2">
            <Button variant="secondary">
                <CalendarDaysIcon className="w-5 h-5 mr-2" />
                Cronograma
            </Button>
            <Button>
                <PlusCircleIcon className="w-5 h-5 mr-2" />
                Nueva Reunión
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Próxima Reunión" className="md:col-span-1">
          {meetings.find(m => m.status === 'Scheduled') ? (
            <div>
              <h4 className="text-lg font-semibold text-pns-blue dark:text-pns-blue-light">{meetings.find(m => m.status === 'Scheduled')?.title}</h4>
              <p className="text-sm text-pns-gray-500 dark:text-pns-gray-400">Fecha: {meetings.find(m => m.status === 'Scheduled')?.date}</p>
              <Button size="sm" className="mt-2">Ver Detalles</Button>
            </div>
          ) : (
            <p className="text-pns-gray-500 dark:text-pns-gray-400">No hay reuniones programadas.</p>
          )}
        </Card>
        <Card title="Acuerdos Pendientes" className="md:col-span-2">
           <ul className="space-y-2">
                <li className="flex justify-between items-center p-2 rounded hover:bg-pns-gray-50 dark:hover:bg-pns-gray-800">
                    <span>Revisar propuestas de EPP para soldadores</span>
                    <span className="text-xs text-pns-gray-400">Asignado a: LP</span>
                </li>
                <li className="flex justify-between items-center p-2 rounded hover:bg-pns-gray-50 dark:hover:bg-pns-gray-800">
                    <span>Planificar inspección de extintores</span>
                    <span className="text-xs text-pns-gray-400">Asignado a: PC</span>
                </li>
           </ul>
        </Card>
      </div>
      

      <Card title="Gestión de Reuniones y Actas">
         <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-pns-border-light dark:divide-pns-border-dark">
            <thead className="bg-pns-gray-50 dark:bg-pns-gray-800">
              <tr>
                {['ID', 'Fecha', 'Título', 'Asistentes', 'Estado', 'Acciones'].map(header => (
                  <th key={header} scope="col" className="px-4 py-3 text-left text-xs font-medium text-pns-gray-500 dark:text-pns-gray-400 uppercase tracking-wider">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-pns-card-bg-light dark:bg-pns-card-bg-dark divide-y divide-pns-border-light dark:divide-pns-border-dark">
              {meetings.map((meeting) => (
                <tr key={meeting.id} className="hover:bg-pns-gray-50 dark:hover:bg-pns-gray-700 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-pns-gray-500 dark:text-pns-gray-400">{meeting.id}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-pns-text-dark dark:text-pns-text-light">{meeting.date}</td>
                  <td className="px-4 py-3 text-sm font-medium text-pns-text-dark dark:text-pns-text-light max-w-sm truncate" title={meeting.title}>{meeting.title}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-pns-text-dark dark:text-pns-text-light text-center">{meeting.attendees}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      meeting.status === 'Scheduled' ? 'bg-pns-blue-light dark:bg-pns-blue-dark text-pns-blue-dark dark:text-pns-blue-light' :
                      meeting.status === 'Completed' ? 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200' :
                      'bg-pns-gray-200 dark:bg-pns-gray-600 text-pns-text-dark dark:text-pns-text-light'
                    }`}>
                      {meeting.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium space-x-1">
                     <Button variant="ghost" size="icon" title="Ver Acta">
                      <ClipboardDocumentListIcon className="w-4 h-4 text-pns-blue dark:text-pns-blue-light" />
                    </Button>
                    <Button variant="ghost" size="icon" title="Editar Reunión">
                      <PencilIcon className="w-4 h-4 text-pns-teal dark:text-pns-teal-light" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {meetings.length === 0 && (
           <p className="py-10 text-center text-pns-gray-500 dark:text-pns-gray-400">No hay reuniones registradas.</p>
        )}
      </Card>
       <Card title="Biblioteca de Documentos del Comité">
          <p className="text-pns-gray-500 dark:text-pns-gray-400">
            Aquí se listarán los documentos importantes del comité (reglamentos, informes, etc.).
            La funcionalidad de carga y descarga de archivos será implementada.
          </p>
          {/* Placeholder for document list */}
          <ul className="mt-4 space-y-2">
            <li className="flex justify-between items-center p-2 rounded hover:bg-pns-gray-50 dark:hover:bg-pns-gray-800">
                <span>Reglamento Interno del Comité.pdf</span>
                <Button variant="outline" size="sm">Descargar</Button>
            </li>
             <li className="flex justify-between items-center p-2 rounded hover:bg-pns-gray-50 dark:hover:bg-pns-gray-800">
                <span>Informe Anual Actividades 2023.docx</span>
                <Button variant="outline" size="sm">Descargar</Button>
            </li>
          </ul>
      </Card>
    </div>
  );
};

export default CommitteePage;
