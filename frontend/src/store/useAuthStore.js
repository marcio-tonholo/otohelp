import { create } from 'zustand';
import { authAPI } from '../api/client';

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,

  setUser: (user) => set({ user }),

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authAPI.login({ email, password });
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });

      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Erro ao fazer login';
      set({
        error: errorMessage,
        isLoading: false,
      });
      throw error;
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authAPI.register(userData);
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });

      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Erro ao registrar';
      set({
        error: errorMessage,
        isLoading: false,
      });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  fetchCurrentUser: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ isAuthenticated: false });
      return;
    }

    set({ isLoading: true });
    try {
      const response = await authAPI.getCurrentUser();
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      localStorage.removeItem('token');
      set({
        isAuthenticated: false,
        token: null,
        user: null,
        isLoading: false,
      });
    }
  },
}));
