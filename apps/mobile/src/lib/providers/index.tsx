/**
 * 앱 전역 Providers
 */

import React from 'react';
import { QueryProvider } from './QueryProvider';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return <QueryProvider>{children}</QueryProvider>;
}

export { QueryProvider } from './QueryProvider';
