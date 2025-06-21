import { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { 
  ShoppingBagIcon, 
  TruckIcon, 
  UserGroupIcon, 
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

// Business Domain Components
import {
  ProductEcosystemHub,
  OrderOperationsCenter,
  CustomerRelationshipHub,
  FinancialControlCenter,
  OrganizationHub,
  BusinessIntelligenceCenter
} from '../components/business-domains';

const businessDomains = [
  {
    id: 'products',
    name: 'Product Ecosystem',
    description: 'Complete product lifecycle management',
    icon: ShoppingBagIcon,
    component: ProductEcosystemHub,
    microservices: ['catalog-management', 'inventory-management', 'image-management', 'category-management', 'label-design']
  },
  {
    id: 'orders',
    name: 'Order Operations',
    description: 'End-to-end order processing and fulfillment',
    icon: TruckIcon,
    component: OrderOperationsCenter,
    microservices: ['order-management', 'payment-processing', 'shipping-delivery', 'customer-service']
  },
  {
    id: 'customers',
    name: 'Customer Relations',
    description: 'Complete customer lifecycle management',
    icon: UserGroupIcon,
    component: CustomerRelationshipHub,
    microservices: ['customer-service', 'user-role-management', 'notification-service', 'subscription-management']
  },
  {
    id: 'financial',
    name: 'Financial Control',
    description: 'Comprehensive financial oversight',
    icon: CurrencyDollarIcon,
    component: FinancialControlCenter,
    microservices: ['accounting-management', 'expense-monitoring', 'payment-analytics', 'reporting-management']
  },
  {
    id: 'organization',
    name: 'Organization Hub',
    description: 'Company structure and team management',
    icon: BuildingOfficeIcon,
    component: OrganizationHub,
    microservices: ['company-management', 'employee-management', 'user-role-management', 'branch-management']
  },
  {
    id: 'intelligence',
    name: 'Business Intelligence',
    description: 'Analytics and performance insights',
    icon: ChartBarIcon,
    component: BusinessIntelligenceCenter,
    microservices: ['analytics-reporting', 'performance-monitor', 'custom-reporting', 'data-visualization']
  }
];

export default function OperationalDashboard() {
  const [activeDomain, setActiveDomain] = useState<string>('products');
  const { user, logout } = useAuthStore();

  const ActiveComponent = businessDomains.find(domain => domain.id === activeDomain)?.component || ProductEcosystemHub;

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">LH</span>
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-semibold text-gray-900">LeafyHealth</h1>
                <p className="text-sm text-gray-500">Operational Super Admin Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="text-sm text-gray-600">
                  Welcome, <span className="font-medium text-gray-900">{user?.email}</span>
                </div>
                <div className="h-6 w-px bg-gray-300"></div>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                >
                  <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Domain Navigation Tabs */}
      <div className="bg-white border-b border-slate-200">
        <div className="px-6">
          <nav className="flex space-x-6 overflow-x-auto">
            {businessDomains.map((domain) => {
              const Icon = domain.icon;
              const isActive = activeDomain === domain.id;
              return (
                <button
                  key={domain.id}
                  onClick={() => setActiveDomain(domain.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 whitespace-nowrap text-sm font-medium transition-colors ${
                    isActive
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span>{domain.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Full Width Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="p-6">
          <ActiveComponent />
        </div>
      </main>
    </div>
  );
}