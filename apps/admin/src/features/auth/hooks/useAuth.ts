import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const { admin, isAuthenticated, isLoading, isInitialized, initialize, checkAuth } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return {
    admin,
    isAuthenticated,
    isLoading,
    isInitialized,
    checkAuth,
  };
};
