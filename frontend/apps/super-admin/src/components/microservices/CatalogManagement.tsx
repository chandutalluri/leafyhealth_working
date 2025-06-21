import React, { useState, useEffect } from 'react';
import { apiClient } from '../../lib/apiClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Package, Plus, Search, Edit, Trash2, Eye, DollarSign } from 'lucide-react';
// Temporarily disable dialog to fix compilation
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  sku: string;
  stock: number;
  status: 'active' | 'inactive' | 'out_of_stock';
  images: string[];
  weight: number;
  dimensions: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  productCount: number;
  isActive: boolean;
  parentId?: string;
}

export default function CatalogManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        apiClient.get('/api/direct-data/products', { search: searchTerm, category: selectedCategory }),
        apiClient.get('/api/direct-data/categories')
      ]);
      setProducts(productsData || []);
      setCategories(categoriesData || []);
    } catch (error) {
      console.error('Failed to fetch catalog data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchTerm, selectedCategory]);

  const createProduct = async (productData: Partial<Product>) => {
    try {
      await apiClient.post('/api/direct-data/products', productData);
      fetchData();
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Failed to create product:', error);
    }
  };

  const updateProduct = async (id: string, productData: Partial<Product>) => {
    try {
      await apiClient.put(`/api/direct-data/products/${id}`, productData);
      fetchData();
    } catch (error) {
      console.error('Failed to update product:', error);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await apiClient.delete(`/api/direct-data/products/${id}`);
      fetchData();
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  const createCategory = async (categoryData: Partial<Category>) => {
    try {
      await apiClient.post('/api/direct-data/categories', categoryData);
      fetchData();
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Failed to create category:', error);
    }
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading catalog management...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Product Catalog Management</h2>
          <p className="text-muted-foreground">Manage products, categories, and inventory</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setActiveTab('products')} variant={activeTab === 'products' ? 'default' : 'outline'}>
            <Package className="w-4 h-4 mr-2" />
            Products ({products.length})
          </Button>
          <Button onClick={() => setActiveTab('categories')} variant={activeTab === 'categories' ? 'default' : 'outline'}>
            <Search className="w-4 h-4 mr-2" />
            Categories ({categories.length})
          </Button>
        </div>
      </div>

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          {/* Search and Filters */}
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search products by name, description, or SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
            <Button onClick={() => setIsCreateDialogOpen(!isCreateDialogOpen)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </div>
          
          {isCreateDialogOpen && (
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>Create New Product</CardTitle>
                <CardDescription>Add a new product to the catalog</CardDescription>
              </CardHeader>
              <CardContent>
                <CreateProductForm categories={categories} onSubmit={createProduct} />
              </CardContent>
            </Card>
          )}
          
          {/* Products Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <Card key={product.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="truncate">{product.name}</span>
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => deleteProduct(product.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardTitle>
                  <CardDescription className="line-clamp-2">{product.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Badge variant="outline">{product.category}</Badge>
                      <Badge variant={
                        product.status === 'active' ? 'default' : 
                        product.status === 'out_of_stock' ? 'destructive' : 'secondary'
                      }>
                        {product.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">SKU: {product.sku}</span>
                      <span className="font-semibold text-lg flex items-center">
                        <DollarSign className="w-4 h-4" />
                        {product.price.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Stock: {product.stock}</span>
                      <span className="text-muted-foreground">{product.weight}kg</span>
                    </div>
                    {product.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {product.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {product.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{product.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Categories Tab */}
      {activeTab === 'categories' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Product Categories</h3>
            <Button onClick={() => setIsCreateDialogOpen(!isCreateDialogOpen)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </div>
          
          {isCreateDialogOpen && (
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>Create New Category</CardTitle>
                <CardDescription>Add a new product category</CardDescription>
              </CardHeader>
              <CardContent>
                <CreateCategoryForm onSubmit={createCategory} />
              </CardContent>
            </Card>
          )}
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Card key={category.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {category.name}
                    <Badge variant={category.isActive ? 'default' : 'secondary'}>
                      {category.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {category.productCount} products
                    </span>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CreateProductForm({ categories, onSubmit }: { categories: Category[], onSubmit: (data: Partial<Product>) => void }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: 0,
    sku: '',
    stock: 0,
    weight: 0,
    dimensions: '',
    tags: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Product Name</Label>
          <Input 
            id="name" 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required 
          />
        </div>
        <div>
          <Label htmlFor="sku">SKU</Label>
          <Input 
            id="sku" 
            value={formData.sku}
            onChange={(e) => setFormData({...formData, sku: e.target.value})}
            required 
          />
        </div>
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description" 
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">Category</Label>
          <select 
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Category</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="price">Price ($)</Label>
          <Input 
            id="price" 
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
            required 
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="stock">Stock</Label>
          <Input 
            id="stock" 
            type="number"
            value={formData.stock}
            onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value)})}
          />
        </div>
        <div>
          <Label htmlFor="weight">Weight (kg)</Label>
          <Input 
            id="weight" 
            type="number"
            step="0.1"
            value={formData.weight}
            onChange={(e) => setFormData({...formData, weight: parseFloat(e.target.value)})}
          />
        </div>
        <div>
          <Label htmlFor="dimensions">Dimensions</Label>
          <Input 
            id="dimensions" 
            value={formData.dimensions}
            onChange={(e) => setFormData({...formData, dimensions: e.target.value})}
            placeholder="L x W x H"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="tags">Tags (comma separated)</Label>
        <Input 
          id="tags" 
          value={formData.tags}
          onChange={(e) => setFormData({...formData, tags: e.target.value})}
          placeholder="organic, fresh, local"
        />
      </div>
      <Button type="submit" className="w-full">Create Product</Button>
    </form>
  );
}

function CreateCategoryForm({ onSubmit }: { onSubmit: (data: Partial<Category>) => void }) {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="categoryName">Category Name</Label>
        <Input 
          id="categoryName" 
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required 
        />
      </div>
      <div>
        <Label htmlFor="categoryDescription">Description</Label>
        <Textarea 
          id="categoryDescription" 
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
        />
      </div>
      <Button type="submit" className="w-full">Create Category</Button>
    </form>
  );
}