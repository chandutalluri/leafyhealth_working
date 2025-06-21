export interface ServiceStatus {
  name: string
  status: 'running' | 'stopped' | 'error'
  port: number
  category: string
  description: string
  uptime: string
}

export interface SystemMetrics {
  totalMicroservices: number
  runningServices: number
  totalUsers: number
  systemHealth: 'Healthy' | 'Warning' | 'Critical'
  databaseConnections: number
  uptime: string
}

export interface SystemStatusResponse {
  services: ServiceStatus[]
  metrics: SystemMetrics
}

class MicroserviceAPI {
  private baseUrl = ''

  async getSystemStatus(): Promise<SystemStatusResponse> {
    try {
      // Fetch microservices status from server-side API
      const response = await fetch('/api/microservices-status', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      return { services: data.services, metrics: data.metrics }
    } catch (error) {
      console.error('Error fetching system status:', error)
      throw new Error('Unable to fetch authentic system data')
    }
  }

  private calculateUptime(): string {
    const startTime = new Date('2024-01-01')
    const now = new Date()
    const diffMs = now.getTime() - startTime.getTime()
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    return `${days} days, ${hours} hours`
  }

  private countDatabaseConnections(): number {
    // Each microservice has one DB connection
    return 21
  }

  private getServiceCategory(serviceName: string): string {
    if (serviceName.includes('auth') || serviceName.includes('user')) return 'security'
    if (serviceName.includes('catalog') || serviceName.includes('inventory') || serviceName.includes('order')) return 'ecommerce'
    if (serviceName.includes('payment') || serviceName.includes('accounting')) return 'finance'
    if (serviceName.includes('notification') || serviceName.includes('customer')) return 'communication'
    if (serviceName.includes('analytics') || serviceName.includes('performance')) return 'analytics'
    return 'integration'
  }

  private getServiceDescription(serviceName: string): string {
    const descriptions: Record<string, string> = {
      'auth': 'User authentication and authorization',
      'users': 'Role and permission management',
      'catalog': 'Product and category management',
      'inventory': 'Stock and warehouse management',
      'orders': 'Order processing and fulfillment',
      'payments': 'Payment processing and transactions',
      'notifications': 'Email and SMS notifications',
      'customers': 'Customer support and service',
      'analytics': 'Business intelligence and reporting',
      'accounting': 'Financial management and billing'
    }
    
    for (const [key, desc] of Object.entries(descriptions)) {
      if (serviceName.includes(key)) return desc
    }
    return 'Microservice component'
  }
}

export const microserviceAPI = new MicroserviceAPI()