
import { create } from 'zustand';
import { AuthState, User } from '../types';
import { MOCK_USERS } from '../constants';

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  login: async (credentials) => {
    set({ isLoading: true, error: null });
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    const mockUser = MOCK_USERS[credentials.email];

    if (mockUser && credentials.password === 'password123') { // Simplified password check
      const userWithId: User = { ...mockUser, id: credentials.email };
      set({ user: userWithId, isAuthenticated: true, isLoading: false });
      localStorage.setItem('currentUser', JSON.stringify(userWithId));
    } else {
      set({ error: 'Credenciales inválidas.', isLoading: false, user: null, isAuthenticated: false });
      localStorage.removeItem('currentUser');
    }
  },
  logout: () => {
    set({ user: null, isAuthenticated: false, isLoading: false, error: null });
    localStorage.removeItem('currentUser');
  },
  setCurrentUser: (user) => {
     set({ user, isAuthenticated: !!user, isLoading: false });
     if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
     } else {
        localStorage.removeItem('currentUser');
     }
  }
}));

// Initialize auth state from localStorage
const storedUser = localStorage.getItem('currentUser');
if (storedUser) {
  try {
    const user: User = JSON.parse(storedUser);
    useAuthStore.getState().setCurrentUser(user);
  } catch (error) {
    console.error("Failed to parse stored user:", error);
    localStorage.removeItem('currentUser');
  }
}


export default useAuthStore;
