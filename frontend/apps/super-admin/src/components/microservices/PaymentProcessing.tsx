import React, { useState, useEffect } from 'react';
import { apiClient } from '../../lib/apiClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { CreditCard, DollarSign, TrendingUp, AlertCircle, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';

interface Payment {
  id: string;
  orderId: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  amount: number;
  currency: string;
  paymentMethod: 'credit_card' | 'debit_card' | 'upi' | 'wallet' | 'bank_transfer' | 'cash_on_delivery';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'cancelled';
  gatewayTransactionId?: string;
  gatewayResponse?: any;
  createdAt: string;
  updatedAt: string;
  branchId: string;
  branchName: string;
}

interface PaymentAttempt {
  id: string;
  paymentId: string;
  attemptNumber: number;
  status: string;
  errorMessage?: string;
  createdAt: string;
}

export default function PaymentProcessing() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [paymentAttempts, setPaymentAttempts] = useState<PaymentAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

  useEffect(() => {
    fetchPaymentData();
  }, [statusFilter, methodFilter, searchTerm]);

  const fetchPaymentData = async () => {
    try {
      setLoading(true);
      const [paymentsData, attemptsData] = await Promise.all([
        apiClient.get('/api/direct-data/payments', {
          status: statusFilter !== 'all' ? statusFilter : undefined,
          method: methodFilter !== 'all' ? methodFilter : undefined,
          search: searchTerm
        }),
        apiClient.get('/api/direct-data/payment-attempts')
      ]);
      setPayments(paymentsData || []);
      setPaymentAttempts(attemptsData || []);
    } catch (error) {
      console.error('Failed to fetch payment data:', error);
    } finally {
      setLoading(false);
    }
  };

  const processPayment = async (paymentId: string) => {
    try {
      await apiClient.post(`/api/direct-data/payments/${paymentId}/process`);
      fetchPaymentData();
    } catch (error) {
      console.error('Failed to process payment:', error);
    }
  };

  const refundPayment = async (paymentId: string, amount?: number) => {
    try {
      await apiClient.post(`/api/direct-data/payments/${paymentId}/refund`, {
        amount
      });
      fetchPaymentData();
    } catch (error) {
      console.error('Failed to refund payment:', error);
    }
  };

  const retryPayment = async (paymentId: string) => {
    try {
      await apiClient.post(`/api/direct-data/payments/${paymentId}/retry`);
      fetchPaymentData();
    } catch (error) {
      console.error('Failed to retry payment:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'pending': return 'secondary';
      case 'processing': return 'secondary';
      case 'failed': return 'destructive';
      case 'refunded': return 'outline';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <AlertCircle className="h-4 w-4" />;
      case 'processing': return <RefreshCw className="h-4 w-4" />;
      case 'failed': return <XCircle className="h-4 w-4" />;
      case 'refunded': return <RefreshCw className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <CreditCard className="h-4 w-4" />;
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'credit_card':
      case 'debit_card':
        return <CreditCard className="h-4 w-4" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

  const filteredPayments = payments.filter(payment =>
    payment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.gatewayTransactionId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const todayRevenue = payments
    .filter(p => p.status === 'completed' && new Date(p.createdAt).toDateString() === new Date().toDateString())
    .reduce((sum, p) => sum + p.amount, 0);

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading payment processing...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payment Processing</h1>
          <p className="text-gray-500">Monitor and manage payment transactions</p>
        </div>
      </div>

      {/* Payment Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₹{totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">₹{todayRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Payments</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {payments.filter(p => p.status === 'failed').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {payments.length > 0 ? Math.round((payments.filter(p => p.status === 'completed').length / payments.length) * 100) : 0}%
            </div>
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
              placeholder="Search payments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="all">All Methods</option>
              <option value="credit_card">Credit Card</option>
              <option value="debit_card">Debit Card</option>
              <option value="upi">UPI</option>
              <option value="wallet">Wallet</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="cash_on_delivery">Cash on Delivery</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Transactions</CardTitle>
          <CardDescription>All payment transactions and their current status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Order #</th>
                  <th className="text-left py-3 px-4 font-medium">Customer</th>
                  <th className="text-left py-3 px-4 font-medium">Amount</th>
                  <th className="text-left py-3 px-4 font-medium">Method</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Date</th>
                  <th className="text-left py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-mono text-sm">{payment.orderNumber}</td>
                    <td className="py-3 px-4">
                      <div className="font-medium">{payment.customerName}</div>
                      <div className="text-sm text-gray-500">{payment.branchName}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold">₹{payment.amount.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">{payment.currency}</div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="gap-1">
                        {getMethodIcon(payment.paymentMethod)}
                        {payment.paymentMethod.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={getStatusColor(payment.status)} className="gap-1">
                        {getStatusIcon(payment.status)}
                        {payment.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Dialog open={isPaymentDialogOpen && selectedPayment?.id === payment.id} onOpenChange={(open) => {
                          setIsPaymentDialogOpen(open);
                          if (!open) setSelectedPayment(null);
                        }}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedPayment(payment)}
                            >
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Payment Details</DialogTitle>
                              <DialogDescription>Order #{payment.orderNumber}</DialogDescription>
                            </DialogHeader>
                            <PaymentDetails payment={payment} />
                          </DialogContent>
                        </Dialog>
                        {payment.status === 'pending' && (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => processPayment(payment.id)}
                          >
                            Process
                          </Button>
                        )}
                        {payment.status === 'failed' && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => retryPayment(payment.id)}
                          >
                            <RefreshCw className="h-4 w-4 mr-1" />
                            Retry
                          </Button>
                        )}
                        {payment.status === 'completed' && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => refundPayment(payment.id)}
                          >
                            Refund
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
    </div>
  );
}

function PaymentDetails({ payment }: { payment: Payment }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Transaction ID</Label>
          <div className="font-mono text-sm">{payment.gatewayTransactionId || 'N/A'}</div>
        </div>
        <div>
          <Label>Payment Method</Label>
          <div>{payment.paymentMethod.replace('_', ' ').toUpperCase()}</div>
        </div>
        <div>
          <Label>Amount</Label>
          <div className="font-semibold">₹{payment.amount.toLocaleString()} {payment.currency}</div>
        </div>
        <div>
          <Label>Status</Label>
          <Badge variant={getStatusColor(payment.status)}>
            {payment.status.toUpperCase()}
          </Badge>
        </div>
      </div>
      
      {payment.gatewayResponse && (
        <div>
          <Label>Gateway Response</Label>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(payment.gatewayResponse, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case 'completed': return 'default';
    case 'pending': return 'secondary';
    case 'processing': return 'secondary';
    case 'failed': return 'destructive';
    case 'refunded': return 'outline';
    case 'cancelled': return 'destructive';
    default: return 'secondary';
  }
}