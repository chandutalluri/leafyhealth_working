'use client';

import { useEffect, useState } from 'react'

interface AuthWrapperProps {
  children: React.ReactNode
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkAuthentication()
  }, [])

  const checkAuthentication = async () => {
    try {
      const token = localStorage.getItem('leafyhealth_token')
      const userStr = localStorage.getItem('leafyhealth_user')
      
      if (!token || !userStr) {
        redirectToLogin()
        return
      }

      // Verify token with server
      const apiGateway = process.env.NEXT_PUBLIC_API_GATEWAY || 'http://localhost:8080';
      const response = await fetch(`${apiGateway}/api/auth/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token })
      })

      const data = await response.json()
      
      if (data.success) {
        const user = JSON.parse(userStr)
        
        // Check if user is authorized for Super Admin app
        if (user.role !== 'super-admin') {
          // User not authorized for this app, redirect to their assigned app
          const assignedAppUrl = getAppUrl(user.assignedApp)
          window.location.href = assignedAppUrl
          return
        }

        // Check if user's assigned app matches current app
        if (user.assignedApp !== 'super-admin') {
          // Redirect to correct app
          const assignedAppUrl = getAppUrl(user.assignedApp)
          window.location.href = assignedAppUrl
          return
        }

        setIsAuthenticated(true)
      } else {
        // Token expired or invalid
        redirectToLogin()
      }
    } catch (error) {
      console.error('Authentication check failed:', error)
      redirectToLogin()
    } finally {
      setIsLoading(false)
    }
  }

  const redirectToLogin = () => {
    localStorage.removeItem('leafyhealth_token')
    localStorage.removeItem('leafyhealth_user')
    const apiGateway = process.env.NEXT_PUBLIC_API_GATEWAY || 'http://localhost:8080';
    window.location.href = `${apiGateway}/login`
  }

  const getAppUrl = (assignedApp: string) => {
    const baseUrl = window.location.origin;
    const APP_URLS: Record<string, string> = {
      'super-admin': `${baseUrl}:3003`,
      'admin': `${baseUrl}:3002`,
      'manager': `${baseUrl}:3002`,
      'analyst': `${baseUrl}:3002`,
      'customer': `${baseUrl}:5000`,
      'staff': `${baseUrl}:5000`,
      'cashier': `${baseUrl}:5000`,
      'delivery': `${baseUrl}:3001`
    }
    
    return APP_URLS[assignedApp] || `${baseUrl}:5000`
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}