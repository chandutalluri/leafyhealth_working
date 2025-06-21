import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function CategoriesPage() {
  const categories = [
    { id: 1, name: 'Fresh Vegetables', icon: '🥬', description: 'Farm-fresh organic vegetables' },
    { id: 2, name: 'Organic Fruits', icon: '🍎', description: 'Sweet and nutritious fruits' },
    { id: 3, name: 'Dairy Products', icon: '🥛', description: 'Fresh milk, cheese, and yogurt' },
    { id: 4, name: 'Grains & Cereals', icon: '🌾', description: 'Healthy grains and cereals' },
    { id: 5, name: 'Herbs & Spices', icon: '🌿', description: 'Fresh herbs and aromatic spices' },
    { id: 6, name: 'Beverages', icon: '🥤', description: 'Healthy drinks and juices' }
  ];

  return (
    <>
      <Head>
        <title>Categories - LeafyHealth</title>
        <meta name="description" content="Browse our organic grocery categories" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-green-600">
              🌿 LeafyHealth
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/categories" className="text-green-600 font-semibold">
                Categories
              </Link>
              <Link href="/products" className="text-gray-700 hover:text-green-600">
                Products
              </Link>
            </nav>
          </div>
        </header>

        <main className="pt-16 pb-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
                Shop by Category
              </h1>
              <p className="text-xl text-gray-600">
                Discover fresh, organic products in every category
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category) => (
                <Link key={category.id} href={`/products?category=${category.id}`}>
                  <div className="bg-white/70 backdrop-blur-md border border-white/20 rounded-xl shadow-lg p-8 text-center hover:bg-white/80 transition-all duration-300 transform hover:scale-105 cursor-pointer group">
                    <div className="text-6xl mb-4">{category.icon}</div>
                    <h3 className="text-xl font-semibold text-gray-800 group-hover:text-green-600 transition-colors mb-3">
                      {category.name}
                    </h3>
                    <p className="text-gray-600">
                      {category.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}