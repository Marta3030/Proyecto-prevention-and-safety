import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Plus,
  Trash2,
  Save,
  Settings,
  Eye,
  Edit,
  Copy,
  FileText,
  Calendar,
  CheckSquare,
  Type,
  Hash,
  Mail,
  Phone,
  Upload,
  Star,
  ToggleLeft,
  List,
  Users,
  AlertCircle,
  Send,
  Zap
} from 'lucide-react';

// Tipos de campos disponibles
type FieldType = 
  | 'text' 
  | 'textarea' 
  | 'number' 
  | 'email' 
  | 'phone' 
  | 'date' 
  | 'select' 
  | 'multiselect' 
  | 'checkbox' 
  | 'radio' 
  | 'file' 
  | 'rating' 
  | 'toggle'
  | 'signature'
  | 'location'
  | 'employee-selector';

interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
  conditional?: {
    dependsOn: string;
    value: any;
  };
  automation?: {
    triggerWorkflow?: string;
    sendNotification?: boolean;
    updateDatabase?: boolean;
  };
}

interface DynamicForm {
  id: string;
  name: string;
  description: string;
  category: 'ISO45001' | 'ISO14001' | 'ISO9001' | 'HR' | 'Operations' | 'Committee';
  fields: FormField[];
  settings: {
    allowMultipleSubmissions: boolean;
    requireAuthentication: boolean;
    sendConfirmationEmail: boolean;
    autoSave: boolean;
    expirationDate?: string;
    workflow?: {
      n8nWebhookUrl?: string;
      triggerOn: 'submit' | 'save' | 'approve';
      includeAttachments: boolean;
    };
  };
  createdBy: string;
  createdAt: string;
  lastModified: string;
  status: 'draft' | 'active' | 'archived';
  submissions: number;
}

interface DynamicFormBuilderProps {
  onSave?: (form: DynamicForm) => void;
  onPreview?: (form: DynamicForm) => void;
  existingForm?: DynamicForm;
}

