import React from 'react';
import { usePermissions } from './PermissionsProvider';

interface PermissionButtonProps {
  domain: string;
  action: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export const PermissionButton: React.FC<PermissionButtonProps> = ({
  domain,
  action,
  children,
  className = '',
  onClick,
  disabled = false,
}) => {
  const { hasPermission } = usePermissions();
  
  if (!hasPermission(domain, action)) {
    return null;
  }

  return (
    <button
      className={`px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};