
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import useAuthStore from '../../store/authStore';
import useUIStore from '../../store/uiStore';
import AIAssistant from '../ai/AIAssistant';
import { Bot } from 'lucide-react';

const Layout: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const isDarkMode = useUIStore((state) => state.isDarkMode);
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);
  const [showAIAssistant, setShowAIAssistant] = useState(false);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="flex h-screen bg-pns-gray-50 dark:bg-pns-gray-900">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-pns-gray-50 dark:bg-pns-gray-900">
            <div className="container mx-auto px-6 py-8">
              <Outlet />
            </div>
          </main>
        </div>

        {/* AI Assistant Floating Button */}
        {!showAIAssistant && (
          <button
            onClick={() => setShowAIAssistant(true)}
            className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-gradient-to-r from-pns-orange to-pns-yellow text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center group hover:scale-105"
            title="IA Assistant - Prevention & Safety"
          >
            <Bot className="h-6 w-6 group-hover:scale-110 transition-transform" />
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
          </button>
        )}

        {/* AI Assistant Component */}
        <AIAssistant 
          isOpen={showAIAssistant}
          onToggle={() => setShowAIAssistant(!showAIAssistant)}
          userRole={user?.role}
        />
      </div>
    </div>
  );
};

export default Layout;
