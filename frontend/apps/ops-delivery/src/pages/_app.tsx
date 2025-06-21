import type { AppProps } from 'next/app'
import { QueryProvider } from '../providers/QueryProvider';
import { ToastProvider } from '../providers/ToastProvider';
import { AuthProvider } from '../providers/AuthProvider';
import { useEffect } from 'react';
import '../styles/globals.css'

// Gateway Enforcement: Ensure Operations Dashboard is accessed through Multi-App Gateway (port 5000)
function GatewayEnforcer({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentPort = window.location.port;
      const isDirectAccess = currentPort === '3004'; // Direct Next.js access
      
      if (isDirectAccess) {
        // Redirect to Multi-App Gateway
        const gatewayUrl = window.location.origin.replace(':3004', ':5000') + '/ops';
        window.location.href = gatewayUrl;
        return;
      }
    }
  }, []);

  return <>{children}</>;
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <GatewayEnforcer>
      <QueryProvider>
        <AuthProvider>
          <ToastProvider>
            <Component {...pageProps} />
          </ToastProvider>
        </AuthProvider>
      </QueryProvider>
    </GatewayEnforcer>
  )
}