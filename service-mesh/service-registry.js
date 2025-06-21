/**
 * Lightweight Service Mesh Registry for LeafyHealth Platform
 * Manages service discovery and secure inter-service communication
 */

const EventEmitter = require('events');
const crypto = require('crypto');

class ServiceMeshRegistry extends EventEmitter {
  constructor() {
    super();
    this.services = new Map();
    this.healthChecks = new Map();
    this.internalTokens = new Map();
    this.communicationKeys = new Map();
    
    // Internal mesh network configuration
    this.meshConfig = {
      networkId: 'leafyhealth-internal',
      encryptionKey: crypto.randomBytes(32),
      tokenExpiry: 3600000, // 1 hour
      healthCheckInterval: 30000 // 30 seconds
    };

    this.startHealthChecking();
    this.generateInternalTokens();
  }

  /**
   * Register a service in the mesh
   */
  registerService(serviceName, config) {
    const serviceId = crypto.randomUUID();
    const internalToken = this.generateServiceToken(serviceName);
    
    const serviceRecord = {
      id: serviceId,
      name: serviceName,
      port: config.port,
      host: config.host || 'localhost',
      status: 'registered',
      registeredAt: new Date().toISOString(),
      lastSeen: new Date().toISOString(),
      internalToken,
      endpoints: config.endpoints || [],
      dependencies: config.dependencies || [],
      metadata: config.metadata || {}
    };

    this.services.set(serviceName, serviceRecord);
    this.internalTokens.set(internalToken, serviceName);
    
    console.log(`🔗 Service registered in mesh: ${serviceName} on port ${config.port}`);
    this.emit('serviceRegistered', serviceRecord);
    
    return { serviceId, internalToken };
  }

  /**
   * Generate secure internal communication token
   */
  generateServiceToken(serviceName) {
    const payload = {
      service: serviceName,
      issued: Date.now(),
      networkId: this.meshConfig.networkId,
      capabilities: ['internal-communication', 'service-discovery']
    };
    
    const token = crypto
      .createHmac('sha256', this.meshConfig.encryptionKey)
      .update(JSON.stringify(payload))
      .digest('hex');
    
    return `mesh.${Buffer.from(JSON.stringify(payload)).toString('base64')}.${token}`;
  }

  /**
   * Validate internal mesh token
   */
  validateMeshToken(token) {
    if (!token || !token.startsWith('mesh.')) {
      return false;
    }

    try {
      const [prefix, payloadB64, signature] = token.split('.');
      const payload = JSON.parse(Buffer.from(payloadB64, 'base64').toString());
      
      const expectedSignature = crypto
        .createHmac('sha256', this.meshConfig.encryptionKey)
        .update(JSON.stringify(payload))
        .digest('hex');
      
      if (signature !== expectedSignature) {
        return false;
      }

      // Check token expiry
      if (Date.now() - payload.issued > this.meshConfig.tokenExpiry) {
        return false;
      }

      return payload;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get service location for internal communication
   */
  getServiceEndpoint(serviceName, requesterToken) {
    const tokenPayload = this.validateMeshToken(requesterToken);
    if (!tokenPayload) {
      throw new Error('Invalid mesh token for service discovery');
    }

    const service = this.services.get(serviceName);
    if (!service || service.status !== 'healthy') {
      throw new Error(`Service ${serviceName} not available`);
    }

    return {
      url: `http://${service.host}:${service.port}`,
      internalToken: service.internalToken,
      endpoints: service.endpoints
    };
  }

  /**
   * Create secure service-to-service communication
   */
  createServiceClient(targetService, requesterToken) {
    const endpoint = this.getServiceEndpoint(targetService, requesterToken);
    
    return {
      async request(path, options = {}) {
        const url = `${endpoint.url}${path}`;
        const headers = {
          'X-Mesh-Token': endpoint.internalToken,
          'X-Mesh-Network': 'leafyhealth-internal',
          'Content-Type': 'application/json',
          ...options.headers
        };

        const requestOptions = {
          method: options.method || 'GET',
          headers,
          body: options.body ? JSON.stringify(options.body) : undefined
        };

        const response = await fetch(url, requestOptions);
        return response.json();
      }
    };
  }

  /**
   * Start health checking for all services
   */
  startHealthChecking() {
    setInterval(async () => {
      for (const [serviceName, service] of this.services) {
        try {
          const response = await fetch(`http://${service.host}:${service.port}/health`, {
            timeout: 5000,
            headers: {
              'X-Mesh-Token': service.internalToken
            }
          });
          
          if (response.ok) {
            service.status = 'healthy';
            service.lastSeen = new Date().toISOString();
          } else {
            service.status = 'unhealthy';
          }
        } catch (error) {
          service.status = 'unreachable';
          console.error(`❌ Health check failed for ${serviceName}:`, error.message);
        }
      }
    }, this.meshConfig.healthCheckInterval);
  }

  /**
   * Generate internal tokens for all services
   */
  generateInternalTokens() {
    const services = [
      'identity-access',
      'user-role-management', 
      'catalog-management',
      'inventory-management',
      'order-management',
      'payment-processing',
      'notification-service',
      'customer-service',
      'api-gateway'
    ];

    services.forEach(serviceName => {
      const token = this.generateServiceToken(serviceName);
      this.communicationKeys.set(serviceName, token);
    });
  }

  /**
   * Get mesh status and service health
   */
  getMeshStatus() {
    const services = Array.from(this.services.values());
    const healthyServices = services.filter(s => s.status === 'healthy').length;
    
    return {
      networkId: this.meshConfig.networkId,
      totalServices: services.length,
      healthyServices,
      unhealthyServices: services.length - healthyServices,
      services: services.map(s => ({
        name: s.name,
        status: s.status,
        port: s.port,
        lastSeen: s.lastSeen
      })),
      meshHealth: healthyServices / services.length >= 0.8 ? 'healthy' : 'degraded'
    };
  }

  /**
   * Secure service shutdown
   */
  async shutdown() {
    console.log('🔒 Service mesh shutting down...');
    
    // Revoke all tokens
    this.internalTokens.clear();
    this.communicationKeys.clear();
    
    // Clear service registry
    this.services.clear();
    
    console.log('✅ Service mesh shutdown complete');
  }
}

// Export singleton instance
module.exports = new ServiceMeshRegistry();