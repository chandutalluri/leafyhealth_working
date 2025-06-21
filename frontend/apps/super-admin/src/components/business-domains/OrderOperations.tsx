import React, { useState, useEffect } from 'react';
import { apiClient } from '../../lib/apiClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { ShoppingCart, CreditCard, Truck, HeadphonesIcon, Search, Eye, RefreshCw, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  shippingStatus: 'not_shipped' | 'shipped' | 'in_transit' | 'delivered';
  deliveryAddress: string;
  branchId: string;
  branchName: string;
  createdAt: string;
  updatedAt: string;
}

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

interface Payment {
  id: string;
  orderId: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  method: 'card' | 'upi' | 'netbanking' | 'cod' | 'wallet';
  gateway: string;
  transactionId?: string;
  createdAt: string;
}

interface DeliveryRoute {
  id: string;
  name: string;
  driverId: string;
  driverName: string;
  orders: Order[];
  status: 'planned' | 'in_progress' | 'completed';
  estimatedDuration: number;
  actualDuration?: number;
}

interface SupportTicket {
  id: string;
  orderId: string;
  customerId: string;
  customerName: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: string;
  createdAt: string;
}

export default function OrderOperations() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [deliveryRoutes, setDeliveryRoutes] = useState<DeliveryRoute[]>([]);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'payments' | 'delivery' | 'support'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrderOperationsData();
  }, [searchTerm, statusFilter]);

  const fetchOrderOperationsData = async () => {
    try {
      setLoading(true);
      const [ordersData, paymentsData, deliveryData, supportData] = await Promise.all([
        apiClient.get('/api/direct-data/orders', {
          search: searchTerm,
          status: statusFilter !== 'all' ? statusFilter : undefined
        }),
        apiClient.get('/api/direct-data/payments'),
        apiClient.get('/api/direct-data/delivery-routes'),
        apiClient.get('/api/direct-data/support-tickets')
      ]);
      
      setOrders(ordersData || []);
      setPayments(paymentsData || []);
      setDeliveryRoutes(deliveryData || []);
      setSupportTickets(supportData || []);
    } catch (error) {
      console.error('Failed to fetch order operations data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      await apiClient.put(`/api/direct-data/orders/${orderId}`, { status });
      
      // If order is confirmed, automatically process payment
      if (status === 'confirmed') {
        await apiClient.post(`/api/direct-data/payments/${orderId}/process`);
      }
      
      // If order is shipped, create delivery route
      if (status === 'shipped') {
        await apiClient.post('/api/direct-data/delivery-routes', {
          orderIds: [orderId],
          driverId: 'auto-assign'
        });
      }
      
      fetchOrderOperationsData();
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const processRefund = async (paymentId: string, amount: number) => {
    try {
      await apiClient.post(`/api/direct-data/payments/${paymentId}/refund`, { amount });
      fetchOrderOperationsData();
    } catch (error) {
      console.error('Failed to process refund:', error);
    }
  };

  const createSupportTicket = async (orderId: string, issue: string) => {
    try {
      await apiClient.post('/api/direct-data/support-tickets', {
        orderId,
        subject: `Order Issue: ${issue}`,
        description: `Customer reported issue with order`,
        priority: 'medium'
      });
      fetchOrderOperationsData();
    } catch (error) {
      console.error('Failed to create support ticket:', error);
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'default';
      case 'shipped': return 'default';
      case 'confirmed': return 'secondary';
      case 'processing': return 'secondary';
      case 'pending': return 'outline';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'processing': return 'secondary';
      case 'pending': return 'outline';
      case 'failed': return 'destructive';
      case 'refunded': return 'secondary';
      default: return 'outline';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const filteredOrders = orders.filter(order =>
    order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'confirmed').length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const pendingPayments = payments.filter(p => p.status === 'pending').length;

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading Order Operations...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order Operations Center</h1>
          <p className="text-gray-500">End-to-end order processing and fulfillment</p>
        </div>
      </div>

      {/* Operations Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₹{totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <CreditCard className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{pendingPayments}</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common operational tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => updateOrderStatus('bulk', 'confirmed')}>
              Process Pending Orders
            </Button>
            <Button variant="outline" onClick={() => fetchOrderOperationsData()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
            <Button variant="outline">
              <Truck className="h-4 w-4 mr-2" />
              Create Delivery Route
            </Button>
            <Button variant="outline">
              <HeadphonesIcon className="h-4 w-4 mr-2" />
              View Support Queue
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Tabs */}
      <div className="flex space-x-4 border-b">
        {['overview', 'orders', 'payments', 'delivery', 'support'].map((tab) => (
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
          <CardTitle className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Search & Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Search orders or customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tab Content */}
      {activeTab === 'orders' && (
        <Card>
          <CardHeader>
            <CardTitle>Order Management</CardTitle>
            <CardDescription>Process and track all customer orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Order #</th>
                    <th className="text-left py-3 px-4 font-medium">Customer</th>
                    <th className="text-left py-3 px-4 font-medium">Items</th>
                    <th className="text-left py-3 px-4 font-medium">Amount</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Payment</th>
                    <th className="text-left py-3 px-4 font-medium">Branch</th>
                    <th className="text-left py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="font-medium">{order.orderNumber}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium">{order.customerName}</div>
                        <div className="text-sm text-gray-500">{order.customerEmail}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm">
                          {order.items.length} items
                        </div>
                      </td>
                      <td className="py-3 px-4">₹{order.totalAmount}</td>
                      <td className="py-3 px-4">
                        <Badge variant={getOrderStatusColor(order.status)}>
                          {order.status.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={getPaymentStatusColor(order.paymentStatus)}>
                          {order.paymentStatus.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">{order.branchName}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => setSelectedOrder(order)}>
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Select onValueChange={(status) => updateOrderStatus(order.id, status)}>
                            <SelectTrigger className="w-28">
                              <SelectValue placeholder="Update" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="confirmed">Confirm</SelectItem>
                              <SelectItem value="processing">Process</SelectItem>
                              <SelectItem value="shipped">Ship</SelectItem>
                              <SelectItem value="delivered">Deliver</SelectItem>
                              <SelectItem value="cancelled">Cancel</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'payments' && (
        <Card>
          <CardHeader>
            <CardTitle>Payment Processing</CardTitle>
            <CardDescription>Monitor transactions and process refunds</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Transaction ID</th>
                    <th className="text-left py-3 px-4 font-medium">Order #</th>
                    <th className="text-left py-3 px-4 font-medium">Amount</th>
                    <th className="text-left py-3 px-4 font-medium">Method</th>
                    <th className="text-left py-3 px-4 font-medium">Gateway</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Date</th>
                    <th className="text-left py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="font-mono text-sm">{payment.transactionId || 'N/A'}</div>
                      </td>
                      <td className="py-3 px-4">{payment.orderId}</td>
                      <td className="py-3 px-4">₹{payment.amount}</td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">{payment.method.toUpperCase()}</Badge>
                      </td>
                      <td className="py-3 px-4">{payment.gateway}</td>
                      <td className="py-3 px-4">
                        <Badge variant={getPaymentStatusColor(payment.status)}>
                          {payment.status.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        {payment.status === 'completed' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => processRefund(payment.id, payment.amount)}
                          >
                            Refund
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'delivery' && (
        <Card>
          <CardHeader>
            <CardTitle>Delivery Management</CardTitle>
            <CardDescription>Coordinate delivery routes and tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {deliveryRoutes.map((route) => (
                <Card key={route.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{route.name}</CardTitle>
                        <CardDescription>Driver: {route.driverName}</CardDescription>
                      </div>
                      <Badge variant={route.status === 'completed' ? 'default' : 'secondary'}>
                        {route.status.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Orders:</span>
                        <span>{route.orders.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Estimated Time:</span>
                        <span>{route.estimatedDuration} mins</span>
                      </div>
                      {route.actualDuration && (
                        <div className="flex justify-between text-sm">
                          <span>Actual Time:</span>
                          <span>{route.actualDuration} mins</span>
                        </div>
                      )}
                      <div className="pt-2">
                        <Button size="sm" className="w-full">
                          Track Route
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'support' && (
        <Card>
          <CardHeader>
            <CardTitle>Customer Support</CardTitle>
            <CardDescription>Handle customer inquiries and issues</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Ticket ID</th>
                    <th className="text-left py-3 px-4 font-medium">Customer</th>
                    <th className="text-left py-3 px-4 font-medium">Order #</th>
                    <th className="text-left py-3 px-4 font-medium">Subject</th>
                    <th className="text-left py-3 px-4 font-medium">Priority</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Created</th>
                    <th className="text-left py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {supportTickets.map((ticket) => (
                    <tr key={ticket.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="font-mono text-sm">#{ticket.id.slice(-6)}</div>
                      </td>
                      <td className="py-3 px-4">{ticket.customerName}</td>
                      <td className="py-3 px-4">{ticket.orderId}</td>
                      <td className="py-3 px-4">
                        <div className="max-w-xs truncate">{ticket.subject}</div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={getPriorityColor(ticket.priority)}>
                          {ticket.priority.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={ticket.status === 'resolved' ? 'default' : 'secondary'}>
                          {ticket.status.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Order Details Dialog */}
      {selectedOrder && (
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Order Details - {selectedOrder.orderNumber}</DialogTitle>
              <DialogDescription>Complete order information and status</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Customer</Label>
                  <div className="font-medium">{selectedOrder.customerName}</div>
                  <div className="text-sm text-gray-500">{selectedOrder.customerEmail}</div>
                </div>
                <div>
                  <Label>Status</Label>
                  <div className="flex gap-2 mt-1">
                    <Badge variant={getOrderStatusColor(selectedOrder.status)}>
                      {selectedOrder.status.toUpperCase()}
                    </Badge>
                    <Badge variant={getPaymentStatusColor(selectedOrder.paymentStatus)}>
                      {selectedOrder.paymentStatus.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </div>
              <div>
                <Label>Order Items</Label>
                <div className="mt-2 space-y-2">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex justify-between p-2 bg-gray-50 rounded">
                      <div>
                        <div className="font-medium">{item.productName}</div>
                        <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
                      </div>
                      <div className="text-right">
                        <div>₹{item.price} each</div>
                        <div className="font-medium">₹{item.total}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <Label>Total Amount</Label>
                  <div className="text-lg font-bold">₹{selectedOrder.totalAmount}</div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => createSupportTicket(selectedOrder.id, 'General Inquiry')}>
                    Create Support Ticket
                  </Button>
                  <Button variant="outline" onClick={() => setSelectedOrder(null)}>
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}