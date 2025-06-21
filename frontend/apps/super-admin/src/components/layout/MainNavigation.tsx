'use client';

import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuthStore } from '../../stores/authStore';

import { 
  Shield, 
  Users, 
  Globe, 
  Zap, 
  Network, 
  Home,
  Settings,
  BarChart3,
  Building2,
  Image,
  Package,
  Warehouse,
  ShoppingBag,
  CreditCard,
  Bell,
  HeadphonesIcon,
  TrendingUp,
  Truck,
  FileCheck,
  Calculator,
  UserCheck,
  DollarSign,
  Store,
  Tag,
  FileText,
  Languages,
  FileBarChart,
  LogOut,
  UserCircle
} from 'lucide-react';

function SecureLogoutButton() {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout from Super Admin?')) {
      logout();
    }
  };

  return (
    <div className="border-t border-gray-200 pt-4">
      <div className="flex items-center px-4 py-2 text-sm">
        <UserCircle className="h-4 w-4 text-gray-400 mr-2" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-900 truncate">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="w-full flex items-center px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 hover:text-red-900 transition-colors rounded-lg mx-2"
      >
        <LogOut className="h-4 w-4 mr-2" />
        Secure Logout
      </button>
    </div>
  );
}

interface NavigationItem {
  name: string;
  href: string;
  icon: any;
  description: string;
  category: string;
  port?: number;
}

const navigationItems: NavigationItem[] = [
  // Core System Management
  {
    name: 'Dashboard',
    href: '/',
    icon: Home,
    description: 'System overview and status',
    category: 'core'
  },
  {
    name: 'Company Management',
    href: '/company-management',
    icon: Building2,
    description: 'Manage business entities and companies',
    category: 'core',
    port: 3013
  },
  {
    name: 'Image Management',
    href: '/image-management',
    icon: Image,
    description: 'Self-hosted image management with variants',
    category: 'core',
    port: 8080
  },

  // Security & Access Control
  {
    name: 'Security Centre',
    href: '/security',
    icon: Shield,
    description: 'Complete user & permission control system',
    category: 'security'
  },
  {
    name: 'Accessibility',
    href: '/accessibility',
    icon: Settings,
    description: 'WCAG compliant accessibility settings',
    category: 'security'
  },

  // Business Operations
  {
    name: 'Catalog Management',
    href: '/catalog-management',
    icon: Package,
    description: 'Product catalog and categories',
    category: 'business',
    port: 3020
  },
  {
    name: 'Inventory Management',
    href: '/inventory-management',
    icon: Warehouse,
    description: 'Stock and inventory tracking',
    category: 'business',
    port: 3021
  },
  {
    name: 'Order Management',
    href: '/order-management',
    icon: ShoppingBag,
    description: 'Order processing and fulfillment',
    category: 'business',
    port: 3022
  },
  {
    name: 'Customer Service',
    href: '/customer-service',
    icon: HeadphonesIcon,
    description: 'Customer support and service management',
    category: 'business',
    port: 3031
  },
  {
    name: 'Marketplace Management',
    href: '/marketplace-management',
    icon: Store,
    description: 'Multi-vendor marketplace operations',
    category: 'business',
    port: 3032
  },

  // Financial Management
  {
    name: 'Payment Processing',
    href: '/payment-processing',
    icon: CreditCard,
    description: 'Payment gateway and transactions',
    category: 'financial',
    port: 3023
  },
  {
    name: 'Accounting Management',
    href: '/accounting-management',
    icon: Calculator,
    description: 'Financial accounting and bookkeeping',
    category: 'financial',
    port: 3028
  },
  {
    name: 'Expense Monitoring',
    href: '/expense-monitoring',
    icon: DollarSign,
    description: 'Business expense tracking and control',
    category: 'financial',
    port: 3034
  },

  // Operations & Logistics
  {
    name: 'Shipping Delivery',
    href: '/shipping-delivery',
    icon: Truck,
    description: 'Logistics and delivery management',
    category: 'operations',
    port: 3026
  },
  {
    name: 'Employee Management',
    href: '/employee-management',
    icon: UserCheck,
    description: 'HR and workforce management',
    category: 'operations',
    port: 3029
  },
  {
    name: 'Label Design',
    href: '/label-design',
    icon: Tag,
    description: 'Product labeling and design system',
    category: 'operations',
    port: 3035
  },

  // Analytics & Reporting
  {
    name: 'Analytics Reporting',
    href: '/analytics-reporting',
    icon: TrendingUp,
    description: 'Business intelligence and analytics',
    category: 'analytics',
    port: 3025
  },
  {
    name: 'Reporting Management',
    href: '/reporting-management',
    icon: FileBarChart,
    description: 'Report generation and management',
    category: 'analytics',
    port: 3036
  },

  // Content & Communication
  {
    name: 'Content Management',
    href: '/content-management',
    icon: FileText,
    description: 'Digital content and media management',
    category: 'content',
    port: 3037
  },
  {
    name: 'Notification Service',
    href: '/notification-service',
    icon: Bell,
    description: 'Multi-channel notifications and alerts',
    category: 'content',
    port: 3024
  },
  {
    name: 'Multi-Language Management',
    href: '/multi-language-management',
    icon: Languages,
    description: 'Internationalization and localization',
    category: 'content',
    port: 3038
  },

  // System Administration
  {
    name: 'Performance Monitor',
    href: '/performance-monitor',
    icon: Zap,
    description: 'System performance monitoring',
    category: 'system',
    port: 3030
  },
  {
    name: 'Integration Hub',
    href: '/integration-hub',
    icon: Network,
    description: 'Third-party integrations and APIs',
    category: 'system',
    port: 3033
  },
  {
    name: 'Compliance Audit',
    href: '/compliance-audit',
    icon: FileCheck,
    description: 'Regulatory compliance and auditing',
    category: 'system',
    port: 3027
  }
];

