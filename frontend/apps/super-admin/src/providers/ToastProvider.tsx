'use client';

import { ReactNode } from 'react';

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  // Basic toast provider for now
  return <>{children}</>;
}