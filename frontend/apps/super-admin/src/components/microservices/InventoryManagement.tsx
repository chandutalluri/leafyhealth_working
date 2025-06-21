import React, { useState, useEffect } from 'react';
import { apiClient } from '../../lib/apiClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Package, Plus, Search, Edit, Trash2, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  branchId: string;
  branchName: string;
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  reorderLevel: number;
  maxStockLevel: number;
  lastUpdated: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'overstock';
}

interface InventoryAdjustment {
  id: string;
  productName: string;
  branchName: string;
  oldQuantity: number;
  newQuantity: number;
  adjustmentReason: string;
  adjustedBy: string;
  createdAt: string;
}

export default function InventoryManagement() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [adjustments, setAdjustments] = useState<InventoryAdjustment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [branchFilter, setBranchFilter] = useState<string>('all');
  const [isAdjustDialogOpen, setIsAdjustDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  useEffect(() => {
    fetchInventoryData();
  }, [searchTerm, statusFilter, branchFilter]);

  const fetchInventoryData = async () => {
    try {
      setLoading(true);
      const [inventoryData, adjustmentsData] = await Promise.all([
        apiClient.get('/api/direct-data/inventory', {
          search: searchTerm,
          status: statusFilter !== 'all' ? statusFilter : undefined,
          branch: branchFilter !== 'all' ? branchFilter : undefined
        }),
        apiClient.get('/api/direct-data/inventory/adjustments')
      ]);
      setInventory(inventoryData || []);
      setAdjustments(adjustmentsData || []);
    } catch (error) {
      console.error('Failed to fetch inventory data:', error);
    } finally {
      setLoading(false);
    }
  };

  const adjustInventory = async (itemId: string, newQuantity: number, reason: string) => {
    try {
      await apiClient.post(`/api/direct-data/inventory/${itemId}/adjust`, {
        newQuantity,
        reason
      });
      fetchInventoryData();
      setIsAdjustDialogOpen(false);
      setSelectedItem(null);
    } catch (error) {
      console.error('Failed to adjust inventory:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_stock': return 'default';
      case 'low_stock': return 'secondary';
      case 'out_of_stock': return 'destructive';
      case 'overstock': return 'secondary';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'low_stock': return <AlertTriangle className="h-4 w-4" />;
      case 'out_of_stock': return <TrendingDown className="h-4 w-4" />;
      case 'overstock': return <TrendingUp className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const filteredInventory = inventory.filter(item =>
    item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.branchName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading inventory management...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-500">Monitor and manage stock levels across all branches</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products or branches..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="in_stock">In Stock</SelectItem>
                <SelectItem value="low_stock">Low Stock</SelectItem>
                <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                <SelectItem value="overstock">Overstock</SelectItem>
              </SelectContent>
            </Select>
            <Select value={branchFilter} onValueChange={setBranchFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Branches</SelectItem>
                <SelectItem value="main">Main Branch</SelectItem>
                <SelectItem value="secondary">Secondary Branch</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventory.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {inventory.filter(item => item.status === 'low_stock').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {inventory.filter(item => item.status === 'out_of_stock').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{inventory.reduce((sum, item) => sum + (item.quantity * 100), 0).toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Items</CardTitle>
          <CardDescription>Current stock levels across all products and branches</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Product</th>
                  <th className="text-left py-3 px-4 font-medium">Branch</th>
                  <th className="text-left py-3 px-4 font-medium">Available</th>
                  <th className="text-left py-3 px-4 font-medium">Reserved</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Last Updated</th>
                  <th className="text-left py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-medium">{item.productName}</div>
                    </td>
                    <td className="py-3 px-4">{item.branchName}</td>
                    <td className="py-3 px-4">
                      <span className="font-semibold">{item.availableQuantity}</span>
                      <span className="text-gray-500 text-sm"> / {item.quantity}</span>
                    </td>
                    <td className="py-3 px-4">{item.reservedQuantity}</td>
                    <td className="py-3 px-4">
                      <Badge variant={getStatusColor(item.status)} className="gap-1">
                        {getStatusIcon(item.status)}
                        {item.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">
                      {new Date(item.lastUpdated).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <Dialog open={isAdjustDialogOpen && selectedItem?.id === item.id} onOpenChange={(open) => {
                        setIsAdjustDialogOpen(open);
                        if (!open) setSelectedItem(null);
                      }}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedItem(item)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Adjust
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Adjust Inventory</DialogTitle>
                            <DialogDescription>
                              Adjust stock level for {item.productName} at {item.branchName}
                            </DialogDescription>
                          </DialogHeader>
                          <InventoryAdjustForm
                            item={item}
                            onSubmit={(newQuantity, reason) => adjustInventory(item.id, newQuantity, reason)}
                            onCancel={() => {
                              setIsAdjustDialogOpen(false);
                              setSelectedItem(null);
                            }}
                          />
                        </DialogContent>
                      </Dialog>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Recent Adjustments */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Adjustments</CardTitle>
          <CardDescription>Latest inventory adjustments and changes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {adjustments.slice(0, 5).map((adjustment) => (
              <div key={adjustment.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">{adjustment.productName}</div>
                  <div className="text-sm text-gray-500">{adjustment.branchName}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">
                    {adjustment.oldQuantity} → {adjustment.newQuantity}
                  </div>
                  <div className="text-sm text-gray-500">{adjustment.adjustmentReason}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">
                    {new Date(adjustment.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function InventoryAdjustForm({ 
  item, 
  onSubmit, 
  onCancel 
}: { 
  item: InventoryItem; 
  onSubmit: (newQuantity: number, reason: string) => void;
  onCancel: () => void;
}) {
  const [newQuantity, setNewQuantity] = useState(item.quantity);
  const [reason, setReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(newQuantity, reason);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="currentQuantity">Current Quantity</Label>
        <Input id="currentQuantity" value={item.quantity} disabled />
      </div>
      <div>
        <Label htmlFor="newQuantity">New Quantity</Label>
        <Input
          id="newQuantity"
          type="number"
          value={newQuantity}
          onChange={(e) => setNewQuantity(parseInt(e.target.value))}
          required
        />
      </div>
      <div>
        <Label htmlFor="reason">Adjustment Reason</Label>
        <Select value={reason} onValueChange={setReason} required>
          <SelectTrigger>
            <SelectValue placeholder="Select reason" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="stock_count">Stock Count</SelectItem>
            <SelectItem value="damaged_goods">Damaged Goods</SelectItem>
            <SelectItem value="theft_loss">Theft/Loss</SelectItem>
            <SelectItem value="supplier_return">Supplier Return</SelectItem>
            <SelectItem value="customer_return">Customer Return</SelectItem>
            <SelectItem value="expired_goods">Expired Goods</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Adjust Inventory
        </Button>
      </div>
    </form>
  );
}