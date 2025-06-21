import { Home, Users, Package, Truck, BarChart3 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/router'

export function OpsNavigation() {
  const router = useRouter();
  
  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Employee Management', href: '/employee-management', icon: Users },
    { name: 'Inventory Management', href: '/inventory-management', icon: Package },
    { name: 'Shipping & Delivery', href: '/shipping-delivery', icon: Truck },
    { name: 'Reports', href: '/reports', icon: BarChart3 },
  ]

  return (
    <nav className="w-64 bg-white shadow-lg border-r border-gray-200 h-full">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">🚚</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Operations</h2>
            <p className="text-xs text-gray-500">Delivery Management</p>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = router.pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center px-4 py-3 rounded-lg transition-colors mb-1
                ${isActive 
                  ? 'bg-orange-100 text-orange-700 border border-orange-200' 
                  : 'text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              <Icon className="h-5 w-5 mr-3" />
              {item.name}
            </Link>
          );
        })}
      </div>
    </nav>
  )
}