'use client';

import { useState, useEffect } from 'react'
import { SuperAdminLayout } from '../components/layout/SuperAdminLayout'

interface User {
  id: number
  username: string
  email: string
  role: string
  assignedApp: string
  status: 'active' | 'inactive' | 'suspended'
  lastLogin: string | null
  permissions: string[]
}

interface AppOption {
  id: string
  name: string
  description: string
  port: number
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showUserCreator, setShowUserCreator] = useState(false)
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    role: 'customer',
    assignedApp: 'customer',
    password: '',
    status: 'active' as 'active' | 'inactive' | 'suspended'
  })

  const appOptions: AppOption[] = [
    {
      id: 'super-admin',
      name: 'Super Admin Portal',
      description: 'Ultimate system control and management',
      port: 3003
    },
    {
      id: 'admin',
      name: 'Admin Portal',
      description: 'Administrative functions and management',
      port: 3002
    },
    {
      id: 'customer',
      name: 'Customer Portal',
      description: 'Shopping and order management',
      port: 3000
    },
    {
      id: 'delivery',
      name: 'Mobile Delivery App',
      description: 'PWA for delivery personnel',
      port: 3001
    }
  ]

  const roleOptions = [
    { value: 'super-admin', label: 'Super Admin', defaultApp: 'super-admin' },
    { value: 'admin', label: 'Admin', defaultApp: 'admin' },
    { value: 'manager', label: 'Manager', defaultApp: 'admin' },
    { value: 'analyst', label: 'Analyst', defaultApp: 'admin' },
    { value: 'customer', label: 'Customer', defaultApp: 'customer' },
    { value: 'staff', label: 'Staff', defaultApp: 'customer' },
    { value: 'delivery', label: 'Delivery Personnel', defaultApp: 'delivery' },
    { value: 'cashier', label: 'Cashier', defaultApp: 'customer' }
  ]

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/users')
      const data = await response.json()
      
      if (Array.isArray(data)) {
        // Transform database users to match the expected interface
        const transformedUsers = data.map(user => ({
          id: parseInt(user.id) || 0,
          username: user.name || user.email,
          email: user.email,
          role: user.role,
          assignedApp: getAppForRole(user.role),
          status: user.status,
          lastLogin: user.lastLogin,
          permissions: getPermissionsForRole(user.role)
        }))
        setUsers(transformedUsers)
      }
    } catch (error) {
      console.error('Error loading users:', error)
    } finally {
      setLoading(false)
    }
  }

  const getAppForRole = (role: string) => {
    const roleConfig = roleOptions.find(r => r.value === role)
    return roleConfig?.defaultApp || 'customer'
  }

  const getPermissionsForRole = (role: string) => {
    switch (role) {
      case 'super_admin': return ['all']
      case 'admin': return ['read', 'write', 'delete']
      case 'manager': return ['read', 'write']
      default: return ['read']
    }
  }

  const handleRoleChange = (role: string) => {
    const roleConfig = roleOptions.find(r => r.value === role)
    setNewUser({
      ...newUser,
      role,
      assignedApp: roleConfig?.defaultApp || 'customer'
    })
  }

  const handleCreateUser = async () => {
    try {
      const token = localStorage.getItem('leafyhealth_token')
      
      const apiGateway = process.env.NEXT_PUBLIC_API_GATEWAY || 'http://localhost:8080';
      const response = await fetch(`${apiGateway}/api/auth/create-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newUser)
      })

      const data = await response.json()
      
      if (data.success) {
        await loadUsers()
        setShowUserCreator(false)
        setNewUser({
          username: '',
          email: '',
          role: 'customer',
          assignedApp: 'customer',
          password: '',
          status: 'active'
        })
        console.log('User created successfully')
      } else {
        console.error('Failed to create user:', data.error)
      }
    } catch (error) {
      console.error('Error creating user:', error)
    }
  }

  const handleUpdateAppAssignment = async (userId: number, newApp: string) => {
    try {
      const token = localStorage.getItem('leafyhealth_token')
      
      const apiGateway = process.env.NEXT_PUBLIC_API_GATEWAY || 'http://localhost:8080';
      const response = await fetch(`${apiGateway}/api/auth/assign-app`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          assignedApp: newApp,
          token
        })
      })

      const data = await response.json()
      
      if (data.success) {
        await loadUsers()
        console.log('App assignment updated successfully')
      } else {
        console.error('Failed to update app assignment:', data.error)
      }
    } catch (error) {
      console.error('Error updating app assignment:', error)
    }
  }

  const getAppName = (appId: string) => {
    const app = appOptions.find(a => a.id === appId)
    return app?.name || appId
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'suspended': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <SuperAdminLayout
        title="User Management"
        subtitle="Create and manage user accounts with app assignments"
        icon="👥"
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
      title="User Management"
      subtitle="Create and manage user accounts with app assignments"
      icon="👥"
      showBackButton={true}
    >
      {/* System Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">🔐</span>
          <div>
            <h3 className="text-lg font-semibold text-blue-800">Multi-App User Management</h3>
            <p className="text-blue-700 text-sm">
              Create users and assign them to specific applications. Users cannot change their assigned app - only Super Admin can modify assignments.
            </p>
          </div>
        </div>
      </div>

      {/* App Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {appOptions.map((app) => (
          <div key={app.id} className="bg-white shadow-lg rounded-xl border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900">{app.name}</h3>
              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                :{app.port}
              </span>
            </div>
            <p className="text-sm text-gray-600">{app.description}</p>
            <div className="mt-3 text-xs text-gray-500">
              Active Users: {users.filter(u => u.assignedApp === app.id).length}
            </div>
          </div>
        ))}
      </div>

      {/* User Management Header */}
      <div className="bg-white shadow-lg rounded-xl border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">System Users</h3>
          <button 
            onClick={() => setShowUserCreator(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Create New User
          </button>
        </div>
        
        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned App</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{user.username}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 capitalize">{user.role}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={user.assignedApp}
                      onChange={(e) => handleUpdateAppAssignment(user.id, e.target.value)}
                      className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      {appOptions.map((app) => (
                        <option key={app.id} value={app.id}>
                          {app.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button className="text-purple-600 hover:text-purple-900">Edit</button>
                    <button className="text-red-600 hover:text-red-900">Suspend</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Creator Modal */}
      {showUserCreator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New User</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <input
                  type="text"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter username"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter email"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter password"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => handleRoleChange(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {roleOptions.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Assigned Application</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {appOptions.map((app) => (
                    <div
                      key={app.id}
                      onClick={() => setNewUser({ ...newUser, assignedApp: app.id })}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        newUser.assignedApp === app.id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{app.name}</h4>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          :{app.port}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{app.description}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={newUser.status}
                  onChange={(e) => setNewUser({ ...newUser, status: e.target.value as any })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button 
                onClick={() => setShowUserCreator(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateUser}
                disabled={!newUser.username.trim() || !newUser.email.trim() || !newUser.password.trim()}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create User
              </button>
            </div>
          </div>
        </div>
      )}
    </SuperAdminLayout>
  )
}