// Export all auth components and hooks
export * from './authStore'
export * from './PermissionsProvider'
export { DomainGuard } from './DomainGuard'
export { PermissionButton } from './PermissionButton'

// Re-export core auth functionality
import React from 'react'
import { useAuthStore, type User } from './authStore'

// Role-based access control
export const hasPermission = (user: User | null, requiredRole: string): boolean => {
  if (!user) return false
  
  const roleHierarchy = {
    customer: 0,
    staff: 1,
    manager: 2,
    admin: 3,
    super_admin: 4,
  }
  
  const userLevel = roleHierarchy[user.role] || 0
  const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0
  
  return userLevel >= requiredLevel
}

// Auth hooks
export const useAuth = () => {
  const auth = useAuthStore()
  
  return {
    ...auth,
    hasPermission: (role: string) => hasPermission(auth.user, role),
    isRole: (role: string) => auth.user?.role === role,
    canAccess: (roles: string[]) => 
      auth.user ? roles.includes(auth.user.role) : false,
  }
}

// Auth guard component props
export interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: string
  allowedRoles?: string[]
  fallback?: React.ReactNode
  redirectTo?: string
}

// Protected route wrapper
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>,
  requiredRole?: string
) => {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, user } = useAuth()
    
    if (!isAuthenticated) {
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login'
      }
      return null
    }
    
    if (requiredRole && !hasPermission(user, requiredRole)) {
      return null
    }
    
    return React.createElement(Component, props)
  }
}