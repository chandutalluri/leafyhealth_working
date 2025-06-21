import React, { useState, useEffect } from 'react';
import { apiClient } from '../../lib/apiClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Bell, Mail, MessageSquare, Phone, Send, Users, Plus, Filter } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'email' | 'sms' | 'push' | 'in_app' | 'whatsapp';
  status: 'pending' | 'sent' | 'delivered' | 'failed' | 'read';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  recipientType: 'individual' | 'group' | 'branch' | 'all_users' | 'role_based';
  recipients: string[];
  scheduledAt?: string;
  sentAt?: string;
  deliveredAt?: string;
  branchId?: string;
  branchName?: string;
  createdBy: string;
  createdAt: string;
}

interface NotificationTemplate {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'push' | 'in_app' | 'whatsapp';
  subject: string;
  bodyTemplate: string;
  variables: string[];
  isActive: boolean;
  category: 'order' | 'promotion' | 'system' | 'reminder' | 'alert';
  createdAt: string;
}

interface NotificationPreference {
  id: string;
  userId: string;
  userName: string;
  emailEnabled: boolean;
  smsEnabled: boolean;
  pushEnabled: boolean;
  whatsappEnabled: boolean;
  categories: {
    orders: boolean;
    promotions: boolean;
    system: boolean;
    reminders: boolean;
    alerts: boolean;
  };
}

