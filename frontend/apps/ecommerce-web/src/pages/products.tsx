import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { apiClient } from '@/lib/api';
import { useBranchStore } from '@/lib/stores/useBranchStore';
import { useCartStore } from '@/lib/stores/useCartStore';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import GlassCard from '@/components/ui/GlassCard';
import BranchSelectorModal from '@/components/modals/BranchSelectorModal';
import { formatPrice } from '@/lib/utils';
import { ShoppingCartIcon, MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function ProductsPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>(
    (router.query.category as string) || 'all'
  );
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('name');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const { selectedBranch } = useBranchStore();
  // Will connect to cart store later
  const addItem = (item: any) => {
    console.log('Adding to cart:', item);
  };

  // Fetch products with filters
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['products', searchTerm, selectedCategory, selectedBranch?.id],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        if (searchTerm) params.append('search', searchTerm);
        if (selectedCategory && selectedCategory !== 'all') params.append('category', selectedCategory);
        if (selectedBranch?.id) params.append('branchId', selectedBranch.id);

        return await apiClient.getProducts(params);
      } catch (error) {
        return { data: [] };
      }
    },
    retry: false,
  });

  // Fetch categories for filter dropdown
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        return await apiClient.getCategories();
      } catch (error) {
        return { data: [] };
      }
    },
    retry: false,
  });

  const handleAddToCart = (product: any) => {
    if (!selectedBranch) {
      toast.error('Please select a delivery location first');
      return;
    }

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || '',
      category: product.category,
      branchId: selectedBranch.id,
      maxQuantity: product.stockQuantity,
    });

    toast.success(`${product.name} added to cart!`);
  };

  return (
    <>
      <Head>
        <title>Products - LeafyHealth</title>
        <meta name="description" content="Browse our wide selection of fresh organic groceries, vegetables, fruits and healthy products." />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <Header />

        <main className="pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
                Fresh Organic Products
              </h1>
              <p className="text-xl text-gray-600">
                Discover our premium selection of organic groceries
              </p>
            </motion.div>

            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <GlassCard className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Search */}
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                    />
                  </div>

                  {/* Category Filter */}
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-full focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                  >
                    <option value="">All Categories</option>
                    {(categories as any)?.data?.map((category: any) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>

                  {/* Sort */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-full focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                  >
                    <option value="name">Sort by Name</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="created_desc">Newest First</option>
                  </select>

                  {/* Price Range */}
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min $"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                      className="w-1/2 px-3 py-2 border border-gray-200 rounded-full focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/80 backdrop-blur-sm text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Max $"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                      className="w-1/2 px-3 py-2 border border-gray-200 rounded-full focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/80 backdrop-blur-sm text-sm"
                    />
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            {/* Products Grid */}
            {productsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="loading-skeleton h-80 rounded-xl" />
                ))}
              </div>
            ) : (products as any)?.data?.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {(products as any).data.map((product: any, index: number) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <GlassCard className="product-card group">
                      <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
                        {product.image ? (
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-green-100 to-emerald-100">
                            🥬
                          </div>
                        )}
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <h3 className="font-semibold text-gray-800 group-hover:text-green-600 transition-colors line-clamp-2">
                            {product.name}
                          </h3>
                          {product.organic && (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex-shrink-0 ml-2">
                              Organic
                            </span>
                          )}
                        </div>

                        {product.description && (
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {product.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between pt-2">
                          <div className="space-y-1">
                            <div className="text-lg font-bold text-green-600">
                              ${(product.price || 0).toFixed(2)}
                            </div>
                            {product.unit && (
                              <div className="text-xs text-gray-500">
                                per {product.unit}
                              </div>
                            )}
                          </div>

                          <button
                            onClick={() => handleAddToCart(product)}
                            className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-green-600 transition-colors transform hover:scale-105"
                          >
                            <ShoppingCartIcon className="h-4 w-4" />
                            Add
                          </button>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-center py-16"
              >
                <GlassCard className="p-12 max-w-md mx-auto">
                  <div className="text-6xl mb-6">🔍</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">No Products Found</h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your search criteria or browse our categories.
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('');
                      setPriceRange({ min: '', max: '' });
                    }}
                    className="btn-primary"
                  >
                    Clear Filters
                  </button>
                </GlassCard>
              </motion.div>
            )}

            {/* Load More Button */}
            {(products as any)?.data?.length > 0 && (products as any)?.hasMore && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-center mt-12"
              >
                <button className="btn-secondary">
                  Load More Products
                </button>
              </motion.div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}