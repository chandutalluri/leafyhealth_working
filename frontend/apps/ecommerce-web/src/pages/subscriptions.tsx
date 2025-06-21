import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { CheckIcon, StarIcon } from '@heroicons/react/24/solid';
import { ClockIcon, TruckIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import GlassCard from '@/components/ui/GlassCard';
import toast from 'react-hot-toast';
import { useSubscriptionStore } from '@/lib/stores/subscriptionStore';
import { useBranchStore } from '@/lib/stores/useBranchStore';
import { useAuthStore } from '@/lib/stores/auth';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  duration: string;
  description: string;
  features: string[];
  popular?: boolean;
  savings?: string;
}

const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'weekly',
    name: 'Weekly Fresh Box',
    price: 399,
    originalPrice: 499,
    duration: 'per week',
    description: 'Perfect for small families. Fresh organic produce delivered weekly.',
    features: [
      '5-7 varieties of seasonal vegetables',
      '3-4 types of fresh fruits',
      'Free delivery within city',
      'Flexible pause/resume',
      '24/7 customer support'
    ],
    savings: 'Save ₹100 weekly'
  },
  {
    id: 'monthly',
    name: 'Monthly Wellness Plan',
    price: 1299,
    originalPrice: 1699,
    duration: 'per month',
    description: 'Complete nutrition for medium families with premium organic selection.',
    features: [
      '10-12 varieties of seasonal vegetables',
      '6-8 types of fresh fruits',
      '2 kg premium grains & pulses',
      'Free delivery & express options',
      'Nutrition consultation included',
      'Recipe suggestions & meal planning',
      'Priority customer support'
    ],
    popular: true,
    savings: 'Save ₹400 monthly'
  },
  {
    id: 'quarterly',
    name: 'Quarterly Family Pack',
    price: 3599,
    originalPrice: 4799,
    duration: 'per quarter',
    description: 'Best value for large families. Comprehensive organic nutrition package.',
    features: [
      '15+ varieties of seasonal vegetables',
      '10+ types of fresh fruits',
      '5 kg premium grains & pulses',
      '2 kg organic dairy products',
      'Free delivery & same-day options',
      'Personal nutrition consultant',
      'Recipe books & cooking classes',
      'Family health tracking',
      'Dedicated account manager'
    ],
    savings: 'Save ₹1200 quarterly'
  }
];

