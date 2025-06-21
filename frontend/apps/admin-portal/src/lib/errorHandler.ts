/**
 * Global Error Handler for React Query
 * Prevents unhandled rejection errors in browser console
 */

// Global error handler for unhandled promise rejections
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    // Suppress unhandled rejection errors from React Query
    if (event.reason?.message?.includes('Failed to fetch') || 
        event.reason?.name === 'APIError' ||
        event.reason?.status === 401) {
      event.preventDefault();
      console.log('Network request handled gracefully:', event.reason?.message || 'Unknown error');
    }
  });
}

export function suppressQueryErrors() {
  // This function exists to ensure the error handler is loaded
  return true;
}