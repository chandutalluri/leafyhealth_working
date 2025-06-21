import React, { useState, useEffect } from 'react';
import { apiClient } from '../../lib/apiClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Package, Boxes, Image, Tags, Plus, Search, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stockLevel: number;
  lowStockThreshold: number;
  images: string[];
  status: 'active' | 'inactive' | 'out_of_stock';
  branchId: string;
  branchName: string;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  productCount: number;
  parentId?: string;
}

interface StockAlert {
  id: string;
  productId: string;
  productName: string;
  currentStock: number;
  threshold: number;
  severity: 'low' | 'critical' | 'out_of_stock';
  branchName: string;
}

export default function ProductEcosystem() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stockAlerts, setStockAlerts] = useState<StockAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'inventory' | 'categories' | 'images'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);

  useEffect(() => {
    fetchProductEcosystemData();
  }, [searchTerm, categoryFilter, statusFilter]);

  const fetchProductEcosystemData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData, stockAlertsData] = await Promise.all([
        apiClient.get('/api/direct-data/products', {
          search: searchTerm,
          category: categoryFilter !== 'all' ? categoryFilter : undefined,
          status: statusFilter !== 'all' ? statusFilter : undefined
        }),
        apiClient.get('/api/direct-data/categories'),
        apiClient.get('/api/direct-data/inventory/alerts')
      ]);
      
      setProducts(productsData || []);
      setCategories(categoriesData || []);
      setStockAlerts(stockAlertsData || []);
    } catch (error) {
      console.error('Failed to fetch product ecosystem data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (productData: Partial<Product>) => {
    try {
      const product = await apiClient.post('/api/direct-data/products', productData);
      
      await apiClient.post('/api/direct-data/inventory', {
        productId: product.id,
        stockLevel: productData.stockLevel || 0,
        lowStockThreshold: productData.lowStockThreshold || 10
      });
      
      if (productData.category) {
        await apiClient.post('/api/direct-data/category-assignments', {
          productId: product.id,
          categoryId: productData.category
        });
      }
      
      fetchProductEcosystemData();
      setIsProductDialogOpen(false);
    } catch (error) {
      console.error('Failed to create product:', error);
    }
  };

  const updateInventory = async (productId: string, stockLevel: number) => {
    try {
      await apiClient.put(`/api/direct-data/inventory/${productId}`, { stockLevel });
      fetchProductEcosystemData();
    } catch (error) {
      console.error('Failed to update inventory:', error);
    }
  };

  const uploadProductImage = async (productId: string, file: File) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('productId', productId);
      
      await apiClient.post('/api/direct-data/product-images', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      fetchProductEcosystemData();
    } catch (error) {
      console.error('Failed to upload product image:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'inactive': return 'secondary';
      case 'out_of_stock': return 'destructive';
      default: return 'outline';
    }
  };

  const getAlertSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'low': return 'secondary';
      case 'out_of_stock': return 'destructive';
      default: return 'outline';
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.status === 'active').length;
  const lowStockProducts = products.filter(p => p.stockLevel <= p.lowStockThreshold).length;
  const totalCategories = categories.length;

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading Product Ecosystem...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Product Ecosystem</h1>
          <p className="text-gray-500">Complete product lifecycle management</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Create New Product</DialogTitle>
                <DialogDescription>Add a new product with complete setup</DialogDescription>
              </DialogHeader>
              <ProductForm onSubmit={createProduct} onCancel={() => setIsProductDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Products</CardTitle>
            <Package className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeProducts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{lowStockProducts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Tags className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{totalCategories}</div>
          </CardContent>
        </Card>
      </div>

      {stockAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              Stock Alerts
            </CardTitle>
            <CardDescription>Products requiring immediate attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stockAlerts.slice(0, 5).map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div>
                    <div className="font-medium">{alert.productName}</div>
                    <div className="text-sm text-gray-500">{alert.branchName}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getAlertSeverityColor(alert.severity)}>
                      {alert.currentStock} / {alert.threshold}
                    </Badge>
                    <Button size="sm" onClick={() => updateInventory(alert.productId, alert.threshold + 50)}>
                      Restock
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex space-x-4 border-b">
        {['overview', 'products', 'inventory', 'categories', 'images'].map((tab) => (
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Search & Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="out_of_stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {activeTab === 'products' && (
        <Card>
          <CardHeader>
            <CardTitle>Product Management</CardTitle>
            <CardDescription>Manage product details, pricing, and status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Product</th>
                    <th className="text-left py-3 px-4 font-medium">Category</th>
                    <th className="text-left py-3 px-4 font-medium">Price</th>
                    <th className="text-left py-3 px-4 font-medium">Stock</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Branch</th>
                    <th className="text-left py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {product.images.length > 0 && (
                            <img 
                              src={product.images[0]} 
                              alt={product.name}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                          )}
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-gray-500 max-w-xs truncate">
                              {product.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">{product.category}</Badge>
                      </td>
                      <td className="py-3 px-4">₹{product.price}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className={product.stockLevel <= product.lowStockThreshold ? 'text-red-600' : ''}>
                            {product.stockLevel}
                          </span>
                          {product.stockLevel <= product.lowStockThreshold && (
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={getStatusColor(product.status)}>
                          {product.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">{product.branchName}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) uploadProductImage(product.id, file);
                            }}
                            className="hidden"
                            id={`image-${product.id}`}
                          />
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => document.getElementById(`image-${product.id}`)?.click()}
                          >
                            <Image className="h-4 w-4 mr-1" />
                            Image
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

      {activeTab === 'categories' && (
        <Card>
          <CardHeader>
            <CardTitle>Category Management</CardTitle>
            <CardDescription>Organize products into categories and hierarchies</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <Card key={category.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        {category.productCount} products
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-4 w-4" />
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
    </div>
  );
}

function ProductForm({ 
  onSubmit, 
  onCancel 
}: { 
  onSubmit: (data: Partial<Product>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    stockLevel: 0,
    lowStockThreshold: 10,
    status: 'active' as const
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Product Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="price">Price (₹)</Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
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
          rows={3}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vegetables">Vegetables</SelectItem>
              <SelectItem value="fruits">Fruits</SelectItem>
              <SelectItem value="grains">Grains</SelectItem>
              <SelectItem value="dairy">Dairy</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="stockLevel">Initial Stock</Label>
          <Input
            id="stockLevel"
            type="number"
            value={formData.stockLevel}
            onChange={(e) => setFormData({ ...formData, stockLevel: parseInt(e.target.value) })}
          />
        </div>
        <div>
          <Label htmlFor="lowStockThreshold">Low Stock Alert</Label>
          <Input
            id="lowStockThreshold"
            type="number"
            value={formData.lowStockThreshold}
            onChange={(e) => setFormData({ ...formData, lowStockThreshold: parseInt(e.target.value) })}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Create Product
        </Button>
      </div>
    </form>
  );
}