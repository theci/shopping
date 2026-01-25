'use client';

import { QueryProvider } from './QueryProvider';
import { ToastProvider } from './ToastProvider';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryProvider>
      <ToastProvider>{children}</ToastProvider>
    </QueryProvider>
  );
}

export { QueryProvider } from './QueryProvider';
export { ToastProvider, useToastContext } from './ToastProvider';
export type { ToastType, ToastMessage } from './ToastProvider';
