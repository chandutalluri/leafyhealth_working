import Head from 'next/head'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSubscriptionStore } from '@/lib/stores/subscriptionStore'
import { useAuthStore } from '@/lib/stores/auth'
import GlassCard from '@/components/ui/GlassCard'
import toast from 'react-hot-toast'
import { PlayIcon, PauseIcon, StopIcon, PencilIcon } from '@heroicons/react/24/outline'

export default function ManageSubscriptionsPage() {
  const [activeTab, setActiveTab] = useState('active')
  const { 
    userSubscriptions, 
    isLoading, 
    error, 
    fetchUserSubscriptions,
    pauseSubscription,
    resumeSubscription,
    cancelSubscription 
  } = useSubscriptionStore()
  const { user, isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchUserSubscriptions(user.id)
    }
  }, [isAuthenticated, user?.id])

  const filteredSubscriptions = userSubscriptions.filter(sub => sub.status === activeTab)

  const handlePauseSubscription = async (subscriptionId: string) => {
    try {
      await pauseSubscription(subscriptionId)
      toast.success('Subscription paused successfully!')
    } catch (error) {
      toast.error('Failed to pause subscription')
    }
  }

  const handleResumeSubscription = async (subscriptionId: string) => {
    try {
      await resumeSubscription(subscriptionId)
      toast.success('Subscription resumed successfully!')
    } catch (error) {
      toast.error('Failed to resume subscription')
    }
  }

  const handleCancelSubscription = async (subscriptionId: string) => {
    if (confirm('Are you sure you want to cancel this subscription? This action cannot be undone.')) {
      try {
        await cancelSubscription(subscriptionId)
        toast.success('Subscription cancelled successfully!')
      } catch (error) {
        toast.error('Failed to cancel subscription')
      }
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#22c55e'
      case 'paused': return '#f59e0b'
      case 'cancelled': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const getMealTypeIcon = (mealType) => {
    switch (mealType) {
      case 'breakfast': return '🥣'
      case 'lunch': return '🍛'
      case 'dinner': return '🍽️'
      case 'all': return '🍽️'
      default: return '🍽️'
    }
  }

  const handleSubscriptionAction = async (subscriptionId: string, action: string) => {
    try {
      if (action === 'pause') {
        await handlePauseSubscription(subscriptionId);
      } else if (action === 'resume') {
        await handleResumeSubscription(subscriptionId);
      } else if (action === 'cancel') {
        await handleCancelSubscription(subscriptionId);
      }
    } catch (error) {
      console.error(`Failed to ${action} subscription:`, error);
    }
  }

  return (
    <>
      <Head>
        <title>Manage Subscriptions - LeafyHealth</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div style={{ 
        minHeight: '100vh', 
        fontFamily: 'system-ui, -apple-system, sans-serif',
        background: 'linear-gradient(135deg, #f0fdf4, #dcfce7, #bbf7d0)',
        padding: '40px 20px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

          {/* Header */}
          <header style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginBottom: '60px',
            padding: '20px 0',
            borderBottom: '1px solid rgba(34, 197, 94, 0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '50px',
                height: '50px',
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px'
              }}>
                🌿
              </div>
              <div>
                <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#1f2937' }}>
                  LeafyHealth
                </h1>
                <p style={{ margin: 0, fontSize: '14px', color: '#22c55e', fontWeight: '500' }}>
                  Fresh & Organic
                </p>
              </div>
            </div>

            <nav style={{ display: 'flex', gap: '32px' }}>
              <a href="/" style={{ 
                textDecoration: 'none', 
                color: '#6b7280',
                fontWeight: '500'
              }}>
                Home
              </a>
              <a href="/products" style={{ 
                textDecoration: 'none', 
                color: '#6b7280',
                fontWeight: '500'
              }}>
                Products
              </a>
              <a href="/subscriptions" style={{ 
                textDecoration: 'none', 
                color: '#6b7280',
                fontWeight: '500'
              }}>
                Subscriptions
              </a>
              <a href="/account" style={{ 
                textDecoration: 'none', 
                color: '#6b7280',
                fontWeight: '500'
              }}>
                Account
              </a>
            </nav>
          </header>

          {/* Page Title */}
          <section style={{
            background: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '24px',
            padding: '40px',
            marginBottom: '40px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h1 style={{
                  fontSize: '36px',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  marginBottom: '12px'
                }}>
                  My Subscriptions
                </h1>
                <p style={{
                  fontSize: '18px',
                  color: '#6b7280',
                  margin: 0
                }}>
                  Manage your meal subscriptions and delivery schedules
                </p>
              </div>
              <a href="/subscriptions" style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '12px 24px',
                fontSize: '16px',
                fontWeight: '600',
                color: 'white',
                background: '#22c55e',
                textDecoration: 'none',
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgba(34, 197, 94, 0.3)'
              }}>
                + New Subscription
              </a>
            </div>
          </section>

          {/* Tabs */}
          <div style={{ marginBottom: '40px' }}>
            <div style={{ 
              display: 'flex', 
              gap: '8px',
              background: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '16px',
              padding: '8px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              width: 'fit-content'
            }}>
              {['active', 'paused', 'cancelled'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    background: activeTab === tab ? '#22c55e' : 'transparent',
                    color: activeTab === tab ? 'white' : '#6b7280',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    textTransform: 'capitalize'
                  }}
                >
                  {tab} ({userSubscriptions.filter(s => s.status === tab).length})
                </button>
              ))}
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <GlassCard className="p-6 mb-8">
              <div className="text-center text-red-600">
                <p className="text-lg font-semibold">Error Loading Subscriptions</p>
                <p className="text-sm mt-2">{error}</p>
                <button 
                  onClick={() => user?.id && fetchUserSubscriptions(user.id)}
                  className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Retry
                </button>
              </div>
            </GlassCard>
          )}

          {/* Subscriptions List */}
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{ 
                width: '60px', 
                height: '60px', 
                border: '4px solid #22c55e', 
                borderTop: '4px solid transparent', 
                borderRadius: '50%', 
                animation: 'spin 1s linear infinite',
                margin: '0 auto 20px'
              }}></div>
              <p style={{ color: '#6b7280', fontSize: '18px' }}>Loading subscriptions...</p>
            </div>
          ) : filteredSubscriptions.length === 0 ? (
            <div style={{
              background: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '24px',
              padding: '80px 40px',
              textAlign: 'center',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <div style={{ fontSize: '80px', marginBottom: '24px' }}>📋</div>
              <h3 style={{ 
                fontSize: '24px', 
                fontWeight: 'bold', 
                color: '#1f2937', 
                marginBottom: '16px' 
              }}>
                No {activeTab} subscriptions
              </h3>
              <p style={{ color: '#6b7280', fontSize: '18px', marginBottom: '32px' }}>
                {activeTab === 'active' 
                  ? 'You don\'t have any active subscriptions yet.' 
                  : `No ${activeTab} subscriptions found.`}
              </p>
              {activeTab === 'active' && (
                <a href="/subscriptions" style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '16px 32px',
                  fontSize: '18px',
                  fontWeight: '600',
                  color: 'white',
                  background: '#22c55e',
                  textDecoration: 'none',
                  borderRadius: '16px',
                  boxShadow: '0 4px 6px -1px rgba(34, 197, 94, 0.3)'
                }}>
                  Browse Meal Plans
                </a>
              )}
            </div>
          ) : (
            <div style={{ 
              display: 'grid', 
              gap: '24px' 
            }}>
              {filteredSubscriptions.map((subscription) => (
                <div key={subscription.id} style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '20px',
                  padding: '32px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  backdropFilter: 'blur(10px)'
                }}>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr 1fr auto', 
                    gap: '32px',
                    alignItems: 'center'
                  }}>

                    {/* Subscription Info */}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <span style={{ fontSize: '32px' }}>
                          {getMealTypeIcon((subscription as any).mealType || 'breakfast')}
                        </span>
                        <div>
                          <h3 style={{ 
                            fontSize: '20px', 
                            fontWeight: 'bold', 
                            color: '#1f2937',
                            margin: 0,
                            marginBottom: '4px'
                          }}>
                            {((subscription as any).mealType || 'breakfast').charAt(0).toUpperCase() + ((subscription as any).mealType || 'breakfast').slice(1)} Plan
                          </h3>
                          <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '4px 12px',
                            background: getStatusColor(subscription.status),
                            color: 'white',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '600',
                            textTransform: 'uppercase'
                          }}>
                            {subscription.status}
                          </div>
                        </div>
                      </div>
                      <p style={{ 
                        color: '#6b7280', 
                        fontSize: '14px',
                        margin: 0
                      }}>
                        Next delivery: {new Date(subscription.nextDelivery).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Dates */}
                    <div>
                      <h4 style={{ 
                        fontSize: '14px', 
                        fontWeight: '600', 
                        color: '#1f2937',
                        marginBottom: '8px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        Duration
                      </h4>
                      <p style={{ 
                        color: '#6b7280', 
                        fontSize: '16px',
                        margin: 0,
                        marginBottom: '4px'
                      }}>
                        <strong>Start:</strong> {formatDate(subscription.startDate)}
                      </p>
                      <p style={{ 
                        color: '#6b7280', 
                        fontSize: '16px',
                        margin: 0
                      }}>
                        <strong>End:</strong> {formatDate(subscription.endDate)}
                      </p>
                    </div>

                    {/* Price & Delivery */}
                    <div>
                      <h4 style={{ 
                        fontSize: '14px', 
                        fontWeight: '600', 
                        color: '#1f2937',
                        marginBottom: '8px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        Details
                      </h4>
                      <p style={{ 
                        color: '#22c55e', 
                        fontSize: '20px',
                        fontWeight: 'bold',
                        margin: 0,
                        marginBottom: '4px'
                      }}>
                        ₹{subscription.totalPrice}
                      </p>
                      <p style={{ 
                        color: '#6b7280', 
                        fontSize: '14px',
                        margin: 0
                      }}>
                        {(subscription as any).deliveryTime || 'Morning'}
                      </p>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {subscription.status === 'active' && (
                        <>
                          <button
                            onClick={() => handleSubscriptionAction(subscription.id, 'pause')}
                            style={{
                              background: '#f59e0b',
                              color: 'white',
                              border: 'none',
                              padding: '8px 16px',
                              borderRadius: '8px',
                              fontSize: '14px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            Pause
                          </button>
                          <button
                            onClick={() => handleCancelSubscription(subscription.id)}
                            style={{
                              background: '#ef4444',
                              color: 'white',
                              border: 'none',
                              padding: '8px 16px',
                              borderRadius: '8px',
                              fontSize: '14px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            Cancel
                          </button>
                        </>
                      )}

                      {subscription.status === 'paused' && (
                        <>
                          <button
                            onClick={() => handleSubscriptionAction(subscription.id, 'resume')}
                            style={{
                              background: '#22c55e',
                              color: 'white',
                              border: 'none',
                              padding: '8px 16px',
                              borderRadius: '8px',
                              fontSize: '14px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            Resume
                          </button>
                          <button
                            onClick={() => handleCancelSubscription(subscription.id)}
                            style={{
                              background: '#ef4444',
                              color: 'white',
                              border: 'none',
                              padding: '8px 16px',
                              borderRadius: '8px',
                              fontSize: '14px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            Cancel
                          </button>
                        </>
                      )}

                      <a 
                        href={`/subscriptions/${subscription.id}/schedule`}
                        style={{
                          background: '#6b7280',
                          color: 'white',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: '600',
                          textDecoration: 'none',
                          textAlign: 'center',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        View Schedule
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  )
}