import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import GlassCard from '@/components/ui/GlassCard';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';

interface Product {
  id: number;
  name: string;
  name_telugu?: string;
  price: number;
  category_id: number;
  image_url?: string;
  stock_quantity: number;
  is_featured: boolean;
}

interface Category {
  id: number;
  name: string;
  description?: string;
  image_url?: string;
  product_count?: number;
}

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch('/api/products?featured=true&limit=8'),
          fetch('/api/categories?limit=6')
        ]);

        if (productsRes.ok) {
          const productsData = await productsRes.json();
          setFeaturedProducts(productsData);
        }

        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json();
          setCategories(categoriesData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getCategoryIcon = (categoryName: string) => {
    const icons: { [key: string]: string } = {
      'vegetables': '🥬',
      'fruits': '🍎',
      'dairy': '🥛',
      'grains': '🌾',
      'spices': '🌶️',
      'snacks': '🍿',
      'beverages': '🥤',
      'meat': '🥩',
      'seafood': '🐟',
      'bakery': '🍞',
      'pulses': '🫘',
      'oils': '🫒'
    };
    return icons[categoryName.toLowerCase()] || '🛒';
  };

  return (
    <>
      <Head>
        <title>Sri Venkateswara Organic Foods - Authentic Telugu Groceries</title>
        <meta name="description" content="Premium Telugu groceries and organic foods delivered across Andhra Pradesh. Fresh vegetables, authentic spices, and traditional products." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
        <Header />
        
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="pt-24 pb-16 px-4"
        >
          <div className="max-w-7xl mx-auto text-center">
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
            >
              Authentic Telugu{' '}
              <span className="text-green-600 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Groceries
              </span>
              <br />Delivered Fresh
            </motion.h1>
            
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
            >
              Premium quality Telugu groceries, organic vegetables, traditional spices, and authentic regional products delivered across Andhra Pradesh from our 5 branch locations.
            </motion.p>
            
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link 
                href="/products"
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Shop Now
              </Link>
              <Link 
                href="/categories"
                className="bg-white/70 backdrop-blur-sm text-green-600 px-8 py-4 rounded-2xl font-semibold border-2 border-green-600 hover:bg-green-50 transition-all duration-300"
              >
                Browse Categories
              </Link>
            </motion.div>
          </div>
        </motion.section>

        {/* Stats Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="py-16 px-4"
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { number: "30min", label: "Fast Delivery", icon: "🚚" },
                { number: "100%", label: "Organic Fresh", icon: "🌱" },
                { number: "24/7", label: "Customer Support", icon: "📞" }
              ].map((stat, index) => (
                <GlassCard key={index} className="text-center p-8">
                  <div className="text-4xl mb-4">{stat.icon}</div>
                  <div className="text-3xl font-bold text-green-600 mb-2">{stat.number}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </GlassCard>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Categories Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.8 }}
          className="py-16 px-4 bg-white/30"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Shop by Category</h2>
              <p className="text-xl text-gray-600">Explore our wide range of fresh, organic products</p>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {[...Array(6)].map((_, i) => (
                  <LoadingSkeleton key={i} className="h-32" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {Array.isArray(categories) && categories.map((category, index) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 + index * 0.1, duration: 0.5 }}
                  >
                    <Link href={`/categories?id=${category.id}`}>
                      <GlassCard className="p-6 text-center group cursor-pointer hover:scale-105 transition-all duration-300">
                        <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                          {getCategoryIcon(category.name)}
                        </div>
                        <h3 className="font-semibold text-gray-900 text-sm">{category.name}</h3>
                        {category.product_count && (
                          <p className="text-xs text-gray-500 mt-1">{category.product_count} items</p>
                        )}
                      </GlassCard>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.section>

        {/* Featured Products Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="py-16 px-4"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Products</h2>
              <p className="text-xl text-gray-600">Fresh picks from our local suppliers</p>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <LoadingSkeleton key={i} className="h-80" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.isArray(featuredProducts) && featuredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.6 + index * 0.1, duration: 0.5 }}
                  >
                    <Link href={`/product/${product.id}`}>
                      <GlassCard className="group cursor-pointer overflow-hidden hover:scale-105 transition-all duration-300">
                        <div className="aspect-square bg-gradient-to-br from-green-100 to-emerald-100 relative overflow-hidden">
                          {product.image_url ? (
                            <img 
                              src={product.image_url} 
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-6xl">
                              🥬
                            </div>
                          )}
                          {product.stock_quantity < 10 && (
                            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                              Low Stock
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-green-600 transition-colors">
                            {product.name}
                          </h3>
                          {product.name_telugu && (
                            <p className="text-sm text-gray-500 mb-2">{product.name_telugu}</p>
                          )}
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-green-600">
                              ₹{product.price.toFixed(2)}
                            </span>
                            <button className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-700 transition-colors">
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      </GlassCard>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.0, duration: 0.8 }}
          className="py-16 px-4 bg-gradient-to-r from-green-600 to-emerald-600"
        >
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-4xl font-bold mb-4">Ready to Start Shopping?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of satisfied customers who trust us for their daily grocery needs
            </p>
            <Link 
              href="/products"
              className="bg-white text-green-600 px-8 py-4 rounded-2xl font-semibold hover:bg-gray-100 transition-colors duration-300 inline-block"
            >
              Start Shopping Now
            </Link>
          </div>
        </motion.section>

        <Footer />
      </div>
    </>
  );
}