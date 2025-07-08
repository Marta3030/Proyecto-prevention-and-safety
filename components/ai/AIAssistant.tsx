import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Bot,
  Send,
  Mic,
  MicOff,
  User,
  FileText,
  AlertTriangle,
  Shield,
  Leaf,
  Award,
  Clock,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Download,
  Minimize2,
  Maximize2,
  X,
  Lightbulb,
  HelpCircle
} from 'lucide-react';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  category?: 'SST' | 'Ambiental' | 'Calidad' | 'HR' | 'General';
  attachments?: Array<{
    name: string;
    type: 'document' | 'form' | 'procedure';
    url: string;
  }>;
  suggestions?: string[];
  feedback?: 'positive' | 'negative';
}

interface AIAssistantProps {
  isOpen: boolean;
  onToggle: () => void;
  userRole?: string;
}

// Respuestas predefinidas del AI Assistant
const aiResponses = {
  greetings: [
    "¡Hola! Soy tu asistente de Prevention & Safety. ¿En qué puedo ayudarte hoy?",
    "¡Bienvenido! Estoy aquí para ayudarte con temas de seguridad, calidad y medio ambiente.",
    "¡Hola! ¿Tienes alguna pregunta sobre nuestros procedimientos o necesitas completar algún formulario?"
  ],
  
  safety: {
    "reporte de incidente": {
      response: "Para reportar un incidente, puedes usar nuestro formulario digital de reporte de incidentes. Te ayudo a completarlo paso a paso:",
      attachments: [
        { name: "Formulario Reporte de Incidente SST", type: "form" as const, url: "/forms/incident-report" }
      ],
      suggestions: [
        "¿Qué tipos de incidentes debo reportar?",
        "¿Cuánto tiempo tengo para reportar un incidente?",
        "¿Necesito testigos para el reporte?"
      ]
    },
    "uso de epp": {
      response: "El uso de Equipos de Protección Personal (EPP) es obligatorio según nuestros procedimientos de seguridad. Aquí tienes la información completa:",
      attachments: [
        { name: "Manual de EPP", type: "document" as const, url: "/docs/epp-manual.pdf" },
        { name: "Lista de Verificación EPP", type: "form" as const, url: "/forms/epp-checklist" }
      ],
      suggestions: [
        "¿Cómo solicito EPP nuevo?",
        "¿Con qué frecuencia debo inspeccionar mi EPP?",
        "¿Qué hago si mi EPP está dañado?"
      ]
    },
    "emergencia": {
      response: "En caso de emergencia, sigue el protocolo establecido. Aquí están los números de emergencia y procedimientos:",
      attachments: [
        { name: "Plan de Emergencias", type: "procedure" as const, url: "/procedures/emergency-plan" },
        { name: "Números de Emergencia", type: "document" as const, url: "/docs/emergency-contacts" }
      ],
      suggestions: [
        "¿Dónde están las salidas de emergencia?",
        "¿Cuál es el punto de encuentro?",
        "¿Cómo uso el extintor?"
      ]
    }
  },

  environmental: {
    "residuos": {
      response: "La gestión adecuada de residuos es fundamental para nuestro compromiso ambiental. Te muestro cómo clasificar y disponer correctamente:",
      attachments: [
        { name: "Guía de Clasificación de Residuos", type: "document" as const, url: "/docs/waste-classification" },
        { name: "Formato Reporte Ambiental", type: "form" as const, url: "/forms/environmental-report" }
      ],
      suggestions: [
        "¿Dónde deposito residuos peligrosos?",
        "¿Cómo reporto un derrame?",
        "¿Qué residuos se pueden reciclar?"
      ]
    },
    "ahorro energia": {
      response: "Excelente pregunta sobre eficiencia energética. Aquí tienes las mejores prácticas para ahorrar energía en tu área de trabajo:",
      attachments: [],
      suggestions: [
        "¿Cómo configurar equipos en modo ahorro?",
        "¿Cuáles son las metas de ahorro energético?",
        "¿Cómo reportar desperdicio de energía?"
      ]
    }
  },

  quality: {
    "no conformidad": {
      response: "Para reportar una no conformidad en el sistema de calidad, utiliza nuestro formulario especializado:",
      attachments: [
        { name: "Formulario No Conformidad", type: "form" as const, url: "/forms/non-conformity" },
        { name: "Guía de No Conformidades", type: "document" as const, url: "/docs/nc-guide" }
      ],
      suggestions: [
        "¿Qué constituye una no conformidad?",
        "¿Cuál es el proceso de investigación?",
        "¿Cómo dar seguimiento a las acciones correctivas?"
      ]
    },
    "mejora continua": {
      response: "¡Perfecto! La mejora continua es clave en nuestro sistema de calidad. Aquí tienes información sobre cómo proponer mejoras:",
      attachments: [
        { name: "Formulario Sugerencia de Mejora", type: "form" as const, url: "/forms/improvement-suggestion" }
      ],
      suggestions: [
        "¿Cómo se evalúan las sugerencias?",
        "¿Hay reconocimientos por mejoras implementadas?",
        "¿Puedo proponer mejoras de otros departamentos?"
      ]
    }
  }
};

