import type { AppProps } from 'next/app'
import { QueryProvider } from '../providers/QueryProvider';
import { ToastProvider } from '../providers/ToastProvider';
import { AuthProvider } from '../providers/AuthProvider';
import { useEffect } from 'react';
import '../styles/globals.css'

// Gateway Enforcement: Ensure Mobile Commerce is accessed through Multi-App Gateway (port 5000)
function GatewayEnforcer({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentPort = window.location.port;
      const isDirectAccess = currentPort === '3001'; // Direct Next.js access
      
      if (isDirectAccess) {
        // Redirect to Multi-App Gateway
        const gatewayUrl = window.location.origin.replace(':3001', ':5000') + '/mobile';
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