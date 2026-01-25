import { useToastContext } from '@/lib/providers';

export function useToast() {
  const { showToast, hideToast, toasts } = useToastContext();
  return { showToast, hideToast, toasts };
}
