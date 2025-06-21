import { useState, useEffect } from 'react'

interface Product {
  id: number
  name: string
  price: number
  category: string
  description: string
  image: string
  inStock: boolean
  currency?: string
  unit?: string
  origin?: string
}

interface Category {
  id: number
  name: string
  description: string
  icon: string
}

export default function MobileEcommerce() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        // Mock data for demonstration
        const mockProducts = [
          { id: 1, name: 'Fresh Apples', price: 120, category: 'Fruits', description: 'Crisp red apples', image: '🍎', inStock: true },
          { id: 2, name: 'Organic Spinach', price: 45, category: 'Vegetables', description: 'Fresh green spinach', image: '🥬', inStock: true }
        ]
        const mockCategories = [
          { id: 1, name: 'Fruits', description: 'Fresh fruits', icon: '🍎' },
          { id: 2, name: 'Vegetables', description: 'Fresh vegetables', icon: '🥬' }
        ]
        setProducts(mockProducts)
        setCategories(mockCategories)
      } catch (error) {
        console.error('Error loading mobile app data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50">
      {/* Mobile Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">L</span>
              </div>
              <div className="ml-2">
                <h1 className="text-lg font-bold text-gray-900">LeafyHealth</h1>
                <p className="text-xs text-green-600">Mobile Commerce</p>
              </div>
            </div>

            <button className="flex items-center space-x-2 bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-200">
              <span className="text-sm text-gray-500">📍</span>
              <span className="text-sm font-medium text-gray-700">Mumbai, MH</span>
            </button>

            <div className="flex space-x-2">
              <button className="p-2 bg-white rounded-lg shadow-sm border border-gray-200">
                <span className="text-lg">❤️</span>
              </button>
              <button className="p-2 bg-white rounded-lg shadow-sm border border-gray-200">
                <span className="text-lg">🛒</span>
              </button>
              <button className="p-2 bg-white rounded-lg shadow-sm border border-gray-200">
                <span className="text-lg">👤</span>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search fresh groceries..."
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
          </div>
        </div>
      </header>

      {/* Categories */}
      <div className="px-4 py-4">
        <div className="flex space-x-4 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category.id}
              className="flex-shrink-0 bg-white rounded-xl px-4 py-2 shadow-sm border border-gray-200 text-sm font-medium text-gray-700 hover:bg-green-50 hover:border-green-200"
            >
              {category.icon} {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="px-4 pb-20">
        <div className="grid grid-cols-2 gap-4">
          {(products || []).map(product => (
            <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4">
                <div className="text-4xl mb-2 text-center">{product.image}</div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate">{product.name}</h3>
                <p className="text-xs text-gray-500 mb-2 h-8 overflow-hidden">{product.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-green-600">₹{product.price}</span>
                    {product.inStock ? (
                      <span className="text-xs text-green-500 font-medium">In Stock</span>
                    ) : (
                      <span className="text-xs text-red-500 font-medium">Out of Stock</span>
                    )}
                  </div>
                  <button className="bg-green-600 text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-green-700">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="grid grid-cols-4 gap-1 px-4 py-2">
          <button className="flex flex-col items-center py-2">
            <span className="text-lg text-green-600">🏪</span>
            <span className="text-xs text-green-600 font-medium mt-1">Shop</span>
          </button>
          
          <button className="flex flex-col items-center py-2">
            <span className="text-lg text-gray-400">🔍</span>
            <span className="text-xs text-gray-400 mt-1">Search</span>
          </button>
          
          <button className="flex flex-col items-center py-2">
            <span className="text-lg text-gray-400">🛒</span>
            <span className="text-xs text-gray-400 mt-1">Cart</span>
          </button>
          
          <button className="flex flex-col items-center py-2">
            <span className="text-lg text-gray-400">👤</span>
            <span className="text-xs text-gray-400 mt-1">Profile</span>
          </button>
        </div>
      </div>
    </div>
  )
}