// Formularios predefinidos para cada ISO
const predefinedForms: Partial<DynamicForm>[] = [
  {
    name: 'Reporte de Incidente SST',
    description: 'Formulario para reportar incidentes de seguridad y salud ocupacional',
    category: 'ISO45001',
    fields: [
      {
        id: 'incident-type',
        type: 'select',
        label: 'Tipo de Incidente',
        required: true,
        options: ['Accidente', 'Casi Accidente', 'Condición Insegura', 'Enfermedad Ocupacional']
      },
      {
        id: 'severity',
        type: 'radio',
        label: 'Severidad',
        required: true,
        options: ['Bajo', 'Medio', 'Alto', 'Crítico']
      },
      {
        id: 'location',
        type: 'location',
        label: 'Ubicación del Incidente',
        required: true
      },
      {
        id: 'description',
        type: 'textarea',
        label: 'Descripción Detallada',
        required: true,
        placeholder: 'Describe qué ocurrió, cuándo y cómo...'
      },
      {
        id: 'injured-person',
        type: 'employee-selector',
        label: 'Persona Afectada',
        required: false
      },
      {
        id: 'witnesses',
        type: 'multiselect',
        label: 'Testigos',
        required: false,
        options: []
      },
      {
        id: 'evidence-photos',
        type: 'file',
        label: 'Fotos/Evidencia',
        required: false
      },
      {
        id: 'immediate-actions',
        type: 'textarea',
        label: 'Acciones Inmediatas Tomadas',
        required: true
      }
    ],
    settings: {
      allowMultipleSubmissions: false,
      requireAuthentication: true,
      sendConfirmationEmail: true,
      autoSave: true,
      workflow: {
        triggerOn: 'submit',
        includeAttachments: true
      }
    }
  },
  {
    name: 'Evaluación de Aspectos Ambientales',
    description: 'Formulario para evaluar impactos ambientales de procesos',
    category: 'ISO14001',
    fields: [
      {
        id: 'process-name',
        type: 'text',
        label: 'Nombre del Proceso',
        required: true
      },
      {
        id: 'environmental-aspect',
        type: 'select',
        label: 'Aspecto Ambiental',
        required: true,
        options: ['Consumo de agua', 'Consumo de energía', 'Generación de residuos', 'Emisiones atmosféricas', 'Vertimientos']
      },
      {
        id: 'environmental-impact',
        type: 'text',
        label: 'Impacto Ambiental',
        required: true
      },
      {
        id: 'significance-level',
        type: 'rating',
        label: 'Nivel de Significancia (1-5)',
        required: true
      },
      {
        id: 'control-measures',
        type: 'textarea',
        label: 'Medidas de Control Existentes',
        required: true
      },
      {
        id: 'monitoring-required',
        type: 'toggle',
        label: 'Requiere Monitoreo',
        required: true
      },
      {
        id: 'legal-requirements',
        type: 'checkbox',
        label: 'Cumple Requisitos Legales',
        required: true
      }
    ],
    settings: {
      allowMultipleSubmissions: true,
      requireAuthentication: true,
      sendConfirmationEmail: false,
      autoSave: true,
      workflow: {
        triggerOn: 'submit',
        includeAttachments: false
      }
    }
  },
  {
    name: 'Reporte de No Conformidad',
    description: 'Formulario para reportar no conformidades del sistema de calidad',
    category: 'ISO9001',
    fields: [
      {
        id: 'nc-source',
        type: 'select',
        label: 'Fuente de la No Conformidad',
        required: true,
        options: ['Auditoría Interna', 'Auditoría Externa', 'Queja de Cliente', 'Proceso Interno', 'Revisión por Dirección']
      },
      {
        id: 'process-affected',
        type: 'select',
        label: 'Proceso Afectado',
        required: true,
        options: ['Ventas', 'Producción', 'Compras', 'Almacén', 'Recursos Humanos', 'Mantenimiento']
      },
      {
        id: 'nc-description',
        type: 'textarea',
        label: 'Descripción de la No Conformidad',
        required: true,
        placeholder: 'Describe detalladamente la no conformidad encontrada...'
      },
      {
        id: 'requirement-reference',
        type: 'text',
        label: 'Referencia del Requisito',
        required: true,
        placeholder: 'Ej: ISO 9001:2015 - Cláusula 8.3.2'
      },
      {
        id: 'severity-impact',
        type: 'radio',
        label: 'Impacto en la Calidad',
        required: true,
        options: ['Menor', 'Mayor', 'Crítico']
      },
      {
        id: 'root-cause-analysis',
        type: 'textarea',
        label: 'Análisis de Causa Raíz',
        required: false,
        placeholder: 'Análisis de las causas que originaron la no conformidad...'
      },
      {
        id: 'corrective-action',
        type: 'textarea',
        label: 'Acción Correctiva Propuesta',
        required: true
      },
      {
        id: 'responsible-person',
        type: 'employee-selector',
        label: 'Responsable de la Acción',
        required: true
      },
      {
        id: 'target-date',
        type: 'date',
        label: 'Fecha Objetivo de Cierre',
        required: true
      }
    ],
    settings: {
      allowMultipleSubmissions: false,
      requireAuthentication: true,
      sendConfirmationEmail: true,
      autoSave: true,
      workflow: {
        triggerOn: 'submit',
        includeAttachments: true
      }
    }
  }
];

