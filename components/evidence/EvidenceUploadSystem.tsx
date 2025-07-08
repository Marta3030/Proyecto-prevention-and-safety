import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Upload,
  FileText,
  Image,
  Video,
  Archive,
  Download,
  Eye,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Calendar,
  Tag,
  AlertCircle,
  Star,
  Filter,
  Search,
  Plus,
  Edit
} from 'lucide-react';

interface EvidenceFile {
  id: string;
  name: string;
  type: 'document' | 'image' | 'video' | 'archive' | 'other';
  size: number;
  uploadDate: string;
  version: string;
  category: string;
  isoStandard: 'ISO45001' | 'ISO14001' | 'ISO9001';
  status: 'pending' | 'approved' | 'rejected' | 'review';
  uploadedBy: string;
  approvedBy?: string;
  approvalDate?: string;
  description: string;
  tags: string[];
  url: string;
  thumbnail?: string;
  requirements?: string[];
  nextReviewDate?: string;
}

interface EvidenceCategory {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  isoStandard: 'ISO45001' | 'ISO14001' | 'ISO9001';
  requiredDocuments: string[];
}

interface EvidenceUploadSystemProps {
  isoStandard: 'ISO45001' | 'ISO14001' | 'ISO9001';
  categories: EvidenceCategory[];
  onFileUpload?: (file: File, category: string, metadata: any) => void;
  onFileDelete?: (fileId: string) => void;
  onFileApprove?: (fileId: string) => void;
  onFileReject?: (fileId: string) => void;
}

// Datos mock para el sistema de evidencia
const mockFiles: EvidenceFile[] = [
  {
    id: '1',
    name: 'Política_SST_v2.1.pdf',
    type: 'document',
    size: 2048576,
    uploadDate: '2024-01-15T10:30:00Z',
    version: '2.1',
    category: 'Políticas de Seguridad',
    isoStandard: 'ISO45001',
    status: 'approved',
    uploadedBy: 'Juan Pérez',
    approvedBy: 'Ana García',
    approvalDate: '2024-01-16T09:00:00Z',
    description: 'Política de Seguridad y Salud en el Trabajo actualizada',
    tags: ['política', 'sst', 'oficial'],
    url: '/documents/politica-sst-v2.1.pdf',
    requirements: ['Obligatorio para certificación', 'Revisión anual'],
    nextReviewDate: '2025-01-15'
  },
  {
    id: '2',
    name: 'Capacitación_EPP_Enero.mp4',
    type: 'video',
    size: 157286400,
    uploadDate: '2024-01-10T14:20:00Z',
    version: '1.0',
    category: 'Registros de Capacitación',
    isoStandard: 'ISO45001',
    status: 'pending',
    uploadedBy: 'Carlos López',
    description: 'Video de capacitación sobre uso correcto de EPP',
    tags: ['capacitación', 'epp', 'video'],
    url: '/videos/capacitacion-epp-enero.mp4',
    thumbnail: '/thumbnails/capacitacion-epp.jpg'
  },
  {
    id: '3',
    name: 'Matriz_Aspectos_Ambientales.xlsx',
    type: 'document',
    size: 512000,
    uploadDate: '2024-01-12T16:45:00Z',
    version: '3.2',
    category: 'Aspectos Ambientales',
    isoStandard: 'ISO14001',
    status: 'review',
    uploadedBy: 'María Rodríguez',
    description: 'Matriz actualizada de aspectos e impactos ambientales',
    tags: ['matriz', 'aspectos', 'ambiental'],
    url: '/documents/matriz-aspectos-v3.2.xlsx'
  }
];

