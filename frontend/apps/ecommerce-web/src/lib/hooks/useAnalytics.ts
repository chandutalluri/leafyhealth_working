
import { useCallback } from 'react';
import { apiClient } from '@/lib/api/client';

interface AnalyticsEvent {
  eventType: 'page_view' | 'product_view' | 'add_to_cart' | 'purchase' | 'search' | 'category_view';
  userId?: string;
  sessionId?: string;
  productId?: string;
  categoryId?: string;
  searchQuery?: string;
  value?: number;
  metadata?: Record<string, any>;
}

export const useAnalytics = () => {
  const trackEvent = useCallback(async (event: AnalyticsEvent) => {
    try {
      await apiClient.analytics.trackEvent({
        ...event,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        referrer: document.referrer,
      });
    } catch (error) {
      console.error('Analytics tracking failed:', error);
    }
  }, []);

  const trackPageView = useCallback((pageName: string, additionalData?: Record<string, any>) => {
    trackEvent({
      eventType: 'page_view',
      metadata: {
        pageName,
        ...additionalData
      }
    });
  }, [trackEvent]);

  const trackProductView = useCallback((productId: string, productName: string, categoryId?: string) => {
    trackEvent({
      eventType: 'product_view',
      productId,
      categoryId,
      metadata: {
        productName
      }
    });
  }, [trackEvent]);

  const trackAddToCart = useCallback((productId: string, quantity: number, price: number) => {
    trackEvent({
      eventType: 'add_to_cart',
      productId,
      value: price * quantity,
      metadata: {
        quantity
      }
    });
  }, [trackEvent]);

  const trackPurchase = useCallback((orderId: string, totalValue: number, items: any[]) => {
    trackEvent({
      eventType: 'purchase',
      value: totalValue,
      metadata: {
        orderId,
        itemCount: items.length,
        items
      }
    });
  }, [trackEvent]);

  const trackSearch = useCallback((query: string, resultsCount: number) => {
    trackEvent({
      eventType: 'search',
      searchQuery: query,
      metadata: {
        resultsCount
      }
    });
  }, [trackEvent]);

  return {
    trackEvent,
    trackPageView,
    trackProductView,
    trackAddToCart,
    trackPurchase,
    trackSearch
  };
};
