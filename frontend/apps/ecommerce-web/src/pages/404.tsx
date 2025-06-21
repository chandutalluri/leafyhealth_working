import Link from 'next/link';

export default function Custom404() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-emerald-600 mb-4">404</h1>
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">Page Not Found</h2>
          <p className="text-lg text-gray-600 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link href="/" className="inline-block bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors">
            Return Home
          </Link>
          
          <div className="text-sm text-gray-500">
            <p>Or try searching for products:</p>
            <Link href="/products" className="text-emerald-600 hover:text-emerald-700 font-medium">
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}