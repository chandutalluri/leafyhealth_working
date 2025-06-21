import React from 'react';
import { usePermissions } from './PermissionsProvider';

interface DomainGuardProps {
  domain: string;
  action: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showError?: boolean;
}

export function DomainGuard({ 
  domain, 
  action, 
  children, 
  fallback = null, 
  showError = false 
}: DomainGuardProps) {
  const { hasPermission, isLoading } = usePermissions();

  if (isLoading) {
    return (
      <div className="animate-pulse bg-gray-200 rounded h-8 w-32"></div>
    );
  }

  if (!hasPermission(domain, action)) {
    if (showError) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <div className="text-red-600 text-sm">
            Access denied: You don't have permission to {action} {domain}
          </div>
        </div>
      );
    }
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

