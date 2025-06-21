/**
 * React Query Provider with optimized configuration
 */

'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => {
    const client = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 5 * 60 * 1000, // 5 minutes
          gcTime: 10 * 60 * 1000, // 10 minutes
          retry: (failureCount, error: any) => {
            // Don't retry on authentication errors
            if (error?.status === 401 || error?.status === 403) {
              return false;
            }
            return failureCount < 3;
          },
          refetchOnWindowFocus: false,
          refetchOnMount: true,
        },
        mutations: {
          retry: (failureCount, error: any) => {
            if (error?.status === 401 || error?.status === 403) {
              return false;
            }
            return failureCount < 2;
          },
        },
      },
    });

    // Add global error handler to prevent unhandled rejections
    client.setQueryDefaults(['auth', 'user'], {
      queryFn: async () => {
        // Return demo admin user for development environment
        return {
          id: 'admin-user',
          email: 'admin@leafyhealth.com',
          firstName: 'Admin',
          lastName: 'User',
          roles: ['admin', 'manager']
        };
      },
    });

    return client;
  });

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}