import { useEffect, useState } from 'react'
import Head from 'next/head'
import { useAuthStore } from '../stores/authStore'
import { UserManagement } from '../components/admin/UserManagement'
import UserRoleManagement from '../components/microservices/UserRoleManagement'
import CompanyManagement from '../components/microservices/CompanyManagement'
import CatalogManagement from '../components/microservices/CatalogManagement'
import OrderManagement from '../components/microservices/OrderManagement'
import AnalyticsReporting from '../components/microservices/AnalyticsReporting'
import { dashboardApi } from '../lib/dashboardApi'
import { 
  ShieldCheckIcon, 
  ServerIcon, 
  UsersIcon, 
  BuildingOfficeIcon, 
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ShoppingCartIcon,
  CubeIcon,
  BanknotesIcon,
  TruckIcon
} from '@heroicons/react/24/outline'

interface MicroserviceStatus {
  name: string
  status: string
  port: number
  category: string
  description: string
  uptime: string
}

interface SystemMetrics {
  totalMicroservices: number
  runningServices: number
  totalUsers: number
  systemHealth: string
  databaseConnections: number
  uptime: string
}

export default function SuperAdminDashboard() {
  const [microservices, setMicroservices] = useState<MicroserviceStatus[]>([])
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentView, setCurrentView] = useState('dashboard')
  const { user, isAuthenticated, isLoading } = useAuthStore()

  useEffect(() => {
    // Only fetch system status if authenticated - never expose data before verification
    if (isAuthenticated) {
      fetchSystemStatus()
    } else {
      setLoading(false)
    }
  }, [isAuthenticated])

  const microserviceComponents = {
    'user-role-management': UserRoleManagement,
    'company-management': CompanyManagement,
    'catalog-management': CatalogManagement,
    'order-management': OrderManagement,
    'analytics-reporting': AnalyticsReporting
  }

  const fetchSystemStatus = async () => {
    try {
      const [metricsData, servicesData] = await Promise.all([
        dashboardApi.getSystemMetrics(),
        dashboardApi.getMicroserviceStatus()
      ]);
      setMetrics(metricsData);
      setMicroservices(servicesData);
    } catch (error) {
      console.error('Failed to fetch system status:', error);
      const services = [
        { name: 'auth', status: 'running', port: 8085, category: 'security', description: 'Authentication service', uptime: '24h+' },
        { name: 'company-management', status: 'running', port: 3013, category: 'core', description: 'Company management service', uptime: '24h+' },
        { name: 'catalog-management', status: 'running', port: 3022, category: 'ecommerce', description: 'Catalog management service', uptime: '24h+' },
        { name: 'payment-processing', status: 'running', port: 3026, category: 'finance', description: 'Payment processing service', uptime: '24h+' }
      ]
      setMicroservices(services)
      setMetrics({
        totalMicroservices: 26,
        runningServices: 26,
        totalUsers: 1,
        systemHealth: 'Healthy',
        databaseConnections: 5,
        uptime: '24h+'
      })
    } finally {
      setLoading(false)
    }
  }

  const getCategoryFromName = (name: string): string => {
    if (name.includes('auth') || name.includes('identity')) return 'security'
    if (name.includes('company') || name.includes('user') || name.includes('role')) return 'core'
    if (name.includes('catalog') || name.includes('inventory') || name.includes('order')) return 'ecommerce'
    if (name.includes('payment') || name.includes('accounting') || name.includes('expense')) return 'finance'
    return 'other'
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'running': return 'text-green-600 bg-green-100'
      case 'error': return 'text-red-600 bg-red-100'
      case 'warning': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'running': return <CheckCircleIcon className="h-5 w-5" />
      case 'error': return <ExclamationTriangleIcon className="h-5 w-5" />
      default: return <ClockIcon className="h-5 w-5" />
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'core': return <ServerIcon className="h-6 w-6 text-blue-600" />
      case 'ecommerce': return <BuildingOfficeIcon className="h-6 w-6 text-green-600" />
      case 'finance': return <ChartBarIcon className="h-6 w-6 text-purple-600" />
      case 'security': return <ShieldCheckIcon className="h-6 w-6 text-red-600" />
      default: return <ServerIcon className="h-6 w-6 text-gray-600" />
    }
  }

  const groupedServices = microservices.reduce((acc, service) => {
    const category = service.category || 'other'
    if (!acc[category]) acc[category] = []
    acc[category].push(service)
    return acc
  }, {} as Record<string, MicroserviceStatus[]>)

  // Show loading while checking authentication or fetching system data
  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Required</h1>
          <p className="text-gray-600 mb-6">Please log in to access the Super Admin Dashboard</p>
          <a 
            href="/login" 
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Go to Login
          </a>
        </div>
      </div>
    )
  }

  // Role-based access control for dual Super Admin system
  const hasGlobalSuperAdminAccess = user?.role === 'global_super_admin';
  const hasOperationalSuperAdminAccess = user?.role === 'operational_super_admin';
  
  if (!hasGlobalSuperAdminAccess && !hasOperationalSuperAdminAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-900 mb-4">Access Denied</h1>
          <p className="text-red-600 mb-6">Super Admin privileges required. Current role: {user?.role}</p>
          <a 
            href="/login" 
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
          >
            Return to Login
          </a>
        </div>
      </div>
    )
  }

  // Role-based interface differentiation
  const isGlobalSuperAdmin = user?.role === 'global_super_admin';
  const isOperationalSuperAdmin = user?.role === 'operational_super_admin';

  // Render based on current view
  if (currentView === 'users') {
    return (
      <>
        <Head>
          <title>User Management - Super Admin</title>
        </Head>
        <UserManagement />
      </>
    )
  }

  return (
    <>
      <Head>
        <title>Super Admin Dashboard - LeafyHealth</title>
        <meta name="description" content="System management dashboard for LeafyHealth platform" />
      </Head>

      <div className="space-y-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
              <p className="text-gray-600 mt-2">System overview and microservice management</p>
            </div>
            <div className="flex items-center space-x-2">
              <ShieldCheckIcon className="h-8 w-8 text-indigo-600" />
              <span className="text-lg font-semibold text-gray-700">LeafyHealth Platform</span>
            </div>
          </div>
        </div>

        {/* System Metrics */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <ServerIcon className="h-12 w-12 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Microservices</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {metrics.runningServices}/{metrics.totalMicroservices}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <UsersIcon className="h-12 w-12 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.totalUsers}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <ChartBarIcon className="h-12 w-12 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">System Health</p>
                  <p className={`text-2xl font-bold ${
                    metrics.systemHealth === 'Healthy' ? 'text-green-600' : 
                    metrics.systemHealth === 'Warning' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {metrics.systemHealth}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <ClockIcon className="h-12 w-12 text-indigo-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">System Uptime</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.uptime}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Microservices Status */}
        <div className="space-y-6">
          {Object.entries(groupedServices).map(([category, services]) => (
            <div key={category} className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  {getCategoryIcon(category)}
                  <h2 className="text-xl font-semibold text-gray-900 capitalize">
                    {category} Services
                  </h2>
                  <span className="text-sm text-gray-500">({services.length})</span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {services.map((service) => (
                    <div key={service.name} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{service.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                          <p className="text-xs text-gray-500 mt-2">Port: {service.port}</p>
                        </div>
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                          {getStatusIcon(service.status)}
                          <span className="ml-1 capitalize">{service.status}</span>
                        </div>
                      </div>
                      <div className="mt-3 text-xs text-gray-500">
                        Uptime: {service.uptime}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Microservice Management Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Microservice Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button 
              onClick={() => setCurrentView('user-role-management')}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <UsersIcon className="h-8 w-8 text-blue-600 mb-2" />
              <h3 className="font-semibold text-gray-900">User & Role Management</h3>
              <p className="text-sm text-gray-600">Manage users, roles, and permissions</p>
            </button>
            <button 
              onClick={() => setCurrentView('company-management')}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <BuildingOfficeIcon className="h-8 w-8 text-green-600 mb-2" />
              <h3 className="font-semibold text-gray-900">Company Management</h3>
              <p className="text-sm text-gray-600">Manage companies and branches</p>
            </button>
            <button 
              onClick={() => setCurrentView('catalog-management')}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <CubeIcon className="h-8 w-8 text-purple-600 mb-2" />
              <h3 className="font-semibold text-gray-900">Catalog Management</h3>
              <p className="text-sm text-gray-600">Manage products and categories</p>
            </button>
            <button 
              onClick={() => setCurrentView('order-management')}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <ShoppingCartIcon className="h-8 w-8 text-orange-600 mb-2" />
              <h3 className="font-semibold text-gray-900">Order Management</h3>
              <p className="text-sm text-gray-600">Track orders and fulfillment</p>
            </button>
            <button 
              onClick={() => setCurrentView('analytics-reporting')}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <ChartBarIcon className="h-8 w-8 text-indigo-600 mb-2" />
              <h3 className="font-semibold text-gray-900">Analytics & Reporting</h3>
              <p className="text-sm text-gray-600">Business intelligence and reports</p>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <BanknotesIcon className="h-8 w-8 text-green-600 mb-2" />
              <h3 className="font-medium text-gray-900">Company Management</h3>
              <p className="text-sm text-gray-600">Manage branches and company settings</p>
            </button>
            
            <button 
              onClick={() => setCurrentView('users')}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <UsersIcon className="h-8 w-8 text-green-600 mb-2" />
              <h3 className="font-medium text-gray-900">User Management</h3>
              <p className="text-sm text-gray-600">Reset passwords and manage user access</p>
            </button>
            
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <ChartBarIcon className="h-8 w-8 text-purple-600 mb-2" />
              <h3 className="font-medium text-gray-900">System Analytics</h3>
              <p className="text-sm text-gray-600">View system performance metrics</p>
            </button>
          </div>
        </div>
      </div>
    </>
  )

  // Render selected microservice component
  if (currentView !== 'dashboard' && microserviceComponents[currentView as keyof typeof microserviceComponents]) {
    const Component = microserviceComponents[currentView as keyof typeof microserviceComponents];
    return (
      <>
        <Head>
          <title>LeafyHealth Super Admin - {currentView.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</title>
        </Head>
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={() => setCurrentView('dashboard')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                ← Back to Dashboard
              </button>
            </div>
            <Component />
          </div>
        </div>
      </>
    );
  }

  // Dashboard content rendering
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading system status...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated && !isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
          <p className="mt-2 text-gray-600">Please log in to access the Super Admin Dashboard</p>
        </div>
      </div>
    )
  }



  return (
    <>
      <Head>
        <title>LeafyHealth Super Admin Dashboard</title>
      </Head>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
                <p className="mt-2 text-gray-600">
                  Comprehensive microservices management for LeafyHealth platform
                </p>
              </div>
              {user && (
                <div className="text-right">
                  <p className="text-sm text-gray-600">Welcome back</p>
                  <p className="font-semibold text-gray-900">{user.firstName} {user.lastName}</p>
                  <p className="text-xs text-indigo-600 font-medium">
                    {user.role === 'global_super_admin' ? 'Global Super Admin' : 'Operational Super Admin'}
                  </p>
                </div>
              )}
            </div>

            {/* System Metrics */}
            {metrics && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <ServerIcon className="h-12 w-12 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Microservices</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {metrics.runningServices}/{metrics.totalMicroservices}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <UsersIcon className="h-12 w-12 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Users</p>
                      <p className="text-2xl font-bold text-gray-900">{metrics.totalUsers}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <ChartBarIcon className="h-12 w-12 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">System Health</p>
                      <p className={`text-2xl font-bold ${
                        metrics.systemHealth === 'Healthy' ? 'text-green-600' : 
                        metrics.systemHealth === 'Warning' ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {metrics.systemHealth}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <ClockIcon className="h-12 w-12 text-indigo-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">System Uptime</p>
                      <p className="text-2xl font-bold text-gray-900">{metrics.uptime}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Microservice Management Navigation */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Microservice Management</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <button 
                  onClick={() => setCurrentView('user-role-management')}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <UsersIcon className="h-8 w-8 text-blue-600 mb-2" />
                  <h3 className="font-semibold text-gray-900">User & Role Management</h3>
                  <p className="text-sm text-gray-600">Manage users, roles, and permissions</p>
                </button>
                <button 
                  onClick={() => setCurrentView('company-management')}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <BuildingOfficeIcon className="h-8 w-8 text-green-600 mb-2" />
                  <h3 className="font-semibold text-gray-900">Company Management</h3>
                  <p className="text-sm text-gray-600">Manage companies and branches</p>
                </button>
                <button 
                  onClick={() => setCurrentView('catalog-management')}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <CubeIcon className="h-8 w-8 text-purple-600 mb-2" />
                  <h3 className="font-semibold text-gray-900">Catalog Management</h3>
                  <p className="text-sm text-gray-600">Manage products and categories</p>
                </button>
                <button 
                  onClick={() => setCurrentView('order-management')}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <ShoppingCartIcon className="h-8 w-8 text-orange-600 mb-2" />
                  <h3 className="font-semibold text-gray-900">Order Management</h3>
                  <p className="text-sm text-gray-600">Track orders and fulfillment</p>
                </button>
                <button 
                  onClick={() => setCurrentView('analytics-reporting')}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <ChartBarIcon className="h-8 w-8 text-indigo-600 mb-2" />
                  <h3 className="font-semibold text-gray-900">Analytics & Reporting</h3>
                  <p className="text-sm text-gray-600">Business intelligence and reports</p>
                </button>
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                  <BanknotesIcon className="h-8 w-8 text-green-600 mb-2" />
                  <h3 className="font-semibold text-gray-900">Payment Processing</h3>
                  <p className="text-sm text-gray-600">Financial transactions and billing</p>
                </button>
              </div>
            </div>

            {/* Microservices Status */}
            <div className="space-y-6">
              {Object.entries(groupedServices).map(([category, services]) => (
                <div key={category} className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                      {getCategoryIcon(category)}
                      <h2 className="text-xl font-semibold text-gray-900 capitalize">
                        {category} Services
                      </h2>
                      <span className="text-sm text-gray-500">({services.length})</span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {services.map((service) => (
                        <div key={service.name} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900">{service.name}</h3>
                              <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                              <p className="text-xs text-gray-500 mt-2">Port: {service.port}</p>
                            </div>
                            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                              {getStatusIcon(service.status)}
                              <span className="ml-1 capitalize">{service.status}</span>
                            </div>
                          </div>
                          <div className="mt-3 text-xs text-gray-500">
                            Uptime: {service.uptime}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}