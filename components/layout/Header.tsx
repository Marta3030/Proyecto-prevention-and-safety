
import React, { useState } from 'react';
import { 
  Bell, 
  Settings, 
  LogOut, 
  Moon, 
  Sun, 
  Globe,
  Zap,
  ChevronDown,
  User
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import useUIStore from '../../store/uiStore';
import { useTranslation } from 'react-i18next';
import Logo from '../ui/Logo';
import AutomationModal from '../ui/AutomationModal';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode, language, setLanguage } = useUIStore();
  const { t, i18n } = useTranslation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAutomationModal, setShowAutomationModal] = useState(false);

  const handleLanguageChange = (newLanguage: 'es' | 'en') => {
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
  };

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
  };

  return (
    <>
      <header className="bg-white dark:bg-pns-gray-800 shadow-sm border-b border-pns-gray-200 dark:border-pns-gray-700">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo y Título */}
            <div className="flex items-center space-x-4">
              <Logo size="sm" showText={false} />
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-pns-orange">PREVENTION</h1>
                <p className="text-xs text-pns-gray-500 dark:text-pns-gray-400 leading-none">
                  AND SAFETY
                </p>
              </div>
            </div>

            {/* Centro - Botón de Automatización */}
            <div className="flex-1 flex justify-center">
              <button
                onClick={() => setShowAutomationModal(true)}
                className="flex items-center space-x-2 bg-gradient-to-r from-pns-orange to-pns-primary hover:from-pns-orange-dark hover:to-pns-primary-dark text-white px-4 py-2 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                <Zap className="h-5 w-5" />
                <span className="font-medium text-sm">Servicios de Automatización</span>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </button>
            </div>

            {/* Derecha - Controles */}
            <div className="flex items-center space-x-4">
              {/* Selector de idioma */}
              <div className="relative">
                <button
                  onClick={() => handleLanguageChange(language === 'es' ? 'en' : 'es')}
                  className="flex items-center space-x-1 p-2 text-pns-gray-600 dark:text-pns-gray-300 hover:text-pns-orange dark:hover:text-pns-orange transition-colors"
                  title={language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
                >
                  <Globe className="h-5 w-5" />
                  <span className="text-sm font-medium uppercase">{language}</span>
                </button>
              </div>

              {/* Toggle tema */}
              <button
                onClick={toggleDarkMode}
                className="p-2 text-pns-gray-600 dark:text-pns-gray-300 hover:text-pns-orange dark:hover:text-pns-orange transition-colors"
                title={darkMode ? 'Modo claro' : 'Modo oscuro'}
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              {/* Notificaciones */}
              <button className="relative p-2 text-pns-gray-600 dark:text-pns-gray-300 hover:text-pns-orange dark:hover:text-pns-orange transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Menú de usuario */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-pns-gray-100 dark:hover:bg-pns-gray-700 transition-colors"
                >
                  <div className="w-8 h-8 bg-pns-orange rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="text-sm font-medium text-pns-gray-900 dark:text-white">
                      {user?.name}
                    </div>
                    <div className="text-xs text-pns-gray-500 dark:text-pns-gray-400">
                      {user?.role}
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-pns-gray-500" />
                </button>

                {/* Dropdown del usuario */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-pns-gray-800 rounded-lg shadow-lg border border-pns-gray-200 dark:border-pns-gray-700 z-50">
                    <div className="py-1">
                      <div className="px-4 py-2 text-sm text-pns-gray-700 dark:text-pns-gray-300 border-b border-pns-gray-200 dark:border-pns-gray-700">
                        <div className="font-medium">{user?.name}</div>
                        <div className="text-xs text-pns-gray-500">{user?.email}</div>
                      </div>
                      
                      <button className="flex items-center w-full px-4 py-2 text-sm text-pns-gray-700 dark:text-pns-gray-300 hover:bg-pns-gray-100 dark:hover:bg-pns-gray-700">
                        <User className="h-4 w-4 mr-3" />
                        Mi Perfil
                      </button>
                      
                      <button className="flex items-center w-full px-4 py-2 text-sm text-pns-gray-700 dark:text-pns-gray-300 hover:bg-pns-gray-100 dark:hover:bg-pns-gray-700">
                        <Settings className="h-4 w-4 mr-3" />
                        Configuración
                      </button>
                      
                      <div className="border-t border-pns-gray-200 dark:border-pns-gray-700">
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <LogOut className="h-4 w-4 mr-3" />
                          {t('auth.logout')}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Modal de Automatización */}
      <AutomationModal 
        isOpen={showAutomationModal}
        onClose={() => setShowAutomationModal(false)}
      />
    </>
  );
};

export default Header;
