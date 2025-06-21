import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { usePermissionStore } from '../../stores/permissionStore';
import { useAdminAuthStore } from '../../stores/adminAuthStore';
import {
  BarChart3,
  Package,
  ShoppingCart,
  Users,
  Calculator,
  TrendingUp,
  CreditCard,
  Truck,
  UserCheck,
  Receipt,
  Menu,
  Building2,
  ChevronLeft,
  ChevronRight,
  Home,
  Settings,
  LogOut,
  Bell,
  Activity
} from 'lucide-react';

const iconMap = {
  BarChart3,
  Package,
  ShoppingCart,
  Users,
  Calculator,
  TrendingUp,
  CreditCard,
  Truck,
  UserCheck,
  Receipt,
  Menu,
  Building2,
  Home,
  Settings,
  Activity
};

interface DynamicSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export const DynamicSidebar: React.FC<DynamicSidebarProps> = ({
  collapsed: propCollapsed,
  onToggle
}) => {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const collapsed = propCollapsed || internalCollapsed;
  
  const router = useRouter();
  const { availableSidebar, loading } = usePermissionStore();
  const { user, logout } = useAdminAuthStore();

  const handleToggle = () => {
    if (onToggle) {
      onToggle();
    } else {
      setInternalCollapsed(!internalCollapsed);
    }
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const isActiveRoute = (path: string) => {
    return router.pathname === path || router.pathname.startsWith(path + '/');
  };

  const groupedItems = availableSidebar.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof availableSidebar>);

  const categoryLabels = {
    overview: 'Overview',
    operations: 'Operations',
    finance: 'Finance',
    insights: 'Analytics',
    hr: 'Human Resources'
  };

  return (
    <div className={`h-full flex flex-col bg-white border-r border-slate-200 transition-all duration-300 ${
      collapsed ? 'w-16' : 'w-64 lg:w-72'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Admin Portal</h2>
                <p className="text-xs text-slate-500">Branch Management</p>
              </div>
            </div>
          )}
          
          <button
            onClick={handleToggle}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4 text-slate-600" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-slate-600" />
            )}
          </button>
        </div>
      </div>

      {/* User Info */}
      {!collapsed && user && (
        <div className="p-4 bg-indigo-50 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {user.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.username}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user.role}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        {/* Dashboard Link */}
        <div className="px-4 mb-6">
          <button
            onClick={() => handleNavigation('/dashboard')}
            className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
              isActiveRoute('/dashboard')
                ? 'bg-indigo-100 text-indigo-700 border-r-2 border-indigo-700'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <Home className="h-5 w-5 mr-3" />
            {!collapsed && 'Dashboard'}
          </button>
        </div>

        {loading ? (
          <div className="px-4">
            <div className="animate-pulse space-y-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-12 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedItems).map(([category, items]) => (
              <div key={category} className="px-3">
                {!collapsed && (
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    {categoryLabels[category as keyof typeof categoryLabels] || category}
                  </h3>
                )}
                
                <div className="space-y-1">
                  {items.map((item) => {
                    const IconComponent = iconMap[item.icon as keyof typeof iconMap];
                    const isActive = isActiveRoute(item.path);
                    
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavigation(item.path)}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                          isActive
                            ? 'bg-indigo-100 text-indigo-700 border-r-2 border-indigo-600'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        title={collapsed ? item.name : undefined}
                      >
                        {IconComponent && (
                          <IconComponent className={`h-5 w-5 ${
                            isActive ? 'text-indigo-600' : 'text-gray-500'
                          }`} />
                        )}
                        {!collapsed && (
                          <span className="text-sm font-medium">{item.name}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        {!collapsed && (
          <div className="text-center">
            <p className="text-xs text-gray-500">
              Powered by LeafyHealth ERP
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Version 2.0
            </p>
          </div>
        )}
      </div>
    </div>
  );
};