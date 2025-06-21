import React from 'react';
import { DomainGuard, PermissionButton } from '@leafyhealth/auth';
import { Package, Plus, Search, Filter } from 'lucide-react';

export default function CatalogPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
            <Package className="w-8 h-8 text-emerald-600" />
            <span>Product Catalog</span>
          </h1>
          <p className="text-gray-600 mt-2">Manage products, categories, and inventory items</p>
        </div>
        
        <DomainGuard domain="catalog-management" action="create">
          <PermissionButton 
            domain="catalog-management" 
            action="create"
            className="flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </PermissionButton>
        </DomainGuard>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
          </div>
        </div>

        <div className="p-6">
          <DomainGuard domain="catalog-management" action="read">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="w-full h-48 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-4xl">🥬</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Organic Leafy Greens</h3>
                  <p className="text-sm text-gray-600 mb-3">Fresh organic vegetables from local farms</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-emerald-600">₹{(Math.random() * 200 + 50).toFixed(0)}</span>
                    <div className="flex space-x-2">
                      <DomainGuard domain="catalog-management" action="update">
                        <button className="text-blue-600 hover:text-blue-700 text-sm">Edit</button>
                      </DomainGuard>
                      <DomainGuard domain="catalog-management" action="delete">
                        <button className="text-red-600 hover:text-red-700 text-sm">Delete</button>
                      </DomainGuard>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </DomainGuard>
        </div>
      </div>
    </div>
  );
}