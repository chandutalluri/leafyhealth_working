import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  Settings, 
  Building, 
  Globe,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminMode, setAdminMode] = useState<'operational' | 'global'>('operational');

  const businessDomains = [
    {
      name: 'Product Ecosystem',
      href: '/products',
      icon: Package,
      description: 'Catalog • Inventory • Images • Categories',
      services: ['catalog-management', 'inventory-management', 'image-management']
    },
    {
      name: 'Order Operations',
      href: '/orders',
      icon: ShoppingCart,
      description: 'Orders • Payments • Shipping • Support',
      services: ['order-management', 'payment-processing', 'shipping-delivery', 'customer-service']
    },
    {
      name: 'Customer Relationship Hub',
      href: '/customers',
      icon: Users,
      description: 'Customers • Subscriptions • Notifications • Roles',
      services: ['customer-service', 'subscription-management', 'notification-service', 'user-role-management']
    },
    {
      name: 'Financial Control Center',
      href: '/finance',
      icon: BarChart3,
      description: 'Accounting • Expenses • Analytics • Reporting',
      services: ['accounting-management', 'expense-monitoring', 'analytics-reporting', 'reporting-management']
    },
    {
      name: 'Organization Management',
      href: '/organization',
      icon: Building,
      description: 'Company • Branches • Employees • Compliance',
      services: ['company-management', 'employee-management', 'compliance-audit']
    },
    {
      name: 'Business Intelligence',
      href: '/intelligence',
      icon: Globe,
      description: 'Performance • Integration • Multi-Language • Content',
      services: ['performance-monitor', 'integration-hub', 'multi-language-management', 'content-management']
    }
  ];

  const globalAdminNavigation = [
    { name: 'System Overview', href: '/', icon: LayoutDashboard },
    { name: 'Microservices', href: '/microservices', icon: Settings },
    { name: 'Performance Monitor', href: '/performance-monitor', icon: BarChart3 },
    { name: 'Security & Compliance', href: '/security', icon: Settings },
  ];

  const isActive = (href: string) => router.pathname === href;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 flex z-40 md:hidden ${sidebarOpen ? '' : 'pointer-events-none'}`}>
        <div className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setSidebarOpen(false)} />
        <div className={`relative flex-1 flex flex-col max-w-xs w-full bg-white transform transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          <SidebarContent adminMode={adminMode} setAdminMode={setAdminMode} businessDomains={businessDomains} globalAdminNavigation={globalAdminNavigation} isActive={isActive} />
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <SidebarContent adminMode={adminMode} setAdminMode={setAdminMode} businessDomains={businessDomains} globalAdminNavigation={globalAdminNavigation} isActive={isActive} />
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gray-50">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const SidebarContent = ({ adminMode, setAdminMode, businessDomains, globalAdminNavigation, isActive }: any) => {
  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">LH</span>
            </div>
            <div className="ml-3">
              <h1 className="text-lg font-semibold text-gray-900">LeafyHealth</h1>
              <p className="text-xs text-gray-500">Super Admin</p>
            </div>
          </div>
        </div>

        {/* Admin Mode Toggle */}
        <div className="mt-6 px-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-700">Admin Mode</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAdminMode(adminMode === 'operational' ? 'global' : 'operational')}
              className="flex items-center gap-2"
            >
              {adminMode === 'operational' ? (
                <>
                  <Building className="h-4 w-4" />
                  Operational
                </>
              ) : (
                <>
                  <Globe className="h-4 w-4" />
                  Global
                </>
              )}
              <ChevronDown className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <nav className="mt-8 flex-1 px-2 space-y-1">
          {adminMode === 'operational' ? (
            <>
              <div className="px-3 py-2">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Business Domains
                </h3>
              </div>
              {businessDomains.map((domain) => {
                const Icon = domain.icon;
                return (
                  <a
                    key={domain.name}
                    href={domain.href}
                    className={`group flex flex-col p-3 rounded-md text-sm font-medium transition-colors ${
                      isActive(domain.href)
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-500'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex items-center">
                      <Icon className="flex-shrink-0 h-5 w-5 mr-3" />
                      <span className="truncate">{domain.name}</span>
                    </div>
                    <div className="mt-1 ml-8">
                      <p className="text-xs text-gray-500">{domain.description}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {domain.services.slice(0, 2).map((service) => (
                          <Badge key={service} variant="outline" className="text-xs">
                            {service.split('-')[0]}
                          </Badge>
                        ))}
                        {domain.services.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{domain.services.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </a>
                );
              })}
            </>
          ) : (
            <>
              <div className="px-3 py-2">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Global Administration
                </h3>
              </div>
              {globalAdminNavigation.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive(item.href)
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="mr-3 flex-shrink-0 h-5 w-5" />
                    {item.name}
                  </a>
                );
              })}
            </>
          )}
        </nav>
      </div>
      
      <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-gray-600 font-medium text-sm">SA</span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700">Super Admin</p>
            <p className="text-xs text-gray-500">System Administrator</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;