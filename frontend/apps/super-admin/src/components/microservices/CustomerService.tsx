import React, { useState, useEffect } from 'react';
import { apiClient } from '../../lib/apiClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { MessageSquare, Phone, Mail, User, Clock, CheckCircle, AlertCircle, XCircle, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface SupportTicket {
  id: string;
  ticketNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'order_issue' | 'product_query' | 'billing' | 'technical' | 'complaint' | 'other';
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  responses: TicketResponse[];
}

interface TicketResponse {
  id: string;
  ticketId: string;
  message: string;
  isFromCustomer: boolean;
  respondedBy: string;
  createdAt: string;
}

export default function CustomerService() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [isTicketDialogOpen, setIsTicketDialogOpen] = useState(false);
  const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, [statusFilter, priorityFilter, searchTerm]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const ticketsData = await apiClient.get('/api/direct-data/customer-service/tickets', {
        status: statusFilter !== 'all' ? statusFilter : undefined,
        priority: priorityFilter !== 'all' ? priorityFilter : undefined,
        search: searchTerm
      });
      setTickets(ticketsData || []);
    } catch (error) {
      console.error('Failed to fetch support tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTicketStatus = async (ticketId: string, newStatus: string) => {
    try {
      await apiClient.put(`/api/direct-data/customer-service/tickets/${ticketId}`, { status: newStatus });
      fetchTickets();
    } catch (error) {
      console.error('Failed to update ticket status:', error);
    }
  };

  const assignTicket = async (ticketId: string, assigneeId: string) => {
    try {
      await apiClient.put(`/api/direct-data/customer-service/tickets/${ticketId}/assign`, { assignedTo: assigneeId });
      fetchTickets();
    } catch (error) {
      console.error('Failed to assign ticket:', error);
    }
  };

  const addResponse = async (ticketId: string, message: string) => {
    try {
      await apiClient.post(`/api/direct-data/customer-service/tickets/${ticketId}/responses`, {
        message,
        isFromCustomer: false
      });
      fetchTickets();
      setIsResponseDialogOpen(false);
    } catch (error) {
      console.error('Failed to add response:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'destructive';
      case 'in_progress': return 'secondary';
      case 'resolved': return 'default';
      case 'closed': return 'outline';
      default: return 'secondary';
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
      case 'open': return <AlertCircle className="h-4 w-4" />;
      case 'in_progress': return <Clock className="h-4 w-4" />;
      case 'resolved': return <CheckCircle className="h-4 w-4" />;
      case 'closed': return <XCircle className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const filteredTickets = tickets.filter(ticket =>
    ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading customer service...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customer Service</h1>
          <p className="text-gray-500">Manage customer support tickets and inquiries</p>
        </div>
      </div>

      {/* Service Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {tickets.filter(t => t.status === 'open').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {tickets.filter(t => t.status === 'in_progress').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {tickets.filter(t => t.status === 'resolved').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
            <MessageSquare className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">94%</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tickets Table */}
      <Card>
        <CardHeader>
          <CardTitle>Support Tickets</CardTitle>
          <CardDescription>All customer support requests and their current status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Ticket #</th>
                  <th className="text-left py-3 px-4 font-medium">Customer</th>
                  <th className="text-left py-3 px-4 font-medium">Subject</th>
                  <th className="text-left py-3 px-4 font-medium">Priority</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Created</th>
                  <th className="text-left py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-mono text-sm">{ticket.ticketNumber}</td>
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium">{ticket.customerName}</div>
                        <div className="text-sm text-gray-500">{ticket.customerEmail}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="max-w-xs truncate">{ticket.subject}</div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={getPriorityColor(ticket.priority)}>
                        {ticket.priority.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={getStatusColor(ticket.status)} className="gap-1">
                        {getStatusIcon(ticket.status)}
                        {ticket.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Dialog open={isTicketDialogOpen && selectedTicket?.id === ticket.id} onOpenChange={(open) => {
                          setIsTicketDialogOpen(open);
                          if (!open) setSelectedTicket(null);
                        }}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedTicket(ticket)}
                            >
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl">
                            <DialogHeader>
                              <DialogTitle>Ticket #{ticket.ticketNumber}</DialogTitle>
                              <DialogDescription>{ticket.subject}</DialogDescription>
                            </DialogHeader>
                            <TicketDetails
                              ticket={ticket}
                              onStatusChange={(status) => updateTicketStatus(ticket.id, status)}
                              onAddResponse={(message) => addResponse(ticket.id, message)}
                            />
                          </DialogContent>
                        </Dialog>
                        <Select value={ticket.status} onValueChange={(status) => updateTicketStatus(ticket.id, status)}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="open">Open</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
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
    </div>
  );
}

function TicketDetails({ 
  ticket, 
  onStatusChange, 
  onAddResponse 
}: { 
  ticket: SupportTicket; 
  onStatusChange: (status: string) => void;
  onAddResponse: (message: string) => void;
}) {
  const [responseMessage, setResponseMessage] = useState('');

  const handleAddResponse = (e: React.FormEvent) => {
    e.preventDefault();
    if (responseMessage.trim()) {
      onAddResponse(responseMessage);
      setResponseMessage('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Ticket Info */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Customer</Label>
          <div className="font-medium">{ticket.customerName}</div>
          <div className="text-sm text-gray-500">{ticket.customerEmail}</div>
        </div>
        <div>
          <Label>Priority</Label>
          <Badge variant={getPriorityColor(ticket.priority)}>
            {ticket.priority.toUpperCase()}
          </Badge>
        </div>
      </div>

      {/* Description */}
      <div>
        <Label>Description</Label>
        <div className="mt-2 p-4 bg-gray-50 rounded-lg">
          {ticket.description}
        </div>
      </div>

      {/* Responses */}
      <div>
        <Label>Conversation</Label>
        <div className="mt-2 space-y-4 max-h-96 overflow-y-auto">
          {ticket.responses.map((response) => (
            <div key={response.id} className={`p-4 rounded-lg ${response.isFromCustomer ? 'bg-blue-50 ml-8' : 'bg-gray-50 mr-8'}`}>
              <div className="flex justify-between items-start mb-2">
                <div className="font-medium">
                  {response.isFromCustomer ? ticket.customerName : response.respondedBy}
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(response.createdAt).toLocaleString()}
                </div>
              </div>
              <div>{response.message}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Response */}
      <form onSubmit={handleAddResponse} className="space-y-4">
        <div>
          <Label htmlFor="response">Add Response</Label>
          <Textarea
            id="response"
            value={responseMessage}
            onChange={(e) => setResponseMessage(e.target.value)}
            placeholder="Type your response here..."
            rows={4}
          />
        </div>
        <div className="flex justify-end space-x-2">
          <Button type="submit">
            <MessageSquare className="h-4 w-4 mr-2" />
            Send Response
          </Button>
        </div>
      </form>
    </div>
  );
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case 'urgent': return 'destructive';
    case 'high': return 'destructive';
    case 'medium': return 'secondary';
    case 'low': return 'outline';
    default: return 'secondary';
  }
}