export default function Subscriptions() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { 
    plans, 
    isLoading, 
    error, 
    fetchPlans, 
    createSubscription, 
    setSelectedPlan: setStorePlan 
  } = useSubscriptionStore();
  
  const { selectedBranch, detectLocation } = useBranchStore();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    fetchPlans();
    if (!selectedBranch) {
      detectLocation();
    }
  }, []);

  const handleSubscribe = async (planId: string) => {
    if (!isAuthenticated) {
      toast.error('Please login to create a subscription');
      window.location.href = '/auth/login';
      return;
    }

    if (!selectedBranch) {
      toast.error('Please select a delivery location first');
      return;
    }

    setSelectedPlan(planId);
    setIsProcessing(true);

    try {
      await createSubscription(planId, {
        branchId: selectedBranch.id,
        deliveryAddress: {
          street: 'Auto-detected location',
          city: selectedBranch.city,
          state: selectedBranch.state,
          zipCode: (selectedBranch as any).pincode || selectedBranch.zipCode || '',
          phone: user?.phone || ''
        }
      });
      
      toast.success('Subscription started successfully! Welcome to LeafyHealth family.');
      setTimeout(() => {
        window.location.href = '/subscriptions/manage';
      }, 1500);
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error('Failed to start subscription. Please try again.');
    } finally {
      setIsProcessing(false);
      setSelectedPlan(null);
    }
  };

  return (
    <>
      <Head>
        <title>Subscription Plans - LeafyHealth</title>
        <meta name="description" content="Choose from our flexible subscription plans for regular delivery of fresh organic groceries" />
      </Head>

      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Subscription Plans
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the perfect plan for your family's organic nutrition needs. 
              Fresh, healthy, and delivered right to your doorstep.
            </p>
          </motion.div>

          {/* Benefits Section */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            {[
              {
                icon: <TruckIcon className="h-8 w-8" />,
                title: 'Free Delivery',
                description: 'No delivery charges on all subscription plans'
              },
              {
                icon: <ClockIcon className="h-8 w-8" />,
                title: 'Flexible Scheduling',
                description: 'Pause, resume, or modify your plan anytime'
              },
              {
                icon: <ShieldCheckIcon className="h-8 w-8" />,
                title: '100% Organic',
                description: 'Certified organic produce from trusted farms'
              }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
              >
                <GlassCard className="p-6 text-center h-full">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                    {benefit.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {benefit.description}
                  </p>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>

          {/* Subscription Plans */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {(plans.length > 0 ? plans : subscriptionPlans).map((plan, index) => (
              <motion.div
                key={plan.id}
                className="relative"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.2, duration: 0.8 }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-1">
                      <StarIcon className="h-4 w-4" />
                      <span>Most Popular</span>
                    </div>
                  </div>
                )}

                <GlassCard className={`p-8 h-full ${plan.popular ? 'ring-2 ring-green-500 ring-opacity-50' : ''}`}>
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {plan.description}
                    </p>

                    <div className="mb-4">
                      {plan.originalPrice && (
                        <div className="text-sm text-gray-500 line-through">
                          ₹{plan.originalPrice} {plan.duration}
                        </div>
                      )}
                      <div className="text-4xl font-bold text-gray-800">
                        ₹{plan.price}
                        <span className="text-lg font-normal text-gray-600">
                          /{plan.duration.split(' ')[1]}
                        </span>
                      </div>
                      {plan.savings && (
                        <div className="text-sm text-green-600 font-medium mt-1">
                          {plan.savings}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start space-x-3">
                        <CheckIcon className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <motion.button
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={isProcessing && selectedPlan === plan.id}
                    className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700'
                        : 'bg-white border-2 border-green-500 text-green-600 hover:bg-green-50'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                    whileHover={{ scale: isProcessing && selectedPlan === plan.id ? 1 : 1.02 }}
                    whileTap={{ scale: isProcessing && selectedPlan === plan.id ? 1 : 0.98 }}
                  >
                    {isProcessing && selectedPlan === plan.id ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-2"></div>
                        Processing...
                      </div>
                    ) : (
                      'Start Subscription'
                    )}
                  </motion.button>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <GlassCard className="p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Frequently Asked Questions
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  {
                    question: 'Can I pause my subscription?',
                    answer: 'Yes, you can pause your subscription anytime from your account dashboard. Resume whenever you want.'
                  },
                  {
                    question: 'How fresh are the products?',
                    answer: 'All products are harvested within 24-48 hours of delivery. We guarantee maximum freshness.'
                  },
                  {
                    question: 'Can I customize my box?',
                    answer: 'Yes, you can customize your selection based on your preferences and dietary requirements.'
                  },
                  {
                    question: 'What if I\'m not satisfied?',
                    answer: 'We offer 100% satisfaction guarantee. Full refund or replacement for any unsatisfactory products.'
                  },
                  {
                    question: 'Do you deliver on weekends?',
                    answer: 'Yes, we deliver 7 days a week. You can choose your preferred delivery time slots.'
                  },
                  {
                    question: 'Is there a minimum commitment?',
                    answer: 'No minimum commitment required. You can cancel anytime without any cancellation fees.'
                  }
                ].map((faq, index) => (
                  <div key={index} className="space-y-2">
                    <h3 className="font-semibold text-gray-800">{faq.question}</h3>
                    <p className="text-gray-600 text-sm">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* Contact Section */}
          <motion.div
            className="text-center mt-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Need Help Choosing?
            </h2>
            <p className="text-gray-600 mb-6">
              Our nutrition experts are here to help you select the perfect plan for your family.
            </p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              whileHover={{ scale: 1.05 }}
            >
              <a
                href="/contact"
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-full font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-200"
              >
                Contact Our Experts
              </a>
              <a
                href="tel:+919876543210"
                className="bg-white border-2 border-green-500 text-green-600 px-8 py-3 rounded-full font-medium hover:bg-green-50 transition-all duration-200"
              >
                Call: +91 98765 43210
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
}