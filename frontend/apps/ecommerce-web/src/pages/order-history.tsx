import { useState } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import Head from 'next/head'
import Link from 'next/link'
import { 
  ClockIcon, 
  CheckCircleIcon, 
  TruckIcon,
  XCircleIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline'
import GlassCard from '@/components/ui/GlassCard'
import { LoadingSkeleton, ErrorFallback } from '@/components/ui/ErrorFallback'
import { useAuthStore } from '@/lib/stores/auth'
import { apiClient } from '@/lib/api'

interface Order {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  items: any[];
}
import { formatPrice, formatDate } from '@/lib/utils'

export default function OrderHistoryPage() {
  const { user, isAuthenticated } = useAuthStore()
  const [selectedStatus, setSelectedStatus] = useState('all')

  const { data: ordersData, isLoading, error } = useQuery({
    queryKey: ['orders', user?.id],
    queryFn: () => apiClient.getOrders(),
    enabled: !!user?.id,
  })

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <GlassCard className="text-center py-16">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Please Sign In
            </h1>
            <p className="text-gray-600 mb-6">
              You need to be signed in to view your order history.
            </p>
            <Link
              href="/auth/login"
              className="glass-button px-6 py-3 text-white bg-leaf-600 hover:bg-leaf-700 font-semibold"
            >
              Sign In
            </Link>
          </GlassCard>
        </div>
      </div>
    )
  }

  const orders = (ordersData as any)?.data || []
  const filteredOrders = selectedStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === selectedStatus)

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />
      case 'confirmed':
        return <CheckCircleIcon className="h-5 w-5 text-blue-500" />
      case 'preparing':
        return <ClockIcon className="h-5 w-5 text-orange-500" />
      case 'ready':
        return <TruckIcon className="h-5 w-5 text-green-500" />
      case 'delivered':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />
      case 'cancelled':
        return <XCircleIcon className="h-5 w-5 text-red-500" />
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'preparing': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'ready': return 'bg-green-100 text-green-800 border-green-200'
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200'
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <>
      <Head>
        <title>Order History - LeafyHealth</title>
        <meta name="description" content="View your order history and track current orders" />
      </Head>

      <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Order History
            </h1>
            <p className="text-gray-600">
              Track your orders and view your purchase history
            </p>
          </motion.div>

          {/* Status Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <GlassCard className="p-4">
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'all', label: 'All Orders', count: orders.length },
                  { value: 'pending', label: 'Pending', count: orders.filter(o => o.status === 'pending').length },
                  { value: 'confirmed', label: 'Confirmed', count: orders.filter(o => o.status === 'confirmed').length },
                  { value: 'preparing', label: 'Preparing', count: orders.filter(o => o.status === 'preparing').length },
                  { value: 'ready', label: 'Ready', count: orders.filter(o => o.status === 'ready').length },
                  { value: 'delivered', label: 'Delivered', count: orders.filter(o => o.status === 'delivered').length },
                ].map(status => (
                  <button
                    key={status.value}
                    onClick={() => setSelectedStatus(status.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedStatus === status.value
                        ? 'bg-leaf-600 text-white'
                        : 'glass-button text-gray-700 hover:bg-white/30'
                    }`}
                  >
                    {status.label} ({status.count})
                  </button>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* Orders List */}
          {isLoading ? (
            <LoadingSkeleton count={5} type="card" />
          ) : error ? (
            <ErrorFallback error={error} />
          ) : filteredOrders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <GlassCard className="text-center py-16">
                <ShoppingBagIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  {selectedStatus === 'all' ? 'No orders yet' : `No ${selectedStatus} orders`}
                </h3>
                <p className="text-gray-600 mb-8">
                  {selectedStatus === 'all' 
                    ? "You haven't placed any orders yet. Start shopping for fresh organic products!"
                    : `You don't have any ${selectedStatus} orders at the moment.`
                  }
                </p>
                <Link
                  href="/products"
                  className="inline-flex items-center px-6 py-3 glass-button text-white bg-leaf-600 hover:bg-leaf-700 font-semibold"
                >
                  Start Shopping
                </Link>
              </GlassCard>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              {filteredOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <GlassCard className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                      {/* Order Info */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-2">
                          <h3 className="text-lg font-semibold text-gray-800">
                            Order #{order.id.slice(-8)}
                          </h3>
                          <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            <span className="capitalize">{order.status}</span>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm text-gray-600">
                          <span>Placed on {formatDate(order.createdAt)}</span>
                          <span className="hidden sm:block">•</span>
                          <span>{order.items.length} items</span>
                          <span className="hidden sm:block">•</span>
                          <span className="font-medium text-gray-800">{formatPrice(order.total)}</span>
                        </div>
                      </div>

                      {/* Order Actions */}
                      <div className="mt-4 lg:mt-0 flex space-x-3">
                        <Link
                          href={`/order/${order.id}`}
                          className="glass-button px-4 py-2 text-leaf-600 hover:bg-leaf-100 text-sm font-medium"
                        >
                          View Details
                        </Link>
                        {order.status === 'delivered' && (
                          <button className="glass-button px-4 py-2 text-gray-600 hover:bg-gray-100 text-sm font-medium">
                            Reorder
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Order Items Preview */}
                    <div className="border-t pt-4">
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                        {order.items.slice(0, 6).map((item) => (
                          <div key={item.id} className="text-center">
                            <div className="relative w-16 h-16 mx-auto mb-2 rounded-lg overflow-hidden bg-gray-100">
                              {item.image ? (
                                <img
                                  src={`http://localhost:8080/api/image-management/serve/${item.image}`}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                  🥬
                                </div>
                              )}
                              {item.quantity > 1 && (
                                <div className="absolute -top-1 -right-1 bg-leaf-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                  {item.quantity}
                                </div>
                              )}
                            </div>
                            <p className="text-xs text-gray-600 truncate">
                              {item.name}
                            </p>
                          </div>
                        ))}
                        {order.items.length > 6 && (
                          <div className="text-center flex items-center justify-center">
                            <div className="w-16 h-16 glass-card rounded-lg flex items-center justify-center">
                              <span className="text-sm text-gray-600">
                                +{order.items.length - 6}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Delivery Info */}
                    {order.estimatedDelivery && (
                      <div className="mt-4 p-3 bg-leaf-50 border border-leaf-200 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <TruckIcon className="h-4 w-4 text-leaf-600" />
                          <span className="text-sm text-leaf-800">
                            {order.status === 'delivered' 
                              ? `Delivered on ${formatDate(order.estimatedDelivery)}`
                              : `Estimated delivery: ${formatDate(order.estimatedDelivery)}`
                            }
                          </span>
                        </div>
                      </div>
                    )}
                  </GlassCard>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </>
  )
}