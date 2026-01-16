import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../services/auth.service';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email, password) => {
        try {
          const response = await authService.login(email, password);
          set({ 
            user: response.user, 
            token: response.token, 
            isAuthenticated: true 
          });
          return response;
        } catch (error) {
          throw error;
        }
      },

      logout: () => {
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false 
        });
        localStorage.removeItem('token');
      },

      updateUser: (userData) => {
        set((state) => ({ 
          user: { ...state.user, ...userData } 
        }));
      },

      setAuth: (user, token) => {
        set({ 
          user, 
          token, 
          isAuthenticated: true 
        });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
