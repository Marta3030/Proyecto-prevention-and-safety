import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  X, 
  Zap, 
  Send, 
  CheckCircle, 
  Settings, 
  Database, 
  Mail, 
  MessageSquare,
  Workflow,
  Bot,
  Users,
  FileText
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface AutomationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Esquema de validación
const contactSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  company: z.string().min(2, 'La empresa debe tener al menos 2 caracteres'),
  phone: z.string().optional(),
  service: z.string().min(1, 'Selecciona un servicio'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  priority: z.enum(['low', 'medium', 'high']),
});

type ContactFormData = z.infer<typeof contactSchema>;

// Servicios disponibles
const automationServices = [
  {
    id: 'rrhh-automation',
    title: 'Automatización de Procesos RRHH',
    description: 'Automatiza onboarding, evaluaciones y reportes de empleados',
    icon: Users,
    color: 'text-blue-500',
    examples: ['Onboarding automático', 'Evaluaciones periódicas', 'Reportes de asistencia']
  },
  {
    id: 'safety-integration',
    title: 'Integración de Sistemas de Seguridad',
    description: 'Conecta sensores IoT, alarmas y sistemas de monitoreo',
    icon: Settings,
    color: 'text-red-500',
    examples: ['Sensores de gas', 'Sistemas de alarma', 'Cámaras de seguridad']
  },
  {
    id: 'document-workflow',
    title: 'Flujos de Documentos ISO',
    description: 'Automatiza aprobaciones, revisiones y control de versiones',
    icon: FileText,
    color: 'text-green-500',
    examples: ['Aprobaciones automáticas', 'Control de versiones', 'Notificaciones de vencimiento']
  },
  {
    id: 'notification-system',
    title: 'Sistema de Notificaciones Inteligentes',
    description: 'Email, SMS y notificaciones push personalizadas',
    icon: Mail,
    color: 'text-purple-500',
    examples: ['Alertas por email', 'SMS de emergencia', 'Notificaciones push']
  },
  {
    id: 'data-integration',
    title: 'Integración de Bases de Datos',
    description: 'Sincroniza datos entre sistemas y APIs externas',
    icon: Database,
    color: 'text-yellow-500',
    examples: ['APIs de terceros', 'Sincronización de datos', 'Reportes automáticos']
  },
  {
    id: 'chatbot-ai',
    title: 'Asistente IA para Empleados',
    description: 'Chatbot inteligente para consultas y soporte 24/7',
    icon: Bot,
    color: 'text-indigo-500',
    examples: ['Consultas de políticas', 'Soporte técnico', 'Reportes de incidentes']
  }
];