const EvidenceUploadSystem: React.FC<EvidenceUploadSystemProps> = ({
  isoStandard,
  categories,
  onFileUpload,
  onFileDelete,
  onFileApprove,
  onFileReject
}) => {
  const { t } = useTranslation();
  const [files, setFiles] = useState<EvidenceFile[]>(
    mockFiles.filter(file => file.isoStandard === isoStandard)
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<File[]>([]);

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'document': return FileText;
      case 'image': return Image;
      case 'video': return Video;
      case 'archive': return Archive;
      default: return FileText;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'review': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setUploadingFiles(droppedFiles);
    setIsUploadModalOpen(true);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === '' || file.category === selectedCategory;
    const matchesStatus = statusFilter === 'all' || file.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getCategoryIcon = (categoryName: string) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category?.icon || FileText;
  };

  const UploadModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-pns-gray-800 rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-pns-gray-900 dark:text-white mb-4">
          Subir Evidencia - {isoStandard}
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-pns-gray-700 dark:text-pns-gray-300 mb-2">
              Categoría
            </label>
            <select className="w-full px-3 py-2 border border-pns-gray-300 dark:border-pns-gray-600 rounded-lg bg-white dark:bg-pns-gray-700 text-pns-gray-900 dark:text-white">
              <option value="">Seleccionar categoría</option>
              {categories.map(category => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-pns-gray-700 dark:text-pns-gray-300 mb-2">
              Descripción
            </label>
            <textarea 
              className="w-full px-3 py-2 border border-pns-gray-300 dark:border-pns-gray-600 rounded-lg bg-white dark:bg-pns-gray-700 text-pns-gray-900 dark:text-white"
              rows={3}
              placeholder="Describe el documento..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-pns-gray-700 dark:text-pns-gray-300 mb-2">
              Tags (separados por coma)
            </label>
            <input 
              type="text"
              className="w-full px-3 py-2 border border-pns-gray-300 dark:border-pns-gray-600 rounded-lg bg-white dark:bg-pns-gray-700 text-pns-gray-900 dark:text-white"
              placeholder="política, procedimiento, seguridad"
            />
          </div>

          {uploadingFiles.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-pns-gray-700 dark:text-pns-gray-300">
                Archivos a subir:
              </h4>
              {uploadingFiles.map((file, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm text-pns-gray-600 dark:text-pns-gray-400">
                  <FileText className="h-4 w-4" />
                  <span>{file.name}</span>
                  <span>({formatFileSize(file.size)})</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex space-x-3 mt-6">
          <button 
            onClick={() => setIsUploadModalOpen(false)}
            className="btn-secondary flex-1"
          >
            Cancelar
          </button>
          <button 
            onClick={() => {
              // Aquí se manejaría la subida real
              setIsUploadModalOpen(false);
              setUploadingFiles([]);
            }}
            className="btn-primary flex-1"
          >
            Subir Archivos
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header con filtros */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-pns-gray-900 dark:text-white">
            Gestión de Evidencias - {isoStandard}
          </h2>
          <button 
            onClick={() => setIsUploadModalOpen(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Subir Evidencia</span>
          </button>
        </div>

        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-pns-gray-400" />
            <input
              type="text"
              placeholder="Buscar archivos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full px-3 py-2 border border-pns-gray-300 dark:border-pns-gray-600 rounded-lg bg-white dark:bg-pns-gray-700 text-pns-gray-900 dark:text-white"
            />
          </div>

          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-pns-gray-300 dark:border-pns-gray-600 rounded-lg bg-white dark:bg-pns-gray-700 text-pns-gray-900 dark:text-white"
          >
            <option value="">Todas las categorías</option>
            {categories.map(category => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>

          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-pns-gray-300 dark:border-pns-gray-600 rounded-lg bg-white dark:bg-pns-gray-700 text-pns-gray-900 dark:text-white"
          >
            <option value="all">Todos los estados</option>
            <option value="approved">Aprobados</option>
            <option value="pending">Pendientes</option>
            <option value="review">En Revisión</option>
            <option value="rejected">Rechazados</option>
          </select>

          <button className="btn-secondary flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span>Más Filtros</span>
          </button>
        </div>
      </div>

      {/* Área de arrastrar y soltar */}
      <div 
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed border-pns-gray-300 dark:border-pns-gray-600 rounded-lg p-8 text-center hover:border-pns-orange transition-colors"
      >
        <Upload className="mx-auto h-12 w-12 text-pns-gray-400 mb-4" />
        <p className="text-lg font-medium text-pns-gray-900 dark:text-white mb-2">
          Arrastra archivos aquí o haz clic para seleccionar
        </p>
        <p className="text-sm text-pns-gray-500 dark:text-pns-gray-400">
          Soporta: PDF, DOC, XLS, JPG, PNG, MP4 (máx. 50MB)
        </p>
        <button 
          onClick={() => setIsUploadModalOpen(true)}
          className="btn-primary mt-4"
        >
          Seleccionar Archivos
        </button>
      </div>

      {/* Lista de archivos */}
      <div className="grid grid-cols-1 gap-4">
        {filteredFiles.map((file) => {
          const FileIcon = getFileIcon(file.type);
          const CategoryIcon = getCategoryIcon(file.category);

          return (
            <div key={file.id} className="card p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="p-3 bg-pns-gray-100 dark:bg-pns-gray-700 rounded-lg">
                    <FileIcon className="h-6 w-6 text-pns-gray-600 dark:text-pns-gray-300" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-pns-gray-900 dark:text-white">
                        {file.name}
                      </h3>
                      <p className="text-sm text-pns-gray-600 dark:text-pns-gray-300 mt-1">
                        {file.description}
                      </p>
                      
                      <div className="flex items-center space-x-4 mt-2 text-xs text-pns-gray-500 dark:text-pns-gray-400">
                        <span className="flex items-center space-x-1">
                          <CategoryIcon className="h-3 w-3" />
                          <span>{file.category}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <User className="h-3 w-3" />
                          <span>{file.uploadedBy}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(file.uploadDate)}</span>
                        </span>
                        <span>{formatFileSize(file.size)}</span>
                        <span>v{file.version}</span>
                      </div>

                      {file.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {file.tags.map((tag, index) => (
                            <span 
                              key={index}
                              className="px-2 py-1 text-xs bg-pns-gray-100 dark:bg-pns-gray-700 text-pns-gray-600 dark:text-pns-gray-300 rounded"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(file.status)}`}>
                        {file.status === 'approved' && 'Aprobado'}
                        {file.status === 'pending' && 'Pendiente'}
                        {file.status === 'rejected' && 'Rechazado'}
                        {file.status === 'review' && 'En Revisión'}
                      </span>

                      <div className="flex space-x-1">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded">
                          <Download className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-900/20 rounded">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {file.status === 'approved' && file.approvedBy && (
                    <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/20 rounded-lg">
                      <div className="flex items-center space-x-2 text-sm text-green-800 dark:text-green-400">
                        <CheckCircle className="h-4 w-4" />
                        <span>Aprobado por {file.approvedBy} el {formatDate(file.approvalDate!)}</span>
                      </div>
                    </div>
                  )}

                  {file.requirements && file.requirements.length > 0 && (
                    <div className="mt-3">
                      <h4 className="text-sm font-medium text-pns-gray-700 dark:text-pns-gray-300 mb-1">
                        Requisitos:
                      </h4>
                      <ul className="text-xs text-pns-gray-600 dark:text-pns-gray-400 space-y-1">
                        {file.requirements.map((req, index) => (
                          <li key={index} className="flex items-center space-x-1">
                            <AlertCircle className="h-3 w-3 flex-shrink-0" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredFiles.length === 0 && (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-pns-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-pns-gray-900 dark:text-white mb-2">
            No se encontraron archivos
          </h3>
          <p className="text-pns-gray-500 dark:text-pns-gray-400">
            Ajusta los filtros o sube nuevos archivos para comenzar.
          </p>
        </div>
      )}

      {/* Modal de subida */}
      {isUploadModalOpen && <UploadModal />}
    </div>
  );
};

export default EvidenceUploadSystem;