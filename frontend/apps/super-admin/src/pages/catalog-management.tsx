import { useState, useEffect } from 'react'
import { SuperAdminLayout } from '../components/layout/SuperAdminLayout'

interface CatalogStats {
  totalProducts: number
  activeProducts: number
  pendingProducts: number
  totalCategories: number
  recentProducts: any[]
}

interface Product {
  id: number
  name: string
  category: string
  price: number
  status: 'active' | 'inactive' | 'pending'
  createdAt: string
}

export default function CatalogManagementPage() {
  const [stats, setStats] = useState<CatalogStats>({
    totalProducts: 0,
    activeProducts: 0,
    pendingProducts: 0,
    totalCategories: 0,
    recentProducts: []
  })
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCatalogData()
  }, [])

  const fetchCatalogData = async () => {
    try {
      setLoading(true)
      
      // Fetch from direct data endpoint (bypasses auth)
      const apiGateway = process.env.NEXT_PUBLIC_API_GATEWAY || 'http://localhost:8080';
      const response = await fetch(`${apiGateway}/api/catalog-management/products`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch catalog data')
      }
      
      const data = await response.json()
      
      // Calculate stats from real data
      const totalProducts = data.length
      const activeProducts = data.filter((p: Product) => p.status === 'active').length
      const pendingProducts = data.filter((p: Product) => p.status === 'pending').length
      
      setStats({
        totalProducts,
        activeProducts,
        pendingProducts,
        totalCategories: new Set(data.map((p: Product) => p.category)).size,
        recentProducts: data.slice(0, 5)
      })
      
      setProducts(data)
      setError(null)
    } catch (err) {
      console.error('Error fetching catalog data:', err)
      setError('Failed to connect to catalog management service')
    } finally {
      setLoading(false)
    }
  }

  const createProduct = async (productData: Partial<Product>) => {
    try {
      const apiGateway = process.env.NEXT_PUBLIC_API_GATEWAY || 'http://localhost:8080';
      const response = await fetch(`${apiGateway}/api/catalog-management/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData)
      })
      
      if (response.ok) {
        fetchCatalogData() // Refresh data
      }
    } catch (err) {
      console.error('Error creating product:', err)
    }
  }

  if (loading) {
    return (
      <SuperAdminLayout title="Catalog Management" subtitle="Manage product catalog and categories">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white shadow-lg rounded-xl border border-gray-100 p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="grid grid-cols-3 gap-4">
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
    <SuperAdminLayout title="Catalog Management" subtitle="Manage product catalog and categories">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-lg rounded-xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Product Catalog</h2>
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
                    onClick={fetchCatalogData}
                    className="text-red-800 text-sm underline mt-2"
                  >
                    Retry Connection
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600">Total Products</p>
                      <p className="text-2xl font-bold text-blue-900">{stats.totalProducts}</p>
                    </div>
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">📦</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600">Active Products</p>
                      <p className="text-2xl font-bold text-green-900">{stats.activeProducts}</p>
                    </div>
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-green-600 font-semibold">✅</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-600">Pending Review</p>
                      <p className="text-2xl font-bold text-orange-900">{stats.pendingProducts}</p>
                    </div>
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                      <span className="text-orange-600 font-semibold">⏳</span>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-600">Categories</p>
                      <p className="text-2xl font-bold text-purple-900">{stats.totalCategories}</p>
                    </div>
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-purple-600 font-semibold">🏷️</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Recent Products</h3>
                  <button 
                    onClick={() => createProduct({ name: 'New Product', category: 'General', price: 0, status: 'pending' })}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add Product
                  </button>
                </div>
                
                {products.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {products.slice(0, 10).map((product) => (
                          <tr key={product.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.price}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                product.status === 'active' ? 'bg-green-100 text-green-800' :
                                product.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {product.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(product.createdAt).toLocaleDateString()}
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
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No Products Found</h4>
                    <p className="text-gray-600 mb-4">
                      Start by adding your first product to the catalog.
                    </p>
                    <button 
                      onClick={() => createProduct({ name: 'First Product', category: 'General', price: 0, status: 'pending' })}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add First Product
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