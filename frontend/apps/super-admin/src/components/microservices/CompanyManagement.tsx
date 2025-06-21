import React, { useState, useEffect } from 'react';
import { apiClient } from '../../lib/apiClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Building, Plus, MapPin, Users, Settings, Trash2 } from 'lucide-react';
// Temporarily disable dialog to fix compilation
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

interface Company {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  isActive: boolean;
  branchCount: number;
  createdAt: string;
}

interface Branch {
  id: string;
  name: string;
  companyId: string;
  companyName: string;
  address: string;
  phone: string;
  managerName: string;
  isActive: boolean;
  employeeCount: number;
  revenue: number;
}

export default function CompanyManagement() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'companies' | 'branches'>('companies');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [companiesData, branchesData] = await Promise.all([
        apiClient.get('/api/direct-data/companies'),
        apiClient.get('/api/direct-data/branches')
      ]);
      setCompanies(companiesData || []);
      setBranches(branchesData || []);
    } catch (error) {
      console.error('Failed to fetch company/branch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createCompany = async (companyData: Partial<Company>) => {
    try {
      await apiClient.post('/api/company-management/companies', companyData);
      fetchData();
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Failed to create company:', error);
    }
  };

  const createBranch = async (branchData: Partial<Branch>) => {
    try {
      await apiClient.post('/api/company-management/branches', branchData);
      fetchData();
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Failed to create branch:', error);
    }
  };

  const deleteCompany = async (id: string) => {
    try {
      await apiClient.delete(`/api/company-management/companies/${id}`);
      fetchData();
    } catch (error) {
      console.error('Failed to delete company:', error);
    }
  };

  const deleteBranch = async (id: string) => {
    try {
      await apiClient.delete(`/api/company-management/branches/${id}`);
      fetchData();
    } catch (error) {
      console.error('Failed to delete branch:', error);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading company management...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Company & Branch Management</h2>
          <p className="text-muted-foreground">Manage companies, branches, and organizational hierarchy</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setActiveTab('companies')} variant={activeTab === 'companies' ? 'default' : 'outline'}>
            <Building className="w-4 h-4 mr-2" />
            Companies ({companies.length})
          </Button>
          <Button onClick={() => setActiveTab('branches')} variant={activeTab === 'branches' ? 'default' : 'outline'}>
            <MapPin className="w-4 h-4 mr-2" />
            Branches ({branches.length})
          </Button>
        </div>
      </div>

      {/* Companies Tab */}
      {activeTab === 'companies' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Companies</h3>
            <Button onClick={() => setIsCreateDialogOpen(!isCreateDialogOpen)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Company
            </Button>
          </div>
          
          {isCreateDialogOpen && (
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>Create New Company</CardTitle>
                <CardDescription>Add a new company to the system</CardDescription>
              </CardHeader>
              <CardContent>
                <CreateCompanyForm onSubmit={createCompany} />
              </CardContent>
            </Card>
          )}
          
          <div className="grid gap-4 md:grid-cols-2">
            {companies.map((company) => (
              <Card key={company.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Building className="w-5 h-5" />
                      <span>{company.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={company.isActive ? 'default' : 'secondary'}>
                        {company.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      <Button variant="ghost" size="sm" onClick={() => deleteCompany(company.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardTitle>
                  <CardDescription>{company.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <MapPin className="w-4 h-4 mr-2" />
                      {company.address}
                    </div>
                    <div className="flex items-center text-sm">
                      <Users className="w-4 h-4 mr-2" />
                      {company.branchCount} branches
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <Badge variant="outline">{company.phone}</Badge>
                      <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Branches Tab */}
      {activeTab === 'branches' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Branches</h3>
            <Button onClick={() => setIsCreateDialogOpen(!isCreateDialogOpen)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Branch
            </Button>
          </div>
          
          {isCreateDialogOpen && (
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>Create New Branch</CardTitle>
                <CardDescription>Add a new branch to a company</CardDescription>
              </CardHeader>
              <CardContent>
                <CreateBranchForm companies={companies} onSubmit={createBranch} />
              </CardContent>
            </Card>
          )}
          
          <div className="grid gap-4">
            {branches.map((branch) => (
              <Card key={branch.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{branch.name}</h4>
                        <p className="text-sm text-muted-foreground">{branch.companyName}</p>
                        <p className="text-xs text-muted-foreground">{branch.address}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={branch.isActive ? 'default' : 'secondary'}>
                        {branch.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge variant="outline">{branch.employeeCount} employees</Badge>
                      <Button variant="ghost" size="sm" onClick={() => deleteBranch(branch.id)}>
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

function CreateCompanyForm({ onSubmit }: { onSubmit: (data: Partial<Company>) => void }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    website: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Company Name</Label>
        <Input 
          id="name" 
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required 
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description" 
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
        />
      </div>
      <div>
        <Label htmlFor="address">Address</Label>
        <Textarea 
          id="address" 
          value={formData.address}
          onChange={(e) => setFormData({...formData, address: e.target.value})}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input 
            id="phone" 
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="website">Website</Label>
        <Input 
          id="website" 
          value={formData.website}
          onChange={(e) => setFormData({...formData, website: e.target.value})}
        />
      </div>
      <Button type="submit" className="w-full">Create Company</Button>
    </form>
  );
}

function CreateBranchForm({ companies, onSubmit }: { companies: Company[], onSubmit: (data: Partial<Branch>) => void }) {
  const [formData, setFormData] = useState({
    name: '',
    companyId: '',
    address: '',
    phone: '',
    managerName: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="branchName">Branch Name</Label>
        <Input 
          id="branchName" 
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required 
        />
      </div>
      <div>
        <Label htmlFor="companyId">Company</Label>
        <select 
          id="companyId"
          value={formData.companyId}
          onChange={(e) => setFormData({...formData, companyId: e.target.value})}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select Company</option>
          {companies.map(company => (
            <option key={company.id} value={company.id}>{company.name}</option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="branchAddress">Address</Label>
        <Textarea 
          id="branchAddress" 
          value={formData.address}
          onChange={(e) => setFormData({...formData, address: e.target.value})}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="branchPhone">Phone</Label>
          <Input 
            id="branchPhone" 
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="managerName">Manager Name</Label>
          <Input 
            id="managerName" 
            value={formData.managerName}
            onChange={(e) => setFormData({...formData, managerName: e.target.value})}
          />
        </div>
      </div>
      <Button type="submit" className="w-full">Create Branch</Button>
    </form>
  );
}