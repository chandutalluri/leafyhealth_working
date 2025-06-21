import React, { useState } from 'react';
import { useAdminAuthStore } from '../stores/adminAuthStore';
import { usePermissionStore } from '../stores/permissionStore';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Package, 
  DollarSign,
  ShoppingCart,
  Activity,
  Calendar,
  Bell,
  Search,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ElementType;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, changeType, icon: Icon }) => {
  const changeColor = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-600'
  }[changeType];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
          <p className={`text-sm font-medium ${changeColor} flex items-center mt-2`}>
            <TrendingUp className="h-4 w-4 mr-1" />
            {change}
          </p>
        </div>
        <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center">
          <Icon className="h-6 w-6 text-indigo-600" />
        </div>
      </div>
    </div>
  );
};

interface QuickActionProps {
  title: string;
  description: string;
  icon: React.ElementType;
  onClick: () => void;
}

const QuickAction: React.FC<QuickActionProps> = ({ title, description, icon: Icon, onClick }) => (
  <button
    onClick={onClick}
    className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md hover:border-indigo-200 transition-all text-left group"
  >
    <div className="flex items-center mb-3">
      <div className="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
        <Icon className="h-5 w-5 text-indigo-600 group-hover:text-white" />
      </div>
    </div>
    <h3 className="font-semibold text-slate-900 mb-1">{title}</h3>
    <p className="text-sm text-slate-600">{description}</p>
  </button>
);

export default function DashboardPage() {
  const { user } = useAdminAuthStore();
  const { availableSidebar } = usePermissionStore();
  const [searchQuery, setSearchQuery] = useState('');

  const metrics = [
    {
      title: 'Total Revenue',
      value: '₹2,45,690',
      change: '+12.5% from last month',
      changeType: 'positive' as const,
      icon: DollarSign
    },
    {
      title: 'Total Orders',
      value: '1,247',
      change: '+8.2% from last month',
      changeType: 'positive' as const,
      icon: ShoppingCart
    },
    {
      title: 'Active Customers',
      value: '892',
      change: '+5.1% from last month',
      changeType: 'positive' as const,
      icon: Users
    },
    {
      title: 'Inventory Items',
      value: '3,456',
      change: '-2.1% from last month',
      changeType: 'negative' as const,
      icon: Package
    }
  ];

  const quickActions = [
    {
      title: 'Process New Order',
      description: 'Create and manage customer orders',
      icon: ShoppingCart,
      onClick: () => console.log('Navigate to orders')
    },
    {
      title: 'Inventory Management',
      description: 'Update stock levels and products',
      icon: Package,
      onClick: () => console.log('Navigate to inventory')
    },
    {
      title: 'Customer Support',
      description: 'Handle customer queries and issues',
      icon: Users,
      onClick: () => console.log('Navigate to support')
    },
    {
      title: 'Generate Reports',
      description: 'Create detailed business reports',
      icon: BarChart3,
      onClick: () => console.log('Navigate to reports')
    }
  ];

  const recentActivities = [
    { id: 1, action: 'New order placed', time: '2 minutes ago', type: 'order' },
    { id: 2, action: 'Inventory updated', time: '15 minutes ago', type: 'inventory' },
    { id: 3, action: 'Customer registered', time: '1 hour ago', type: 'customer' },
    { id: 4, action: 'Payment processed', time: '2 hours ago', type: 'payment' },
    { id: 5, action: 'Report generated', time: '3 hours ago', type: 'report' }
  ];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Welcome back, {user?.username || 'Admin'}
          </h1>
          <p className="text-slate-600 mt-1">
            Here's what's happening with your branch today.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="h-5 w-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-64"
            />
          </div>
          <button className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
            <Filter className="h-5 w-5 text-slate-600" />
          </button>
          <button className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
            <Bell className="h-5 w-5 text-slate-600" />
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* Quick Actions and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-900">Quick Actions</h2>
            <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <QuickAction key={index} {...action} />
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-900">Recent Activity</h2>
            <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
              <RefreshCw className="h-4 w-4 text-slate-600" />
            </button>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-6">
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-3">
                    <div className="h-2 w-2 bg-indigo-600 rounded-full"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {activity.action}
                      </p>
                      <p className="text-xs text-slate-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Available Microservices Section */}
      {availableSidebar.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-900">Available Services</h2>
            <button className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 text-sm font-medium">
              <Download className="h-4 w-4" />
              Export Data
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {availableSidebar.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                    <Activity className="h-5 w-5 text-indigo-600 group-hover:text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-slate-900 truncate">{service.name}</h3>
                    <p className="text-xs text-slate-500">Active Service</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* System Status */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-2">System Status</h3>
            <p className="text-indigo-100">All services are running smoothly</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Online</span>
          </div>
        </div>
      </div>
    </div>
  );
}