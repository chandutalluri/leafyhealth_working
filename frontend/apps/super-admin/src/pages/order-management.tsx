import { useState, useEffect } from 'react'
import { SuperAdminLayout } from '../components/layout/SuperAdminLayout'

interface OrderStats {
  totalOrders: number
  pendingOrders: number
  confirmedOrders: number
  deliveredOrders: number
  totalRevenue: number
}

interface Order {
  id: number
  orderNumber: string
  customerName: string
  customerEmail: string
  totalAmount: number
  orderStatus: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED'
  orderDate: string
  deliveryAddress: string
}

export default function OrderManagementPage() {
  const [stats, setStats] = useState<OrderStats>({
    totalOrders: 0,
    pendingOrders: 0,
    confirmedOrders: 0,
    deliveredOrders: 0,
    totalRevenue: 0
  })
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchOrderData()
  }, [])

  const fetchOrderData = async () => {
    try {
      setLoading(true)
      
      // Fetch from direct data endpoint (bypasses auth)
      const apiGateway = process.env.NEXT_PUBLIC_API_GATEWAY || 'http://localhost:8080';
      const response = await fetch(`${apiGateway}/api/order-management/orders`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch order data')
      }
      
      const data = await response.json()
      
      // Calculate stats from real data - adapt to actual database structure
      const totalOrders = data.length
      const pendingOrders = data.filter((o: any) => o.status === 'pending' || o.orderStatus === 'PENDING').length
      const confirmedOrders = data.filter((o: any) => o.status === 'confirmed' || o.orderStatus === 'CONFIRMED').length
      const deliveredOrders = data.filter((o: any) => o.status === 'delivered' || o.orderStatus === 'DELIVERED').length
      const totalRevenue = data.reduce((sum: number, order: any) => sum + (order.totalAmount || order.total || 0), 0)
      
      setStats({
        totalOrders,
        pendingOrders,
        confirmedOrders,
        deliveredOrders,
        totalRevenue
      })
      
      setOrders(data)
      setError(null)
    } catch (err) {
      console.error('Error fetching order data:', err)
      setError('Failed to connect to order management service')
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      const apiGateway = process.env.NEXT_PUBLIC_API_GATEWAY || 'http://localhost:8080';
      const response = await fetch(`${apiGateway}/api/order-management/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderStatus: newStatus })
      })
      
      if (response.ok) {
        fetchOrderData() // Refresh data
      }
    } catch (err) {
      console.error('Error updating order status:', err)
    }
  }

  if (loading) {
    return (
      <SuperAdminLayout title="Order Management" subtitle="Monitor orders and fulfillment operations">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white shadow-lg rounded-xl border border-gray-100 p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="grid grid-cols-5 gap-4">
                <div className="h-24 bg-gray-200 rounded"></div>
                <div className="h-24 bg-gray-200 rounded"></div>
                <div className="h-24 bg-gray-200 rounded"></div>
                <div className="h-24 bg-gray-200 rounded"></div>
                <div className="h-24 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </SuperAdminLayout>
    )
  }

  return (
    <SuperAdminLayout title="Order Management" subtitle="Monitor orders and fulfillment operations">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-lg rounded-xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Order Overview</h2>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              error ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
            }`}>
              {error ? 'Offline' : 'Online'}
            </div>
          </div>
          
          {error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex">
                <div className="text-red-400 mr-3">⚠️</div>
                <div>
                  <h3 className="text-sm font-medium text-red-800">Service Connection Error</h3>
                  <p className="text-red-700 text-sm mt-1">{error}</p>
                  <button 
                    onClick={fetchOrderData}
                    className="text-red-800 text-sm underline mt-2"
                  >
                    Retry Connection
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600">Total Orders</p>
                      <p className="text-2xl font-bold text-blue-900">{stats.totalOrders}</p>
                    </div>
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">📦</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-yellow-600">Pending</p>
                      <p className="text-2xl font-bold text-yellow-900">{stats.pendingOrders}</p>
                    </div>
                    <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <span className="text-yellow-600 font-semibold">⏳</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600">Confirmed</p>
                      <p className="text-2xl font-bold text-green-900">{stats.confirmedOrders}</p>
                    </div>
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-green-600 font-semibold">✅</span>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-600">Delivered</p>
                      <p className="text-2xl font-bold text-purple-900">{stats.deliveredOrders}</p>
                    </div>
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-purple-600 font-semibold">🚚</span>
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-emerald-600">Revenue</p>
                      <p className="text-2xl font-bold text-emerald-900">${stats.totalRevenue.toLocaleString()}</p>
                    </div>
                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <span className="text-emerald-600 font-semibold">💰</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
                  <button 
                    onClick={fetchOrderData}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Refresh
                  </button>
                </div>
                
                {orders.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order #</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {orders.slice(0, 10).map((order) => (
                          <tr key={order.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.orderNumber}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customerName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${order.totalAmount}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                order.orderStatus === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                                order.orderStatus === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' :
                                order.orderStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {order.orderStatus}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' :
                                order.paymentStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {order.paymentStatus}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(order.orderDate).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                      <span className="text-gray-400 text-2xl">📦</span>
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No Orders Found</h4>
                    <p className="text-gray-600 mb-4">
                      The order management service is connected but no orders are available yet.
                    </p>
                    <button 
                      onClick={fetchOrderData}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Refresh Data
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </SuperAdminLayout>
  )
}