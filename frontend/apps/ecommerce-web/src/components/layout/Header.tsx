import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCartIcon, 
  UserIcon, 
  Bars3Icon, 
  XMarkIcon, 
  MagnifyingGlassIcon,
  MapPinIcon,
  HeartIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid, BellIcon as BellSolid } from '@heroicons/react/24/solid';

import GlassCard from '@/components/ui/GlassCard';
import { useCartStore } from '@/lib/stores/useCartStore';
import { useBranchStore } from '@/lib/stores/useBranchStore';
import { useAuthStore } from '../../stores/authStore';
import { AuthButton } from '../ui/AuthButton';
import CartDrawer from '@/components/cart/CartDrawer';

export default function Header() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasNotifications, setHasNotifications] = useState(true);

  const { getTotalItems } = useCartStore();
  const { selectedBranch } = useBranchStore();
  const { isAuthenticated, user } = useAuthStore();

  const totalItems = getTotalItems();

  const navigationItems = [
    { href: '/', label: 'Home', active: router.pathname === '/' },
    { href: '/products', label: 'Products', active: router.pathname === '/products' },
    { href: '/categories', label: 'Categories', active: router.pathname === '/categories' },
    { href: '/subscriptions', label: 'Subscriptions', active: router.pathname === '/subscriptions' },
    { href: '/about', label: 'About', active: router.pathname === '/about' },
    { href: '/contact', label: 'Contact', active: router.pathname === '/contact' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleCartClick = () => {
    setIsCartOpen(true);
  };

  const handleProfileClick = () => {
    if (isAuthenticated) {
      router.push('/account');
    } else {
      router.push('/auth/login');
    }
  };

  return (
    <>
      <motion.header 
        className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-200/20"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo */}
            <motion.div 
              className="flex-shrink-0"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">శ్రీ</span>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold text-gray-900">Sri Venkateswara</h1>
                  <p className="text-sm text-gray-600">Organic Foods</p>
                </div>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navigationItems.map((item) => (
                <motion.div key={item.href} whileHover={{ scale: 1.05 }}>
                  <Link 
                    href={item.href}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      item.active 
                        ? 'bg-green-100 text-green-700 shadow-sm' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <form onSubmit={handleSearch} className="w-full">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products (English or Telugu)..."
                    className="w-full pl-10 pr-4 py-2 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                  />
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </form>
            </div>

            {/* Location Indicator */}
            {selectedBranch && (
              <motion.div 
                className="hidden xl:flex items-center space-x-2 text-sm text-gray-600 bg-white/50 rounded-lg px-3 py-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <MapPinIcon className="h-4 w-4 text-green-500" />
                <span className="font-medium">{selectedBranch.city}</span>
              </motion.div>
            )}

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3">
              
              {/* Notifications */}
              {isAuthenticated && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative p-2 text-gray-700 hover:text-green-600 transition-colors"
                  onClick={() => router.push('/notifications')}
                >
                  {hasNotifications ? (
                    <BellSolid className="h-6 w-6" />
                  ) : (
                    <BellIcon className="h-6 w-6" />
                  )}
                  {hasNotifications && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  )}
                </motion.button>
              )}

              {/* Wishlist */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-gray-700 hover:text-red-500 transition-colors"
                onClick={() => router.push('/wishlist')}
              >
                <HeartIcon className="h-6 w-6" />
              </motion.button>

              {/* Cart */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCartClick}
                className="relative p-2 text-gray-700 hover:text-green-600 transition-colors"
              >
                <ShoppingCartIcon className="h-6 w-6" />
                {totalItems > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium"
                  >
                    {totalItems > 99 ? '99+' : totalItems}
                  </motion.div>
                )}
              </motion.button>

              {/* Authentication */}
              <AuthButton />

              {/* Mobile Menu Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 text-gray-700 hover:text-green-600 transition-colors"
              >
                {isMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden border-t border-gray-200/20 bg-white/95 backdrop-blur-lg"
            >
              <div className="px-4 py-6 space-y-4">
                
                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="md:hidden">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search products..."
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                </form>

                {/* Mobile Navigation */}
                <nav className="space-y-2">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        item.active 
                          ? 'bg-green-100 text-green-700' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>

                {/* Mobile Auth Actions */}
                {!isAuthenticated && (
                  <div className="pt-4 border-t border-gray-200">
                    <div className="space-y-2">
                      <Link
                        href="/auth/login"
                        onClick={() => setIsMenuOpen(false)}
                        className="block w-full text-center bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/auth/register"
                        onClick={() => setIsMenuOpen(false)}
                        className="block w-full text-center border-2 border-green-600 text-green-600 py-3 rounded-lg font-medium hover:bg-green-50 transition-colors"
                      >
                        Sign Up
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}