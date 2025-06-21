'use client';

import { useState, useEffect } from 'react'
import { SuperAdminLayout } from '../components/layout/SuperAdminLayout'

interface Integration {
  id: number
  name: string
  type: 'webhook' | 'api' | 'database' | 'messaging'
  provider: string
  status: 'active' | 'inactive' | 'error' | 'pending'
  lastSync: string
  requests24h: number
  errorRate: number
  description: string
  configuredBy: string
}

interface IntegrationStats {
  totalIntegrations: number
  activeIntegrations: number
  erroredIntegrations: number
  totalRequests: number
}

export default function IntegrationHub() {
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [stats, setStats] = useState<IntegrationStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'integrations' | 'webhooks' | 'logs'>('overview')
  const [showIntegrationCreator, setShowIntegrationCreator] = useState(false)
  const [newIntegration, setNewIntegration] = useState({
    name: '',
    type: 'api' as 'webhook' | 'api' | 'database' | 'messaging',
    provider: '',
    description: ''
  })

  useEffect(() => {
    loadIntegrationData()
  }, [])

  const loadIntegrationData = async () => {
    try {
      setLoading(true)
      
      // Fetch from actual integration hub microservice
      const response = await fetch('/api/integration-hub')
      const data = await response.json()
      
      if (data.success && data.data) {
        setIntegrations(data.data)
        
        // Calculate statistics from real data
        const totalIntegrations = data.data.length
        const activeIntegrations = data.data.filter((int: Integration) => int.status === 'active').length
        const erroredIntegrations = data.data.filter((int: Integration) => int.status === 'error').length
        const totalRequests = data.data.reduce((sum: number, int: Integration) => sum + int.requests24h, 0)
        
        setStats({
          totalIntegrations,
          activeIntegrations,
          erroredIntegrations,
          totalRequests
        })
      }
    } catch (error) {
      console.error('Error loading integration data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateIntegration = async () => {
    try {
      const response = await fetch('/api/integration-hub', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newIntegration,
          status: 'pending',
          lastSync: new Date().toISOString(),
          requests24h: 0,
          errorRate: 0,
          configuredBy: 'admin'
        })
      })

      if (response.ok) {
        await loadIntegrationData()
        setShowIntegrationCreator(false)
        setNewIntegration({ name: '', type: 'api', provider: '', description: '' })
        console.log('Integration created successfully')
      }
    } catch (error) {
      console.error('Error creating integration:', error)
    }
  }

  const handleDeleteIntegration = async (integrationId: number) => {
    if (!confirm('Are you sure you want to delete this integration?')) return
    
    try {
      const response = await fetch(`/api/integration-hub/${integrationId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        await loadIntegrationData()
        console.log('Integration deleted successfully')
      }
    } catch (error) {
      console.error('Error deleting integration:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'error': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'webhook': return '🔗'
      case 'api': return '🌐'
      case 'database': return '🗄️'
      case 'messaging': return '💬'
      default: return '🔧'
    }
  }

  const getErrorRateColor = (errorRate: number) => {
    if (errorRate < 1) return 'text-green-600'
    if (errorRate < 5) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (loading) {
    return (
      <SuperAdminLayout
        title="Integration Hub"
        subtitle="Third-party Integrations and APIs"
        icon="🔌"
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
      title="Integration Hub"
      subtitle="Third-party Integrations and APIs"
      icon="🔌"
      showBackButton={true}
    >
      {/* System Notice */}
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 mb-6">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">🔗</span>
          <div>
            <h3 className="text-lg font-semibold text-purple-800">Integration Management</h3>
            <p className="text-purple-700 text-sm">
              Manage all third-party integrations, APIs, webhooks, and external service connections from one central hub.
            </p>
          </div>
        </div>
      </div>

      {/* Integration Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-2xl">🔌</span>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Integrations</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.totalIntegrations}</dd>
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
                    <dt className="text-sm font-medium text-gray-500 truncate">Active</dt>
                    <dd className="text-lg font-medium text-green-600">{stats.activeIntegrations}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-2xl">❌</span>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Errors</dt>
                    <dd className="text-lg font-medium text-red-600">{stats.erroredIntegrations}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-2xl">📊</span>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Requests</dt>
                    <dd className="text-lg font-medium text-blue-600">{stats.totalRequests.toLocaleString()}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: '📊' },
              { id: 'integrations', name: 'Integrations', icon: '🔌' },
              { id: 'webhooks', name: 'Webhooks', icon: '🔗' },
              { id: 'logs', name: 'Activity Logs', icon: '📋' }
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
      {activeTab === 'integrations' && (
        <div className="space-y-6">
          {/* Integration Management Header */}
          <div className="bg-white shadow-lg rounded-xl border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Integration Management</h3>
              <button 
                onClick={() => setShowIntegrationCreator(true)}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Add New Integration
              </button>
            </div>
            
            {/* Integrations Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Integration</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requests (24h)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Error Rate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Sync</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {integrations.map((integration) => (
                    <tr key={integration.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-lg mr-3">{getTypeIcon(integration.type)}</span>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{integration.name}</div>
                            <div className="text-xs text-gray-500">{integration.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 capitalize">{integration.type}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{integration.provider}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(integration.status)}`}>
                          {integration.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{integration.requests24h.toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${getErrorRateColor(integration.errorRate)}`}>
                          {integration.errorRate.toFixed(2)}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(integration.lastSync).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button className="text-purple-600 hover:text-purple-900">Edit</button>
                        <button className="text-blue-600 hover:text-blue-900">Test</button>
                        <button 
                          onClick={() => handleDeleteIntegration(integration.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
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
          {/* Integration Overview */}
          <div className="bg-white shadow-lg rounded-xl border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Integration Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🌐</span>
                  <div>
                    <h4 className="font-medium text-blue-800">API Integrations</h4>
                    <p className="text-lg font-bold text-blue-600">
                      {integrations.filter(i => i.type === 'api').length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🔗</span>
                  <div>
                    <h4 className="font-medium text-green-800">Webhooks</h4>
                    <p className="text-lg font-bold text-green-600">
                      {integrations.filter(i => i.type === 'webhook').length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🗄️</span>
                  <div>
                    <h4 className="font-medium text-yellow-800">Databases</h4>
                    <p className="text-lg font-bold text-yellow-600">
                      {integrations.filter(i => i.type === 'database').length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">💬</span>
                  <div>
                    <h4 className="font-medium text-purple-800">Messaging</h4>
                    <p className="text-lg font-bold text-purple-600">
                      {integrations.filter(i => i.type === 'messaging').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Integration Creator Modal */}
      {showIntegrationCreator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Integration</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Integration Name"
                value={newIntegration.name}
                onChange={(e) => setNewIntegration({ ...newIntegration, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <select
                value={newIntegration.type}
                onChange={(e) => setNewIntegration({ ...newIntegration, type: e.target.value as any })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="api">API Integration</option>
                <option value="webhook">Webhook</option>
                <option value="database">Database</option>
                <option value="messaging">Messaging</option>
              </select>
              <input
                type="text"
                placeholder="Provider (e.g., Stripe, PayPal, AWS)"
                value={newIntegration.provider}
                onChange={(e) => setNewIntegration({ ...newIntegration, provider: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <textarea
                placeholder="Description"
                value={newIntegration.description}
                onChange={(e) => setNewIntegration({ ...newIntegration, description: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button 
                onClick={() => setShowIntegrationCreator(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateIntegration}
                disabled={!newIntegration.name.trim() || !newIntegration.provider.trim()}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Integration
              </button>
            </div>
          </div>
        </div>
      )}
    </SuperAdminLayout>
  )
}