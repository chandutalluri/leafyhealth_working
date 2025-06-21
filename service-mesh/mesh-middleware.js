/**
 * Service Mesh Middleware for NestJS Microservices
 * Integrates mesh authentication and service discovery into existing services
 */

const serviceMesh = require('./service-registry');

class MeshMiddleware {
  /**
   * Create middleware for NestJS services
   */
  static createNestMiddleware() {
    return (req, res, next) => {
      // Skip mesh validation for health checks and public endpoints
      if (req.path === '/health' || req.path === '/__introspect' || req.path === '/') {
        return next();
      }

      // Validate mesh token for internal service communication
      const meshToken = req.headers['x-mesh-token'];
      if (meshToken) {
        const tokenPayload = serviceMesh.validateMeshToken(meshToken);
        if (tokenPayload) {
          req.meshSource = tokenPayload.service;
          req.meshNetwork = tokenPayload.networkId;
          return next();
        }
      }

      // Allow API Gateway requests with proper headers
      const userAgent = req.headers['user-agent'];
      if (userAgent && userAgent.includes('API-Gateway')) {
        return next();
      }

      // Allow requests from localhost for development
      const forwarded = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      if (forwarded === '127.0.0.1' || forwarded === '::1') {
        return next();
      }

      // Block unauthorized external access
      res.status(403).json({
        error: 'Access Denied',
        message: 'Direct service access not permitted. Use API Gateway.',
        timestamp: new Date().toISOString()
      });
    };
  }

  /**
   * Service registration helper for microservices
   */
  static registerServiceInMesh(serviceName, port, metadata = {}) {
    const config = {
      port,
      host: 'localhost',
      endpoints: metadata.endpoints || [],
      dependencies: metadata.dependencies || [],
      metadata
    };

    return serviceMesh.registerService(serviceName, config);
  }

  /**
   * Create service client for inter-service communication
   */
  static createServiceClient(targetService, requesterToken) {
    return serviceMesh.createServiceClient(targetService, requesterToken);
  }

  /**
   * Enhanced health check with mesh status
   */
  static createMeshHealthCheck(serviceName) {
    return (req, res) => {
      const service = serviceMesh.services.get(serviceName);
      const meshStatus = serviceMesh.getMeshStatus();
      
      res.json({
        service: serviceName,
        status: 'healthy',
        timestamp: new Date().toISOString(),
        mesh: {
          registered: !!service,
          networkId: meshStatus.networkId,
          totalServices: meshStatus.totalServices,
          meshHealth: meshStatus.meshHealth
        },
        port: service?.port,
        lastSeen: service?.lastSeen
      });
    };
  }
}

module.exports = MeshMiddleware;