import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useAuthStore } from '../stores/authStore'
import {
  ServerIcon,
  UsersIcon,
  BuildingOfficeIcon,
  CubeIcon,
  ShoppingCartIcon,
  ChartBarIcon,
  TruckIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  ShieldCheckIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline'

// Import microservice components
import UserRoleManagement from '../components/microservices/UserRoleManagement'
import CompanyManagement from '../components/microservices/CompanyManagement'
import CatalogManagement from '../components/microservices/CatalogManagement'
import OrderManagement from '../components/microservices/OrderManagement'
import AnalyticsReporting from '../components/microservices/AnalyticsReporting'

interface MicroserviceStatus {
  name: string
  status: string
  port: number
  category: string
  description: string
  uptime: string
  health: string
  lastResponse: number
}

interface SystemMetrics {
  totalMicroservices: number
  runningServices: number
  totalUsers: number
  totalCustomers: number
  totalInternalUsers: number
  totalBranches: number
  totalCompanies: number
  totalProducts: number
  totalOrders: number
  totalRevenue: number
  systemHealth: string
  databaseConnections: number
  uptime: string
}

export default function SuperAdminDashboard() {
  const [microservices, setMicroservices] = useState<MicroserviceStatus[]>([])
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentView, setCurrentView] = useState('dashboard')
  const { user, isAuthenticated, isLoading, logout } = useAuthStore()

  const microserviceComponents = {
    'user-role-management': UserRoleManagement,
    'company-management': CompanyManagement,
    'catalog-management': CatalogManagement,
    'order-management': OrderManagement,
    'analytics-reporting': AnalyticsReporting
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchSystemStatus()
    } else {
      setLoading(false)
    }
  }, [isAuthenticated])

  const fetchSystemStatus = async () => {
    try {
      setLoading(true)
      
      // Fetch microservices status
      const servicesResponse = await fetch('/api/direct-data/microservices/status')
      if (servicesResponse.ok) {
        const servicesData = await servicesResponse.json()
        setMicroservices(servicesData.services || [])
      }

      // Fetch system metrics
      const metricsResponse = await fetch('/api/direct-data/system/stats')
      if (metricsResponse.ok) {
        const metricsData = await metricsResponse.json()
        setMetrics(metricsData)
      }

    } catch (error) {
      console.error('Error fetching system status:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCategoryFromName = (serviceName: string): string => {
    const name = serviceName.toLowerCase()
    if (name.includes('auth') || name.includes('security')) return 'security'
    if (name.includes('payment') || name.includes('finance')) return 'finance'
    if (name.includes('order') || name.includes('catalog') || name.includes('product')) return 'ecommerce'
    if (name.includes('analytics') || name.includes('reporting')) return 'analytics'
    if (name.includes('notification') || name.includes('customer-service')) return 'communication'
    if (name.includes('shipping') || name.includes('delivery')) return 'logistics'
    if (name.includes('content') || name.includes('media')) return 'content'
    return 'core'
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'running': return 'text-green-600 bg-green-100'
      case 'stopped': return 'text-red-600 bg-red-100'
      case 'warning': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'running': return <CheckCircleIcon className="h-4 w-4" />
      case 'stopped': return <ExclamationTriangleIcon className="h-4 w-4" />
      case 'warning': return <ClockIcon className="h-4 w-4" />
      default: return <ClockIcon className="h-4 w-4" />
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'security': return <ShieldCheckIcon className="h-6 w-6 text-red-600" />
      case 'core': return <ServerIcon className="h-6 w-6 text-blue-600" />
      case 'ecommerce': return <ShoppingCartIcon className="h-6 w-6 text-green-600" />
      case 'finance': return <BanknotesIcon className="h-6 w-6 text-yellow-600" />
      case 'analytics': return <ChartBarIcon className="h-6 w-6 text-purple-600" />
      case 'content': return <CubeIcon className="h-6 w-6 text-indigo-600" />
      case 'logistics': return <TruckIcon className="h-6 w-6 text-orange-600" />
      case 'communication': return <UsersIcon className="h-6 w-6 text-pink-600" />
      default: return <ServerIcon className="h-6 w-6 text-gray-600" />
    }
  }

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

  // Loading state
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

  // Authentication check
  if (!isAuthenticated && !isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
          <p className="mt-2 text-gray-600">Please log in to access the Super Admin Dashboard</p>
          <a 
            href="/login" 
            className="mt-4 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Go to Login
          </a>
        </div>
      </div>
    )
  }

  // Group services by category
  const groupedServices = microservices.reduce((acc, service) => {
    const category = getCategoryFromName(service.name)
    if (!acc[category]) acc[category] = []
    acc[category].push(service)
    return acc
  }, {} as Record<string, typeof microservices>)

  return (
    <>
      <Head>
        <title>LeafyHealth Super Admin Dashboard</title>
      </Head>
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 bg-white shadow-lg h-screen fixed left-0 top-0 flex flex-col">
            {/* Logo and Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">LH</span>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">LeafyHealth</h2>
                  <p className="text-sm text-gray-600">Super Admin</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 px-4 py-6">
              <nav className="space-y-2">
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    currentView === 'dashboard' 
                      ? 'bg-indigo-100 text-indigo-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <ServerIcon className="w-5 h-5 mr-3" />
                  System Overview
                </button>
                <button
                  onClick={() => setCurrentView('user-role-management')}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    currentView === 'user-role-management' 
                      ? 'bg-indigo-100 text-indigo-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <UsersIcon className="w-5 h-5 mr-3" />
                  User Management
                </button>
                <button
                  onClick={() => setCurrentView('company-management')}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    currentView === 'company-management' 
                      ? 'bg-indigo-100 text-indigo-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <BuildingOfficeIcon className="w-5 h-5 mr-3" />
                  Company Management
                </button>
                <button
                  onClick={() => setCurrentView('catalog-management')}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    currentView === 'catalog-management' 
                      ? 'bg-indigo-100 text-indigo-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <CubeIcon className="w-5 h-5 mr-3" />
                  Catalog Management
                </button>
                <button
                  onClick={() => setCurrentView('analytics-reporting')}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    currentView === 'analytics-reporting' 
                      ? 'bg-indigo-100 text-indigo-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <ChartBarIcon className="w-5 h-5 mr-3" />
                  Analytics & Reporting
                </button>
              </nav>
            </div>

            {/* User Info and Logout */}
            <div className="border-t border-gray-200 p-4">
              {user && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-900">{user.email}</p>
                  <p className="text-xs text-gray-600">Global Administrator</p>
                </div>
              )}
              <button
                onClick={() => logout()}
                className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="ml-64 flex-1">
            <div className="p-8">
              <div className="space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">System Dashboard</h1>
                    <p className="mt-2 text-gray-600">
                      Comprehensive microservices management for LeafyHealth platform
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircleIcon className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">System Healthy</span>
                  </div>
                </div>

                {/* System Metrics */}
                {metrics && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <ServerIcon className="h-8 w-8 text-blue-600" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Total Services</dt>
                            <dd className="text-lg font-medium text-gray-900">{metrics.totalMicroservices}</dd>
                          </dl>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <UsersIcon className="h-8 w-8 text-green-600" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                            <dd className="text-lg font-medium text-gray-900">{metrics.totalUsers}</dd>
                          </dl>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <BuildingOfficeIcon className="h-8 w-8 text-purple-600" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Total Branches</dt>
                            <dd className="text-lg font-medium text-gray-900">{metrics.totalBranches}</dd>
                          </dl>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <CubeIcon className="h-8 w-8 text-orange-600" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Total Products</dt>
                            <dd className="text-lg font-medium text-gray-900">{metrics.totalProducts}</dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Business Domain Quick Access */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Business Domain Management</h2>
                    <p className="text-sm text-gray-600 mt-1">Quick access to key business functions</p>
                  </div>
                  
                  <div className="p-6">
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
                        <TruckIcon className="h-8 w-8 text-orange-600 mb-2" />
                        <h3 className="font-semibold text-gray-900">Shipping & Delivery</h3>
                        <p className="text-sm text-gray-600">Logistics and delivery management</p>
                      </button>
                    </div>
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
        </div>
      </div>
    </>
  )
}