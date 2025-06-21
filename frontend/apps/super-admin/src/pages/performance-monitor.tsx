'use client';

import { useState, useEffect } from 'react'
import { SuperAdminLayout } from '../components/layout/SuperAdminLayout'

interface PerformanceMetric {
  id: number
  service: string
  endpoint: string
  avgResponseTime: number
  requests24h: number
  errorRate: number
  uptime: number
  lastCheck: string
  status: 'healthy' | 'warning' | 'critical'
}

interface SystemStats {
  totalServices: number
  healthyServices: number
  avgResponseTime: number
  totalRequests: number
  systemUptime: number
}

export default function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([])
  const [stats, setStats] = useState<SystemStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'alerts' | 'reports'>('overview')
  const [refreshInterval, setRefreshInterval] = useState(0) // Disabled by default
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(false)

  useEffect(() => {
    loadPerformanceData()
    
    // Only set interval if auto-refresh is enabled
    let interval: NodeJS.Timeout | null = null
    if (autoRefreshEnabled && refreshInterval > 0) {
      interval = setInterval(loadPerformanceData, refreshInterval * 1000)
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [refreshInterval, autoRefreshEnabled])

  const loadPerformanceData = async () => {
    try {
      setLoading(true)
      
      // Fetch from actual performance monitoring microservice
      const response = await fetch('/api/performance-monitor')
      const data = await response.json()
      
      if (data.success && data.data) {
        setMetrics(data.data)
        
        // Calculate system statistics from real data
        const totalServices = data.data.length
        const healthyServices = data.data.filter((metric: PerformanceMetric) => metric.status === 'healthy').length
        const avgResponseTime = data.data.reduce((sum: number, metric: PerformanceMetric) => sum + metric.avgResponseTime, 0) / totalServices
        const totalRequests = data.data.reduce((sum: number, metric: PerformanceMetric) => sum + metric.requests24h, 0)
        const systemUptime = data.data.reduce((sum: number, metric: PerformanceMetric) => sum + metric.uptime, 0) / totalServices
        
        setStats({
          totalServices,
          healthyServices,
          avgResponseTime: Math.round(avgResponseTime),
          totalRequests,
          systemUptime: Math.round(systemUptime)
        })
      }
    } catch (error) {
      console.error('Error loading performance data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800'
      case 'warning': return 'bg-yellow-100 text-yellow-800'
      case 'critical': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getResponseTimeColor = (responseTime: number) => {
    if (responseTime < 200) return 'text-green-600'
    if (responseTime < 500) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getUptimeColor = (uptime: number) => {
    if (uptime >= 99.5) return 'text-green-600'
    if (uptime >= 95) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (loading) {
    return (
      <SuperAdminLayout
        title="Performance Monitor"
        subtitle="System Performance and Health Monitoring"
        icon="⚡"
        showBackButton={true}
      >
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </SuperAdminLayout>
    )
  }

  return (
    <SuperAdminLayout
      title="Performance Monitor"
      subtitle="System Performance and Health Monitoring"
      icon="⚡"
      showBackButton={true}
    >
      {/* System Notice */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">📊</span>
          <div>
            <h3 className="text-lg font-semibold text-green-800">Performance Monitoring</h3>
            <p className="text-green-700 text-sm">
              Real-time monitoring of all microservices, API endpoints, and system performance metrics.
            </p>
          </div>
        </div>
      </div>

      {/* Performance Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-2xl">🔧</span>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Services</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.totalServices}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-2xl">✅</span>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Healthy Services</dt>
                    <dd className="text-lg font-medium text-green-600">{stats.healthyServices}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-2xl">⚡</span>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Avg Response</dt>
                    <dd className={`text-lg font-medium ${getResponseTimeColor(stats.avgResponseTime)}`}>
                      {stats.avgResponseTime}ms
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-2xl">📈</span>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Requests</dt>
                    <dd className="text-lg font-medium text-blue-600">
                      {stats.totalRequests.toLocaleString()}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-2xl">🔄</span>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">System Uptime</dt>
                    <dd className={`text-lg font-medium ${getUptimeColor(stats.systemUptime)}`}>
                      {stats.systemUptime}%
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Auto-refresh Control */}
      <div className="bg-white shadow-lg rounded-xl border border-gray-100 p-4 mb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-900">Auto-refresh Settings</h3>
          <div className="flex items-center space-x-3">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={autoRefreshEnabled}
                onChange={(e) => setAutoRefreshEnabled(e.target.checked)}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm text-gray-600">Enable auto-refresh</span>
            </label>
            <select
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(Number(e.target.value))}
              disabled={!autoRefreshEnabled}
              className={`border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                !autoRefreshEnabled ? 'bg-gray-100 text-gray-400' : ''
              }`}
            >
              <option value={0}>Manual only</option>
              <option value={10}>10 seconds</option>
              <option value={30}>30 seconds</option>
              <option value={60}>1 minute</option>
              <option value={300}>5 minutes</option>
            </select>
            <button
              onClick={loadPerformanceData}
              className="bg-purple-600 text-white px-3 py-1 rounded-lg hover:bg-purple-700 text-sm"
            >
              Refresh Now
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: '📊' },
              { id: 'services', name: 'Services', icon: '🔧' },
              { id: 'alerts', name: 'Alerts', icon: '🚨' },
              { id: 'reports', name: 'Reports', icon: '📋' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
              >
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'services' && (
        <div className="space-y-6">
          {/* Services Performance Table */}
          <div className="bg-white shadow-lg rounded-xl border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Performance Metrics</h3>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Response Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requests (24h)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Error Rate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uptime</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Check</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {metrics.map((metric) => (
                    <tr key={metric.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{metric.service}</div>
                          <div className="text-xs text-gray-500">{metric.endpoint}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(metric.status)}`}>
                          {metric.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${getResponseTimeColor(metric.avgResponseTime)}`}>
                          {metric.avgResponseTime}ms
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{metric.requests24h.toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${metric.errorRate > 5 ? 'text-red-600' : metric.errorRate > 1 ? 'text-yellow-600' : 'text-green-600'}`}>
                          {metric.errorRate.toFixed(2)}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${getUptimeColor(metric.uptime)}`}>
                          {metric.uptime}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(metric.lastCheck).toLocaleTimeString()}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Overview */}
          <div className="bg-white shadow-lg rounded-xl border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-medium text-green-800 mb-2">Healthy Services</h4>
                <p className="text-2xl font-bold text-green-600">{stats?.healthyServices}</p>
                <p className="text-sm text-green-600">
                  {stats ? Math.round((stats.healthyServices / stats.totalServices) * 100) : 0}% of total services
                </p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-800 mb-2">Average Response Time</h4>
                <p className={`text-2xl font-bold ${getResponseTimeColor(stats?.avgResponseTime || 0)}`}>
                  {stats?.avgResponseTime}ms
                </p>
                <p className="text-sm text-blue-600">Across all endpoints</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h4 className="font-medium text-purple-800 mb-2">System Uptime</h4>
                <p className={`text-2xl font-bold ${getUptimeColor(stats?.systemUptime || 0)}`}>
                  {stats?.systemUptime}%
                </p>
                <p className="text-sm text-purple-600">Last 24 hours</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </SuperAdminLayout>
  )
}