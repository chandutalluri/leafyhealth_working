import { useState, useEffect } from 'react'
import { SuperAdminLayout } from '../components/layout/SuperAdminLayout'

interface InventoryStats {
  totalItems: number
  lowStockItems: number
  outOfStockItems: number
  totalValue: number
  restockAlerts: number
}

interface InventoryItem {
  id: number
  productId: number
  productName: string
  sku: string
  currentStock: number
  minimumStock: number
  maximumStock: number
  unitPrice: number
  totalValue: number
  location: string
  status: 'in-stock' | 'low-stock' | 'out-of-stock'
  lastUpdated: string
}

export default function InventoryManagementPage() {
  const [stats, setStats] = useState<InventoryStats>({
    totalItems: 0,
    lowStockItems: 0,
    outOfStockItems: 0,
    totalValue: 0,
    restockAlerts: 0
  })
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchInventoryData()
  }, [])

  const fetchInventoryData = async () => {
    try {
      setLoading(true)
      
      // Fetch from direct data endpoint (bypasses auth)
      const apiGateway = process.env.NEXT_PUBLIC_API_GATEWAY || 'http://localhost:8080';
      const response = await fetch(`${apiGateway}/api/inventory-management/inventory`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch inventory data')
      }
      
      const data = await response.json()
      
      // Calculate stats from real data
      const totalItems = data.length
      // Calculate stats from real data - adapt to actual database structure
      const lowStockItems = data.filter((item: any) => item.currentStock <= item.reorderLevel).length
      const outOfStockItems = data.filter((item: any) => item.currentStock === 0).length
      const totalValue = data.reduce((sum: number, item: any) => sum + (item.currentStock * (item.unitCost || 0)), 0)
      
      setStats({
        totalItems,
        lowStockItems,
        outOfStockItems,
        totalValue,
        restockAlerts: lowStockItems + outOfStockItems
      })
      
      setInventory(data)
      setError(null)
    } catch (err) {
      console.error('Error fetching inventory data:', err)
      setError('Failed to connect to inventory management service')
    } finally {
      setLoading(false)
    }
  }

  const updateStock = async (itemId: number, newStock: number) => {
    try {
      const apiGateway = process.env.NEXT_PUBLIC_API_GATEWAY || 'http://localhost:8080';
      const response = await fetch(`${apiGateway}/api/inventory-management/stock/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentStock: newStock })
      })
      
      if (response.ok) {
        fetchInventoryData() // Refresh data
      }
    } catch (err) {
      console.error('Error updating stock:', err)
    }
  }

  if (loading) {
    return (
      <SuperAdminLayout title="Inventory Management" subtitle="Monitor stock levels and warehouse operations">
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
    <SuperAdminLayout title="Inventory Management" subtitle="Monitor stock levels and warehouse operations">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-lg rounded-xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Inventory Overview</h2>
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
                    onClick={fetchInventoryData}
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
                      <p className="text-sm font-medium text-blue-600">Total Items</p>
                      <p className="text-2xl font-bold text-blue-900">{stats.totalItems}</p>
                    </div>
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">📦</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-yellow-600">Low Stock</p>
                      <p className="text-2xl font-bold text-yellow-900">{stats.lowStockItems}</p>
                    </div>
                    <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <span className="text-yellow-600 font-semibold">⚠️</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-red-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-red-600">Out of Stock</p>
                      <p className="text-2xl font-bold text-red-900">{stats.outOfStockItems}</p>
                    </div>
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                      <span className="text-red-600 font-semibold">❌</span>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600">Total Value</p>
                      <p className="text-2xl font-bold text-green-900">${stats.totalValue.toLocaleString()}</p>
                    </div>
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-green-600 font-semibold">💰</span>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-600">Restock Alerts</p>
                      <p className="text-2xl font-bold text-purple-900">{stats.restockAlerts}</p>
                    </div>
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-purple-600 font-semibold">🔔</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Inventory Items</h3>
                  <button 
                    onClick={fetchInventoryData}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Refresh Data
                  </button>
                </div>
                
                {inventory.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min/Max</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {inventory.slice(0, 10).map((item) => (
                          <tr key={item.id} className={item.status === 'out-of-stock' ? 'bg-red-50' : item.status === 'low-stock' ? 'bg-yellow-50' : ''}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.productName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.sku}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.currentStock}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.minimumStock}/{item.maximumStock}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.totalValue.toLocaleString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                item.status === 'in-stock' ? 'bg-green-100 text-green-800' :
                                item.status === 'low-stock' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {item.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.location}</td>
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
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No Inventory Items</h4>
                    <p className="text-gray-600 mb-4">
                      Start by adding products to your inventory system.
                    </p>
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      Add Inventory Item
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