// Sugerencias rápidas por categoría
const quickSuggestions = [
  { text: "¿Cómo reporto un incidente?", category: "SST" },
  { text: "¿Dónde encuentro el manual de EPP?", category: "SST" },
  { text: "¿Cómo clasifico residuos peligrosos?", category: "Ambiental" },
  { text: "¿Cómo reporto una no conformidad?", category: "Calidad" },
  { text: "¿Cuáles son los números de emergencia?", category: "SST" },
  { text: "¿Dónde están los extintores?", category: "SST" },
  { text: "¿Cómo ahorro energía en mi puesto?", category: "Ambiental" },
  { text: "¿Cómo propongo una mejora?", category: "Calidad" }
];

const AIAssistant: React.FC<AIAssistantProps> = ({ isOpen, onToggle, userRole }) => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Inicializar con mensaje de bienvenida
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        type: 'assistant',
        content: aiResponses.greetings[0],
        timestamp: new Date(),
        category: 'General',
        suggestions: quickSuggestions.slice(0, 4).map(s => s.text)
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length]);

  // Auto-scroll al final
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Función para encontrar respuesta del AI
  const findAIResponse = (userInput: string): ChatMessage => {
    const input = userInput.toLowerCase();
    
    // Búsqueda en respuestas de seguridad
    for (const [key, response] of Object.entries(aiResponses.safety)) {
      if (input.includes(key) || input.includes(key.replace(' ', ''))) {
        return {
          id: `ai-${Date.now()}`,
          type: 'assistant',
          content: response.response,
          timestamp: new Date(),
          category: 'SST',
          attachments: response.attachments,
          suggestions: response.suggestions
        };
      }
    }

         // Búsqueda en respuestas ambientales
     for (const [key, response] of Object.entries(aiResponses.environmental)) {
       if (input.includes(key) || input.includes(key.replace(' ', ''))) {
         return {
           id: `ai-${Date.now()}`,
           type: 'assistant',
           content: response.response,
           timestamp: new Date(),
           category: 'Ambiental',
           attachments: response.attachments || [],
           suggestions: response.suggestions
         };
       }
     }

    // Búsqueda en respuestas de calidad
    for (const [key, response] of Object.entries(aiResponses.quality)) {
      if (input.includes(key) || input.includes(key.replace(' ', ''))) {
        return {
          id: `ai-${Date.now()}`,
          type: 'assistant',
          content: response.response,
          timestamp: new Date(),
          category: 'Calidad',
          attachments: response.attachments,
          suggestions: response.suggestions
        };
      }
    }

    // Respuesta genérica
    return {
      id: `ai-${Date.now()}`,
      type: 'assistant',
      content: "Entiendo tu consulta. Te recomiendo revisar nuestros procedimientos documentados o contactar a tu supervisor para información específica. ¿Puedes ser más específico sobre lo que necesitas?",
      timestamp: new Date(),
      category: 'General',
      suggestions: [
        "¿Cómo reporto un incidente?",
        "¿Dónde encuentro los procedimientos?",
        "¿Con quién contacto para más ayuda?"
      ]
    };
  };

  const handleSendMessage = async (content: string = inputValue) => {
    if (!content.trim()) return;

    // Agregar mensaje del usuario
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simular delay de respuesta del AI
    setTimeout(() => {
      const aiResponse = findAIResponse(content);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const handleVoiceToggle = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsListening(!isListening);
      // Aquí se implementaría la funcionalidad de reconocimiento de voz
    } else {
      alert('Tu navegador no soporta reconocimiento de voz');
    }
  };

  const handleFeedback = (messageId: string, feedback: 'positive' | 'negative') => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, feedback } : msg
    ));
  };

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'SST': return Shield;
      case 'Ambiental': return Leaf;
      case 'Calidad': return Award;
      case 'HR': return User;
      default: return HelpCircle;
    }
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'SST': return 'text-red-500';
      case 'Ambiental': return 'text-green-500';
      case 'Calidad': return 'text-blue-500';
      case 'HR': return 'text-purple-500';
      default: return 'text-gray-500';
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${isMinimized ? 'w-80' : 'w-96'} max-h-[600px] bg-white dark:bg-pns-gray-800 rounded-lg shadow-2xl border border-pns-gray-200 dark:border-pns-gray-700 flex flex-col overflow-hidden`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-pns-gray-200 dark:border-pns-gray-700 bg-gradient-to-r from-pns-orange to-pns-yellow">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/20 rounded-full">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">
              IA Assistant
            </h3>
            <p className="text-xs text-white/80">
              Prevention & Safety Helper
            </p>
          </div>
        </div>
        
        <div className="flex space-x-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 text-white/80 hover:text-white hover:bg-white/20 rounded"
          >
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </button>
          <button
            onClick={onToggle}
            className="p-1 text-white/80 hover:text-white hover:bg-white/20 rounded"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96">
            {messages.map((message) => {
              const CategoryIcon = getCategoryIcon(message.category);
              
              return (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] ${message.type === 'user' ? 'bg-pns-orange text-white' : 'bg-pns-gray-100 dark:bg-pns-gray-700 text-pns-gray-900 dark:text-white'} rounded-lg p-3`}>
                    {message.type === 'assistant' && (
                      <div className="flex items-center space-x-2 mb-2">
                        <CategoryIcon className={`h-4 w-4 ${getCategoryColor(message.category)}`} />
                        <span className="text-xs font-medium text-pns-gray-500 dark:text-pns-gray-400">
                          {message.category}
                        </span>
                        <span className="text-xs text-pns-gray-400 dark:text-pns-gray-500">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    )}
                    
                    <div className="text-sm">{message.content}</div>
                    
                    {/* Attachments */}
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {message.attachments.map((attachment, index) => (
                          <div key={index} className="flex items-center space-x-2 p-2 bg-white/10 rounded">
                            <FileText className="h-4 w-4 text-pns-orange" />
                            <span className="text-xs flex-1">{attachment.name}</span>
                            <button className="text-xs text-pns-orange hover:underline">
                              Abrir
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Suggestions */}
                    {message.suggestions && message.suggestions.length > 0 && (
                      <div className="mt-3 space-y-1">
                        <div className="text-xs font-medium text-pns-gray-600 dark:text-pns-gray-300">
                          Sugerencias:
                        </div>
                        {message.suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="block w-full text-left text-xs p-2 bg-white/10 hover:bg-white/20 rounded transition-colors"
                          >
                            💡 {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                    
                    {/* Feedback buttons for AI messages */}
                    {message.type === 'assistant' && (
                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/10">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleFeedback(message.id, 'positive')}
                            className={`p-1 rounded ${message.feedback === 'positive' ? 'text-green-500' : 'text-pns-gray-400 hover:text-green-500'}`}
                          >
                            <ThumbsUp className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => handleFeedback(message.id, 'negative')}
                            className={`p-1 rounded ${message.feedback === 'negative' ? 'text-red-500' : 'text-pns-gray-400 hover:text-red-500'}`}
                          >
                            <ThumbsDown className="h-3 w-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => navigator.clipboard.writeText(message.content)}
                          className="p-1 text-pns-gray-400 hover:text-pns-gray-600 rounded"
                        >
                          <Copy className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            
            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-pns-gray-100 dark:bg-pns-gray-700 rounded-lg p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-pns-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-pns-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-pns-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick suggestions */}
          {messages.length <= 1 && (
            <div className="p-4 border-t border-pns-gray-200 dark:border-pns-gray-700">
              <div className="text-xs font-medium text-pns-gray-600 dark:text-pns-gray-400 mb-2">
                Sugerencias rápidas:
              </div>
              <div className="grid grid-cols-2 gap-2">
                {quickSuggestions.slice(0, 4).map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion.text)}
                    className="text-left text-xs p-2 bg-pns-gray-50 dark:bg-pns-gray-700 hover:bg-pns-gray-100 dark:hover:bg-pns-gray-600 rounded transition-colors"
                  >
                    <Lightbulb className="h-3 w-3 inline mr-1 text-pns-orange" />
                    {suggestion.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 border-t border-pns-gray-200 dark:border-pns-gray-700">
            <div className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Escribe tu pregunta sobre seguridad, calidad o medio ambiente..."
                className="flex-1 px-3 py-2 text-sm border border-pns-gray-300 dark:border-pns-gray-600 rounded bg-white dark:bg-pns-gray-700 text-pns-gray-900 dark:text-white placeholder-pns-gray-500 focus:ring-2 focus:ring-pns-orange focus:border-transparent"
              />
              
              <button
                onClick={handleVoiceToggle}
                className={`p-2 rounded ${isListening ? 'bg-red-500 text-white' : 'bg-pns-gray-100 dark:bg-pns-gray-700 text-pns-gray-600 dark:text-pns-gray-300 hover:bg-pns-gray-200 dark:hover:bg-pns-gray-600'}`}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </button>
              
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim()}
                className="p-2 bg-pns-orange text-white rounded hover:bg-pns-orange/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AIAssistant;