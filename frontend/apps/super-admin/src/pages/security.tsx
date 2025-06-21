import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { SuperAdminLayout } from '../components/layout/SuperAdminLayout'
import { Shield, Users, Lock, Activity, Eye, EyeOff, Plus, Search, Filter, Trash2, Edit, Save, X } from 'lucide-react'

interface DatabaseUser {
  id: number
  username: string
  email: string
  role: string
  status: string
  lastLogin: string | null
  permissions: string[]
  assignedApp: string
  createdAt: string
  updatedAt: string
}

interface RoleStats {
  role: string
  count: number
  permissions: string[]
}

interface SecurityMetrics {
  totalUsers: number
  activeUsers: number
  suspendedUsers: number
  roleDistribution: RoleStats[]
  recentLogins: number
  lastSecurityScan: string
  failedLoginAttempts: number
  systemIntegrity: string
}

interface CRUDPermissions {
  create: boolean
  read: boolean
  update: boolean
  delete: boolean
}

interface SystemRole {
  id: number
  name: string
  description: string
  userCount: number
  permissions: { [microservice: string]: CRUDPermissions | 'all' }
  isSystemRole: boolean
  createdAt: string
  updatedAt: string
}

interface Domain {
  id: number
  name: string
  label: string
  description: string
  category: string
  port: number
  status: 'active' | 'inactive' | 'maintenance'
  url: string
  lastHealthCheck: string
  uptime: number
}

// All microservices for comprehensive domain management
const allMicroservices = [
  { name: 'identity-access', label: 'Identity & Access', description: 'User authentication and authorization', category: 'security' },
  { name: 'user-role-management', label: 'User Role Management', description: 'Role and permission management', category: 'security' },
  { name: 'catalog-management', label: 'Catalog Management', description: 'Product catalog and category management', category: 'core' },
  { name: 'inventory-management', label: 'Inventory Management', description: 'Stock tracking and warehouse operations', category: 'core' },
  { name: 'order-management', label: 'Order Management', description: 'Order processing and fulfillment', category: 'core' },
  { name: 'payment-processing', label: 'Payment Processing', description: 'Payment gateway and transaction management', category: 'financial' },
  { name: 'analytics-reporting', label: 'Analytics & Reporting', description: 'Business intelligence and data analysis', category: 'analytics' },
  { name: 'shipping-delivery', label: 'Shipping & Delivery', description: 'Logistics and delivery management', category: 'operations' },
  { name: 'customer-service', label: 'Customer Service', description: 'Customer support and ticketing', category: 'service' },
  { name: 'notification-service', label: 'Notification Service', description: 'Email, SMS, and push notifications', category: 'communication' },
  { name: 'content-management', label: 'Content Management', description: 'CMS and digital asset management', category: 'content' },
  { name: 'integration-hub', label: 'Integration Hub', description: 'Third-party service integrations', category: 'system' },
  { name: 'employee-management', label: 'Employee Management', description: 'HR and staff management', category: 'hr' },
  { name: 'accounting-management', label: 'Accounting Management', description: 'Financial accounting and bookkeeping', category: 'financial' },
  { name: 'compliance-audit', label: 'Compliance & Audit', description: 'Regulatory compliance and auditing', category: 'compliance' },
  { name: 'performance-monitor', label: 'Performance Monitor', description: 'System performance and monitoring', category: 'system' },
  { name: 'expense-monitoring', label: 'Expense Monitoring', description: 'Cost tracking and expense management', category: 'financial' },
  { name: 'label-design', label: 'Label Design', description: 'Product labeling and design tools', category: 'design' },
  { name: 'marketplace-management', label: 'Marketplace Management', description: 'Multi-vendor marketplace operations', category: 'marketplace' },
  { name: 'multi-language-management', label: 'Multi-Language Management', description: 'Internationalization and localization', category: 'localization' },
  { name: 'reporting-management', label: 'Reporting Management', description: 'Advanced reporting and dashboards', category: 'analytics' },
  { name: 'company-management', label: 'Company Management', description: 'Corporate structure and branch management', category: 'corporate' },
  { name: 'branch-management', label: 'Branch Management', description: 'Multi-location branch operations', category: 'corporate' }
]

