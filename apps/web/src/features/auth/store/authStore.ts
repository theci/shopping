import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { tokenManager } from '@/lib/auth/tokenManager';
import { authApi } from '../api/authApi';
import type { Customer, LoginRequest, RegisterRequest } from '../types';

interface AuthState {
  customer: Customer | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;

  // Actions
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  setCustomer: (customer: Customer) => void;
  checkAuth: () => Promise<boolean>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      customer: null,
      isAuthenticated: false,
      isLoading: false,
      isInitialized: false,

      login: async (data) => {
        set({ isLoading: true });
        try {
          const response = await authApi.login(data);
          tokenManager.setTokens(response.accessToken, response.refreshToken);
          set({
            customer: response.customer,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (data) => {
        set({ isLoading: true });
        try {
          await authApi.register(data);
          set({ isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        tokenManager.clearTokens();
        set({
          customer: null,
          isAuthenticated: false,
        });
      },

      setCustomer: (customer) => {
        set({ customer, isAuthenticated: true });
      },

      checkAuth: async () => {
        const token = tokenManager.getAccessToken();
        if (!token) {
          set({ isAuthenticated: false, customer: null });
          return false;
        }

        try {
          const customer = await authApi.getMe();
          set({ customer, isAuthenticated: true });
          return true;
        } catch {
          tokenManager.clearTokens();
          set({ isAuthenticated: false, customer: null });
          return false;
        }
      },

      initialize: async () => {
        if (get().isInitialized) return;

        const token = tokenManager.getAccessToken();
        if (token) {
          try {
            const customer = await authApi.getMe();
            set({ customer, isAuthenticated: true, isInitialized: true });
          } catch {
            tokenManager.clearTokens();
            set({ isAuthenticated: false, customer: null, isInitialized: true });
          }
        } else {
          set({ isInitialized: true });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        customer: state.customer,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