export default function NotificationService() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreference[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'notifications' | 'templates' | 'preferences'>('notifications');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isNotificationDialogOpen, setIsNotificationDialogOpen] = useState(false);

  useEffect(() => {
    fetchNotificationData();
  }, [statusFilter, typeFilter, searchTerm]);

  const fetchNotificationData = async () => {
    try {
      setLoading(true);
      const [notificationsData, templatesData, preferencesData] = await Promise.all([
        apiClient.get('/api/direct-data/notifications', {
          status: statusFilter !== 'all' ? statusFilter : undefined,
          type: typeFilter !== 'all' ? typeFilter : undefined,
          search: searchTerm
        }),
        apiClient.get('/api/direct-data/notification-templates'),
        apiClient.get('/api/direct-data/notification-preferences')
      ]);
      setNotifications(notificationsData || []);
      setTemplates(templatesData || []);
      setPreferences(preferencesData || []);
    } catch (error) {
      console.error('Failed to fetch notification data:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendNotification = async (notificationData: Partial<Notification>) => {
    try {
      await apiClient.post('/api/direct-data/notifications/send', notificationData);
      fetchNotificationData();
      setIsNotificationDialogOpen(false);
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  };

  const retryNotification = async (notificationId: string) => {
    try {
      await apiClient.post(`/api/direct-data/notifications/${notificationId}/retry`);
      fetchNotificationData();
    } catch (error) {
      console.error('Failed to retry notification:', error);
    }
  };

  const updateTemplate = async (templateId: string, updates: Partial<NotificationTemplate>) => {
    try {
      await apiClient.put(`/api/direct-data/notification-templates/${templateId}`, updates);
      fetchNotificationData();
    } catch (error) {
      console.error('Failed to update template:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'default';
      case 'delivered': return 'default';
      case 'pending': return 'secondary';
      case 'failed': return 'destructive';
      case 'read': return 'outline';
      default: return 'secondary';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'sms': return <MessageSquare className="h-4 w-4" />;
      case 'phone': return <Phone className="h-4 w-4" />;
      case 'push':
      case 'in_app':
        return <Bell className="h-4 w-4" />;
      default: return <Send className="h-4 w-4" />;
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

  const filteredNotifications = notifications.filter(notification =>
    notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notification.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalNotifications = notifications.length;
  const sentNotifications = notifications.filter(n => n.status === 'sent' || n.status === 'delivered').length;
  const failedNotifications = notifications.filter(n => n.status === 'failed').length;
  const deliveryRate = totalNotifications > 0 ? Math.round((sentNotifications / totalNotifications) * 100) : 0;

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading notification service...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notification Service</h1>
          <p className="text-gray-500">Manage multi-channel notifications and messaging</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isNotificationDialogOpen} onOpenChange={setIsNotificationDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Send Notification
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Send New Notification</DialogTitle>
                <DialogDescription>Create and send a notification to users</DialogDescription>
              </DialogHeader>
              <NotificationForm onSubmit={sendNotification} onCancel={() => setIsNotificationDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Notification Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sent</CardTitle>
            <Send className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalNotifications}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
            <Bell className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{sentNotifications}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <MessageSquare className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{failedNotifications}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivery Rate</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{deliveryRate}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b">
        {['notifications', 'templates', 'preferences'].map((tab) => (
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
            <Filter className="h-4 w-4" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Search notifications..."
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
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="read">Read</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
                <SelectItem value="push">Push</SelectItem>
                <SelectItem value="in_app">In-App</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Content based on active tab */}
      {activeTab === 'notifications' && (
        <Card>
          <CardHeader>
            <CardTitle>Notification History</CardTitle>
            <CardDescription>All sent notifications and their delivery status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Title</th>
                    <th className="text-left py-3 px-4 font-medium">Type</th>
                    <th className="text-left py-3 px-4 font-medium">Recipients</th>
                    <th className="text-left py-3 px-4 font-medium">Priority</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Sent</th>
                    <th className="text-left py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredNotifications.map((notification) => (
                    <tr key={notification.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="font-medium">{notification.title}</div>
                        <div className="text-sm text-gray-500 max-w-xs truncate">
                          {notification.message}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className="gap-1">
                          {getTypeIcon(notification.type)}
                          {notification.type.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div>{notification.recipients.length} recipients</div>
                        <div className="text-sm text-gray-500">{notification.recipientType}</div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={getPriorityColor(notification.priority)}>
                          {notification.priority.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={getStatusColor(notification.status)}>
                          {notification.status.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {notification.sentAt ? new Date(notification.sentAt).toLocaleString() : '-'}
                      </td>
                      <td className="py-3 px-4">
                        {notification.status === 'failed' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => retryNotification(notification.id)}
                          >
                            Retry
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

      {activeTab === 'templates' && (
        <Card>
          <CardHeader>
            <CardTitle>Notification Templates</CardTitle>
            <CardDescription>Manage reusable notification templates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map((template) => (
                <Card key={template.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <CardDescription>{template.category} template</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant={template.isActive ? 'default' : 'outline'}>
                          {template.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <Badge variant="outline" className="gap-1">
                          {getTypeIcon(template.type)}
                          {template.type.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm font-medium">Subject</div>
                        <div className="text-sm text-gray-600">{template.subject}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">Template</div>
                        <div className="text-sm text-gray-600 max-h-20 overflow-y-auto">
                          {template.bodyTemplate}
                        </div>
                      </div>
                      {template.variables.length > 0 && (
                        <div>
                          <div className="text-sm font-medium">Variables</div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {template.variables.map((variable, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {variable}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant={template.isActive ? 'destructive' : 'default'}
                          onClick={() => updateTemplate(template.id, { isActive: !template.isActive })}
                        >
                          {template.isActive ? 'Deactivate' : 'Activate'}
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

      {activeTab === 'preferences' && (
        <Card>
          <CardHeader>
            <CardTitle>User Preferences</CardTitle>
            <CardDescription>Manage user notification preferences and settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">User</th>
                    <th className="text-left py-3 px-4 font-medium">Email</th>
                    <th className="text-left py-3 px-4 font-medium">SMS</th>
                    <th className="text-left py-3 px-4 font-medium">Push</th>
                    <th className="text-left py-3 px-4 font-medium">WhatsApp</th>
                    <th className="text-left py-3 px-4 font-medium">Categories</th>
                  </tr>
                </thead>
                <tbody>
                  {preferences.map((preference) => (
                    <tr key={preference.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{preference.userName}</td>
                      <td className="py-3 px-4">
                        <Badge variant={preference.emailEnabled ? 'default' : 'outline'}>
                          {preference.emailEnabled ? 'Enabled' : 'Disabled'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={preference.smsEnabled ? 'default' : 'outline'}>
                          {preference.smsEnabled ? 'Enabled' : 'Disabled'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={preference.pushEnabled ? 'default' : 'outline'}>
                          {preference.pushEnabled ? 'Enabled' : 'Disabled'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={preference.whatsappEnabled ? 'default' : 'outline'}>
                          {preference.whatsappEnabled ? 'Enabled' : 'Disabled'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(preference.categories)
                            .filter(([_, enabled]) => enabled)
                            .map(([category, _]) => (
                              <Badge key={category} variant="outline" className="text-xs">
                                {category}
                              </Badge>
                            ))}
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
    </div>
  );
}

function NotificationForm({ 
  onSubmit, 
  onCancel 
}: { 
  onSubmit: (data: Partial<Notification>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'email' as const,
    priority: 'medium' as const,
    recipientType: 'all_users' as const
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
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
          <Label htmlFor="type">Notification Type</Label>
          <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="sms">SMS</SelectItem>
              <SelectItem value="push">Push Notification</SelectItem>
              <SelectItem value="in_app">In-App</SelectItem>
              <SelectItem value="whatsapp">WhatsApp</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="priority">Priority</Label>
          <Select value={formData.priority} onValueChange={(value: any) => setFormData({ ...formData, priority: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="recipientType">Recipients</Label>
        <Select value={formData.recipientType} onValueChange={(value: any) => setFormData({ ...formData, recipientType: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all_users">All Users</SelectItem>
            <SelectItem value="branch">Branch Specific</SelectItem>
            <SelectItem value="role_based">Role Based</SelectItem>
            <SelectItem value="group">User Group</SelectItem>
            <SelectItem value="individual">Individual</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Send Notification
        </Button>
      </div>
    </form>
  );
}