import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  Home, 
  Users, 
  Package, 
  Truck, 
  ShoppingBag,
  HeadphonesIcon,
  Tag,
  Warehouse,
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
  'order-management': {
    name: 'Order Management',
    href: '/order-management',
    icon: ShoppingBag,
    description: 'Order processing and fulfillment',
    category: 'business',
    port: 3022
  },
  'shipping-delivery': {
    name: 'Shipping & Delivery',
    href: '/shipping-delivery',
    icon: Truck,
    description: 'Logistics and delivery management',
    category: 'operations',
    port: 3026
  },
  'inventory-management': {
    name: 'Inventory Management',
    href: '/inventory-management',
    icon: Warehouse,
    description: 'Stock and inventory tracking',
    category: 'business',
    port: 3021
  },
  'customer-service': {
    name: 'Customer Service',
    href: '/customer-service',
    icon: HeadphonesIcon,
    description: 'Customer support and service management',
    category: 'business',
    port: 3031
  },
  'employee-management': {
    name: 'Employee Management',
    href: '/employee-management',
    icon: Users,
    description: 'HR and workforce management',
    category: 'operations',
    port: 3029
  },
  'label-design': {
    name: 'Label Design',
    href: '/label-design',
    icon: Tag,
    description: 'Product labeling and design system',
    category: 'operations',
    port: 3035
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

// Default permissions for Operations Dashboard users
const DEFAULT_OPERATIONS_PERMISSIONS = [
  'order-management',
  'shipping-delivery',
  'inventory-management',
  'customer-service',
  'employee-management'
];

export function DynamicOpsNavigation() {
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
        setUserPermissions(data.permissions || DEFAULT_OPERATIONS_PERMISSIONS);
      } else {
        // Fallback to default permissions if API not available
        console.log('Using default Operations Dashboard permissions');
        setUserPermissions(DEFAULT_OPERATIONS_PERMISSIONS);
      }
    } catch (err) {
      console.log('Permission API not available, using defaults');
      setUserPermissions(DEFAULT_OPERATIONS_PERMISSIONS);
    } finally {
      setLoading(false);
    }
  };

  const isActiveRoute = (href: string) => {
    if (href === '/') {
      return router.pathname === '/';
    }
    return router.pathname.startsWith(href);
  };

  // Always include dashboard, then add permitted microservices
  const navigation = [
    {
      name: 'Dashboard',
      href: '/',
      icon: Home,
      description: 'Operations overview',
      category: 'core'
    },
    ...userPermissions
      .filter(permission => AVAILABLE_MICROSERVICES[permission])
      .map(permission => AVAILABLE_MICROSERVICES[permission])
  ];

  if (loading) {
    return (
      <nav className="w-64 bg-white shadow-lg border-r border-gray-200 h-full">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">🚚</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Operations</h2>
              <p className="text-xs text-gray-500">Loading...</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      </nav>
    );
  }

  return (
    <nav className="w-64 bg-white shadow-lg border-r border-gray-200 h-full">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">🚚</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Operations</h2>
            <p className="text-xs text-gray-500">Delivery Management</p>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = isActiveRoute(item.href);
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center px-4 py-3 rounded-lg transition-colors mb-1
                ${isActive 
                  ? 'bg-orange-100 text-orange-700 border border-orange-200' 
                  : 'text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              <Icon className="h-5 w-5 mr-3" />
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
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-gray-50 to-transparent">
        <div className="text-center">
          <p className="text-xs text-gray-500">
            LeafyHealth Operations
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
    </nav>
  );
}