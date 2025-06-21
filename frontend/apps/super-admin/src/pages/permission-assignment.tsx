import { useState, useEffect } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  Shield, 
  Users, 
  CheckCircle, 
  XCircle, 
  Save,
  RefreshCw,
  Settings,
  Building2,
  UserCheck
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin_portal' | 'operations_dashboard';
  permissions: string[];
}

interface Microservice {
  name: string;
  displayName: string;
  category: string;
  description: string;
  port?: number;
}

const MICROSERVICES: Microservice[] = [
  // Core System Management
  { name: 'company-management', displayName: 'Company Management', category: 'core', description: 'Manage business entities and companies', port: 3013 },
  { name: 'image-management', displayName: 'Image Management', category: 'core', description: 'Self-hosted image management with variants', port: 8080 },

  // Security & Access Control
  { name: 'identity-access', displayName: 'Identity Access', category: 'security', description: 'Authentication and identity management', port: 3010 },
  { name: 'user-role-management', displayName: 'User Role Management', category: 'security', description: 'User roles and permissions management', port: 3011 },

  // Business Operations
  { name: 'catalog-management', displayName: 'Catalog Management', category: 'business', description: 'Product catalog and categories', port: 3020 },
  { name: 'inventory-management', displayName: 'Inventory Management', category: 'business', description: 'Stock and inventory tracking', port: 3021 },
  { name: 'order-management', displayName: 'Order Management', category: 'business', description: 'Order processing and fulfillment', port: 3022 },
  { name: 'customer-service', displayName: 'Customer Service', category: 'business', description: 'Customer support and service management', port: 3031 },
  { name: 'marketplace-management', displayName: 'Marketplace Management', category: 'business', description: 'Multi-vendor marketplace operations', port: 3032 },

  // Financial Management
  { name: 'payment-processing', displayName: 'Payment Processing', category: 'financial', description: 'Payment gateway and transactions', port: 3023 },
  { name: 'accounting-management', displayName: 'Accounting Management', category: 'financial', description: 'Financial accounting and bookkeeping', port: 3028 },
  { name: 'expense-monitoring', displayName: 'Expense Monitoring', category: 'financial', description: 'Business expense tracking and control', port: 3034 },

  // Operations & Logistics
  { name: 'shipping-delivery', displayName: 'Shipping Delivery', category: 'operations', description: 'Logistics and delivery management', port: 3026 },
  { name: 'employee-management', displayName: 'Employee Management', category: 'operations', description: 'HR and workforce management', port: 3029 },
  { name: 'label-design', displayName: 'Label Design', category: 'operations', description: 'Product labeling and design system', port: 3035 },

  // Analytics & Reporting
  { name: 'analytics-reporting', displayName: 'Analytics Reporting', category: 'analytics', description: 'Business intelligence and analytics', port: 3025 },
  { name: 'reporting-management', displayName: 'Reporting Management', category: 'analytics', description: 'Report generation and management', port: 3036 },

  // Content & Communication
  { name: 'content-management', displayName: 'Content Management', category: 'content', description: 'Digital content and media management', port: 3037 },
  { name: 'notification-service', displayName: 'Notification Service', category: 'content', description: 'Multi-channel notifications and alerts', port: 3024 },
  { name: 'multi-language-management', displayName: 'Multi-Language Management', category: 'content', description: 'Internationalization and localization', port: 3038 },

  // System Administration
  { name: 'performance-monitor', displayName: 'Performance Monitor', category: 'system', description: 'System performance monitoring', port: 3030 },
  { name: 'integration-hub', displayName: 'Integration Hub', category: 'system', description: 'Third-party integrations and APIs', port: 3033 },
  { name: 'compliance-audit', displayName: 'Compliance Audit', category: 'system', description: 'Regulatory compliance and auditing', port: 3027 }
];

const CATEGORY_COLORS = {
  core: 'bg-blue-100 text-blue-800',
  security: 'bg-red-100 text-red-800',
  business: 'bg-green-100 text-green-800',
  financial: 'bg-yellow-100 text-yellow-800',
  operations: 'bg-purple-100 text-purple-800',
  analytics: 'bg-indigo-100 text-indigo-800',
  content: 'bg-pink-100 text-pink-800',
  system: 'bg-gray-100 text-gray-800'
};

const DEFAULT_PERMISSIONS = {
  admin_portal: [
    'accounting-management',
    'expense-monitoring', 
    'payment-processing',
    'image-management',
    'analytics-reporting'
  ],
  operations_dashboard: [
    'order-management',
    'shipping-delivery',
    'inventory-management',
    'customer-service',
    'employee-management'
  ]
};

