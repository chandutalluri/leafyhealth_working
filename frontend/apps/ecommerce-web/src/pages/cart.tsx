import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import GlassCard from '@/components/ui/GlassCard';

export default function Cart() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Fresh Tomatoes',
      name_telugu: 'టమాటోలు',
      price: 40.00,
      quantity: 2,
      image_url: null
    },
    {
      id: 2,
      name: 'Organic Bananas',
      name_telugu: 'అరటికాయలు',
      price: 60.00,
      quantity: 1,
      image_url: null
    }
  ]);

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      setCartItems(items => items.filter(item => item.id !== id));
    } else {
      setCartItems(items => 
        items.map(item => 
          item.id === id ? { ...item, quantity } : item
        )
      );
    }
  };

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <>
      <Head>
        <title>Shopping Cart - Sri Venkateswara Organic Foods</title>
        <meta name="description" content="Review your selected items and proceed to checkout" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
        <Header />
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="pt-24 pb-16 px-4"
        >
          <div className="max-w-4xl mx-auto">
            
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-4xl font-bold text-gray-900 mb-8"
            >
              Shopping Cart
            </motion.h1>

            {cartItems.length === 0 ? (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <GlassCard className="p-12 text-center">
                  <div className="text-6xl mb-6">🛒</div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your cart is empty</h2>
                  <p className="text-gray-600 mb-8">Add some fresh products to get started!</p>
                  <Link 
                    href="/products"
                    className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  >
                    Start Shopping
                  </Link>
                </GlassCard>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Cart Items */}
                <div className="lg:col-span-2">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="space-y-4"
                  >
                    {cartItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                      >
                        <GlassCard className="p-6">
                          <div className="flex items-center space-x-4">
                            <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center text-3xl">
                              🥬
                            </div>
                            
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900">{item.name}</h3>
                              {item.name_telugu && (
                                <p className="text-sm text-gray-500">{item.name_telugu}</p>
                              )}
                              <p className="text-lg font-bold text-green-600">
                                ₹{item.price.toFixed(2)}
                              </p>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                              >
                                -
                              </button>
                              <span className="font-semibold w-8 text-center">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center hover:bg-green-700 transition-colors"
                              >
                                +
                              </button>
                            </div>
                            
                            <div className="text-right">
                              <p className="font-bold text-gray-900">
                                ₹{(item.price * item.quantity).toFixed(2)}
                              </p>
                              <button
                                onClick={() => updateQuantity(item.id, 0)}
                                className="text-red-500 hover:text-red-700 text-sm"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </GlassCard>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>

                {/* Order Summary */}
                <div>
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                  >
                    <GlassCard className="p-6 sticky top-24">
                      <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                      
                      <div className="space-y-3 mb-6">
                        <div className="flex justify-between">
                          <span>Subtotal ({cartItems.length} items)</span>
                          <span>₹{total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Delivery Fee</span>
                          <span className="text-green-600">Free</span>
                        </div>
                        <div className="border-t pt-3">
                          <div className="flex justify-between text-lg font-bold">
                            <span>Total</span>
                            <span>₹{total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <Link 
                        href="/checkout"
                        className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors block text-center"
                      >
                        Proceed to Checkout
                      </Link>
                      
                      <Link 
                        href="/products"
                        className="w-full bg-white text-green-600 py-3 rounded-lg font-semibold border-2 border-green-600 hover:bg-green-50 transition-colors block text-center mt-3"
                      >
                        Continue Shopping
                      </Link>
                    </GlassCard>
                  </motion.div>
                </div>

              </div>
            )}

          </div>
        </motion.div>

        <Footer />
      </div>
    </>
  );
}