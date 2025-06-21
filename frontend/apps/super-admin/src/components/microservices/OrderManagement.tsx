import React, { useState, useEffect } from 'react';
import { apiClient } from '../../lib/apiClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { ShoppingCart, Package, Truck, CheckCircle, Clock, DollarSign, User, MapPin } from 'lucide-react';

interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  itemCount: number;
  items: OrderItem[];
  shippingAddress: Address;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  deliveryDate?: string;
}

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, searchTerm]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const ordersData = await apiClient.get('/api/direct-data/orders', {
        status: statusFilter !== 'all' ? statusFilter : undefined,
        search: searchTerm
      });
      setOrders(ordersData || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await apiClient.put(`/api/direct-data/orders/${orderId}`, { status: newStatus });
      fetchOrders();
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const processPayment = async (orderId: string) => {
    try {
      await apiClient.post(`/api/direct-data/orders/${orderId}/payment`, { action: 'process' });
      fetchOrders();
    } catch (error) {
      console.error('Failed to process payment:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'confirmed': return 'default';
      case 'processing': return 'default';
      case 'shipped': return 'default';
      case 'delivered': return 'default';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'default';
      case 'pending': return 'secondary';
      case 'failed': return 'destructive';
      case 'refunded': return 'secondary';
      default: return 'secondary';
    }
  };

  const filteredOrders = orders.filter(order => 
    order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading order management...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Order Management</h2>
          <p className="text-muted-foreground">Track and manage customer orders, payments, and fulfillment</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="text-sm">
            <ShoppingCart className="w-4 h-4 mr-1" />
            {orders.length} Total Orders
          </Badge>
          <Badge variant="outline" className="text-sm">
            <DollarSign className="w-4 h-4 mr-1" />
            ${orders.reduce((sum, order) => sum + order.totalAmount, 0).toFixed(2)}
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="flex-1">
          <Input
            placeholder="Search by order number, customer name, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border rounded-md"
        >
          <option value="all">All Orders</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders List */}
      <div className="grid gap-4">
        {filteredOrders.map((order) => (
          <Card key={order.id} className="cursor-pointer hover:bg-accent/50" onClick={() => setSelectedOrder(order)}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{order.orderNumber}</CardTitle>
                    <CardDescription className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>{order.customerName}</span>
                      <span>•</span>
                      <span>{order.customerEmail}</span>
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                  <Badge variant={getPaymentStatusColor(order.paymentStatus)}>
                    {order.paymentStatus}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Package className="w-4 h-4 text-muted-foreground" />
                  <span>{order.itemCount} items</span>
                </div>
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  <span>${order.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{order.shippingAddress.city}, {order.shippingAddress.state}</span>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="flex gap-2 mt-4">
                {order.status === 'pending' && (
                  <Button size="sm" onClick={(e) => { e.stopPropagation(); updateOrderStatus(order.id, 'confirmed'); }}>
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Confirm
                  </Button>
                )}
                {order.status === 'confirmed' && (
                  <Button size="sm" onClick={(e) => { e.stopPropagation(); updateOrderStatus(order.id, 'processing'); }}>
                    <Package className="w-4 h-4 mr-1" />
                    Process
                  </Button>
                )}
                {order.status === 'processing' && (
                  <Button size="sm" onClick={(e) => { e.stopPropagation(); updateOrderStatus(order.id, 'shipped'); }}>
                    <Truck className="w-4 h-4 mr-1" />
                    Ship
                  </Button>
                )}
                {order.paymentStatus === 'pending' && (
                  <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); processPayment(order.id); }}>
                    <DollarSign className="w-4 h-4 mr-1" />
                    Process Payment
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Order Details: {selectedOrder.orderNumber}</h3>
                <Button variant="ghost" onClick={() => setSelectedOrder(null)}>×</Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Info */}
                <Card>
                  <CardHeader>
                    <CardTitle>Customer Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p><strong>Name:</strong> {selectedOrder.customerName}</p>
                    <p><strong>Email:</strong> {selectedOrder.customerEmail}</p>
                    <p><strong>Order Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                  </CardContent>
                </Card>

                {/* Shipping Address */}
                <Card>
                  <CardHeader>
                    <CardTitle>Shipping Address</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{selectedOrder.shippingAddress.street}</p>
                    <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}</p>
                    <p>{selectedOrder.shippingAddress.country}</p>
                  </CardContent>
                </Card>

                {/* Order Items */}
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Order Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedOrder.items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                          <div>
                            <p className="font-medium">{item.productName}</p>
                            <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${item.totalPrice.toFixed(2)}</p>
                            <p className="text-sm text-muted-foreground">${item.unitPrice.toFixed(2)} each</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between items-center font-bold text-lg">
                        <span>Total:</span>
                        <span>${selectedOrder.totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}