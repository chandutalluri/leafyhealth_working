'use client';

import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Loader2, Plus, Search, Filter } from 'lucide-react';
import { Input } from '../../components/ui/input';

interface EmployeeManagementItem {
  id: string;
  employeeName: string;
  department: string;
  position: string;
  salary: string;
  hireDate: string;
  createdAt: string;
  updatedAt: string;
}

export default function EmployeeManagementPage() {
  const [items, setItems] = useState<EmployeeManagementItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      // Replace with actual API endpoint
      const response = await fetch('/api/employee-management');
      if (response.ok) {
        const data = await response.json();
        setItems(data || []);
      }
    } catch (error) {
      console.error('Error fetching employee-management data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const filteredItems = (items || []).filter(item =>
    Object.values(item || {}).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading employee-management...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">EmployeeManagement Management</h1>
          <p className="text-muted-foreground">
            Manage your employee management efficiently
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search employee-management..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => (
          <Card key={item.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="truncate">{item.employeeName}</span>
                <Badge variant="secondary">
                  {item.status || 'Active'}
                </Badge>
              </CardTitle>
              <CardDescription>
                {item.department || 'No description available'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">position:</span>
                  <span>{item.position}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">salary:</span>
                  <span>{item.salary}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {(filteredItems || []).length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No employee-management items found.</p>
          <Button className="mt-4">
            <Plus className="mr-2 h-4 w-4" />
            Create First Item
          </Button>
        </div>
      )}
    </div>
  );
}