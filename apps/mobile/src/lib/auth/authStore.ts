/**
 * 인증 상태 관리 (Zustand)
 */

import { create } from 'zustand';
import { tokenManager } from './tokenManager';

export interface Customer {
  id: number;
  email: string;
  name: string;
  phoneNumber?: string;
}

interface AuthState {
  customer: Customer | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setCustomer: (customer: Customer | null) => void;
  setAuthenticated: (value: boolean) => void;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  customer: null,
  isAuthenticated: false,
  isLoading: true,

  setCustomer: (customer) => {
    set({ customer, isAuthenticated: !!customer });
  },

  setAuthenticated: (value) => {
    set({ isAuthenticated: value });
  },

  logout: async () => {
    await tokenManager.clearTokens();
    set({ customer: null, isAuthenticated: false });
  },

  initialize: async () => {
    try {
      const hasToken = await tokenManager.hasToken();
      if (hasToken) {
        // 토큰이 있으면 인증 상태로 설정
        // 실제로는 여기서 /api/v1/customers/me API를 호출하여 사용자 정보를 가져옴
        set({ isAuthenticated: true, isLoading: false });
      } else {
        set({ isAuthenticated: false, isLoading: false });
      }
    } catch (error) {
      console.log('Auth initialization error:', error);
      set({ isAuthenticated: false, isLoading: false });
    }
  },
}));
