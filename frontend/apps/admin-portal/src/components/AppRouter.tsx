import React, { Suspense } from 'react';
import { useRouter } from 'next/router';
import { usePermissions, DomainGuard } from '../lib/auth';
import { DOMAIN_REGISTRY } from '../lib/domainRegistry';
import { SecurityDashboard } from './SecurityDashboard';
import { AlertCircle, Lock } from 'lucide-react';

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
    </div>
  );
}

function AccessDenied({ domain }: { domain?: string }) {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Access Denied</h3>
        <p className="text-gray-600 mb-4">
          You don't have permission to access {domain ? `the ${domain} module` : 'this page'}.
        </p>
        <p className="text-sm text-gray-500">
          Contact your administrator if you need access to this feature.
        </p>
      </div>
    </div>
  );
}

function PageNotFound() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-yellow-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Page Not Found</h3>
        <p className="text-gray-600">
          The page you're looking for doesn't exist or has been moved.
        </p>
      </div>
    </div>
  );
}

export function AppRouter() {
  const router = useRouter();
  const { getAllowedDomains, hasPermission } = usePermissions();
  
  const allowedDomains = getAllowedDomains();
  const currentPath = router.pathname;
  
  // Find matching domain for current route
  const currentDomain = allowedDomains.find(domain => {
    const domainMeta = DOMAIN_REGISTRY[domain];
    return domainMeta?.route === currentPath;
  });

  // Handle security dashboard - Super Admin only
  if (currentPath === '/security') {
    const { user } = usePermissions();
    if (user?.role !== 'super_admin') {
      return <AccessDenied domain="security-dashboard" />;
    }
    return <SecurityDashboard />;
  }

  // Handle dashboard/home page
  if (currentPath === '/' || currentPath === '/dashboard') {
    return <DashboardOverview />;
  }

  // If no domain matches, show 404
  if (!currentDomain) {
    return <PageNotFound />;
  }

  // Check if user has read access to this domain
  if (!hasPermission(currentDomain, 'read')) {
    return <AccessDenied domain={currentDomain} />;
  }

  const DomainComponent = DOMAIN_REGISTRY[currentDomain].component;
  
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <DomainComponent />
    </Suspense>
  );
}

function DashboardOverview() {
  const { getAllowedDomains } = usePermissions();
  const allowedDomains = getAllowedDomains();
  
  const quickAccess = allowedDomains
    .slice(0, 6)
    .map(domain => DOMAIN_REGISTRY[domain])
    .filter(Boolean);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your LeafyHealth business operations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quickAccess.map(({ label, icon: Icon, route, description }) => {
          const domain = allowedDomains.find(d => DOMAIN_REGISTRY[d]?.route === route);
          
          return (
            <DomainGuard key={route} domain={domain!} action="read">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <Icon className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{label}</h3>
                    <p className="text-sm text-gray-500 mt-1">{description}</p>
                  </div>
                </div>
                <a 
                  href={route}
                  className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium text-sm"
                >
                  Open Module →
                </a>
              </div>
            </DomainGuard>
          );
        })}
      </div>

      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Welcome to LeafyHealth Admin</h2>
        <p className="text-gray-700 mb-4">
          You have access to {allowedDomains.length} business modules. Use the sidebar to navigate between different areas of your business management system.
        </p>
        <div className="flex flex-wrap gap-2">
          {allowedDomains.map(domain => {
            const meta = DOMAIN_REGISTRY[domain];
            return meta ? (
              <span 
                key={domain}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800"
              >
                {meta.label}
              </span>
            ) : null;
          })}
        </div>
      </div>
    </div>
  );
}