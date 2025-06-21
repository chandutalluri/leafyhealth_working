import React, { useState, useEffect } from 'react';
import { apiClient } from '../../lib/apiClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Calculator, TrendingUp, TrendingDown, DollarSign, FileText, Plus, Download } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface AccountEntry {
  id: string;
  date: string;
  description: string;
  accountName: string;
  accountType: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  debitAmount: number;
  creditAmount: number;
  balance: number;
  reference: string;
  createdBy: string;
  branchId: string;
  branchName: string;
}

interface FinancialReport {
  id: string;
  reportType: 'balance_sheet' | 'income_statement' | 'cash_flow' | 'trial_balance';
  title: string;
  period: string;
  generatedDate: string;
  status: 'draft' | 'final' | 'reviewed';
  totalAssets: number;
  totalLiabilities: number;
  totalEquity: number;
  netIncome: number;
}

export default function AccountingManagement() {
  const [entries, setEntries] = useState<AccountEntry[]>([]);
  const [reports, setReports] = useState<FinancialReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'entries' | 'reports'>('entries');
  const [accountFilter, setAccountFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isEntryDialogOpen, setIsEntryDialogOpen] = useState(false);

  useEffect(() => {
    fetchAccountingData();
  }, [accountFilter, searchTerm]);

  const fetchAccountingData = async () => {
    try {
      setLoading(true);
      const [entriesData, reportsData] = await Promise.all([
        apiClient.get('/api/direct-data/accounting/entries', {
          account: accountFilter !== 'all' ? accountFilter : undefined,
          search: searchTerm
        }),
        apiClient.get('/api/direct-data/accounting/reports')
      ]);
      setEntries(entriesData || []);
      setReports(reportsData || []);
    } catch (error) {
      console.error('Failed to fetch accounting data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createEntry = async (entryData: Partial<AccountEntry>) => {
    try {
      await apiClient.post('/api/direct-data/accounting/entries', entryData);
      fetchAccountingData();
      setIsEntryDialogOpen(false);
    } catch (error) {
      console.error('Failed to create accounting entry:', error);
    }
  };

  const generateReport = async (reportType: string, period: string) => {
    try {
      await apiClient.post('/api/direct-data/accounting/reports/generate', {
        type: reportType,
        period
      });
      fetchAccountingData();
    } catch (error) {
      console.error('Failed to generate report:', error);
    }
  };

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case 'asset': return 'default';
      case 'liability': return 'destructive';
      case 'equity': return 'secondary';
      case 'revenue': return 'default';
      case 'expense': return 'outline';
      default: return 'secondary';
    }
  };

  const getReportStatusColor = (status: string) => {
    switch (status) {
      case 'final': return 'default';
      case 'reviewed': return 'secondary';
      case 'draft': return 'outline';
      default: return 'secondary';
    }
  };

  const filteredEntries = entries.filter(entry =>
    entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.reference.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalAssets = entries
    .filter(e => e.accountType === 'asset')
    .reduce((sum, e) => sum + e.debitAmount - e.creditAmount, 0);

  const totalLiabilities = entries
    .filter(e => e.accountType === 'liability')
    .reduce((sum, e) => sum + e.creditAmount - e.debitAmount, 0);

  const totalRevenue = entries
    .filter(e => e.accountType === 'revenue')
    .reduce((sum, e) => sum + e.creditAmount - e.debitAmount, 0);

  const totalExpenses = entries
    .filter(e => e.accountType === 'expense')
    .reduce((sum, e) => sum + e.debitAmount - e.creditAmount, 0);

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading accounting management...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Accounting Management</h1>
          <p className="text-gray-500">Manage financial records and accounting operations</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isEntryDialogOpen} onOpenChange={setIsEntryDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Entry
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Accounting Entry</DialogTitle>
                <DialogDescription>Add a new journal entry to the accounting system</DialogDescription>
              </DialogHeader>
              <AccountingEntryForm onSubmit={createEntry} onCancel={() => setIsEntryDialogOpen(false)} />
            </DialogContent>
          </Dialog>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₹{totalAssets.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Liabilities</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">₹{totalLiabilities.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">₹{totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Income</CardTitle>
            <Calculator className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">₹{(totalRevenue - totalExpenses).toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b">
        <button
          onClick={() => setActiveTab('entries')}
          className={`pb-2 px-1 border-b-2 font-medium text-sm ${
            activeTab === 'entries'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Journal Entries
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`pb-2 px-1 border-b-2 font-medium text-sm ${
            activeTab === 'reports'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Financial Reports
        </button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Search entries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select value={accountFilter} onValueChange={setAccountFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by account type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Account Types</SelectItem>
                <SelectItem value="asset">Assets</SelectItem>
                <SelectItem value="liability">Liabilities</SelectItem>
                <SelectItem value="equity">Equity</SelectItem>
                <SelectItem value="revenue">Revenue</SelectItem>
                <SelectItem value="expense">Expenses</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {activeTab === 'entries' ? (
        <Card>
          <CardHeader>
            <CardTitle>Journal Entries</CardTitle>
            <CardDescription>All accounting journal entries and transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Date</th>
                    <th className="text-left py-3 px-4 font-medium">Account</th>
                    <th className="text-left py-3 px-4 font-medium">Description</th>
                    <th className="text-left py-3 px-4 font-medium">Debit</th>
                    <th className="text-left py-3 px-4 font-medium">Credit</th>
                    <th className="text-left py-3 px-4 font-medium">Balance</th>
                    <th className="text-left py-3 px-4 font-medium">Type</th>
                    <th className="text-left py-3 px-4 font-medium">Reference</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEntries.map((entry) => (
                    <tr key={entry.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm">
                        {new Date(entry.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium">{entry.accountName}</div>
                        <div className="text-sm text-gray-500">{entry.branchName}</div>
                      </td>
                      <td className="py-3 px-4">{entry.description}</td>
                      <td className="py-3 px-4">
                        {entry.debitAmount > 0 ? `₹${entry.debitAmount.toLocaleString()}` : '-'}
                      </td>
                      <td className="py-3 px-4">
                        {entry.creditAmount > 0 ? `₹${entry.creditAmount.toLocaleString()}` : '-'}
                      </td>
                      <td className="py-3 px-4 font-medium">₹{entry.balance.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <Badge variant={getAccountTypeColor(entry.accountType)}>
                          {entry.accountType.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">{entry.reference}</td>
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
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Financial Reports</CardTitle>
                <CardDescription>Generated financial statements and reports</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => generateReport('balance_sheet', 'current_month')} size="sm">
                  Generate Balance Sheet
                </Button>
                <Button onClick={() => generateReport('income_statement', 'current_month')} size="sm" variant="outline">
                  Generate Income Statement
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reports.map((report) => (
                <Card key={report.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{report.title}</CardTitle>
                        <CardDescription>{report.period}</CardDescription>
                      </div>
                      <Badge variant={getReportStatusColor(report.status)}>
                        {report.status.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {report.reportType === 'balance_sheet' && (
                        <>
                          <div className="flex justify-between">
                            <span>Total Assets:</span>
                            <span className="font-medium">₹{report.totalAssets.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Total Liabilities:</span>
                            <span className="font-medium">₹{report.totalLiabilities.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Total Equity:</span>
                            <span className="font-medium">₹{report.totalEquity.toLocaleString()}</span>
                          </div>
                        </>
                      )}
                      {report.reportType === 'income_statement' && (
                        <div className="flex justify-between">
                          <span>Net Income:</span>
                          <span className="font-medium">₹{report.netIncome.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="text-sm text-gray-500 pt-2">
                        Generated: {new Date(report.generatedDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="mt-4">
                      <Button size="sm" variant="outline" className="w-full">
                        <FileText className="h-4 w-4 mr-2" />
                        View Report
                      </Button>
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

function AccountingEntryForm({ 
  onSubmit, 
  onCancel 
}: { 
  onSubmit: (data: Partial<AccountEntry>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    accountName: '',
    accountType: 'expense' as const,
    debitAmount: 0,
    creditAmount: 0,
    reference: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        <Label htmlFor="accountName">Account Name</Label>
        <Input
          id="accountName"
          value={formData.accountName}
          onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
          placeholder="Enter account name"
          required
        />
      </div>

      <div>
        <Label htmlFor="accountType">Account Type</Label>
        <Select value={formData.accountType} onValueChange={(value: any) => setFormData({ ...formData, accountType: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asset">Asset</SelectItem>
            <SelectItem value="liability">Liability</SelectItem>
            <SelectItem value="equity">Equity</SelectItem>
            <SelectItem value="revenue">Revenue</SelectItem>
            <SelectItem value="expense">Expense</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Enter transaction description"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="debitAmount">Debit Amount</Label>
          <Input
            id="debitAmount"
            type="number"
            step="0.01"
            value={formData.debitAmount}
            onChange={(e) => setFormData({ ...formData, debitAmount: parseFloat(e.target.value) || 0 })}
          />
        </div>
        <div>
          <Label htmlFor="creditAmount">Credit Amount</Label>
          <Input
            id="creditAmount"
            type="number"
            step="0.01"
            value={formData.creditAmount}
            onChange={(e) => setFormData({ ...formData, creditAmount: parseFloat(e.target.value) || 0 })}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="reference">Reference</Label>
        <Input
          id="reference"
          value={formData.reference}
          onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
          placeholder="Enter reference number"
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Create Entry
        </Button>
      </div>
    </form>
  );
}