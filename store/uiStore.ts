
import { create } from 'zustand';
import { UIState, Notification } from '../types';

const useUIStore = create<UIState>((set) => ({
  darkMode: localStorage.getItem('darkMode') === 'true',
  sidebarOpen: false,
  language: (localStorage.getItem('language') as 'es' | 'en') || 'es',
  notifications: [],
  
  toggleDarkMode: () => set((state) => {
    const newDarkMode = !state.darkMode;
    localStorage.setItem('darkMode', newDarkMode.toString());
    return { darkMode: newDarkMode };
  }),
  
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  
  setSidebarOpen: (isOpen) => set({ sidebarOpen: isOpen }),
  
  setLanguage: (language: 'es' | 'en') => {
    localStorage.setItem('language', language);
    set({ language });
  },
  
  addNotification: (notification: Notification) => set((state: UIState) => ({
    notifications: [...state.notifications, notification]
  })),
  
  removeNotification: (id: string) => set((state: UIState) => ({
    notifications: state.notifications.filter(n => n.id !== id)
  })),
}));

export default useUIStore;
