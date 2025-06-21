import React, { useState, useEffect } from 'react';
import { apiClient } from '../../lib/apiClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Users, UserCheck, Bell, RefreshCcw, Search, Eye, Edit, MessageSquare, Phone } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  branchId: string;
  branchName: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: string;
  subscriptions: Subscription[];
  status: 'active' | 'inactive' | 'blocked';
  joinDate: string;
  loyaltyPoints: number;
  preferredLanguage: string;
  communicationPreferences: {
    email: boolean;
    sms: boolean;
    whatsapp: boolean;
    push: boolean;
  };
}

interface Subscription {
  id: string;
  customerId: string;
  planType: 'daily' | 'weekly' | 'monthly';
  status: 'active' | 'paused' | 'cancelled' | 'expired';
  startDate: string;
  endDate?: string;
  nextDelivery: string;
  items: SubscriptionItem[];
  totalValue: number;
}

interface SubscriptionItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

interface NotificationCampaign {
  id: string;
  name: string;
  type: 'promotional' | 'informational' | 'reminder' | 'alert';
  channel: 'email' | 'sms' | 'whatsapp' | 'push' | 'all';
  targetSegment: string;
  message: string;
  scheduledAt: string;
  status: 'draft' | 'scheduled' | 'sent' | 'cancelled';
  recipientCount: number;
  deliveredCount: number;
  openRate?: number;
}

interface CustomerSegment {
  id: string;
  name: string;
  description: string;
  criteria: {
    minOrders?: number;
    minSpent?: number;
    lastOrderDays?: number;
    branch?: string;
    subscriptionStatus?: string;
  };
  customerCount: number;
}

