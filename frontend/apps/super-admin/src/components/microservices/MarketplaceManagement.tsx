import React, { useState, useEffect } from 'react';
import { apiClient } from '../../lib/apiClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Store, Users, Package, DollarSign, TrendingUp, Star, Eye, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface Vendor {
  id: string;
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  gstNumber?: string;
  panNumber?: string;
  status: 'active' | 'pending' | 'suspended' | 'rejected';
  rating: number;
  totalProducts: number;
  totalSales: number;
  commissionRate: number;
  joinedDate: string;
  lastActive: string;
}

interface VendorProduct {
  id: string;
  vendorId: string;
  vendorName: string;
  productName: string;
  category: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive' | 'out_of_stock';
  rating: number;
  totalSales: number;
  createdAt: string;
}

export default function MarketplaceManagement() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [vendorProducts, setVendorProducts] = useState<VendorProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'vendors' | 'products'>('vendors');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [isVendorDialogOpen, setIsVendorDialogOpen] = useState(false);

  useEffect(() => {
    fetchMarketplaceData();
  }, [statusFilter, searchTerm]);

  const fetchMarketplaceData = async () => {
    try {
      setLoading(true);
      const [vendorsData, productsData] = await Promise.all([
        apiClient.get('/api/direct-data/marketplace/vendors', {
          status: statusFilter !== 'all' ? statusFilter : undefined,
          search: searchTerm
        }),
        apiClient.get('/api/direct-data/marketplace/products')
      ]);
      setVendors(vendorsData || []);
      setVendorProducts(productsData || []);
    } catch (error) {
      console.error('Failed to fetch marketplace data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateVendorStatus = async (vendorId: string, newStatus: string) => {
    try {
      await apiClient.put(`/api/direct-data/marketplace/vendors/${vendorId}`, { status: newStatus });
      fetchMarketplaceData();
    } catch (error) {
      console.error('Failed to update vendor status:', error);
    }
  };

  const updateCommissionRate = async (vendorId: string, newRate: number) => {
    try {
      await apiClient.put(`/api/direct-data/marketplace/vendors/${vendorId}/commission`, { rate: newRate });
      fetchMarketplaceData();
    } catch (error) {
      console.error('Failed to update commission rate:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'pending': return 'secondary';
      case 'suspended': return 'destructive';
      case 'rejected': return 'destructive';
      default: return 'secondary';
    }
  };

  const filteredVendors = vendors.filter(vendor =>
    vendor.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProducts = vendorProducts.filter(product =>
    product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.vendorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = vendors.reduce((sum, vendor) => sum + vendor.totalSales, 0);
  const totalCommission = vendors.reduce((sum, vendor) => sum + (vendor.totalSales * vendor.commissionRate / 100), 0);

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading marketplace management...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Marketplace Management</h1>
          <p className="text-gray-500">Manage vendors, products, and marketplace operations</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Vendor
        </Button>
      </div>

      {/* Marketplace Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
            <Store className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vendors.length}</div>
            <div className="text-sm text-gray-500">
              {vendors.filter(v => v.status === 'active').length} active
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vendorProducts.length}</div>
            <div className="text-sm text-gray-500">
              {vendorProducts.filter(p => p.status === 'active').length} active
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commission Earned</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalCommission.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b">
        <button
          onClick={() => setActiveTab('vendors')}
          className={`pb-2 px-1 border-b-2 font-medium text-sm ${
            activeTab === 'vendors'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Vendors
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-2 px-1 border-b-2 font-medium text-sm ${
            activeTab === 'products'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Products
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {activeTab === 'vendors' ? (
        <Card>
          <CardHeader>
            <CardTitle>Vendors</CardTitle>
            <CardDescription>Manage marketplace vendors and their details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Business Name</th>
                    <th className="text-left py-3 px-4 font-medium">Contact</th>
                    <th className="text-left py-3 px-4 font-medium">Products</th>
                    <th className="text-left py-3 px-4 font-medium">Sales</th>
                    <th className="text-left py-3 px-4 font-medium">Commission</th>
                    <th className="text-left py-3 px-4 font-medium">Rating</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVendors.map((vendor) => (
                    <tr key={vendor.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="font-medium">{vendor.businessName}</div>
                        <div className="text-sm text-gray-500">{vendor.gstNumber}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium">{vendor.contactName}</div>
                        <div className="text-sm text-gray-500">{vendor.email}</div>
                      </td>
                      <td className="py-3 px-4">{vendor.totalProducts}</td>
                      <td className="py-3 px-4">₹{vendor.totalSales.toLocaleString()}</td>
                      <td className="py-3 px-4">{vendor.commissionRate}%</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          {vendor.rating.toFixed(1)}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={getStatusColor(vendor.status)}>
                          {vendor.status.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Dialog open={isVendorDialogOpen && selectedVendor?.id === vendor.id} onOpenChange={(open) => {
                            setIsVendorDialogOpen(open);
                            if (!open) setSelectedVendor(null);
                          }}>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedVendor(vendor)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>{vendor.businessName}</DialogTitle>
                                <DialogDescription>Vendor details and management</DialogDescription>
                              </DialogHeader>
                              <VendorDetails
                                vendor={vendor}
                                onStatusChange={(status) => updateVendorStatus(vendor.id, status)}
                                onCommissionChange={(rate) => updateCommissionRate(vendor.id, rate)}
                              />
                            </DialogContent>
                          </Dialog>
                          <Select value={vendor.status} onValueChange={(status) => updateVendorStatus(vendor.id, status)}>
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="suspended">Suspended</SelectItem>
                              <SelectItem value="rejected">Rejected</SelectItem>
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
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Vendor Products</CardTitle>
            <CardDescription>Products listed by marketplace vendors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Product</th>
                    <th className="text-left py-3 px-4 font-medium">Vendor</th>
                    <th className="text-left py-3 px-4 font-medium">Price</th>
                    <th className="text-left py-3 px-4 font-medium">Stock</th>
                    <th className="text-left py-3 px-4 font-medium">Sales</th>
                    <th className="text-left py-3 px-4 font-medium">Rating</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="font-medium">{product.productName}</div>
                        <div className="text-sm text-gray-500">{product.category}</div>
                      </td>
                      <td className="py-3 px-4">{product.vendorName}</td>
                      <td className="py-3 px-4">₹{product.price.toLocaleString()}</td>
                      <td className="py-3 px-4">{product.stock}</td>
                      <td className="py-3 px-4">{product.totalSales}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          {product.rating.toFixed(1)}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={getStatusColor(product.status)}>
                          {product.status.replace('_', ' ').toUpperCase()}
                        </Badge>
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

function VendorDetails({ 
  vendor, 
  onStatusChange, 
  onCommissionChange 
}: { 
  vendor: Vendor; 
  onStatusChange: (status: string) => void;
  onCommissionChange: (rate: number) => void;
}) {
  const [commissionRate, setCommissionRate] = useState(vendor.commissionRate);

  const handleCommissionUpdate = () => {
    onCommissionChange(commissionRate);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Business Name</Label>
          <div className="font-medium">{vendor.businessName}</div>
        </div>
        <div>
          <Label>Contact Person</Label>
          <div className="font-medium">{vendor.contactName}</div>
        </div>
        <div>
          <Label>Email</Label>
          <div>{vendor.email}</div>
        </div>
        <div>
          <Label>Phone</Label>
          <div>{vendor.phone}</div>
        </div>
        <div>
          <Label>GST Number</Label>
          <div>{vendor.gstNumber || 'N/A'}</div>
        </div>
        <div>
          <Label>PAN Number</Label>
          <div>{vendor.panNumber || 'N/A'}</div>
        </div>
      </div>

      <div>
        <Label>Address</Label>
        <div className="mt-1 p-2 bg-gray-50 rounded">{vendor.address}</div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label>Total Products</Label>
          <div className="text-2xl font-bold">{vendor.totalProducts}</div>
        </div>
        <div>
          <Label>Total Sales</Label>
          <div className="text-2xl font-bold">₹{vendor.totalSales.toLocaleString()}</div>
        </div>
        <div>
          <Label>Rating</Label>
          <div className="text-2xl font-bold flex items-center">
            <Star className="h-5 w-5 text-yellow-500 mr-1" />
            {vendor.rating.toFixed(1)}
          </div>
        </div>
      </div>

      <div>
        <Label>Commission Rate (%)</Label>
        <div className="flex gap-2 mt-1">
          <Input
            type="number"
            value={commissionRate}
            onChange={(e) => setCommissionRate(parseFloat(e.target.value))}
            className="w-32"
          />
          <Button onClick={handleCommissionUpdate} size="sm">
            Update
          </Button>
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="text-sm text-gray-500">
          Joined: {new Date(vendor.joinedDate).toLocaleDateString()} | 
          Last Active: {new Date(vendor.lastActive).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}