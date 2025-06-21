import { ReactNode } from 'react'


interface SuperAdminLayoutProps {
  children: ReactNode
  title: string
  subtitle: string
  icon?: string
  showBackButton?: boolean
}

function SuperAdminLayoutContent({ 
  children, 
  title, 
  subtitle, 
  icon = "⚙️",
  showBackButton = true 
}: SuperAdminLayoutProps) {

  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{icon}</span>
                </div>
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                <p className="text-sm text-purple-600">{subtitle}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                System Status: <span className="text-green-600 font-medium">Operational</span>
              </div>
              {showBackButton && (
                <button 
                  onClick={() => window.location.href = '/'}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                >
                  Back to Dashboard
                </button>
              )}

            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              LeafyHealth Super Admin v1.1
            </p>
            <p className="text-sm text-gray-500">
              System Management Interface
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export function SuperAdminLayout(props: SuperAdminLayoutProps) {
  return <SuperAdminLayoutContent {...props} />
}