const DynamicFormBuilder: React.FC<DynamicFormBuilderProps> = ({
  onSave,
  onPreview,
  existingForm
}) => {
  const { t } = useTranslation();
  const [form, setForm] = useState<DynamicForm>(
    existingForm || {
      id: '',
      name: '',
      description: '',
      category: 'ISO45001',
      fields: [],
      settings: {
        allowMultipleSubmissions: false,
        requireAuthentication: true,
        sendConfirmationEmail: false,
        autoSave: true
      },
      createdBy: 'Usuario Actual',
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      status: 'draft',
      submissions: 0
    }
  );

  const [activeTab, setActiveTab] = useState<'builder' | 'settings' | 'automation'>('builder');
  const [selectedFieldType, setSelectedFieldType] = useState<FieldType>('text');

     const fieldTypes: Array<{ type: FieldType; label: string; icon: React.ComponentType<any> }> = [
     { type: 'text', label: 'Texto', icon: Type },
     { type: 'textarea', label: 'Área de Texto', icon: FileText },
     { type: 'number', label: 'Número', icon: Hash },
     { type: 'email', label: 'Email', icon: Mail },
     { type: 'phone', label: 'Teléfono', icon: Phone },
     { type: 'date', label: 'Fecha', icon: Calendar },
     { type: 'select', label: 'Lista Desplegable', icon: List },
     { type: 'multiselect', label: 'Selección Múltiple', icon: CheckSquare },
     { type: 'checkbox', label: 'Casilla de Verificación', icon: CheckSquare },
     { type: 'radio', label: 'Opción Única', icon: CheckSquare },
     { type: 'file', label: 'Archivo', icon: Upload },
     { type: 'rating', label: 'Calificación', icon: Star },
     { type: 'toggle', label: 'Interruptor', icon: ToggleLeft },
     { type: 'employee-selector', label: 'Selector de Empleado', icon: Users }
   ];

  const addField = useCallback(() => {
    const newField: FormField = {
      id: `field-${Date.now()}`,
      type: selectedFieldType,
      label: `Campo ${form.fields.length + 1}`,
      required: false
    };

    if (['select', 'multiselect', 'radio'].includes(selectedFieldType)) {
      newField.options = ['Opción 1', 'Opción 2'];
    }

    setForm(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
  }, [selectedFieldType, form.fields.length]);

  const updateField = useCallback((fieldId: string, updates: Partial<FormField>) => {
    setForm(prev => ({
      ...prev,
      fields: prev.fields.map(field => 
        field.id === fieldId ? { ...field, ...updates } : field
      )
    }));
  }, []);

  const removeField = useCallback((fieldId: string) => {
    setForm(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== fieldId)
    }));
  }, []);

  const loadPredefinedForm = useCallback((predefinedForm: Partial<DynamicForm>) => {
    setForm(prev => ({
      ...prev,
      ...predefinedForm,
      id: `form-${Date.now()}`,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    }));
  }, []);

  const handleSave = useCallback(() => {
    const formToSave = {
      ...form,
      id: form.id || `form-${Date.now()}`,
      lastModified: new Date().toISOString()
    };
    
    if (onSave) {
      onSave(formToSave);
    }
    
    // Simular envío a n8n si está configurado
    if (form.settings.workflow?.n8nWebhookUrl) {
      console.log('Enviando formulario a n8n:', form.settings.workflow.n8nWebhookUrl);
    }
  }, [form, onSave]);

  const FieldEditor = ({ field }: { field: FormField }) => (
    <div className="card p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-pns-orange/10 rounded">
            {fieldTypes.find(ft => ft.type === field.type)?.icon && 
              React.createElement(fieldTypes.find(ft => ft.type === field.type)!.icon, { 
                className: "h-4 w-4 text-pns-orange" 
              })
            }
          </div>
          <span className="text-sm font-medium text-pns-gray-700 dark:text-pns-gray-300">
            {fieldTypes.find(ft => ft.type === field.type)?.label}
          </span>
        </div>
        <button 
          onClick={() => removeField(field.id)}
          className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-pns-gray-600 dark:text-pns-gray-400 mb-1">
            Etiqueta
          </label>
          <input
            type="text"
            value={field.label}
            onChange={(e) => updateField(field.id, { label: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-pns-gray-300 dark:border-pns-gray-600 rounded bg-white dark:bg-pns-gray-700 text-pns-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-pns-gray-600 dark:text-pns-gray-400 mb-1">
            Placeholder
          </label>
          <input
            type="text"
            value={field.placeholder || ''}
            onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-pns-gray-300 dark:border-pns-gray-600 rounded bg-white dark:bg-pns-gray-700 text-pns-gray-900 dark:text-white"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id={`required-${field.id}`}
            checked={field.required}
            onChange={(e) => updateField(field.id, { required: e.target.checked })}
            className="rounded border-pns-gray-300 text-pns-orange focus:ring-pns-orange"
          />
          <label htmlFor={`required-${field.id}`} className="text-xs font-medium text-pns-gray-600 dark:text-pns-gray-400">
            Campo Obligatorio
          </label>
        </div>

        {['select', 'multiselect', 'radio'].includes(field.type) && (
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-pns-gray-600 dark:text-pns-gray-400 mb-1">
              Opciones (una por línea)
            </label>
            <textarea
              value={field.options?.join('\n') || ''}
              onChange={(e) => updateField(field.id, { 
                options: e.target.value.split('\n').filter(opt => opt.trim()) 
              })}
              rows={3}
              className="w-full px-3 py-2 text-sm border border-pns-gray-300 dark:border-pns-gray-600 rounded bg-white dark:bg-pns-gray-700 text-pns-gray-900 dark:text-white"
              placeholder="Opción 1&#10;Opción 2&#10;Opción 3"
            />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-pns-gray-50 dark:bg-pns-gray-900 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-pns-gray-900 dark:text-white">
              Constructor de Formularios Dinámicos
            </h1>
            <p className="text-pns-gray-600 dark:text-pns-gray-300">
              Crea formularios inteligentes con automatización n8n
            </p>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={() => onPreview && onPreview(form)}
              className="btn-secondary flex items-center space-x-2"
            >
              <Eye className="h-4 w-4" />
              <span>Vista Previa</span>
            </button>
            <button 
              onClick={handleSave}
              className="btn-primary flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Guardar Formulario</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 border-b border-pns-gray-200 dark:border-pns-gray-700">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'builder', name: 'Constructor', icon: Edit },
              { id: 'settings', name: 'Configuración', icon: Settings },
              { id: 'automation', name: 'Automatización', icon: Zap }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-pns-orange text-pns-orange'
                    : 'border-transparent text-pns-gray-500 hover:text-pns-gray-700 hover:border-pns-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {activeTab === 'builder' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Info */}
          <div className="lg:col-span-3">
            <div className="card p-6 mb-6">
              <h3 className="text-lg font-semibold text-pns-gray-900 dark:text-white mb-4">
                Información del Formulario
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-pns-gray-700 dark:text-pns-gray-300 mb-1">
                    Nombre del Formulario
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-pns-gray-300 dark:border-pns-gray-600 rounded bg-white dark:bg-pns-gray-700 text-pns-gray-900 dark:text-white"
                    placeholder="Ej: Reporte de Incidente SST"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-pns-gray-700 dark:text-pns-gray-300 mb-1">
                    Categoría
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-pns-gray-300 dark:border-pns-gray-600 rounded bg-white dark:bg-pns-gray-700 text-pns-gray-900 dark:text-white"
                  >
                    <option value="ISO45001">ISO 45001 - SST</option>
                    <option value="ISO14001">ISO 14001 - Ambiental</option>
                    <option value="ISO9001">ISO 9001 - Calidad</option>
                    <option value="HR">Recursos Humanos</option>
                    <option value="Operations">Operaciones</option>
                    <option value="Committee">Comité Paritario</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-pns-gray-700 dark:text-pns-gray-300 mb-1">
                    Formularios Predefinidos
                  </label>
                  <select
                    onChange={(e) => {
                      const selectedForm = predefinedForms[parseInt(e.target.value)];
                      if (selectedForm) loadPredefinedForm(selectedForm);
                    }}
                    className="w-full px-3 py-2 border border-pns-gray-300 dark:border-pns-gray-600 rounded bg-white dark:bg-pns-gray-700 text-pns-gray-900 dark:text-white"
                  >
                    <option value="">Cargar plantilla...</option>
                    {predefinedForms.map((predForm, index) => (
                      <option key={index} value={index}>
                        {predForm.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-pns-gray-700 dark:text-pns-gray-300 mb-1">
                    Descripción
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={2}
                    className="w-full px-3 py-2 border border-pns-gray-300 dark:border-pns-gray-600 rounded bg-white dark:bg-pns-gray-700 text-pns-gray-900 dark:text-white"
                    placeholder="Describe el propósito del formulario..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Field Types Palette */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-pns-gray-900 dark:text-white mb-4">
              Tipos de Campo
            </h3>
            <div className="space-y-2">
              {fieldTypes.map((fieldType) => (
                <button
                  key={fieldType.type}
                  onClick={() => setSelectedFieldType(fieldType.type)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg border transition-colors ${
                    selectedFieldType === fieldType.type
                      ? 'border-pns-orange bg-pns-orange/10 text-pns-orange'
                      : 'border-pns-gray-200 dark:border-pns-gray-700 hover:border-pns-gray-300 dark:hover:border-pns-gray-600 text-pns-gray-700 dark:text-pns-gray-300'
                  }`}
                >
                  <fieldType.icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{fieldType.label}</span>
                </button>
              ))}
            </div>
            
            <button
              onClick={addField}
              className="w-full mt-4 btn-primary flex items-center justify-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Agregar Campo</span>
            </button>
          </div>

          {/* Form Builder */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-pns-gray-900 dark:text-white mb-4">
                Campos del Formulario ({form.fields.length})
              </h3>
              
              {form.fields.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="mx-auto h-12 w-12 text-pns-gray-400 mb-4" />
                  <h4 className="text-lg font-medium text-pns-gray-900 dark:text-white mb-2">
                    Formulario Vacío
                  </h4>
                  <p className="text-pns-gray-500 dark:text-pns-gray-400">
                    Selecciona un tipo de campo y haz clic en "Agregar Campo" para comenzar
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {form.fields.map((field) => (
                    <FieldEditor key={field.id} field={field} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="max-w-2xl">
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-pns-gray-900 dark:text-white mb-6">
              Configuración del Formulario
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-pns-gray-900 dark:text-white">
                    Permitir Múltiples Envíos
                  </h4>
                  <p className="text-xs text-pns-gray-500 dark:text-pns-gray-400">
                    Los usuarios pueden enviar el formulario varias veces
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={form.settings.allowMultipleSubmissions}
                  onChange={(e) => setForm(prev => ({
                    ...prev,
                    settings: { ...prev.settings, allowMultipleSubmissions: e.target.checked }
                  }))}
                  className="rounded border-pns-gray-300 text-pns-orange focus:ring-pns-orange"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-pns-gray-900 dark:text-white">
                    Requerir Autenticación
                  </h4>
                  <p className="text-xs text-pns-gray-500 dark:text-pns-gray-400">
                    Solo usuarios autenticados pueden acceder
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={form.settings.requireAuthentication}
                  onChange={(e) => setForm(prev => ({
                    ...prev,
                    settings: { ...prev.settings, requireAuthentication: e.target.checked }
                  }))}
                  className="rounded border-pns-gray-300 text-pns-orange focus:ring-pns-orange"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-pns-gray-900 dark:text-white">
                    Enviar Email de Confirmación
                  </h4>
                  <p className="text-xs text-pns-gray-500 dark:text-pns-gray-400">
                    Notificar al usuario cuando envíe el formulario
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={form.settings.sendConfirmationEmail}
                  onChange={(e) => setForm(prev => ({
                    ...prev,
                    settings: { ...prev.settings, sendConfirmationEmail: e.target.checked }
                  }))}
                  className="rounded border-pns-gray-300 text-pns-orange focus:ring-pns-orange"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-pns-gray-900 dark:text-white">
                    Auto-guardado
                  </h4>
                  <p className="text-xs text-pns-gray-500 dark:text-pns-gray-400">
                    Guardar progreso automáticamente
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={form.settings.autoSave}
                  onChange={(e) => setForm(prev => ({
                    ...prev,
                    settings: { ...prev.settings, autoSave: e.target.checked }
                  }))}
                  className="rounded border-pns-gray-300 text-pns-orange focus:ring-pns-orange"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-pns-gray-700 dark:text-pns-gray-300 mb-2">
                  Fecha de Expiración (Opcional)
                </label>
                <input
                  type="date"
                  value={form.settings.expirationDate || ''}
                  onChange={(e) => setForm(prev => ({
                    ...prev,
                    settings: { ...prev.settings, expirationDate: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-pns-gray-300 dark:border-pns-gray-600 rounded bg-white dark:bg-pns-gray-700 text-pns-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'automation' && (
        <div className="max-w-2xl">
          <div className="card p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-pns-gray-900 dark:text-white">
                  Automatización n8n
                </h3>
                <p className="text-sm text-pns-gray-500 dark:text-pns-gray-400">
                  Configura workflows automáticos
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-pns-gray-700 dark:text-pns-gray-300 mb-2">
                  URL del Webhook n8n
                </label>
                <input
                  type="url"
                  value={form.settings.workflow?.n8nWebhookUrl || ''}
                  onChange={(e) => setForm(prev => ({
                    ...prev,
                    settings: {
                      ...prev.settings,
                      workflow: {
                        ...prev.settings.workflow,
                        n8nWebhookUrl: e.target.value,
                        triggerOn: prev.settings.workflow?.triggerOn || 'submit',
                        includeAttachments: prev.settings.workflow?.includeAttachments || false
                      }
                    }
                  }))}
                  placeholder="https://n8n.tudominio.com/webhook/formulario-sst"
                  className="w-full px-3 py-2 border border-pns-gray-300 dark:border-pns-gray-600 rounded bg-white dark:bg-pns-gray-700 text-pns-gray-900 dark:text-white"
                />
                <p className="text-xs text-pns-gray-500 dark:text-pns-gray-400 mt-1">
                  Los datos del formulario se enviarán a esta URL cuando se active el trigger
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-pns-gray-700 dark:text-pns-gray-300 mb-2">
                  Trigger del Workflow
                </label>
                <select
                  value={form.settings.workflow?.triggerOn || 'submit'}
                  onChange={(e) => setForm(prev => ({
                    ...prev,
                    settings: {
                      ...prev.settings,
                      workflow: {
                        ...prev.settings.workflow,
                        triggerOn: e.target.value as any,
                        n8nWebhookUrl: prev.settings.workflow?.n8nWebhookUrl || '',
                        includeAttachments: prev.settings.workflow?.includeAttachments || false
                      }
                    }
                  }))}
                  className="w-full px-3 py-2 border border-pns-gray-300 dark:border-pns-gray-600 rounded bg-white dark:bg-pns-gray-700 text-pns-gray-900 dark:text-white"
                >
                  <option value="submit">Al Enviar Formulario</option>
                  <option value="save">Al Guardar Borrador</option>
                  <option value="approve">Al Aprobar</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-pns-gray-900 dark:text-white">
                    Incluir Archivos Adjuntos
                  </h4>
                  <p className="text-xs text-pns-gray-500 dark:text-pns-gray-400">
                    Enviar archivos subidos junto con los datos
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={form.settings.workflow?.includeAttachments || false}
                  onChange={(e) => setForm(prev => ({
                    ...prev,
                    settings: {
                      ...prev.settings,
                      workflow: {
                        ...prev.settings.workflow,
                        includeAttachments: e.target.checked,
                        triggerOn: prev.settings.workflow?.triggerOn || 'submit',
                        n8nWebhookUrl: prev.settings.workflow?.n8nWebhookUrl || ''
                      }
                    }
                  }))}
                  className="rounded border-pns-gray-300 text-pns-orange focus:ring-pns-orange"
                />
              </div>

              {form.settings.workflow?.n8nWebhookUrl && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/30 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300">
                        Configuración de n8n
                      </h4>
                      <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                        Asegúrate de que tu workflow en n8n esté configurado para recibir datos en formato JSON. 
                        Los campos del formulario se enviarán como propiedades del objeto.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={() => {
                  // Simular test del webhook
                  console.log('Testing webhook:', form.settings.workflow?.n8nWebhookUrl);
                  alert('Test enviado al webhook n8n (simulado)');
                }}
                disabled={!form.settings.workflow?.n8nWebhookUrl}
                className="w-full btn-secondary flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                <span>Probar Conexión n8n</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DynamicFormBuilder;