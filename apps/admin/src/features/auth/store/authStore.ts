import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { tokenManager } from '@/lib/auth/tokenManager';
import { authApi } from '../api/authApi';
import type { Admin, LoginRequest, AuthState } from '../types';

interface AuthStore extends AuthState {
  login: (data: LoginRequest) => Promise<void>;
  logout: () => void;
  setAdmin: (admin: Admin) => void;
  checkAuth: () => Promise<boolean>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      admin: null,
      isAuthenticated: false,
      isLoading: false,
      isInitialized: false,

      login: async (data) => {
        set({ isLoading: true });
        try {
          const response = await authApi.login(data);

          // ADMIN 역할 검증
          if (response.customer.role !== 'ADMIN') {
            throw new Error('관리자 권한이 없습니다. 관리자 계정으로 로그인해주세요.');
          }

          tokenManager.setTokens(response.accessToken, response.refreshToken);
          set({
            admin: response.customer,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        tokenManager.clearTokens();
        set({
          admin: null,
          isAuthenticated: false,
        });
      },

      setAdmin: (admin) => {
        set({ admin, isAuthenticated: true });
      },

      checkAuth: async () => {
        const token = tokenManager.getAccessToken();
        if (!token) {
          set({ isAuthenticated: false, admin: null });
          return false;
        }

        try {
          const admin = await authApi.getMe();
          // ADMIN 역할 검증
          if (admin.role !== 'ADMIN') {
            tokenManager.clearTokens();
            set({ isAuthenticated: false, admin: null });
            return false;
          }
          set({ admin, isAuthenticated: true });
          return true;
        } catch {
          tokenManager.clearTokens();
          set({ isAuthenticated: false, admin: null });
          return false;
        }
      },

      initialize: async () => {
        if (get().isInitialized) return;

        const token = tokenManager.getAccessToken();
        if (token) {
          try {
            const admin = await authApi.getMe();
            // ADMIN 역할 검증
            if (admin.role !== 'ADMIN') {
              tokenManager.clearTokens();
              set({ admin: null, isAuthenticated: false, isInitialized: true });
              return;
            }
            set({ admin, isAuthenticated: true, isInitialized: true });
          } catch {
            tokenManager.clearTokens();
            set({ admin: null, isAuthenticated: false, isInitialized: true });
          }
        } else {
          set({ isInitialized: true });
        }
      },
    }),
    {
      name: 'admin-auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        admin: state.admin,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
