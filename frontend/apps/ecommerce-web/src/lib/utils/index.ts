export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
};

export const formatWeight = (weight: number, unit: string = 'kg'): string => {
  if (weight < 1 && unit === 'kg') {
    return `${weight * 1000}g`;
  }
  return `${weight}${unit}`;
};

export const calculateDiscount = (originalPrice: number, salePrice: number): number => {
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatDateTime = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^(\+91|91)?[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\s|-/g, ''));
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

export const getImageUrl = (path: string | null | undefined): string => {
  if (!path) return '/images/placeholder.jpg';
  if (path.startsWith('http')) return path;
  return `/images/${path}`;
};

export const sanitizeSearchQuery = (query: string): string => {
  return query
    .trim()
    .replace(/[<>\"']/g, '')
    .substring(0, 100);
};

export const getProductVariantDisplay = (product: any): string => {
  if (!product.variants || product.variants.length === 0) return '';
  
  const variant = product.variants[0];
  const parts = [];
  
  if (variant.weight) parts.push(`${variant.weight}${variant.unit || 'kg'}`);
  if (variant.color) parts.push(variant.color);
  if (variant.size) parts.push(variant.size);
  
  return parts.join(' • ');
};

export const calculateDeliveryTime = (distance: number): string => {
  if (distance <= 5) return '15-30 minutes';
  if (distance <= 10) return '30-45 minutes';
  if (distance <= 20) return '45-60 minutes';
  return '1-2 hours';
};

export const formatQuantity = (quantity: number, unit: string): string => {
  if (unit === 'piece' || unit === 'pcs') {
    return `${quantity} ${quantity === 1 ? 'piece' : 'pieces'}`;
  }
  return `${quantity} ${unit}`;
};

export const getStockStatusColor = (stock: number, minStock: number = 10): string => {
  if (stock === 0) return 'text-red-600';
  if (stock <= minStock) return 'text-orange-600';
  return 'text-green-600';
};

export const getStockStatusText = (stock: number, minStock: number = 10): string => {
  if (stock === 0) return 'Out of Stock';
  if (stock <= minStock) return 'Low Stock';
  return 'In Stock';
};

export const generateOrderId = (): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `SVF-${timestamp}-${random}`.toUpperCase();
};

export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `+91 ${cleaned.substring(0, 5)} ${cleaned.substring(5)}`;
  }
  return phone;
};

export const getDeliveryDate = (days: number = 0): string => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toLocaleDateString('en-IN', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
};

export const parseTeluguText = (text: string): { english: string; telugu?: string } => {
  // Simple parser for bilingual text like "Product Name (తెలుగు పేరు)"
  const match = text.match(/^(.+?)\s*\(([^)]+)\)$/);
  if (match) {
    return {
      english: match[1].trim(),
      telugu: match[2].trim(),
    };
  }
  return { english: text };
};