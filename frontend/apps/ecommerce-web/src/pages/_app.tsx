import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { Inter } from 'next/font/google';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ClientOnly from '@/components/ClientOnly';

// Gateway Enforcement: Ensure Ecommerce Web is accessed through Multi-App Gateway (port 5000)
function GatewayEnforcer({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentPort = window.location.port;
      const isDirectAccess = currentPort === '3000'; // Direct Next.js access
      
      if (isDirectAccess) {
        // Redirect to Multi-App Gateway
        const gatewayUrl = window.location.origin.replace(':3000', ':5000');
        window.location.href = gatewayUrl;
        return;
      }
    }
  }, []);

  return <>{children}</>;
}

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useBranchStore } from '@/lib/stores/useBranchStore';
import { useAuthStore } from '../stores/authStore';
import ErrorFallback from '@/components/ui/ErrorFallback';
import LoadingScreen from '@/components/ui/LoadingScreen';
import BranchSelectorModal from '@/components/modals/BranchSelectorModal';
import PWAInstallPrompt from '@/components/PWA/InstallPrompt';

import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 }
};

const pageTransition = {
  type: 'tween' as const,
  ease: 'easeInOut' as const,
  duration: 0.4
};

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [showBranchModal, setShowBranchModal] = useState(false);
  
  const { selectedBranch, detectLocation, isLoadingLocation } = useBranchStore();
  const { verifyToken, isLoading: authLoading } = useAuthStore();

  // Initialize app
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize authentication
        await verifyToken();
        
        // Detect location and set branch
        if (!selectedBranch) {
          await detectLocation();
        }
        
        // Register service worker for PWA
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.register('/sw.js');
        }
      } catch (error) {
        console.error('App initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  // Show branch selection modal if no branch selected
  useEffect(() => {
    if (!isLoading && !selectedBranch && !isLoadingLocation) {
      setShowBranchModal(true);
    }
  }, [isLoading, selectedBranch, isLoadingLocation]);

  // Loading screen
  if (isLoading || authLoading) {
    return <LoadingScreen />;
  }

  // No header/footer for auth pages
  const isAuthPage = router.pathname.startsWith('/auth/');
  const isCheckoutPage = router.pathname === '/checkout';

  return (
    <GatewayEnforcer>
      <QueryClientProvider client={queryClient}>
        <div className={`${inter.className} min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50`}>
          <ErrorFallback>
            <ClientOnly 
              fallback={
                <div className="min-h-screen flex items-center justify-center">
                  <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
                </div>
              }
            >
              {!isAuthPage && <Header />}
              
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={router.asPath}
                  variants={pageVariants}
                  initial="initial"
                  animate="in"
                  exit="out"
                  transition={pageTransition}
                  className={`${!isAuthPage ? 'pt-20' : ''} ${isCheckoutPage ? 'pb-0' : 'pb-16'}`}
                >
                  <Component {...pageProps} />
                </motion.div>
              </AnimatePresence>
              
              {!isAuthPage && !isCheckoutPage && <Footer />}
              
              {/* Modals */}
              <BranchSelectorModal 
                isOpen={showBranchModal} 
                onClose={() => setShowBranchModal(false)} 
              />
              
              {/* PWA Install Prompt */}
              <PWAInstallPrompt />
            </ClientOnly>
            
            {/* Toast Notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                  borderRadius: '12px',
                  color: '#374151',
                },
                success: {
                  iconTheme: {
                    primary: '#10B981',
                    secondary: '#FFFFFF',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#EF4444',
                    secondary: '#FFFFFF',
                  },
                },
              }}
            />
          </ErrorFallback>
        </div>
        
        {process.env.NODE_ENV === 'development' && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </QueryClientProvider>
    </GatewayEnforcer>
  );
}