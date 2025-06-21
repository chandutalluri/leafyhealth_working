import { useState, useEffect } from 'react'
import { AdminLayout } from '../components/layout/AdminLayout'
import { Search, Phone, Mail, MapPin, Calendar, Package, Star, MessageCircle, Clock, Filter, Eye, Edit, ArrowRight, TrendingUp, Users, ShoppingCart, AlertCircle } from 'lucide-react'

interface Customer {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string | null
  dateOfBirth: string | null
  gender: string | null
  profilePicture: string | null
  preferredLanguage: string
  timezone: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  totalOrders: number
  totalSpent: number
  lastOrderDate: string | null
  lifetimeValue: number
  customerSince: string
  status: 'active' | 'inactive' | 'vip' | 'flagged'
  addresses: CustomerAddress[]
  recentOrders: Order[]
}

interface CustomerAddress {
  id: number
  type: string
  addressLine1: string
  addressLine2: string | null
  city: string
  state: string
  pincode: string
  landmark: string | null
  isDefault: boolean
  isActive: boolean
}

interface Order {
  id: number
  orderNumber: string
  orderStatus: string
  paymentStatus: string
  totalAmount: number
  orderDate: string
  requiredDate: string | null
  deliveryDate: string | null
}

interface CustomerServiceMetrics {
  totalCustomers: number
  activeCustomers: number
  newCustomersToday: number
  vipCustomers: number
  averageOrderValue: number
  customerRetentionRate: number
  totalLifetimeValue: number
  pendingTickets: number
}

