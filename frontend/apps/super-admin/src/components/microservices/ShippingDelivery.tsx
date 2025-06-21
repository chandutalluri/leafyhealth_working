import React, { useState, useEffect } from 'react';
import { apiClient } from '../../lib/apiClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Truck, Package, MapPin, Clock, CheckCircle, AlertCircle, Route, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface DeliveryRoute {
  id: string;
  name: string;
  branchId: string;
  branchName: string;
  driverId: string;
  driverName: string;
  vehicleInfo: {
    type: string;
    number: string;
    capacity: number;
  };
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  deliveryDate: string;
  estimatedDuration: number;
  actualDuration?: number;
  totalOrders: number;
  totalDistance: number;
  createdAt: string;
}

interface DeliverySchedule {
  id: string;
  orderId: string;
  orderNumber: string;
  routeId: string;
  routeName: string;
  customerName: string;
  customerAddress: string;
  deliverySlot: string;
  estimatedDeliveryTime: string;
  actualDeliveryTime?: string;
  deliveryStatus: 'scheduled' | 'out_for_delivery' | 'delivered' | 'failed' | 'rescheduled';
  deliveryNotes?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

interface Carrier {
  id: string;
  name: string;
  code: string;
  contactInfo: {
    phone: string;
    email: string;
    address: string;
  };
  serviceAreas: string[];
  isActive: boolean;
  performanceRating: number;
  totalDeliveries: number;
  onTimeRate: number;
}

export default function ShippingDelivery() {
  const [routes, setRoutes] = useState<DeliveryRoute[]>([]);
  const [schedules, setSchedules] = useState<DeliverySchedule[]>([]);
  const [carriers, setCarriers] = useState<Carrier[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'routes' | 'schedules' | 'carriers'>('routes');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isRouteDialogOpen, setIsRouteDialogOpen] = useState(false);

  useEffect(() => {
    fetchShippingData();
  }, [statusFilter, searchTerm]);

  const fetchShippingData = async () => {
    try {
      setLoading(true);
      const [routesData, schedulesData, carriersData] = await Promise.all([
        apiClient.get('/api/direct-data/shipping/routes', {
          status: statusFilter !== 'all' ? statusFilter : undefined,
          search: searchTerm
        }),
        apiClient.get('/api/direct-data/shipping/schedules'),
        apiClient.get('/api/direct-data/shipping/carriers')
      ]);
      setRoutes(routesData || []);
      setSchedules(schedulesData || []);
      setCarriers(carriersData || []);
    } catch (error) {
      console.error('Failed to fetch shipping data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateRouteStatus = async (routeId: string, newStatus: string) => {
    try {
      await apiClient.put(`/api/direct-data/shipping/routes/${routeId}`, { status: newStatus });
      fetchShippingData();
    } catch (error) {
      console.error('Failed to update route status:', error);
    }
  };

  const updateDeliveryStatus = async (scheduleId: string, newStatus: string, notes?: string) => {
    try {
      await apiClient.put(`/api/direct-data/shipping/schedules/${scheduleId}`, { 
        deliveryStatus: newStatus,
        deliveryNotes: notes,
        actualDeliveryTime: newStatus === 'delivered' ? new Date().toISOString() : undefined
      });
      fetchShippingData();
    } catch (error) {
      console.error('Failed to update delivery status:', error);
    }
  };

  const createRoute = async (routeData: Partial<DeliveryRoute>) => {
    try {
      await apiClient.post('/api/direct-data/shipping/routes', routeData);
      fetchShippingData();
      setIsRouteDialogOpen(false);
    } catch (error) {
      console.error('Failed to create route:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'delivered':
        return 'default';
      case 'in_progress':
      case 'out_for_delivery':
        return 'secondary';
      case 'planned':
      case 'scheduled':
        return 'outline';
      case 'cancelled':
      case 'failed':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'in_progress':
      case 'out_for_delivery':
        return <Truck className="h-4 w-4" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const filteredRoutes = routes.filter(route =>
    route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.branchName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSchedules = schedules.filter(schedule =>
    schedule.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    schedule.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalDeliveries = schedules.length;
  const completedDeliveries = schedules.filter(s => s.deliveryStatus === 'delivered').length;
  const pendingDeliveries = schedules.filter(s => s.deliveryStatus === 'scheduled').length;
  const onTimeRate = completedDeliveries > 0 ? Math.round((completedDeliveries / totalDeliveries) * 100) : 0;

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading shipping & delivery...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Shipping & Delivery</h1>
          <p className="text-gray-500">Manage delivery routes, schedules, and logistics operations</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isRouteDialogOpen} onOpenChange={setIsRouteDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Route
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Delivery Route</DialogTitle>
                <DialogDescription>Set up a new delivery route for orders</DialogDescription>
              </DialogHeader>
              <RouteForm onSubmit={createRoute} onCancel={() => setIsRouteDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Delivery Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deliveries</CardTitle>
            <Package className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDeliveries}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedDeliveries}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingDeliveries}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On-Time Rate</CardTitle>
            <Truck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{onTimeRate}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b">
        {['routes', 'schedules', 'carriers'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`pb-2 px-1 border-b-2 font-medium text-sm capitalize ${
              activeTab === tab
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {activeTab === 'routes' && (
                  <>
                    <SelectItem value="planned">Planned</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </>
                )}
                {activeTab === 'schedules' && (
                  <>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="rescheduled">Rescheduled</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Content based on active tab */}
      {activeTab === 'routes' && (
        <Card>
          <CardHeader>
            <CardTitle>Delivery Routes</CardTitle>
            <CardDescription>Planned and active delivery routes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Route Name</th>
                    <th className="text-left py-3 px-4 font-medium">Driver</th>
                    <th className="text-left py-3 px-4 font-medium">Vehicle</th>
                    <th className="text-left py-3 px-4 font-medium">Orders</th>
                    <th className="text-left py-3 px-4 font-medium">Distance</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRoutes.map((route) => (
                    <tr key={route.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="font-medium">{route.name}</div>
                        <div className="text-sm text-gray-500">{route.branchName}</div>
                      </td>
                      <td className="py-3 px-4">{route.driverName}</td>
                      <td className="py-3 px-4">
                        <div>{route.vehicleInfo.type}</div>
                        <div className="text-sm text-gray-500">{route.vehicleInfo.number}</div>
                      </td>
                      <td className="py-3 px-4">{route.totalOrders}</td>
                      <td className="py-3 px-4">{route.totalDistance} km</td>
                      <td className="py-3 px-4">
                        <Badge variant={getStatusColor(route.status)} className="gap-1">
                          {getStatusIcon(route.status)}
                          {route.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Select value={route.status} onValueChange={(status) => updateRouteStatus(route.id, status)}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="planned">Planned</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'schedules' && (
        <Card>
          <CardHeader>
            <CardTitle>Delivery Schedules</CardTitle>
            <CardDescription>Individual order delivery schedules and status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Order #</th>
                    <th className="text-left py-3 px-4 font-medium">Customer</th>
                    <th className="text-left py-3 px-4 font-medium">Route</th>
                    <th className="text-left py-3 px-4 font-medium">Time Slot</th>
                    <th className="text-left py-3 px-4 font-medium">Priority</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSchedules.map((schedule) => (
                    <tr key={schedule.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-mono text-sm">{schedule.orderNumber}</td>
                      <td className="py-3 px-4">
                        <div className="font-medium">{schedule.customerName}</div>
                        <div className="text-sm text-gray-500 max-w-xs truncate">
                          {schedule.customerAddress}
                        </div>
                      </td>
                      <td className="py-3 px-4">{schedule.routeName}</td>
                      <td className="py-3 px-4">
                        <div>{schedule.deliverySlot}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(schedule.estimatedDeliveryTime).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={getPriorityColor(schedule.priority)}>
                          {schedule.priority.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={getStatusColor(schedule.deliveryStatus)} className="gap-1">
                          {getStatusIcon(schedule.deliveryStatus)}
                          {schedule.deliveryStatus.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Select 
                          value={schedule.deliveryStatus} 
                          onValueChange={(status) => updateDeliveryStatus(schedule.id, status)}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="scheduled">Scheduled</SelectItem>
                            <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="failed">Failed</SelectItem>
                            <SelectItem value="rescheduled">Rescheduled</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'carriers' && (
        <Card>
          <CardHeader>
            <CardTitle>Shipping Carriers</CardTitle>
            <CardDescription>Third-party shipping and logistics partners</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {carriers.map((carrier) => (
                <Card key={carrier.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{carrier.name}</CardTitle>
                        <CardDescription>{carrier.code}</CardDescription>
                      </div>
                      <Badge variant={carrier.isActive ? 'default' : 'outline'}>
                        {carrier.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-gray-500">Total Deliveries</div>
                          <div className="font-medium">{carrier.totalDeliveries}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">On-Time Rate</div>
                          <div className="font-medium">{carrier.onTimeRate}%</div>
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500 text-sm">Service Areas</div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {carrier.serviceAreas.slice(0, 3).map((area, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {area}
                            </Badge>
                          ))}
                          {carrier.serviceAreas.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{carrier.serviceAreas.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500 text-sm">Contact</div>
                        <div className="text-sm">{carrier.contactInfo.phone}</div>
                        <div className="text-sm">{carrier.contactInfo.email}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function RouteForm({ 
  onSubmit, 
  onCancel 
}: { 
  onSubmit: (data: Partial<DeliveryRoute>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    name: '',
    deliveryDate: new Date().toISOString().split('T')[0],
    driverName: '',
    vehicleType: '',
    vehicleNumber: '',
    vehicleCapacity: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      vehicleInfo: {
        type: formData.vehicleType,
        number: formData.vehicleNumber,
        capacity: formData.vehicleCapacity
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Route Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter route name"
          required
        />
      </div>

      <div>
        <Label htmlFor="deliveryDate">Delivery Date</Label>
        <Input
          id="deliveryDate"
          type="date"
          value={formData.deliveryDate}
          onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="driverName">Driver Name</Label>
        <Input
          id="driverName"
          value={formData.driverName}
          onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
          placeholder="Enter driver name"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="vehicleType">Vehicle Type</Label>
          <Select value={formData.vehicleType} onValueChange={(value) => setFormData({ ...formData, vehicleType: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select vehicle type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bike">Bike</SelectItem>
              <SelectItem value="scooter">Scooter</SelectItem>
              <SelectItem value="car">Car</SelectItem>
              <SelectItem value="van">Van</SelectItem>
              <SelectItem value="truck">Truck</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="vehicleNumber">Vehicle Number</Label>
          <Input
            id="vehicleNumber"
            value={formData.vehicleNumber}
            onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
            placeholder="Enter vehicle number"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="vehicleCapacity">Vehicle Capacity (kg)</Label>
        <Input
          id="vehicleCapacity"
          type="number"
          value={formData.vehicleCapacity}
          onChange={(e) => setFormData({ ...formData, vehicleCapacity: parseInt(e.target.value) || 0 })}
          placeholder="Enter vehicle capacity"
          required
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Create Route
        </Button>
      </div>
    </form>
  );
}