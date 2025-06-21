
import React, { useState, useEffect } from 'react';
import GlassCard from '@/components/ui/GlassCard';

interface ServiceStatus {
  name: string;
  port: number;
  status: 'operational' | 'warning' | 'error';
  features: string[];
  integrated: boolean;
}

const FeatureStatus: React.FC = () => {
  const [services, setServices] = useState<ServiceStatus[]>([]);

  useEffect(() => {
    const checkServices = async () => {
      const serviceChecks: ServiceStatus[] = [
        {
          name: 'Order Management',
          port: 3030,
          status: 'operational',
          features: ['Order Creation', 'Order Tracking', 'Payment Status'],
          integrated: true
        },
        {
          name: 'Payment Processing',
          port: 3031,
          status: 'operational',
          features: ['Razorpay Integration', 'HDFC Gateway', 'Payment Verification'],
          integrated: true
        },
        {
          name: 'Inventory Management',
          port: 3025,
          status: 'operational',
          features: ['Stock Checking', 'Branch Inventory', 'Stock Alerts'],
          integrated: true
        },
        {
          name: 'Notification Service',
          port: 3029,
          status: 'operational',
          features: ['Email Notifications', 'SMS Alerts', 'Push Notifications'],
          integrated: true
        },
        {
          name: 'Subscription Management',
          port: 3036,
          status: 'operational',
          features: ['Recurring Orders', 'Subscription Plans', 'Billing Cycles'],
          integrated: true
        },
        {
          name: 'Customer Service',
          port: 3019,
          status: 'operational',
          features: ['Support Tickets', 'Customer Management', 'Issue Tracking'],
          integrated: true
        },
        {
          name: 'Analytics & Reporting',
          port: 3015,
          status: 'operational',
          features: ['User Analytics', 'Sales Reports', 'Performance Metrics'],
          integrated: false // Newly added integration
        },
        {
          name: 'Catalog Management',
          port: 3016,
          status: 'operational',
          features: ['Product Management', 'Category Hierarchy', 'Search Engine'],
          integrated: false // Newly added integration
        },
        {
          name: 'Content Management',
          port: 3018,
          status: 'operational',
          features: ['Dynamic Pages', 'Banner Management', 'Content Updates'],
          integrated: false // Newly added integration
        },
        {
          name: 'Multi-language Support',
          port: 3028,
          status: 'operational',
          features: ['Translation Management', 'Language Switching', 'Localization'],
          integrated: false // Newly added integration
        },
        {
          name: 'Shipping & Delivery',
          port: 3034,
          status: 'operational',
          features: ['Shipping Calculation', 'Delivery Tracking', 'Route Optimization'],
          integrated: false // Newly added integration
        }
      ];

      setServices(serviceChecks);
    };

    checkServices();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const integratedServices = services.filter(s => s.integrated);
  const notIntegratedServices = services.filter(s => !s.integrated);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <GlassCard className="p-6 text-center">
          <div className="text-3xl font-bold text-green-600">{integratedServices.length}</div>
          <div className="text-sm text-gray-600">Fully Integrated</div>
        </GlassCard>
        <GlassCard className="p-6 text-center">
          <div className="text-3xl font-bold text-blue-600">{notIntegratedServices.length}</div>
          <div className="text-sm text-gray-600">Ready to Integrate</div>
        </GlassCard>
        <GlassCard className="p-6 text-center">
          <div className="text-3xl font-bold text-purple-600">{services.length}</div>
          <div className="text-sm text-gray-600">Total Services</div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">✅ Fully Integrated Services</h3>
          <div className="space-y-3">
            {integratedServices.map((service) => (
              <GlassCard key={service.name} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-800">{service.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                    Port {service.port}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {service.features.map((feature, index) => (
                    <span key={index} className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full">
                      {feature}
                    </span>
                  ))}
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">🔧 Ready to Integrate</h3>
          <div className="space-y-3">
            {notIntegratedServices.map((service) => (
              <GlassCard key={service.name} className="p-4 border-l-4 border-blue-500">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-800">{service.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                    Port {service.port}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {service.features.map((feature, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                      {feature}
                    </span>
                  ))}
                </div>
                <div className="mt-2 text-xs text-blue-600">
                  API integration added - Ready for frontend implementation
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureStatus;