const categories = [
  { id: 'core', name: 'Core System', color: 'bg-blue-500' },
  { id: 'security', name: 'Security & Access', color: 'bg-red-500' },
  { id: 'business', name: 'Business Operations', color: 'bg-green-500' },
  { id: 'financial', name: 'Financial Management', color: 'bg-yellow-500' },
  { id: 'operations', name: 'Operations & Logistics', color: 'bg-purple-500' },
  { id: 'analytics', name: 'Analytics & Reporting', color: 'bg-indigo-500' },
  { id: 'content', name: 'Content & Communication', color: 'bg-pink-500' },
  { id: 'system', name: 'System Administration', color: 'bg-gray-500' }
];

export function MainNavigation() {
  const router = useRouter();

  const isActiveRoute = (href: string) => {
    if (href === '/') {
      return router.pathname === '/';
    }
    return router.pathname.startsWith(href);
  };

  return (
    <nav className="w-80 bg-white shadow-xl border-r border-gray-200 h-full overflow-y-auto">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
            <img
              src="/api/image-management/serve/leafyhealthlogo_copy_25991930-2a1c-4593-95db-1965eea84310.png"
              alt="LeafyHealth Logo"
              className="w-full h-full object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg hidden">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              LeafyHealth Super Admin
            </h2>
            <p className="text-xs text-gray-500">System Administration</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        {categories.map((category) => {
          const categoryItems = navigationItems.filter(item => item.category === category.id);
          
          if (categoryItems.length === 0) return null;

          return (
            <div key={category.id} className="mb-6">
              <div className="flex items-center space-x-2 mb-3">
                <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  {category.name}
                </h3>
              </div>
              
              <div className="space-y-1">
                {categoryItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = isActiveRoute(item.href);
                  
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`
                        group flex items-center px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer
                        ${isActive 
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg transform scale-[1.02]' 
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        }
                      `}
                    >
                      <Icon className={`
                        h-5 w-5 mr-3 transition-transform duration-200
                        ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}
                        ${isActive ? 'scale-110' : 'group-hover:scale-105'}
                      `} />
                      <div className="flex-1">
                        <div className={`
                          font-medium text-sm
                          ${isActive ? 'text-white' : 'text-gray-900'}
                        `}>
                          {item.name}
                        </div>
                        <div className={`
                          text-xs mt-0.5
                          ${isActive ? 'text-indigo-100' : 'text-gray-500'}
                        `}>
                          {item.description}
                        </div>
                      </div>
                      {isActive && (
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-gray-50 to-transparent">
        <SecureLogoutButton />
        <div className="text-center mt-4">
          <p className="text-xs text-gray-500">
            LeafyHealth Super Admin v1.0
          </p>
          <p className="text-xs text-gray-400">23 Microservices Connected</p>
        </div>
      </div>
    </nav>
  );
}