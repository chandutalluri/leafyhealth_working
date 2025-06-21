import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { SuperAdminLayout } from '../components/layout/SuperAdminLayout'
import { Save, X, AlertTriangle, Users, Shield, Settings, ArrowLeft, Loader } from 'lucide-react'

interface EditUser {
  id?: number
  username: string
  email: string
  password?: string
  role: string
  status: string
  assignedApp: string
  primaryBranch: string
  preferredBranch: string
  multiBranchAssignment: boolean
  lastLogin?: string
  createdAt?: string
}

const roles = [
  'Super Admin',
  'Admin',
  'Store Manager',
  'Cashier',
  'Inventory Manager',
  'Delivery Manager',
  'Customer Service',
  'Internal User'
]

const apps = [
  'Admin Portal',
  'E-commerce Web',
  'Mobile Commerce',
  'Operations Dashboard',
  'Super Admin'
]

const branches = [
  'Main Branch',
  'Downtown Branch',
  'Suburb Branch',
  'Mall Branch',
  'Online Store'
]

export default function EditUser() {
  const router = useRouter()
  const { id } = router.query
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState<EditUser>({
    username: '',
    email: '',
    role: 'Internal User',
    status: 'Active',
    assignedApp: 'Admin Portal',
    primaryBranch: 'Main Branch',
    preferredBranch: 'Main Branch',
    multiBranchAssignment: true
  })

  // Fetch user data on component mount
  useEffect(() => {
    if (id) {
      fetchUserData()
    }
  }, [id])

  const fetchUserData = async () => {
    try {
      setFetchLoading(true)
      const response = await fetch(`/api/user-role-management?userId=${id}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch user data')
      }
      
      const userData = await response.json()
      
      // Map API response to form data
      setFormData({
        id: userData.id,
        username: userData.username || '',
        email: userData.email || '',
        role: userData.role || 'Internal User',
        status: userData.status || 'Active',
        assignedApp: userData.assignedApp || 'Admin Portal',
        primaryBranch: userData.primaryBranch || 'Main Branch',
        preferredBranch: userData.preferredBranch || 'Main Branch',
        multiBranchAssignment: userData.multiBranchAssignment !== false,
        lastLogin: userData.lastLogin,
        createdAt: userData.createdAt
      })
      
    } catch (err) {
      setError('Failed to load user data. Please try again.')
    } finally {
      setFetchLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/user-role-management', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'update',
          userId: id,
          user: formData
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update user')
      }

      setSuccess('User updated successfully!')
      setTimeout(() => {
        router.push('/security')
      }, 2000)

    } catch (err) {
      setError('Failed to update user. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof EditUser, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (fetchLoading) {
    return (
      <SuperAdminLayout title="Edit User" subtitle="Loading user data">
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
          <div className="text-center">
            <Loader className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Loading user data...</p>
          </div>
        </div>
      </SuperAdminLayout>
    )
  }

  return (
    <SuperAdminLayout title="Edit User" subtitle="Update user information and permissions">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/security')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Security Centre
          </button>
          
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl shadow-lg">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Edit User: {formData.username}</h1>
              <p className="text-gray-600 mt-2 text-lg">Update user information, permissions, and branch assignments</p>
              {formData.lastLogin && (
                <p className="text-sm text-gray-500 mt-1">Last login: {new Date(formData.lastLogin).toLocaleString()}</p>
              )}
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="max-w-5xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            
            {/* Basic Information Section */}
            <div className="p-8 border-b border-gray-200">
              <div className="flex items-center mb-6">
                <Shield className="w-6 h-6 mr-3 text-blue-500" />
                <h2 className="text-2xl font-bold text-gray-900">Basic Information</h2>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Username *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-lg"
                    placeholder="Enter username"
                  />
                  <p className="text-xs text-gray-500">Unique identifier for system login</p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-lg"
                    placeholder="Enter email address"
                  />
                  <p className="text-xs text-gray-500">Will be used for notifications and password recovery</p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={formData.password || ''}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-lg"
                    placeholder="Leave blank to keep current password"
                  />
                  <p className="text-xs text-gray-500">Only enter if you want to change the password</p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Account Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-lg"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                  <p className="text-xs text-gray-500">Current status of the user account</p>
                </div>
              </div>
            </div>

            {/* Role & Application Assignment Section */}
            <div className="p-8 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center mb-6">
                <Settings className="w-6 h-6 mr-3 text-green-500" />
                <h2 className="text-2xl font-bold text-gray-900">Role & Application Assignment</h2>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    User Role *
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-lg"
                  >
                    {roles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500">Determines access permissions and system capabilities</p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Assigned Application *
                  </label>
                  <select
                    value={formData.assignedApp}
                    onChange={(e) => handleInputChange('assignedApp', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-lg"
                  >
                    {apps.map(app => (
                      <option key={app} value={app}>{app}</option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500">Primary application the user will access</p>
                </div>
              </div>
            </div>

            {/* Branch Assignment Section */}
            <div className="p-8">
              <div className="flex items-center mb-6">
                <Users className="w-6 h-6 mr-3 text-purple-500" />
                <h2 className="text-2xl font-bold text-gray-900">Branch Assignment</h2>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <input
                    type="checkbox"
                    id="multiBranch"
                    checked={formData.multiBranchAssignment}
                    onChange={(e) => handleInputChange('multiBranchAssignment', e.target.checked)}
                    className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="multiBranch" className="text-lg font-semibold text-blue-900">
                    Enable Multi-Branch Assignment (Required for Operations)
                  </label>
                </div>

                {formData.multiBranchAssignment && (
                  <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
                    <div className="flex items-start">
                      <AlertTriangle className="w-6 h-6 text-yellow-600 mt-1 mr-3" />
                      <div className="text-yellow-800">
                        <h3 className="font-bold text-lg">Multi-Branch Operations Notice</h3>
                        <p className="mt-2">Branch assignment is required for multi-branch operations. This determines the user's main location for operations and delivery management.</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Primary Branch *
                    </label>
                    <select
                      value={formData.primaryBranch}
                      onChange={(e) => handleInputChange('primaryBranch', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-lg"
                    >
                      {branches.map(branch => (
                        <option key={branch} value={branch}>{branch}</option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500">User's main location branch for operations and delivery</p>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Preferred Branch
                    </label>
                    <select
                      value={formData.preferredBranch}
                      onChange={(e) => handleInputChange('preferredBranch', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-lg"
                    >
                      <option value={formData.primaryBranch}>Same as Primary Branch</option>
                      {branches.filter(branch => branch !== formData.primaryBranch).map(branch => (
                        <option key={branch} value={branch}>{branch}</option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500">Default branch for user preferences and delivery management</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Information */}
            {formData.createdAt && (
              <div className="px-8 py-4 bg-gray-100 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Account created: {new Date(formData.createdAt).toLocaleString()}
                </p>
              </div>
            )}

            {/* Status Messages */}
            {error && (
              <div className="mx-8 mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                <p className="text-red-800 font-medium">{error}</p>
              </div>
            )}

            {success && (
              <div className="mx-8 mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl">
                <p className="text-green-800 font-medium">{success}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 flex justify-between">
              <button
                type="button"
                onClick={() => router.push('/security')}
                className="px-8 py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors font-semibold text-lg flex items-center"
              >
                <X className="w-5 h-5 mr-2" />
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:from-green-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold text-lg flex items-center shadow-lg"
              >
                <Save className="w-5 h-5 mr-2" />
                {loading ? 'Updating User...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </SuperAdminLayout>
  )
}