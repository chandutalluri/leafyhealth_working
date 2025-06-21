import React, { useState, useEffect } from 'react';
import { apiClient } from '../../lib/apiClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Receipt, TrendingUp, TrendingDown, AlertTriangle, Calendar, Plus, Filter } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface Expense {
  id: string;
  date: string;
  description: string;
  category: string;
  subcategory: string;
  amount: number;
  currency: string;
  paymentMethod: 'cash' | 'card' | 'bank_transfer' | 'cheque' | 'upi';
  vendor: string;
  receiptNumber?: string;
  status: 'pending' | 'approved' | 'rejected' | 'paid' | 'reimbursed';
  approvedBy?: string;
  branchId: string;
  branchName: string;
  employeeId: string;
  employeeName: string;
  createdAt: string;
  updatedAt: string;
}

interface ExpenseBudget {
  id: string;
  category: string;
  branchId: string;
  branchName: string;
  budgetAmount: number;
  spentAmount: number;
  remainingAmount: number;
  period: string;
  status: 'on_track' | 'warning' | 'exceeded';
}

export default function ExpenseMonitoring() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgets, setBudgets] = useState<ExpenseBudget[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'expenses' | 'budgets'>('expenses');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);

  useEffect(() => {
    fetchExpenseData();
  }, [statusFilter, categoryFilter, searchTerm]);

  const fetchExpenseData = async () => {
    try {
      setLoading(true);
      const [expensesData, budgetsData] = await Promise.all([
        apiClient.get('/api/direct-data/expenses', {
          status: statusFilter !== 'all' ? statusFilter : undefined,
          category: categoryFilter !== 'all' ? categoryFilter : undefined,
          search: searchTerm
        }),
        apiClient.get('/api/direct-data/expense-budgets')
      ]);
      setExpenses(expensesData || []);
      setBudgets(budgetsData || []);
    } catch (error) {
      console.error('Failed to fetch expense data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateExpenseStatus = async (expenseId: string, newStatus: string) => {
    try {
      await apiClient.put(`/api/direct-data/expenses/${expenseId}`, { status: newStatus });
      fetchExpenseData();
    } catch (error) {
      console.error('Failed to update expense status:', error);
    }
  };

  const createExpense = async (expenseData: Partial<Expense>) => {
    try {
      await apiClient.post('/api/direct-data/expenses', expenseData);
      fetchExpenseData();
      setIsExpenseDialogOpen(false);
    } catch (error) {
      console.error('Failed to create expense:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'default';
      case 'pending': return 'secondary';
      case 'paid': return 'default';
      case 'rejected': return 'destructive';
      case 'reimbursed': return 'outline';
      default: return 'secondary';
    }
  };

  const getBudgetStatusColor = (status: string) => {
    switch (status) {
      case 'on_track': return 'default';
      case 'warning': return 'secondary';
      case 'exceeded': return 'destructive';
      default: return 'secondary';
    }
  };

  const filteredExpenses = expenses.filter(expense =>
    expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.employeeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const pendingExpenses = expenses.filter(e => e.status === 'pending').length;
  const approvedExpenses = expenses.filter(e => e.status === 'approved').length;
  const thisMonthExpenses = expenses
    .filter(e => new Date(e.date).getMonth() === new Date().getMonth())
    .reduce((sum, e) => sum + e.amount, 0);

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading expense monitoring...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Expense Monitoring</h1>
          <p className="text-gray-500">Track and manage business expenses and budgets</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isExpenseDialogOpen} onOpenChange={setIsExpenseDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Expense
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Record New Expense</DialogTitle>
                <DialogDescription>Add a new business expense to the system</DialogDescription>
              </DialogHeader>
              <ExpenseForm onSubmit={createExpense} onCancel={() => setIsExpenseDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Expense Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <Receipt className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalExpenses.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₹{thisMonthExpenses.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingExpenses}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{approvedExpenses}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b">
        <button
          onClick={() => setActiveTab('expenses')}
          className={`pb-2 px-1 border-b-2 font-medium text-sm ${
            activeTab === 'expenses'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Expenses
        </button>
        <button
          onClick={() => setActiveTab('budgets')}
          className={`pb-2 px-1 border-b-2 font-medium text-sm ${
            activeTab === 'budgets'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Budget Tracking
        </button>
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
              placeholder="Search expenses..."
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
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="reimbursed">Reimbursed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="office_supplies">Office Supplies</SelectItem>
                <SelectItem value="travel">Travel</SelectItem>
                <SelectItem value="utilities">Utilities</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="equipment">Equipment</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="software">Software</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {activeTab === 'expenses' ? (
        <Card>
          <CardHeader>
            <CardTitle>Expense Records</CardTitle>
            <CardDescription>All recorded business expenses and their approval status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Date</th>
                    <th className="text-left py-3 px-4 font-medium">Description</th>
                    <th className="text-left py-3 px-4 font-medium">Category</th>
                    <th className="text-left py-3 px-4 font-medium">Amount</th>
                    <th className="text-left py-3 px-4 font-medium">Employee</th>
                    <th className="text-left py-3 px-4 font-medium">Vendor</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExpenses.map((expense) => (
                    <tr key={expense.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm">
                        {new Date(expense.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium">{expense.description}</div>
                        <div className="text-sm text-gray-500">{expense.receiptNumber}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div>{expense.category}</div>
                        <div className="text-sm text-gray-500">{expense.subcategory}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold">₹{expense.amount.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">{expense.paymentMethod}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium">{expense.employeeName}</div>
                        <div className="text-sm text-gray-500">{expense.branchName}</div>
                      </td>
                      <td className="py-3 px-4">{expense.vendor}</td>
                      <td className="py-3 px-4">
                        <Badge variant={getStatusColor(expense.status)}>
                          {expense.status.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        {expense.status === 'pending' && (
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              onClick={() => updateExpenseStatus(expense.id, 'approved')}
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => updateExpenseStatus(expense.id, 'rejected')}
                            >
                              Reject
                            </Button>
                          </div>
                        )}
                        {expense.status === 'approved' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateExpenseStatus(expense.id, 'paid')}
                          >
                            Mark Paid
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
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Budget Tracking</CardTitle>
            <CardDescription>Monitor expense budgets and spending limits by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {budgets.map((budget) => (
                <Card key={budget.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{budget.category}</CardTitle>
                        <CardDescription>{budget.branchName} - {budget.period}</CardDescription>
                      </div>
                      <Badge variant={getBudgetStatusColor(budget.status)}>
                        {budget.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span>Spent</span>
                          <span className="font-medium">₹{budget.spentAmount.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              budget.status === 'exceeded' ? 'bg-red-500' :
                              budget.status === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{
                              width: `${Math.min((budget.spentAmount / budget.budgetAmount) * 100, 100)}%`
                            }}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-gray-500">Budget</div>
                          <div className="font-medium">₹{budget.budgetAmount.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Remaining</div>
                          <div className={`font-medium ${budget.remainingAmount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                            ₹{budget.remainingAmount.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {((budget.spentAmount / budget.budgetAmount) * 100).toFixed(1)}% of budget used
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

function ExpenseForm({ 
  onSubmit, 
  onCancel 
}: { 
  onSubmit: (data: Partial<Expense>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    category: '',
    subcategory: '',
    amount: 0,
    paymentMethod: 'card' as const,
    vendor: '',
    receiptNumber: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Enter expense description"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="office_supplies">Office Supplies</SelectItem>
              <SelectItem value="travel">Travel</SelectItem>
              <SelectItem value="utilities">Utilities</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="equipment">Equipment</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="software">Software</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="paymentMethod">Payment Method</Label>
          <Select value={formData.paymentMethod} onValueChange={(value: any) => setFormData({ ...formData, paymentMethod: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="card">Card</SelectItem>
              <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
              <SelectItem value="cheque">Cheque</SelectItem>
              <SelectItem value="upi">UPI</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="vendor">Vendor</Label>
          <Input
            id="vendor"
            value={formData.vendor}
            onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
            placeholder="Enter vendor name"
            required
          />
        </div>
        <div>
          <Label htmlFor="receiptNumber">Receipt Number</Label>
          <Input
            id="receiptNumber"
            value={formData.receiptNumber}
            onChange={(e) => setFormData({ ...formData, receiptNumber: e.target.value })}
            placeholder="Enter receipt number"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Create Expense
        </Button>
      </div>
    </form>
  );
}