export default function PermissionAssignment() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [pendingPermissions, setPendingPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    // Simulate loading internal users
    setLoading(true);
    
    // Mock data for demonstration - in real implementation this would come from API
    const mockUsers: User[] = [
      {
        id: '1',
        name: 'Admin User',
        email: 'admin@leafyhealth.com',
        role: 'admin_portal',
        permissions: DEFAULT_PERMISSIONS.admin_portal
      },
      {
        id: '2',
        name: 'Operations Manager',
        email: 'ops@leafyhealth.com',
        role: 'operations_dashboard',
        permissions: DEFAULT_PERMISSIONS.operations_dashboard
      }
    ];
    
    setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
    }, 500);
  };

  const selectUser = (user: User) => {
    setSelectedUser(user);
    setPendingPermissions([...user.permissions]);
    setSaveMessage('');
  };

  const togglePermission = (microserviceName: string) => {
    if (pendingPermissions.includes(microserviceName)) {
      setPendingPermissions(prev => prev.filter(p => p !== microserviceName));
    } else {
      setPendingPermissions(prev => [...prev, microserviceName]);
    }
  };

  const savePermissions = async () => {
    if (!selectedUser) return;
    
    setLoading(true);
    
    // Simulate API call to save permissions
    setTimeout(() => {
      setUsers(prev => 
        prev.map(user => 
          user.id === selectedUser.id 
            ? { ...user, permissions: [...pendingPermissions] }
            : user
        )
      );
      
      setSelectedUser(prev => 
        prev ? { ...prev, permissions: [...pendingPermissions] } : null
      );
      
      setLoading(false);
      setSaveMessage('Permissions updated successfully');
      
      setTimeout(() => setSaveMessage(''), 3000);
    }, 1000);
  };

  const hasChanges = selectedUser && 
    JSON.stringify(pendingPermissions.sort()) !== JSON.stringify(selectedUser.permissions.sort());

  const groupedMicroservices = MICROSERVICES.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {} as Record<string, Microservice[]>);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
            <Settings className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Permission Assignment</h1>
            <p className="text-gray-600">Manage microservice access for internal users</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Selection */}
        <div className="lg:col-span-1">
          <Card className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Users className="h-5 w-5 text-gray-600" />
              <h2 className="text-lg font-semibold">Internal Users</h2>
            </div>
            
            {loading && !selectedUser ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : (
              <div className="space-y-3">
                {users.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => selectUser(user)}
                    className={`
                      p-4 rounded-lg border cursor-pointer transition-all
                      ${selectedUser?.id === user.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }
                    `}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{user.name}</h3>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <Badge 
                          className={`mt-2 ${
                            user.role === 'admin_portal' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-purple-100 text-purple-800'
                          }`}
                        >
                          {user.role === 'admin_portal' ? 'Admin Portal' : 'Operations Dashboard'}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {user.permissions.length}
                        </div>
                        <div className="text-xs text-gray-500">
                          microservices
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Permission Management */}
        <div className="lg:col-span-2">
          {selectedUser ? (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold">
                    Manage Permissions for {selectedUser.name}
                  </h2>
                  <p className="text-sm text-gray-600">
                    Select microservices this user can access
                  </p>
                </div>
                
                {hasChanges && (
                  <Button 
                    onClick={savePermissions}
                    disabled={loading}
                    className="flex items-center space-x-2"
                  >
                    {loading ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    <span>Save Changes</span>
                  </Button>
                )}
              </div>

              {saveMessage && (
                <div className="mb-4 p-3 bg-green-100 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-800">{saveMessage}</span>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                {Object.entries(groupedMicroservices).map(([category, services]) => (
                  <div key={category}>
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                      {category.replace('-', ' ')} ({services.length})
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {services.map((service) => {
                        const isGranted = pendingPermissions.includes(service.name);
                        
                        return (
                          <div
                            key={service.name}
                            onClick={() => togglePermission(service.name)}
                            className={`
                              p-4 rounded-lg border cursor-pointer transition-all
                              ${isGranted 
                                ? 'border-green-500 bg-green-50' 
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                              }
                            `}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                  <h4 className="font-medium text-gray-900">
                                    {service.displayName}
                                  </h4>
                                  <Badge className={CATEGORY_COLORS[service.category as keyof typeof CATEGORY_COLORS]}>
                                    {category}
                                  </Badge>
                                </div>
                                <p className="text-xs text-gray-600 mt-1">
                                  {service.description}
                                </p>
                                {service.port && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    Port: {service.port}
                                  </p>
                                )}
                              </div>
                              
                              <div className="ml-4">
                                {isGranted ? (
                                  <CheckCircle className="h-5 w-5 text-green-600" />
                                ) : (
                                  <XCircle className="h-5 w-5 text-gray-400" />
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ) : (
            <Card className="p-12">
              <div className="text-center">
                <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Select a User
                </h3>
                <p className="text-gray-600">
                  Choose an internal user from the left panel to manage their microservice permissions
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}