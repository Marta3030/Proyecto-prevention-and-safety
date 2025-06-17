
import React from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { PlusCircleIcon, DocumentTextIcon } from '../components/icons/Icons';

const DocumentManagementPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-pns-text-dark dark:text-pns-text-light">Gestión Documental</h1>
        <Button>
          <PlusCircleIcon className="w-5 h-5 mr-2" />
          Cargar Documento
        </Button>
      </div>

      <Card title="Repositorio de Documentos">
        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-pns-border-light dark:border-pns-border-dark rounded-lg">
          <DocumentTextIcon className="w-16 h-16 text-pns-gray-300 dark:text-pns-gray-600 mb-4" />
          <p className="text-pns-gray-500 dark:text-pns-gray-400 mb-2">
            Arrastre y suelte archivos aquí o haga clic en "Cargar Documento".
          </p>
          <p className="text-xs text-pns-gray-400 dark:text-pns-gray-500">
            Funcionalidades de carga/descarga, control de versiones y firma digital serán implementadas.
          </p>
        </div>
      </Card>
       <Card title="Documentos Recientes (Ejemplo)">
          <ul className="space-y-2">
            {[
                {name: "Manual de Seguridad ISO 45001 v2.1.pdf", size:"2.5MB", date:"2024-07-28"},
                {name: "Plan de Emergencia General v1.5.docx", size:"870KB", date:"2024-07-20"},
                {name: "Política Ambiental ISO 14001.pdf", size:"300KB", date:"2024-06-15"},
            ].map(doc => (
                 <li key={doc.name} className="flex justify-between items-center p-3 rounded-md hover:bg-pns-gray-50 dark:hover:bg-pns-gray-800 border border-pns-border-light dark:border-pns-border-dark">
                    <div>
                        <p className="font-medium text-pns-text-dark dark:text-pns-text-light">{doc.name}</p>
                        <p className="text-xs text-pns-gray-500 dark:text-pns-gray-400">Tamaño: {doc.size} - Subido: {doc.date}</p>
                    </div>
                    <Button variant="outline" size="sm">Descargar</Button>
                 </li>
            ))}
          </ul>
      </Card>
    </div>
  );
};

export default DocumentManagementPage;