const AutomationModal: React.FC<AutomationModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [selectedService, setSelectedService] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      priority: 'medium'
    }
  });

  const watchedService = watch('service');

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    try {
      // Aquí se enviaría a la API que conecta con n8n
      const response = await fetch('/api/contact/automation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          timestamp: new Date().toISOString(),
          source: 'prevention-safety-app'
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        reset();
        setTimeout(() => {
          setIsSubmitted(false);
          onClose();
        }, 3000);
      } else {
        throw new Error('Error al enviar la solicitud');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al enviar la solicitud. Por favor, intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
    setValue('service', serviceId);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-pns-gray-800 shadow-xl rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-pns-gray-200 dark:border-pns-gray-700">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-pns-orange to-pns-primary rounded-lg">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-pns-gray-900 dark:text-white">
                  Servicios de Automatización
                </h3>
                <p className="text-sm text-pns-gray-500 dark:text-pns-gray-400">
                  Potencia tu empresa con automatización inteligente
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-pns-gray-400 hover:text-pns-gray-600 dark:hover:text-pns-gray-200 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          {isSubmitted ? (
            // Success State
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <h4 className="text-xl font-semibold text-pns-gray-900 dark:text-white mb-2">
                ¡Solicitud Enviada!
              </h4>
              <p className="text-pns-gray-600 dark:text-pns-gray-300 mb-4">
                Hemos recibido tu solicitud de automatización. Nuestro equipo se pondrá en contacto contigo dentro de las próximas 24 horas.
              </p>
              <div className="text-sm text-pns-gray-500 dark:text-pns-gray-400">
                <Workflow className="h-4 w-4 inline mr-2" />
                Se ha activado un flujo automático en n8n para procesar tu solicitud
              </div>
            </div>
          ) : (
            <div className="p-6">
              {/* Services Grid */}
              <div className="mb-6">
                <h4 className="text-lg font-medium text-pns-gray-900 dark:text-white mb-4">
                  Selecciona un Servicio
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {automationServices.map((service) => (
                    <div
                      key={service.id}
                      onClick={() => handleServiceSelect(service.id)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                        watchedService === service.id
                          ? 'border-pns-orange bg-orange-50 dark:bg-orange-900/20'
                          : 'border-pns-gray-200 dark:border-pns-gray-700 hover:border-pns-orange'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <service.icon className={`h-6 w-6 ${service.color} flex-shrink-0 mt-1`} />
                        <div className="flex-1 min-w-0">
                          <h5 className="text-sm font-medium text-pns-gray-900 dark:text-white">
                            {service.title}
                          </h5>
                          <p className="text-xs text-pns-gray-500 dark:text-pns-gray-400 mt-1">
                            {service.description}
                          </p>
                          <div className="mt-2">
                            {service.examples.slice(0, 2).map((example, index) => (
                              <span
                                key={index}
                                className="inline-block text-xs bg-pns-gray-100 dark:bg-pns-gray-700 text-pns-gray-600 dark:text-pns-gray-300 px-2 py-1 rounded mr-1 mb-1"
                              >
                                {example}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-pns-gray-700 dark:text-pns-gray-300 mb-2">
                      Nombre Completo *
                    </label>
                    <input
                      {...register('name')}
                      className="input-field"
                      placeholder="Tu nombre completo"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-pns-gray-700 dark:text-pns-gray-300 mb-2">
                      Email *
                    </label>
                    <input
                      {...register('email')}
                      type="email"
                      className="input-field"
                      placeholder="tu@empresa.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-pns-gray-700 dark:text-pns-gray-300 mb-2">
                      Empresa *
                    </label>
                    <input
                      {...register('company')}
                      className="input-field"
                      placeholder="Nombre de tu empresa"
                    />
                    {errors.company && (
                      <p className="mt-1 text-sm text-red-600">{errors.company.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-pns-gray-700 dark:text-pns-gray-300 mb-2">
                      Teléfono
                    </label>
                    <input
                      {...register('phone')}
                      className="input-field"
                      placeholder="+1234567890"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-pns-gray-700 dark:text-pns-gray-300 mb-2">
                    Prioridad
                  </label>
                  <select {...register('priority')} className="input-field">
                    <option value="low">Baja - No urgente</option>
                    <option value="medium">Media - En las próximas semanas</option>
                    <option value="high">Alta - Necesario pronto</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-pns-gray-700 dark:text-pns-gray-300 mb-2">
                    Descripción del Proyecto *
                  </label>
                  <textarea
                    {...register('description')}
                    rows={4}
                    className="input-field"
                    placeholder="Describe qué necesitas automatizar, el contexto actual de tu empresa y los resultados esperados..."
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                  )}
                </div>

                <input type="hidden" {...register('service')} />
                {errors.service && (
                  <p className="text-sm text-red-600">{errors.service.message}</p>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-pns-gray-200 dark:border-pns-gray-700">
                  <div className="text-sm text-pns-gray-500 dark:text-pns-gray-400">
                    <MessageSquare className="h-4 w-4 inline mr-1" />
                    Respuesta en menos de 24 horas
                  </div>
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="btn-secondary"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary flex items-center space-x-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Enviando...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          <span>Enviar Solicitud</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AutomationModal;