export default function CustomerServicePage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [metrics, setMetrics] = useState<CustomerServiceMetrics>({
    totalCustomers: 0,
    activeCustomers: 0,
    newCustomersToday: 0,
    vipCustomers: 0,
    averageOrderValue: 0,
    customerRetentionRate: 0,
    totalLifetimeValue: 0,
    pendingTickets: 0
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('recent')
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    loadCustomerData()
  }, [])

  const loadCustomerData = async () => {
    try {
      setLoading(true)
      
      // Load customer data from customer service microservice
      const response = await fetch('/api/customer-service/customers')
      if (response.ok) {
        const data = await response.json()
        setCustomers(data.customers || [])
        setMetrics(data.metrics || metrics)
      }
    } catch (error) {
      console.error('Error loading customer data:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateCustomerStatus = (customer: Customer): 'active' | 'inactive' | 'vip' | 'flagged' => {
    if (!customer.isActive) return 'inactive'
    if (customer.lifetimeValue > 50000) return 'vip'
    if (customer.totalOrders === 0) return 'flagged'
    return 'active'
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getCustomerSince = (createdAt: string) => {
    const created = new Date(createdAt)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - created.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 30) return `${diffDays} days`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months`
    return `${Math.floor(diffDays / 365)} years`
  }

  // Filter customers based on search and filters
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.phone && customer.phone.includes(searchTerm))
    
    const customerStatus = calculateCustomerStatus(customer)
    const matchesStatus = statusFilter === 'all' || customerStatus === statusFilter
    
    return matchesSearch && matchesStatus
  }).sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.firstName.localeCompare(b.firstName)
      case 'orders':
        return b.totalOrders - a.totalOrders
      case 'value':
        return b.lifetimeValue - a.lifetimeValue
      case 'recent':
      default:
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    }
  })

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Customer Service Center</h1>
            <p className="text-gray-600">Manage and support customer relationships</p>
          </div>
        </div>

        {/* Metrics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">Total Customers</p>
                <p className="text-2xl font-bold text-blue-600">{metrics.totalCustomers.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">Active Customers</p>
                <p className="text-2xl font-bold text-green-600">{metrics.activeCustomers.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <ShoppingCart className="h-8 w-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">Avg Order Value</p>
                <p className="text-2xl font-bold text-purple-600">{formatCurrency(metrics.averageOrderValue)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-red-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">Support Tickets</p>
                <p className="text-2xl font-bold text-red-600">{metrics.pendingTickets}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Search and Filters */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search customers by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="all">All Customers</option>
              <option value="active">Active</option>
              <option value="vip">VIP</option>
              <option value="inactive">Inactive</option>
              <option value="flagged">Flagged</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="recent">Recently Updated</option>
              <option value="name">Name A-Z</option>
              <option value="orders">Most Orders</option>
              <option value="value">Highest Value</option>
            </select>
          </div>
        </div>

        {/* Customer List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Customer Cards */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Customers ({filteredCustomers.length})
                </h3>
              </div>
              
              <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                {filteredCustomers.map((customer) => {
                  const status = calculateCustomerStatus(customer)
                  return (
                    <div
                      key={customer.id}
                      onClick={() => setSelectedCustomer(customer)}
                      className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-semibold">
                              {customer.firstName.charAt(0)}{customer.lastName.charAt(0)}
                            </span>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">
                              {customer.firstName} {customer.lastName}
                            </h4>
                            <p className="text-sm text-gray-500">{customer.email}</p>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className="text-xs text-gray-500">
                                {customer.totalOrders} orders
                              </span>
                              <span className="text-xs text-gray-500">
                                {formatCurrency(customer.lifetimeValue)}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            status === 'vip' ? 'bg-purple-100 text-purple-800' :
                            status === 'active' ? 'bg-green-100 text-green-800' :
                            status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {status.toUpperCase()}
                          </span>
                          <ArrowRight className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Customer Details Panel */}
          <div className="lg:col-span-1">
            {selectedCustomer ? (
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Customer Details</h3>
                </div>
                
                <div className="p-6 space-y-6">
                  {/* Customer Info */}
                  <div>
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-xl">
                          {selectedCustomer.firstName.charAt(0)}{selectedCustomer.lastName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-xl font-semibold text-gray-900">
                          {selectedCustomer.firstName} {selectedCustomer.lastName}
                        </h4>
                        <p className="text-gray-600">Customer since {getCustomerSince(selectedCustomer.createdAt)}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{selectedCustomer.email}</span>
                      </div>
                      {selectedCustomer.phone && (
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{selectedCustomer.phone}</span>
                        </div>
                      )}
                      {selectedCustomer.dateOfBirth && (
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{formatDate(selectedCustomer.dateOfBirth)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Customer Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{selectedCustomer.totalOrders}</p>
                      <p className="text-sm text-gray-600">Total Orders</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">{formatCurrency(selectedCustomer.lifetimeValue)}</p>
                      <p className="text-sm text-gray-600">Lifetime Value</p>
                    </div>
                  </div>

                  {/* Recent Orders */}
                  <div>
                    <h5 className="text-sm font-semibold text-gray-900 mb-3">Recent Orders</h5>
                    <div className="space-y-2">
                      {selectedCustomer.recentOrders?.slice(0, 3).map((order) => (
                        <div key={order.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <div>
                            <p className="text-sm font-medium text-gray-900">#{order.orderNumber}</p>
                            <p className="text-xs text-gray-500">{formatDate(order.orderDate)}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">{formatCurrency(order.totalAmount)}</p>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                              order.orderStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {order.orderStatus}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Customer Addresses */}
                  {selectedCustomer.addresses?.length > 0 && (
                    <div>
                      <h5 className="text-sm font-semibold text-gray-900 mb-3">Addresses</h5>
                      <div className="space-y-2">
                        {selectedCustomer.addresses.filter(addr => addr.isActive).map((address) => (
                          <div key={address.id} className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-start space-x-2">
                              <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                              <div>
                                <p className="text-sm font-medium text-gray-900 capitalize">{address.type}</p>
                                <p className="text-xs text-gray-600">
                                  {address.addressLine1}, {address.city}, {address.state} - {address.pincode}
                                </p>
                                {address.isDefault && (
                                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Default</span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2">
                      <MessageCircle className="h-4 w-4" />
                      <span>Contact Customer</span>
                    </button>
                    <button className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2">
                      <Package className="h-4 w-4" />
                      <span>View All Orders</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-center text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Select a customer to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}