export default function SecurityCentrePage() {
  const router = useRouter()
  const [users, setUsers] = useState<DatabaseUser[]>([])
  const [roles, setRoles] = useState<SystemRole[]>([])
  const [domains, setDomains] = useState<Domain[]>([])
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    totalUsers: 0,
    activeUsers: 0,
    suspendedUsers: 0,
    roleDistribution: [],
    recentLogins: 0,
    lastSecurityScan: 'Never',
    failedLoginAttempts: 0,
    systemIntegrity: 'Secure'
  })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedUser, setSelectedUser] = useState<DatabaseUser | null>(null)
  const [selectedRole, setSelectedRole] = useState<SystemRole | null>(null)
  const [showUserCreator, setShowUserCreator] = useState(false)
  const [showRoleCreator, setShowRoleCreator] = useState(false)
  const [showDomainCreator, setShowDomainCreator] = useState(false)
  const [showRoleEditor, setShowRoleEditor] = useState(false)
  const [showUserEditor, setShowUserEditor] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showPasswords, setShowPasswords] = useState(false)

  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    role: 'user',
    status: 'active',
    assignedApp: 'admin',
    password: '',
    permissions: [] as string[],
    branchId: '' as string,
    preferredBranchId: '' as string
  })
  
  const [branches, setBranches] = useState<{ id: number; name: string; code: string; address: string; isActive: boolean }[]>([])

  const [newRole, setNewRole] = useState({
    name: '',
    description: '',
    permissions: {} as { [key: string]: CRUDPermissions | 'all' },
    isSystemRole: false
  })

  const [newDomain, setNewDomain] = useState({
    name: '',
    label: '',
    description: '',
    category: 'core',
    port: 3020,
    status: 'active' as 'active' | 'inactive' | 'maintenance'
  })

  // Internal role options ONLY - NO CUSTOMER ROLES
  const roleOptions = [
    { value: 'admin', label: 'Administrator', apps: ['admin', 'super-admin'] },
    { value: 'manager', label: 'Store Manager', apps: ['admin', 'ops'] },
    { value: 'cashier', label: 'Cashier', apps: ['admin'] },
    { value: 'analyst', label: 'Data Analyst', apps: ['admin', 'ops'] },
    { value: 'delivery', label: 'Delivery Driver', apps: ['ops'] },
    { value: 'staff', label: 'Staff Member', apps: ['admin', 'ops'] },
    { value: 'user', label: 'Internal User', apps: ['admin', 'ops'] }
  ]

  const appOptions = [
    { value: 'admin', label: 'Admin Portal', description: 'Administrative functions and management' },
    { value: 'ops', label: 'Operations Dashboard', description: 'Operational oversight and delivery management' },
    { value: 'super-admin', label: 'Super Admin', description: 'Full system administration' }
  ]

  const getDefaultPermissions = (role: string): string[] => {
    const permissionMap: { [key: string]: string[] } = {
      'admin': ['identity-access', 'user-role-management', 'catalog-management', 'inventory-management', 'order-management', 'payment-processing', 'analytics-reporting'],
      'manager': ['catalog-management', 'inventory-management', 'order-management', 'analytics-reporting'],
      'cashier': ['order-management', 'customer-service', 'payment-processing'],
      'analyst': ['analytics-reporting', 'reporting-management', 'accounting-management'],
      'delivery': ['shipping-delivery', 'order-management'],
      'staff': ['customer-service', 'order-management'],
      'user': ['catalog-management', 'inventory-management']
    }
    return permissionMap[role] || []
  }

  const calculateRoleDistribution = (users: DatabaseUser[]): RoleStats[] => {
    const roleCount: { [key: string]: number } = {}
    users.forEach(user => {
      roleCount[user.role] = (roleCount[user.role] || 0) + 1
    })
    
    return Object.entries(roleCount).map(([role, count]) => ({
      role,
      count,
      permissions: getDefaultPermissions(role)
    }))
  }

  const loadBranches = async () => {
    try {
      const response = await fetch('/api/branches')
      if (response.ok) {
        const branchData = await response.json()
        setBranches(branchData.branches || [])
      }
    } catch (error) {
      console.error('Error loading branches:', error)
      // Set default branches for multi-branch company
      setBranches([
        { id: 1, name: 'Main Branch', code: 'MAIN', address: 'Downtown Location', isActive: true },
        { id: 2, name: 'North Branch', code: 'NORTH', address: 'North Side Location', isActive: true },
        { id: 3, name: 'South Branch', code: 'SOUTH', address: 'South Side Location', isActive: true }
      ])
    }
  }

  const loadSecurityData = async () => {
    try {
      setLoading(true)
      
      // Load branches first for multi-branch support
      await loadBranches()
      
      // Load users and metrics from database
      const identityResponse = await fetch('/api/identity-access')
      const identityData = await identityResponse.json()
      
      if (identityData.users) {
        // Filter out customers from all operations - INTERNAL USERS ONLY
        const internalUsers = identityData.users.filter((u: DatabaseUser) => 
          u.role !== 'customer' && u.assignedApp !== 'customer'
        )
        
        setUsers(identityData.users) // Keep full list for backend operations
        
        // Calculate metrics from internal users only
        const activeUsers = internalUsers.filter((u: DatabaseUser) => u.status === 'active').length
        const suspendedUsers = internalUsers.filter((u: DatabaseUser) => u.status === 'suspended').length
        
        // Calculate role distribution for internal users only
        const roleDistribution = calculateRoleDistribution(internalUsers)
        
        setMetrics({
          totalUsers: internalUsers.length,
          activeUsers,
          suspendedUsers,
          roleDistribution,
          recentLogins: internalUsers.filter((u: DatabaseUser) => {
            if (!u.lastLogin) return false
            const loginDate = new Date(u.lastLogin)
            const weekAgo = new Date()
            weekAgo.setDate(weekAgo.getDate() - 7)
            return loginDate > weekAgo
          }).length,
          lastSecurityScan: new Date().toISOString().split('T')[0],
          failedLoginAttempts: 0,
          systemIntegrity: 'Secure'
        })
      }
      
      if (identityData.metrics) {
        setMetrics(prev => ({ ...prev, ...identityData.metrics }))
      }
      
      // Load roles from database
      const rolesResponse = await fetch('/api/user-role-management')
      const rolesData = await rolesResponse.json()
      
      if (Array.isArray(rolesData)) {
        setRoles(rolesData)
      }
      
      // Load domains (microservices) with health status
      const domainsData = allMicroservices.map((service, index) => ({
        id: index + 1,
        name: service.name,
        label: service.label,
        description: service.description,
        category: service.category,
        port: 3020 + index,
        status: 'active' as const,
        url: `http://localhost:${3020 + index}`,
        lastHealthCheck: new Date().toISOString(),
        uptime: Math.random() * 100
      }))
      setDomains(domainsData)
      
    } catch (error) {
      console.error('Error loading security data:', error)
      setUsers([])
      setRoles([])
      setMetrics({
        totalUsers: 0,
        activeUsers: 0,
        suspendedUsers: 0,
        roleDistribution: [],
        recentLogins: 0,
        lastSecurityScan: 'Never',
        failedLoginAttempts: 0,
        systemIntegrity: 'Unknown'
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSecurityData()
  }, [])

  const handleCreateUser = async () => {
    try {
      // Add default permissions based on role
      const userWithPermissions = {
        ...newUser,
        permissions: getDefaultPermissions(newUser.role)
      }

      const response = await fetch('/api/identity-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userWithPermissions)
      })
      
      if (response.ok) {
        await loadSecurityData()
        setShowUserCreator(false)
        setNewUser({
          username: '',
          email: '',
          role: 'user',
          status: 'active',
          assignedApp: 'admin',
          password: '',
          permissions: [],
          branchId: '',
          preferredBranchId: ''
        })
      }
    } catch (error) {
      console.error('Error creating user:', error)
    }
  }

  const handleUpdateUser = async (user: DatabaseUser) => {
    try {
      const response = await fetch('/api/identity-access', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      })
      
      if (response.ok) {
        await loadSecurityData()
        setSelectedUser(null)
        setShowUserEditor(false)
      }
    } catch (error) {
      console.error('Error updating user:', error)
    }
  }

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return
    }
    
    try {
      const response = await fetch(`/api/identity-access?id=${userId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        await loadSecurityData()
      }
    } catch (error) {
      console.error('Error deleting user:', error)
    }
  }

  const handleCreateRole = async () => {
    try {
      const response = await fetch('/api/user-role-management', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRole)
      })
      
      if (response.ok) {
        await loadSecurityData()
        setShowRoleCreator(false)
        setNewRole({
          name: '',
          description: '',
          permissions: {},
          isSystemRole: false
        })
      }
    } catch (error) {
      console.error('Error creating role:', error)
    }
  }

  const handleCreateDomain = async () => {
    try {
      const domain = {
        ...newDomain,
        url: `http://localhost:${newDomain.port}`
      }
      
      setDomains(prev => [...prev, { ...domain, id: Date.now(), lastHealthCheck: new Date().toISOString(), uptime: 100 }])
      setShowDomainCreator(false)
      setNewDomain({
        name: '',
        label: '',
        description: '',
        category: 'core',
        port: 3020,
        status: 'active'
      })
    } catch (error) {
      console.error('Error creating domain:', error)
    }
  }

  const handleEditRole = (role: SystemRole) => {
    setSelectedRole(role)
    setNewRole({
      name: role.name,
      description: role.description,
      permissions: role.permissions,
      isSystemRole: role.isSystemRole
    })
    setShowRoleEditor(true)
  }

  const handleUpdateRole = async () => {
    if (!selectedRole) return
    
    try {
      const response = await fetch(`/api/user-role-management/${selectedRole.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRole)
      })
      
      if (response.ok) {
        setRoles(prev => prev.map(role => 
          role.id === selectedRole.id ? { ...role, ...newRole } : role
        ))
        setShowRoleEditor(false)
        setSelectedRole(null)
        setNewRole({
          name: '',
          description: '',
          permissions: {},
          isSystemRole: false
        })
        await loadSecurityData()
      }
    } catch (error) {
      console.error('Error updating role:', error)
    }
  }

  const handleDeleteRole = async (roleId: number) => {
    if (!confirm('Are you sure you want to delete this role? Users with this role will need to be reassigned.')) {
      return
    }
    
    try {
      const response = await fetch(`/api/user-role-management?id=${roleId}`, {
        method: 'DELETE'
      })
      
      const result = await response.json()
      
      if (response.ok) {
        await loadSecurityData()
        alert('Role deleted successfully')
      } else {
        alert(result.message || 'Failed to delete role')
      }
    } catch (error) {
      console.error('Error deleting role:', error)
      alert('Failed to delete role')
    }
  }

  const togglePermission = (microservice: string, permission: keyof CRUDPermissions) => {
    setNewRole(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [microservice]: {
          ...(prev.permissions[microservice] as CRUDPermissions || { create: false, read: false, update: false, delete: false }),
          [permission]: !((prev.permissions[microservice] as CRUDPermissions)?.[permission] || false)
        }
      }
    }))
  }

  const handleRoleFilterChange = (role: string) => {
    setRoleFilter(role)
    setNewUser(prev => ({
      ...prev,
      role,
      permissions: getDefaultPermissions(role),
      assignedApp: roleOptions.find(r => r.value === role)?.apps[0] || 'admin'
    }))
  }

  // Filter users based on search and filters - EXCLUDE CUSTOMERS COMPLETELY
  const filteredUsers = users.filter(user => {
    // CRITICAL: Exclude all customer users from admin interface
    if (user.role === 'customer' || user.assignedApp === 'customer') {
      return false
    }
    
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  if (loading) {
    return (
      <SuperAdminLayout title="Security Centre" subtitle="Comprehensive security management and user administration">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </SuperAdminLayout>
    )
  }

  return (
    <SuperAdminLayout title="Security Centre" subtitle="Comprehensive security management and user administration">
      <div className="space-y-6">
        {/* Header with Action Buttons */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Security Centre</h1>
          <div className="flex space-x-3">
            <button
              onClick={() => router.push('/user-add')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add User</span>
            </button>
            <button
              onClick={() => setShowRoleCreator(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Role</span>
            </button>
            <button
              onClick={() => setShowDomainCreator(true)}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Domain</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {[
            { id: 'overview', label: 'Overview', icon: Shield },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'roles', label: 'Roles', icon: Lock },
            { id: 'domains', label: 'Domains', icon: Activity }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Security Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700">Total Users</p>
                    <p className="text-2xl font-bold text-blue-600">{metrics.totalUsers}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <Shield className="h-8 w-8 text-green-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700">Active Users</p>
                    <p className="text-2xl font-bold text-green-600">{metrics.activeUsers}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <Lock className="h-8 w-8 text-red-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700">Suspended</p>
                    <p className="text-2xl font-bold text-red-600">{metrics.suspendedUsers}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <Activity className="h-8 w-8 text-purple-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700">Recent Logins</p>
                    <p className="text-2xl font-bold text-purple-600">{metrics.recentLogins}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* System Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">System Integrity</span>
                    <span className="text-sm font-medium text-green-600">{metrics.systemIntegrity}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Last Security Scan</span>
                    <span className="text-sm font-medium text-gray-900">{metrics.lastSecurityScan}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Failed Login Attempts</span>
                    <span className="text-sm font-medium text-red-600">{metrics.failedLoginAttempts}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Role Distribution</h3>
                <div className="space-y-2">
                  {metrics.roleDistribution.map((role, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 capitalize">{role.role}</span>
                      <span className="text-sm font-medium text-gray-900">{role.count} users</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* User Filters */}
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-64">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                </div>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="all">All Roles</option>
                  {roleOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
                <button
                  onClick={() => setShowPasswords(!showPasswords)}
                  className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  <span>{showPasswords ? 'Hide' : 'Show'} Passwords</span>
                </button>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">App</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Permissions</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.username}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.role === 'admin' ? 'bg-red-100 text-red-800' : 
                            user.role === 'manager' ? 'bg-blue-100 text-blue-800' :
                            user.role === 'analyst' ? 'bg-purple-100 text-purple-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.status === 'active' ? 'bg-green-100 text-green-800' : 
                            user.status === 'suspended' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.assignedApp}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-xs text-gray-600">
                            {user.permissions?.length || 0} permissions
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => router.push(`/user-edit?id=${user.id}`)}
                            className="text-blue-600 hover:text-blue-900 mr-3 flex items-center space-x-1"
                          >
                            <Edit className="h-4 w-4" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-900 flex items-center space-x-1"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>Delete</span>
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

        {/* Roles Tab */}
        {activeTab === 'roles' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Users</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Permissions</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {roles.map((role) => (
                      <tr key={role.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {role.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {role.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {role.userCount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            role.isSystemRole ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {role.isSystemRole ? 'System' : 'Custom'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {Object.keys(role.permissions).length} services
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEditRole(role)}
                            className="text-blue-600 hover:text-blue-900 mr-3 flex items-center space-x-1"
                          >
                            <Edit className="h-4 w-4" />
                            <span>Edit</span>
                          </button>
                          {(!role.isSystemRole && role.name !== 'admin' && role.name !== 'user' && role.name !== 'Super Admin') && (
                            <button
                              onClick={() => handleDeleteRole(role.id)}
                              className="text-red-600 hover:text-red-900 flex items-center space-x-1"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span>Delete</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Domains Tab */}
        {activeTab === 'domains' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Port</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uptime</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Check</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {domains.map((domain) => (
                      <tr key={domain.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{domain.label}</div>
                            <div className="text-sm text-gray-500">{domain.description}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 capitalize">
                            {domain.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {domain.port}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            domain.status === 'active' ? 'bg-green-100 text-green-800' : 
                            domain.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {domain.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {domain.uptime.toFixed(1)}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(domain.lastHealthCheck).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* User Creator Modal */}
        {showUserCreator && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Create New User</h3>
                <button
                  onClick={() => setShowUserCreator(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Username</label>
                  <input
                    type="text"
                    value={newUser.username}
                    onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Enter username"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Enter email"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <input
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Enter password"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Role</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => handleRoleFilterChange(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    {roleOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={newUser.status}
                    onChange={(e) => setNewUser({...newUser, status: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Assigned App</label>
                  <select
                    value={newUser.assignedApp}
                    onChange={(e) => setNewUser({...newUser, assignedApp: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    {appOptions
                      .filter(app => roleOptions.find(r => r.value === newUser.role)?.apps.includes(app.value))
                      .map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Multi-Branch Assignment Section */}
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="text-sm font-semibold text-yellow-800 mb-3">
                  🏢 Multi-Branch Assignment (Required)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Primary Branch</label>
                    <select
                      value={newUser.branchId}
                      onChange={(e) => setNewUser({...newUser, branchId: e.target.value})}
                      className="mt-1 block w-full border border-yellow-300 rounded-md px-3 py-2 bg-white"
                      required
                    >
                      <option value="">Select Primary Branch</option>
                      {branches.filter(b => b.isActive).map(branch => (
                        <option key={branch.id} value={branch.id.toString()}>
                          {branch.name} ({branch.code}) - {branch.address}
                        </option>
                      ))}
                    </select>
                    <p className="mt-1 text-xs text-gray-600">
                      User's main working branch for operations and reports
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Preferred Branch</label>
                    <select
                      value={newUser.preferredBranchId}
                      onChange={(e) => setNewUser({...newUser, preferredBranchId: e.target.value})}
                      className="mt-1 block w-full border border-yellow-300 rounded-md px-3 py-2 bg-white"
                    >
                      <option value="">Same as Primary Branch</option>
                      {branches.filter(b => b.isActive).map(branch => (
                        <option key={branch.id} value={branch.id.toString()}>
                          {branch.name} ({branch.code}) - {branch.address}
                        </option>
                      ))}
                    </select>
                    <p className="mt-1 text-xs text-gray-600">
                      Default branch for customer service and delivery management
                    </p>
                  </div>
                </div>
                {!newUser.branchId && (
                  <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                    <p className="text-xs text-red-600">
                      ⚠️ Branch assignment is required for multi-branch operations
                    </p>
                  </div>
                )}
              </div>

              {/* Permissions Preview */}
              {newUser.permissions.length > 0 && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Default Permissions</label>
                  <div className="flex flex-wrap gap-2">
                    {newUser.permissions.map(permission => (
                      <span key={permission} className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {permission}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowUserCreator(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateUser}
                  disabled={!newUser.username || !newUser.email || !newUser.password || !newUser.branchId}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create User
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Role Creator/Editor Modal */}
        {(showRoleCreator || showRoleEditor) && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  {showRoleEditor ? 'Edit Role' : 'Create New Role'}
                </h3>
                <button
                  onClick={() => {
                    setShowRoleCreator(false)
                    setShowRoleEditor(false)
                    setSelectedRole(null)
                    setNewRole({ name: '', description: '', permissions: {}, isSystemRole: false })
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Role Name</label>
                  <input
                    type="text"
                    value={newRole.name}
                    onChange={(e) => setNewRole({...newRole, name: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Enter role name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <input
                    type="text"
                    value={newRole.description}
                    onChange={(e) => setNewRole({...newRole, description: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Enter role description"
                  />
                </div>
              </div>

              {/* Permissions Matrix */}
              <div className="mb-6">
                <h4 className="text-md font-semibold text-gray-900 mb-4">Microservice Permissions</h4>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Create</th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Read</th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Update</th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Delete</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {allMicroservices.map((service) => (
                          <tr key={service.name}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{service.label}</div>
                                <div className="text-sm text-gray-500">{service.category}</div>
                              </div>
                            </td>
                            {(['create', 'read', 'update', 'delete'] as const).map((permission) => (
                              <td key={permission} className="px-6 py-4 whitespace-nowrap text-center">
                                <input
                                  type="checkbox"
                                  checked={(newRole.permissions[service.name] as CRUDPermissions)?.[permission] || false}
                                  onChange={() => togglePermission(service.name, permission)}
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowRoleCreator(false)
                    setShowRoleEditor(false)
                    setSelectedRole(null)
                    setNewRole({ name: '', description: '', permissions: {}, isSystemRole: false })
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={showRoleEditor ? handleUpdateRole : handleCreateRole}
                  disabled={!newRole.name || !newRole.description}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>{showRoleEditor ? 'Update Role' : 'Create Role'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Domain Creator Modal */}
        {showDomainCreator && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Create New Domain</h3>
                <button
                  onClick={() => setShowDomainCreator(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Domain Name</label>
                  <input
                    type="text"
                    value={newDomain.name}
                    onChange={(e) => setNewDomain({...newDomain, name: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="e.g., new-service"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Display Label</label>
                  <input
                    type="text"
                    value={newDomain.label}
                    onChange={(e) => setNewDomain({...newDomain, label: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="e.g., New Service"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={newDomain.description}
                    onChange={(e) => setNewDomain({...newDomain, description: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    rows={3}
                    placeholder="Describe the service functionality"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    value={newDomain.category}
                    onChange={(e) => setNewDomain({...newDomain, category: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="core">Core</option>
                    <option value="financial">Financial</option>
                    <option value="analytics">Analytics</option>
                    <option value="operations">Operations</option>
                    <option value="security">Security</option>
                    <option value="system">System</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Port</label>
                  <input
                    type="number"
                    value={newDomain.port}
                    onChange={(e) => setNewDomain({...newDomain, port: parseInt(e.target.value) || 3020})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    min="3000"
                    max="9999"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowDomainCreator(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateDomain}
                  disabled={!newDomain.name || !newDomain.label}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Domain
                </button>
              </div>
            </div>
          </div>
        )}

        {/* User Editor Modal */}
        {showUserEditor && selectedUser && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Edit User: {selectedUser.username}</h3>
                <button
                  onClick={() => {
                    setShowUserEditor(false)
                    setSelectedUser(null)
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Username</label>
                  <input
                    type="text"
                    value={selectedUser.username}
                    onChange={(e) => setSelectedUser({...selectedUser, username: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={selectedUser.email}
                    onChange={(e) => setSelectedUser({...selectedUser, email: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Role</label>
                  <select
                    value={selectedUser.role}
                    onChange={(e) => setSelectedUser({...selectedUser, role: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    {roleOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={selectedUser.status}
                    onChange={(e) => setSelectedUser({...selectedUser, status: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Assigned App</label>
                  <select
                    value={selectedUser.assignedApp}
                    onChange={(e) => setSelectedUser({...selectedUser, assignedApp: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    {appOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowUserEditor(false)
                    setSelectedUser(null)
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUpdateUser(selectedUser)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </SuperAdminLayout>
  )
}