export default function CustomerRelationshipHub() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [campaigns, setCampaigns] = useState<NotificationCampaign[]>([]);
  const [segments, setSegments] = useState<CustomerSegment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'customers' | 'subscriptions' | 'communications' | 'segments'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isCampaignDialogOpen, setIsCampaignDialogOpen] = useState(false);

  useEffect(() => {
    fetchCustomerData();
  }, [searchTerm, statusFilter]);

  const fetchCustomerData = async () => {
    try {
      setLoading(true);
      const [customersData, subscriptionsData, campaignsData, segmentsData] = await Promise.all([
        apiClient.get('/api/direct-data/customers', {
          search: searchTerm,
          status: statusFilter !== 'all' ? statusFilter : undefined
        }),
        apiClient.get('/api/direct-data/subscriptions'),
        apiClient.get('/api/direct-data/notification-campaigns'),
        apiClient.get('/api/direct-data/customer-segments')
      ]);
      
      setCustomers(customersData || []);
      setSubscriptions(subscriptionsData || []);
      setCampaigns(campaignsData || []);
      setSegments(segmentsData || []);
    } catch (error) {
      console.error('Failed to fetch customer data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateCustomerStatus = async (customerId: string, status: string) => {
    try {
      await apiClient.put(`/api/direct-data/customers/${customerId}`, { status });
      fetchCustomerData();
    } catch (error) {
      console.error('Failed to update customer status:', error);
    }
  };

  const pauseSubscription = async (subscriptionId: string) => {
    try {
      await apiClient.put(`/api/direct-data/subscriptions/${subscriptionId}`, { status: 'paused' });
      fetchCustomerData();
    } catch (error) {
      console.error('Failed to pause subscription:', error);
    }
  };

  const createNotificationCampaign = async (campaignData: Partial<NotificationCampaign>) => {
    try {
      await apiClient.post('/api/direct-data/notification-campaigns', campaignData);
      fetchCustomerData();
      setIsCampaignDialogOpen(false);
    } catch (error) {
      console.error('Failed to create campaign:', error);
    }
  };

  const sendPersonalizedMessage = async (customerId: string, message: string, channel: string) => {
    try {
      await apiClient.post('/api/direct-data/customer-messages', {
        customerId,
        message,
        channel,
        type: 'personal'
      });
      fetchCustomerData();
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const getCustomerStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'inactive': return 'secondary';
      case 'blocked': return 'destructive';
      default: return 'outline';
    }
  };

  const getSubscriptionStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'paused': return 'secondary';
      case 'cancelled': return 'outline';
      case 'expired': return 'destructive';
      default: return 'outline';
    }
  };

  const getCampaignStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'default';
      case 'scheduled': return 'secondary';
      case 'draft': return 'outline';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === 'active').length;
  const activeSubscriptions = subscriptions.filter(s => s.status === 'active').length;
  const totalLoyaltyPoints = customers.reduce((sum, customer) => sum + customer.loyaltyPoints, 0);

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading Customer Relationship Hub...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customer Relationship Hub</h1>
          <p className="text-gray-500">Complete customer lifecycle management</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isCampaignDialogOpen} onOpenChange={setIsCampaignDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Bell className="h-4 w-4 mr-2" />
                Create Campaign
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Notification Campaign</DialogTitle>
                <DialogDescription>Send targeted messages to customer segments</DialogDescription>
              </DialogHeader>
              <CampaignForm onSubmit={createNotificationCampaign} onCancel={() => setIsCampaignDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Customer Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <UserCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeCustomers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <RefreshCcw className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{activeSubscriptions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Loyalty Points</CardTitle>
            <Users className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{totalLoyaltyPoints.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-4 border-b">
        {['overview', 'customers', 'subscriptions', 'communications', 'segments'].map((tab) => (
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
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tab Content */}
      {activeTab === 'customers' && (
        <Card>
          <CardHeader>
            <CardTitle>Customer Management</CardTitle>
            <CardDescription>Manage customer profiles and relationships</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Customer</th>
                    <th className="text-left py-3 px-4 font-medium">Contact</th>
                    <th className="text-left py-3 px-4 font-medium">Orders</th>
                    <th className="text-left py-3 px-4 font-medium">Total Spent</th>
                    <th className="text-left py-3 px-4 font-medium">Loyalty Points</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Branch</th>
                    <th className="text-left py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="font-medium">{customer.firstName} {customer.lastName}</div>
                        <div className="text-sm text-gray-500">
                          Joined: {new Date(customer.joinDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm">{customer.email}</div>
                        <div className="text-sm text-gray-500">{customer.phone}</div>
                      </td>
                      <td className="py-3 px-4">{customer.totalOrders}</td>
                      <td className="py-3 px-4">₹{customer.totalSpent.toLocaleString()}</td>
                      <td className="py-3 px-4">{customer.loyaltyPoints}</td>
                      <td className="py-3 px-4">
                        <Badge variant={getCustomerStatusColor(customer.status)}>
                          {customer.status.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">{customer.branchName}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => setSelectedCustomer(customer)}>
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Message
                          </Button>
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

      {activeTab === 'subscriptions' && (
        <Card>
          <CardHeader>
            <CardTitle>Subscription Management</CardTitle>
            <CardDescription>Monitor and manage customer subscriptions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Subscription ID</th>
                    <th className="text-left py-3 px-4 font-medium">Customer</th>
                    <th className="text-left py-3 px-4 font-medium">Plan</th>
                    <th className="text-left py-3 px-4 font-medium">Value</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Next Delivery</th>
                    <th className="text-left py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptions.map((subscription) => (
                    <tr key={subscription.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="font-mono text-sm">#{subscription.id.slice(-6)}</div>
                      </td>
                      <td className="py-3 px-4">{subscription.customerId}</td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">{subscription.planType.toUpperCase()}</Badge>
                      </td>
                      <td className="py-3 px-4">₹{subscription.totalValue}</td>
                      <td className="py-3 px-4">
                        <Badge variant={getSubscriptionStatusColor(subscription.status)}>
                          {subscription.status.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        {new Date(subscription.nextDelivery).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          {subscription.status === 'active' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => pauseSubscription(subscription.id)}
                            >
                              Pause
                            </Button>
                          )}
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

      {activeTab === 'communications' && (
        <Card>
          <CardHeader>
            <CardTitle>Communication Campaigns</CardTitle>
            <CardDescription>Manage notification campaigns and messaging</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Campaign</th>
                    <th className="text-left py-3 px-4 font-medium">Type</th>
                    <th className="text-left py-3 px-4 font-medium">Channel</th>
                    <th className="text-left py-3 px-4 font-medium">Recipients</th>
                    <th className="text-left py-3 px-4 font-medium">Delivered</th>
                    <th className="text-left py-3 px-4 font-medium">Open Rate</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Scheduled</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((campaign) => (
                    <tr key={campaign.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="font-medium">{campaign.name}</div>
                        <div className="text-sm text-gray-500 max-w-xs truncate">
                          {campaign.message}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">{campaign.type}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">{campaign.channel}</Badge>
                      </td>
                      <td className="py-3 px-4">{campaign.recipientCount}</td>
                      <td className="py-3 px-4">{campaign.deliveredCount}</td>
                      <td className="py-3 px-4">
                        {campaign.openRate ? `${campaign.openRate}%` : '-'}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={getCampaignStatusColor(campaign.status)}>
                          {campaign.status.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        {new Date(campaign.scheduledAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'segments' && (
        <Card>
          <CardHeader>
            <CardTitle>Customer Segments</CardTitle>
            <CardDescription>Manage customer segmentation for targeted campaigns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {segments.map((segment) => (
                <Card key={segment.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{segment.name}</CardTitle>
                    <CardDescription>{segment.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Customers:</span>
                        <span className="font-medium">{segment.customerCount}</span>
                      </div>
                      {segment.criteria.minOrders && (
                        <div className="flex justify-between text-sm">
                          <span>Min Orders:</span>
                          <span>{segment.criteria.minOrders}+</span>
                        </div>
                      )}
                      {segment.criteria.minSpent && (
                        <div className="flex justify-between text-sm">
                          <span>Min Spent:</span>
                          <span>₹{segment.criteria.minSpent}+</span>
                        </div>
                      )}
                      <div className="pt-2 flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          Edit
                        </Button>
                        <Button size="sm" className="flex-1">
                          Target
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

      {/* Customer Details Dialog */}
      {selectedCustomer && (
        <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Customer Profile - {selectedCustomer.firstName} {selectedCustomer.lastName}</DialogTitle>
              <DialogDescription>Complete customer information and history</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Contact Information</Label>
                  <div className="mt-1">
                    <div>{selectedCustomer.email}</div>
                    <div>{selectedCustomer.phone}</div>
                    <div className="text-sm text-gray-500">{selectedCustomer.address}</div>
                  </div>
                </div>
                <div>
                  <Label>Customer Stats</Label>
                  <div className="mt-1 space-y-1">
                    <div>Total Orders: {selectedCustomer.totalOrders}</div>
                    <div>Total Spent: ₹{selectedCustomer.totalSpent.toLocaleString()}</div>
                    <div>Loyalty Points: {selectedCustomer.loyaltyPoints}</div>
                  </div>
                </div>
              </div>
              <div>
                <Label>Communication Preferences</Label>
                <div className="mt-2 flex gap-2">
                  {selectedCustomer.communicationPreferences.email && (
                    <Badge variant="outline">Email</Badge>
                  )}
                  {selectedCustomer.communicationPreferences.sms && (
                    <Badge variant="outline">SMS</Badge>
                  )}
                  {selectedCustomer.communicationPreferences.whatsapp && (
                    <Badge variant="outline">WhatsApp</Badge>
                  )}
                  {selectedCustomer.communicationPreferences.push && (
                    <Badge variant="outline">Push Notifications</Badge>
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <Label>Active Subscriptions</Label>
                  <div className="text-lg font-bold">{selectedCustomer.subscriptions.length}</div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => sendPersonalizedMessage(selectedCustomer.id, 'Thank you for being a valued customer!', 'email')}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                  <Button variant="outline" onClick={() => setSelectedCustomer(null)}>
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

function CampaignForm({ 
  onSubmit, 
  onCancel 
}: { 
  onSubmit: (data: Partial<NotificationCampaign>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'promotional' as const,
    channel: 'email' as const,
    message: '',
    targetSegment: 'all',
    scheduledAt: new Date().toISOString().slice(0, 16)
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Campaign Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="type">Campaign Type</Label>
          <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="promotional">Promotional</SelectItem>
              <SelectItem value="informational">Informational</SelectItem>
              <SelectItem value="reminder">Reminder</SelectItem>
              <SelectItem value="alert">Alert</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="channel">Channel</Label>
          <Select value={formData.channel} onValueChange={(value: any) => setFormData({ ...formData, channel: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="sms">SMS</SelectItem>
              <SelectItem value="whatsapp">WhatsApp</SelectItem>
              <SelectItem value="push">Push Notification</SelectItem>
              <SelectItem value="all">All Channels</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          rows={4}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="targetSegment">Target Segment</Label>
          <Select value={formData.targetSegment} onValueChange={(value) => setFormData({ ...formData, targetSegment: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Customers</SelectItem>
              <SelectItem value="active">Active Customers</SelectItem>
              <SelectItem value="vip">VIP Customers</SelectItem>
              <SelectItem value="inactive">Inactive Customers</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="scheduledAt">Schedule Date & Time</Label>
          <Input
            id="scheduledAt"
            type="datetime-local"
            value={formData.scheduledAt}
            onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Create Campaign
        </Button>
      </div>
    </form>
  );
}