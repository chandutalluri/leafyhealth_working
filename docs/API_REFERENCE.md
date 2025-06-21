# LeafyHealth API Reference

## Overview
Complete API documentation for all LeafyHealth microservices and gateway endpoints.

## API Gateway Endpoints

### Central Auth Gateway (Port 8084)
```
POST   /api/auth/login              # User authentication
POST   /api/auth/logout             # User logout
GET    /api/auth/verify             # Token verification
POST   /api/auth/refresh            # Token refresh
GET    /health                      # Health check
```

### Direct Data Gateway (Port 8081)
```
GET    /api/companies               # List companies
GET    /api/companies/:id           # Get company details
POST   /api/companies               # Create company
PUT    /api/companies/:id           # Update company
DELETE /api/companies/:id           # Delete company

GET    /api/branches                # List branches
GET    /api/branches/:id            # Get branch details
GET    /api/users                   # List users
GET    /api/analytics               # Analytics data
GET    /api/accounting              # Accounting data
GET    /health                      # Health check
```

### Permission Gateway (Port 8083)
```
GET    /api/*                       # Protected route access
POST   /api/*                       # Protected route access
PUT    /api/*                       # Protected route access
DELETE /api/*                       # Protected route access
GET    /health                      # Health check
```

### Direct Image Service (Port 8080)
```
POST   /api/image-management/upload         # Upload image
GET    /api/image-management/serve/:filename # Serve image
GET    /api/image-management/stats          # Service statistics
GET    /api/image-management/health         # Health check
```

## Business Microservices API

### Company Management (Port 3013)
```
GET    /company-management/companies                    # List companies
POST   /company-management/companies                    # Create company
GET    /company-management/companies/:id                # Get company
PUT    /company-management/companies/:id                # Update company
DELETE /company-management/companies/:id                # Delete company
GET    /company-management/companies/:id/hierarchy      # Company hierarchy

GET    /company-management/branches                     # List branches
POST   /company-management/branches                     # Create branch
GET    /company-management/branches/:id                 # Get branch
PUT    /company-management/branches/:id                 # Update branch
DELETE /company-management/branches/:id                 # Delete branch
GET    /company-management/companies/:companyId/branches # Company branches
GET    /health                                          # Health check
```

### Catalog Management (Port 3016)
```
GET    /catalog-management/products                     # List products
POST   /catalog-management/products                     # Create product
GET    /catalog-management/products/:id                 # Get product
PUT    /catalog-management/products/:id                 # Update product
DELETE /catalog-management/products/:id                 # Delete product

GET    /catalog-management/categories                   # List categories
POST   /catalog-management/categories                   # Create category
GET    /catalog-management/categories/:id               # Get category
PUT    /catalog-management/categories/:id               # Update category
DELETE /catalog-management/categories/:id               # Delete category

GET    /catalog-management/products/:id/variants        # Product variants
POST   /catalog-management/products/:id/variants        # Create variant
GET    /health                                          # Health check
```

### Order Management (Port 3030)
```
GET    /order-management/orders                         # List orders
POST   /order-management/orders                         # Create order
GET    /order-management/orders/:id                     # Get order
PUT    /order-management/orders/:id                     # Update order
DELETE /order-management/orders/:id                     # Delete order
POST   /order-management/orders/:id/items               # Add order item
GET    /health                                          # Health check
```

### Subscription Management (Port 3036)
```
GET    /subscription-management/subscriptions           # List subscriptions
POST   /subscription-management/subscriptions           # Create subscription  
GET    /subscription-management/subscriptions/:id       # Get subscription
PUT    /subscription-management/subscriptions/:id       # Update subscription
DELETE /subscription-management/subscriptions/:id       # Cancel subscription
POST   /subscription-management/subscriptions/:id/renew # Renew subscription
GET    /subscription-management/subscriptions/:id/billing # Billing history
GET    /subscription-management/plans                   # Available plans
GET    /health                                          # Health check
```

### Customer Service (Port 3019)
```
GET    /customer-service/tickets                        # List tickets
POST   /customer-service/tickets                        # Create ticket
GET    /customer-service/tickets/:id                    # Get ticket
PUT    /customer-service/tickets/:id                    # Update ticket
DELETE /customer-service/tickets/:id                    # Delete ticket

GET    /customer-service/customers                      # List customers
POST   /customer-service/customers                      # Create customer
GET    /customer-service/customers/:id                  # Get customer
PUT    /customer-service/customers/:id                  # Update customer

GET    /customer-service/agents                         # List agents
POST   /customer-service/agents                         # Create agent
GET    /health                                          # Health check
```

### Inventory Management (Port 3025)
```
GET    /inventory-management/items                      # List inventory items
POST   /inventory-management/items                      # Create item
GET    /inventory-management/items/:id                  # Get item
PUT    /inventory-management/items/:id                  # Update item
DELETE /inventory-management/items/:id                  # Delete item
POST   /inventory-management/items/:id/stock            # Update stock
GET    /inventory-management/alerts                     # Stock alerts
GET    /health                                          # Health check
```

