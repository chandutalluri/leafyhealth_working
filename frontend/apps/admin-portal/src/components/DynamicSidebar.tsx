import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  Home, 
  DollarSign, 
  CreditCard, 
  Receipt, 
  BarChart3, 
  Image,
  Package,
  TrendingUp,
  FileBarChart,
  Building2,
  RefreshCw
} from 'lucide-react';

interface NavigationItem {
  name: string;
  href: string;
  icon: any;
  description: string;
  category: string;
  port?: number;
}

const AVAILABLE_MICROSERVICES: Record<string, NavigationItem> = {
  'accounting-management': {
    name: 'Accounting Management',
    href: '/accounting-management',
    icon: Receipt,
    description: 'Financial accounting and bookkeeping',
    category: 'financial',
    port: 3028
  },
  'expense-monitoring': {
    name: 'Expense Monitoring',
    href: '/expense-monitoring',
    icon: DollarSign,
    description: 'Business expense tracking and control',
    category: 'financial',
    port: 3034
  },
  'payment-processing': {
    name: 'Payment Processing',
    href: '/payment-processing',
    icon: CreditCard,
    description: 'Payment gateway and transactions',
    category: 'financial',
    port: 3023
  },
  'analytics-reporting': {
    name: 'Analytics Reporting',
    href: '/analytics-reporting',
    icon: TrendingUp,
    description: 'Business intelligence and analytics',
    category: 'analytics',
    port: 3025
  },
  'reporting-management': {
    name: 'Reporting Management',
    href: '/reporting-management',
    icon: FileBarChart,
    description: 'Report generation and management',
    category: 'analytics',
    port: 3036
  },
  'image-management': {
    name: 'Image Management',
    href: '/image-management',
    icon: Image,
    description: 'Self-hosted image management with variants',
    category: 'core',
    port: 8080
  },
  'company-management': {
    name: 'Company Management',
    href: '/company-management',
    icon: Building2,
    description: 'Manage business entities and companies',
    category: 'core',
    port: 3013
  },
  'catalog-management': {
    name: 'Catalog Management',
    href: '/catalog-management',
    icon: Package,
    description: 'Product catalog and categories',
    category: 'business',
    port: 3020
  }
};

// Default permissions for Admin Portal users
const DEFAULT_ADMIN_PERMISSIONS = [
  'accounting-management',
  'expense-monitoring', 
  'payment-processing',
  'image-management',
  'analytics-reporting'
];

export function DynamicSidebar() {
  const router = useRouter();
  const [userPermissions, setUserPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUserPermissions();
  }, []);

  const loadUserPermissions = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to fetch from permission assignment system
      const response = await fetch('/api/user/permissions');
      
      if (response.ok) {
        const data = await response.json();
        setUserPermissions(data.permissions || DEFAULT_ADMIN_PERMISSIONS);
      } else {
        // Fallback to default permissions if API not available
        console.log('Using default Admin Portal permissions');
        setUserPermissions(DEFAULT_ADMIN_PERMISSIONS);
      }
    } catch (err) {
      console.log('Permission API not available, using defaults');
      setUserPermissions(DEFAULT_ADMIN_PERMISSIONS);
    } finally {
      setLoading(false);
    }
  };

  const isActiveRoute = (href: string) => {
    if (href === '/dashboard') {
      return router.pathname === '/' || router.pathname === '/dashboard';
    }
    return router.pathname.startsWith(href);
  };

  // Always include dashboard, then add permitted microservices
  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Home,
      description: 'Admin portal overview',
      category: 'core'
    },
    ...userPermissions
      .filter(permission => AVAILABLE_MICROSERVICES[permission])
      .map(permission => AVAILABLE_MICROSERVICES[permission])
  ];

  if (loading) {
    return (
      <div className="w-64 bg-white shadow-sm border-r">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900">Admin Portal</h2>
        </div>
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-64 bg-white shadow-sm border-r">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Receipt className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Admin Portal</h2>
            <p className="text-xs text-gray-500">Financial Management</p>
          </div>
        </div>
      </div>

      <nav className="mt-6">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = isActiveRoute(item.href);
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center px-6 py-3 transition-colors duration-200
                ${isActive 
                  ? 'bg-blue-50 border-r-2 border-blue-500 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }
              `}
            >
              <Icon className={`
                h-5 w-5 mr-3
                ${isActive ? 'text-blue-600' : 'text-gray-400'}
              `} />
              <div>
                <div className="font-medium text-sm">{item.name}</div>
                {item.description && (
                  <div className="text-xs text-gray-500 mt-0.5">
                    {item.description}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-gray-50 to-transparent">
        <div className="text-center">
          <p className="text-xs text-gray-500">
            LeafyHealth Admin Portal
          </p>
          <p className="text-xs text-gray-400">
            {userPermissions.length + 1} Services Available
          </p>
          {error && (
            <p className="text-xs text-red-500 mt-1">
              Using default permissions
            </p>
          )}
        </div>
      </div>
    </div>
  );
}