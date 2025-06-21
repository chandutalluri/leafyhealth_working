'use client';

import { useState, useEffect } from 'react'
import { SuperAdminLayout } from '../components/layout/SuperAdminLayout'

interface AuditLog {
  id: number
  action: string
  user: string
  resource: string
  timestamp: string
  ipAddress: string
  userAgent: string
  status: 'success' | 'failed' | 'warning'
  details: string
}

interface ComplianceMetric {
  id: number
  standard: string
  requirement: string
  status: 'compliant' | 'non-compliant' | 'under-review'
  lastChecked: string
  nextReview: string
  responsible: string
  priority: 'high' | 'medium' | 'low'
}

interface ComplianceStats {
  totalRequirements: number
  compliantRequirements: number
  nonCompliantRequirements: number
  underReviewRequirements: number
}

export default function ComplianceAudit() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [complianceMetrics, setComplianceMetrics] = useState<ComplianceMetric[]>([])
  const [stats, setStats] = useState<ComplianceStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'audit-logs' | 'compliance' | 'reports'>('overview')
  const [dateFilter, setDateFilter] = useState('7d')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    loadComplianceData()
  }, [])

  const loadComplianceData = async () => {
    try {
      setLoading(true)
      
      // Fetch from actual compliance audit microservice
      const response = await fetch('/api/compliance-audit')
      const data = await response.json()
      
      if (data.success && data.data) {
        setAuditLogs(data.data.auditLogs || [])
        setComplianceMetrics(data.data.complianceMetrics || [])
        
        // Calculate statistics from real data
        const totalRequirements = data.data.complianceMetrics?.length || 0
        const compliantRequirements = data.data.complianceMetrics?.filter((metric: ComplianceMetric) => metric.status === 'compliant').length || 0
        const nonCompliantRequirements = data.data.complianceMetrics?.filter((metric: ComplianceMetric) => metric.status === 'non-compliant').length || 0
        const underReviewRequirements = data.data.complianceMetrics?.filter((metric: ComplianceMetric) => metric.status === 'under-review').length || 0
        
        setStats({
          totalRequirements,
          compliantRequirements,
          nonCompliantRequirements,
          underReviewRequirements
        })
      }
    } catch (error) {
      console.error('Error loading compliance data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
      case 'compliant': return 'bg-green-100 text-green-800'
      case 'failed':
      case 'non-compliant': return 'bg-red-100 text-red-800'
      case 'warning':
      case 'under-review': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredAuditLogs = auditLogs.filter(log => {
    if (statusFilter !== 'all' && log.status !== statusFilter) return false
    
    // Date filtering
    const logDate = new Date(log.timestamp)
    const now = new Date()
    const daysDiff = Math.floor((now.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24))
    
    switch (dateFilter) {
      case '1d': return daysDiff <= 1
      case '7d': return daysDiff <= 7
      case '30d': return daysDiff <= 30
      case '90d': return daysDiff <= 90
      default: return true
    }
  })

  if (loading) {
    return (
      <SuperAdminLayout
        title="Compliance Audit"
        subtitle="Regulatory Compliance and Auditing"
        icon="📋"
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
      title="Compliance Audit"
      subtitle="Regulatory Compliance and Auditing"
      icon="📋"
      showBackButton={true}
    >
      {/* System Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">⚖️</span>
          <div>
            <h3 className="text-lg font-semibold text-amber-800">Compliance Management</h3>
            <p className="text-amber-700 text-sm">
              Monitor regulatory compliance, audit trails, and security requirements to ensure full regulatory adherence.
            </p>
          </div>
        </div>
      </div>

      {/* Compliance Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-2xl">📊</span>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Requirements</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.totalRequirements}</dd>
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
                    <dt className="text-sm font-medium text-gray-500 truncate">Compliant</dt>
                    <dd className="text-lg font-medium text-green-600">{stats.compliantRequirements}</dd>
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
                    <dt className="text-sm font-medium text-gray-500 truncate">Non-Compliant</dt>
                    <dd className="text-lg font-medium text-red-600">{stats.nonCompliantRequirements}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-2xl">⏳</span>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Under Review</dt>
                    <dd className="text-lg font-medium text-yellow-600">{stats.underReviewRequirements}</dd>
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
              { id: 'audit-logs', name: 'Audit Logs', icon: '📋' },
              { id: 'compliance', name: 'Compliance', icon: '⚖️' },
              { id: 'reports', name: 'Reports', icon: '📄' }
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
      {activeTab === 'audit-logs' && (
        <div className="space-y-6">
          {/* Audit Logs Filters */}
          <div className="bg-white shadow-lg rounded-xl border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Audit Logs</h3>
              <div className="flex space-x-3">
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="1d">Last 24 hours</option>
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="all">All time</option>
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">All statuses</option>
                  <option value="success">Success</option>
                  <option value="failed">Failed</option>
                  <option value="warning">Warning</option>
                </select>
              </div>
            </div>
            
            {/* Audit Logs Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resource</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAuditLogs.map((log) => (
                    <tr key={log.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(log.timestamp).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{log.user}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{log.action}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{log.resource}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(log.status)}`}>
                          {log.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{log.ipAddress}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'compliance' && (
        <div className="space-y-6">
          {/* Compliance Requirements */}
          <div className="bg-white shadow-lg rounded-xl border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance Requirements</h3>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Standard</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requirement</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Responsible</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Review</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {complianceMetrics.map((metric) => (
                    <tr key={metric.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{metric.standard}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{metric.requirement}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(metric.status)}`}>
                          {metric.status.replace('-', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(metric.priority)}`}>
                          {metric.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{metric.responsible}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(metric.nextReview).toLocaleDateString()}
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
          {/* Compliance Overview */}
          <div className="bg-white shadow-lg rounded-xl border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-medium text-green-800 mb-2">Compliance Rate</h4>
                <p className="text-2xl font-bold text-green-600">
                  {stats ? Math.round((stats.compliantRequirements / stats.totalRequirements) * 100) : 0}%
                </p>
                <p className="text-sm text-green-600">
                  {stats?.compliantRequirements} of {stats?.totalRequirements} requirements
                </p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <h4 className="font-medium text-red-800 mb-2">Critical Issues</h4>
                <p className="text-2xl font-bold text-red-600">{stats?.nonCompliantRequirements}</p>
                <p className="text-sm text-red-600">Require immediate attention</p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h4 className="font-medium text-yellow-800 mb-2">Under Review</h4>
                <p className="text-2xl font-bold text-yellow-600">{stats?.underReviewRequirements}</p>
                <p className="text-sm text-yellow-600">Pending compliance check</p>
              </div>
            </div>
          </div>

          {/* Recent Audit Activity */}
          <div className="bg-white shadow-lg rounded-xl border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Audit Activity</h3>
            <div className="space-y-3">
              {auditLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(log.status)}`}>
                      {log.status}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{log.action}</p>
                      <p className="text-xs text-gray-500">by {log.user}</p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(log.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </SuperAdminLayout>
  )
}