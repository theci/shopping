'use client';

import { useToastContext } from '@/lib/providers/ToastProvider';
import type { ToastType } from '@/lib/providers/ToastProvider';

interface ShowToastOptions {
  type: ToastType;
  message: string;
  duration?: number;
}

/**
 * Toast 알림 훅
 */
export function useToast() {
  const context = useToastContext();

  return {
    showToast: (options: ShowToastOptions) => context.showToast(options),
    success: (message: string, duration?: number) =>
      context.showToast({ type: 'success', message, duration }),
    error: (message: string, duration?: number) =>
      context.showToast({ type: 'error', message, duration }),
    warning: (message: string, duration?: number) =>
      context.showToast({ type: 'warning', message, duration }),
    info: (message: string, duration?: number) =>
      context.showToast({ type: 'info', message, duration }),
  };
}