### Notification Service (Port 3029)
```
GET    /notification-service/notifications              # List notifications
POST   /notification-service/notifications              # Send notification
GET    /notification-service/notifications/:id          # Get notification
PUT    /notification-service/notifications/:id          # Update notification
DELETE /notification-service/notifications/:id          # Delete notification

GET    /notification-service/templates                  # List templates
POST   /notification-service/templates                  # Create template
GET    /notification-service/channels                   # List channels
GET    /health                                          # Health check
```

### Analytics Reporting (Port 3015)
```
GET    /analytics-reporting/reports                     # List reports
POST   /analytics-reporting/reports                     # Create report
GET    /analytics-reporting/reports/:id                 # Get report
PUT    /analytics-reporting/reports/:id                 # Update report
DELETE /analytics-reporting/reports/:id                 # Delete report

GET    /analytics-reporting/dashboards                  # List dashboards
POST   /analytics-reporting/dashboards                  # Create dashboard
GET    /analytics-reporting/metrics                     # Get metrics
GET    /analytics-reporting/export/:format              # Export data
GET    /health                                          # Health check
```

### Accounting Management (Port 3014)
```
GET    /accounting-management/accounts                  # List accounts
POST   /accounting-management/accounts                  # Create account
GET    /accounting-management/accounts/:id              # Get account
PUT    /accounting-management/accounts/:id              # Update account
DELETE /accounting-management/accounts/:id              # Delete account

GET    /accounting-management/transactions              # List transactions
POST   /accounting-management/transactions              # Create transaction
GET    /accounting-management/invoices                  # List invoices
POST   /accounting-management/invoices                  # Create invoice
GET    /accounting-management/reports                   # Financial reports
GET    /health                                          # Health check
```

## Authentication and Authorization

### JWT Token Structure
```json
{
  "sub": "user_id",
  "email": "user@example.com",
  "roles": ["admin", "user"],
  "permissions": ["read", "write", "delete"],
  "iat": 1640995200,
  "exp": 1641081600
}
```

### Authentication Headers
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

### Permission Levels
- **read**: GET operations
- **create**: POST operations  
- **update**: PUT/PATCH operations
- **delete**: DELETE operations

## Error Responses

### Standard Error Format
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": "Additional error details",
    "timestamp": "2025-06-19T13:45:00Z"
  }
}
```

### Common Error Codes
- **401**: Unauthorized - Invalid or missing authentication
- **403**: Forbidden - Insufficient permissions
- **404**: Not Found - Resource does not exist
- **422**: Validation Error - Invalid input data
- **500**: Internal Server Error - Server-side error

## Request/Response Examples

### Create Product Example
```bash
# Request
POST /catalog-management/products
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "Organic Bananas",
  "description": "Fresh organic bananas from local farms",
  "price": 2.99,
  "categoryId": "fruits",
  "stock": 100,
  "images": ["banana1.jpg", "banana2.jpg"]
}

# Response
{
  "id": "prod_123",
  "name": "Organic Bananas",
  "description": "Fresh organic bananas from local farms",
  "price": 2.99,
  "categoryId": "fruits",
  "stock": 100,
  "images": ["banana1.jpg", "banana2.jpg"],
  "createdAt": "2025-06-19T13:45:00Z",
  "updatedAt": "2025-06-19T13:45:00Z"
}
```

### Place Order Example
```bash
# Request
POST /order-management/orders
Content-Type: application/json
Authorization: Bearer <token>

{
  "customerId": "cust_456",
  "items": [
    {
      "productId": "prod_123",
      "quantity": 2,
      "price": 2.99
    }
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "Vancouver",
    "postalCode": "V6B 1A1"
  }
}

# Response
{
  "id": "order_789",
  "customerId": "cust_456",
  "status": "pending",
  "total": 5.98,
  "items": [...],
  "shippingAddress": {...},
  "createdAt": "2025-06-19T13:45:00Z"
}
```

## Rate Limiting

### Default Limits
- **General API**: 1000 requests per hour per user
- **Authentication**: 10 requests per minute per IP
- **File Upload**: 5 requests per minute per user
- **Bulk Operations**: 100 requests per hour per user

### Rate Limit Headers
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640999999
```

## Health Check Endpoints

All services provide health check endpoints at `/health`:

```json
{
  "status": "healthy",
  "service": "catalog-management",
  "version": "1.0.0",
  "timestamp": "2025-06-19T13:45:00Z",
  "dependencies": {
    "database": "healthy",
    "cache": "healthy"
  }
}
```

## WebSocket Events

### Order Updates
```javascript
// Subscribe to order updates
ws.send(JSON.stringify({
  type: 'subscribe',
  channel: 'orders',
  userId: 'user_123'
}));

// Receive order status updates
{
  "type": "order_update",
  "orderId": "order_789",
  "status": "shipped",
  "timestamp": "2025-06-19T13:45:00Z"
}
```

### Inventory Alerts
```javascript
// Subscribe to inventory alerts
ws.send(JSON.stringify({
  type: 'subscribe',
  channel: 'inventory',
  productIds: ['prod_123', 'prod_456']
}));

// Receive stock alerts
{
  "type": "stock_alert",
  "productId": "prod_123",
  "currentStock": 5,
  "threshold": 10,
  "timestamp": "2025-06-19T13:45:00Z"
}
```

This API reference provides comprehensive documentation for all LeafyHealth platform endpoints and integration patterns.