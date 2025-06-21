import React, { useState, useEffect } from 'react';
import { Building2, Edit, MapPin, X, Save, Users, Phone, Mail, Globe, MapPinIcon } from 'lucide-react';
import { useRouter } from 'next/router';

interface Company {
  id: string;
  name: string;
  description: string;
  website: string;
  email: string;
  phone: string;
  address: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  gstNumber: string;
  fssaiLicense: string;
  panNumber: string;
  cinNumber: string;
  msmeRegistration: string;
  tradeLicense: string;
  establishmentYear: number;
  businessCategory: string;
  complianceDetails: any;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Branch {
  id: string;
  name: string;
  companyId: string;
  address: string;
  latitude?: number;
  longitude?: number;
  language?: string;
  phone?: string;
  whatsappNumber?: string;
  email?: string;
  managerName?: string;
  operatingHours?: Record<string, any>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function CompanyManagement() {
  const router = useRouter();
  const [company, setCompany] = useState<Company | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [updating, setUpdating] = useState(false);
  const [creatingBranch, setCreatingBranch] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: '',
    email: '',
    phone: '',
    address: '',
    logoUrl: '',
    primaryColor: '#6366f1',
    secondaryColor: '#8b5cf6',
    accentColor: '#06b6d4',
    gstNumber: '',
    fssaiLicense: '',
    panNumber: '',
    cinNumber: '',
    msmeRegistration: '',
    tradeLicense: '',
    establishmentYear: 2015,
    businessCategory: ''
  });

  const [branchFormData, setBranchFormData] = useState({
    name: '',
    address: '',
    latitude: 0,
    longitude: 0,
    language: 'en',
    phone: '',
    whatsappNumber: '',
    email: '',
    managerName: '',
    operatingHours: {
      monday: { open: '09:00', close: '18:00' },
      tuesday: { open: '09:00', close: '18:00' },
      wednesday: { open: '09:00', close: '18:00' },
      thursday: { open: '09:00', close: '18:00' },
      friday: { open: '09:00', close: '18:00' },
      saturday: { open: '09:00', close: '15:00' },
      sunday: { open: 'closed', close: 'closed' }
    }
  });

  useEffect(() => {
    fetchCompany();
  }, []);

  const fetchCompany = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/company-management/companies');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      // Get the first company (single company system)
      const mainCompany = data.length > 0 ? data[0] : null;
      setCompany(mainCompany);
      
      // Fetch branches if company exists
      if (mainCompany) {
        fetchBranches(mainCompany.id);
      }
    } catch (error) {
      console.error('Error fetching company:', error);
      setCompany(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchBranches = async (companyId: string) => {
    try {
      const response = await fetch(`/api/company-management/companies/${companyId}/branches`);
      if (response.ok) {
        const branchData = await response.json();
        setBranches(branchData);
      }
    } catch (error) {
      console.error('Error fetching branches:', error);
      setBranches([]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditCompany = () => {
    if (!company) return;
    setFormData({
      name: company.name,
      description: company.description || '',
      website: company.website || '',
      email: company.email || '',
      phone: company.phone || '',
      address: company.address || '',
      logoUrl: company.logoUrl || '',
      primaryColor: company.primaryColor || '#6366f1',
      secondaryColor: company.secondaryColor || '#8b5cf6',
      accentColor: company.accentColor || '#06b6d4',
      gstNumber: company.gstNumber || '',
      fssaiLicense: company.fssaiLicense || '',
      panNumber: company.panNumber || '',
      cinNumber: company.cinNumber || '',
      msmeRegistration: company.msmeRegistration || '',
      tradeLicense: company.tradeLicense || '',
      establishmentYear: company.establishmentYear || 2015,
      businessCategory: company.businessCategory || ''
    });
    setShowEditModal(true);
  };

  const handleUpdateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (updating || !company) return;

    try {
      setUpdating(true);
      
      // Convert establishmentYear to number if it's a string
      const updateData = {
        ...formData,
        establishmentYear: typeof formData.establishmentYear === 'string' 
          ? parseInt(formData.establishmentYear) || 2015 
          : formData.establishmentYear,
        isActive: true
      };

      console.log('Sending update request:', updateData);

      const response = await fetch(`/api/company-management/companies/${company.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const updatedCompany = await response.json();
      setCompany(updatedCompany);
      setShowEditModal(false);
      
      // Refresh the company data
      fetchCompany();
    } catch (error) {
      console.error('Error updating company:', error);
      alert(`Failed to update company: ${error.message}`);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Building2 className="w-8 h-8 text-purple-600" />
            Company Settings
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your company information and branch network
          </p>
        </div>

        {company ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Company Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {company.logoUrl ? (
                    <img 
                      src={company.logoUrl} 
                      alt={company.name}
                      className="w-16 h-16 rounded-lg bg-white/10 object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-white/10 flex items-center justify-center">
                      <Building2 className="w-8 h-8" />
                    </div>
                  )}
                  <div>
                    <h2 className="text-2xl font-bold">{company.name}</h2>
                    <p className="text-white/80">{company.description}</p>
                  </div>
                </div>
                <button
                  onClick={handleEditCompany}
                  className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors"
                  title="Edit Company"
                >
                  <Edit className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Company Details */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{company.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{company.phone}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Website</p>
                      <p className="font-medium">{company.website || 'Not set'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPinIcon className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="font-medium">{company.address || 'Not set'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Compliance Information */}
            {company.gstNumber && (
              <div className="border-t border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Indian Compliance & Certifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {company.gstNumber && (
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <p className="text-sm font-medium text-green-800">GST Registration</p>
                      <p className="text-green-700 font-mono text-sm">{company.gstNumber}</p>
                    </div>
                  )}
                  
                  {company.fssaiLicense && (
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <p className="text-sm font-medium text-blue-800">FSSAI License</p>
                      <p className="text-blue-700 font-mono text-sm">{company.fssaiLicense}</p>
                    </div>
                  )}
                  
                  {company.panNumber && (
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                      <p className="text-sm font-medium text-orange-800">PAN Number</p>
                      <p className="text-orange-700 font-mono text-sm">{company.panNumber}</p>
                    </div>
                  )}
                  
                  {company.cinNumber && (
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <p className="text-sm font-medium text-purple-800">CIN Number</p>
                      <p className="text-purple-700 font-mono text-xs">{company.cinNumber}</p>
                    </div>
                  )}
                  
                  {company.msmeRegistration && (
                    <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                      <p className="text-sm font-medium text-indigo-800">MSME Registration</p>
                      <p className="text-indigo-700 font-mono text-xs">{company.msmeRegistration}</p>
                    </div>
                  )}
                  
                  {company.tradeLicense && (
                    <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                      <p className="text-sm font-medium text-teal-800">Trade License</p>
                      <p className="text-teal-700 font-mono text-sm">{company.tradeLicense}</p>
                    </div>
                  )}
                </div>
                
                {company.complianceDetails && (
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-sm font-medium text-gray-800 mb-2">Certifications</p>
                      <div className="space-y-1">
                        {company.complianceDetails.food_safety_certification && (
                          <p className="text-sm text-gray-600">🏆 {company.complianceDetails.food_safety_certification}</p>
                        )}
                        {company.complianceDetails.quality_management && (
                          <p className="text-sm text-gray-600">✅ {company.complianceDetails.quality_management}</p>
                        )}
                        {company.complianceDetails.organic_certification && (
                          <p className="text-sm text-gray-600">🌱 {company.complianceDetails.organic_certification}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-sm font-medium text-gray-800 mb-2">Business Details</p>
                      <div className="space-y-1">
                        {company.establishmentYear && (
                          <p className="text-sm text-gray-600">Founded: {company.establishmentYear}</p>
                        )}
                        {company.businessCategory && (
                          <p className="text-sm text-gray-600">Category: {company.businessCategory}</p>
                        )}
                        {company.complianceDetails.import_export_code && (
                          <p className="text-sm text-gray-600">IEC: {company.complianceDetails.regulatory_approvals?.import_export_code}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Quick Actions */}
            <div className="border-t border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => router.push('/branch-management')}
                  className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors"
                >
                  <MapPin className="w-6 h-6 text-purple-600" />
                  <div className="text-left">
                    <p className="font-semibold text-purple-900">Manage Branches</p>
                    <p className="text-sm text-purple-600">Add, edit, and organize your branch locations</p>
                  </div>
                </button>

                <button
                  onClick={handleEditCompany}
                  className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
                >
                  <Edit className="w-6 h-6 text-blue-600" />
                  <div className="text-left">
                    <p className="font-semibold text-blue-900">Edit Company Info</p>
                    <p className="text-sm text-blue-600">Update company details and settings</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Company Found</h3>
            <p className="text-gray-600">Please set up your company information first.</p>
          </div>
        )}

        {/* Edit Company Modal */}
        {showEditModal && company && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 max-h-screen overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Edit Company Information</h3>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleUpdateCompany} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter company name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Brief description of the company"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="company@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="+1-555-0123"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="https://company.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Company headquarters address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Logo URL
                  </label>
                  <input
                    type="url"
                    name="logoUrl"
                    value={formData.logoUrl}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="https://company.com/logo.png"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Primary Color
                    </label>
                    <input
                      type="color"
                      name="primaryColor"
                      value={formData.primaryColor}
                      onChange={handleInputChange}
                      className="w-full h-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Secondary Color
                    </label>
                    <input
                      type="color"
                      name="secondaryColor"
                      value={formData.secondaryColor}
                      onChange={handleInputChange}
                      className="w-full h-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Accent Color
                    </label>
                    <input
                      type="color"
                      name="accentColor"
                      value={formData.accentColor}
                      onChange={handleInputChange}
                      className="w-full h-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-md font-semibold text-gray-800 mb-3">Indian Compliance Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        GST Number
                      </label>
                      <input
                        type="text"
                        name="gstNumber"
                        value={formData.gstNumber}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="27AABCL1234M1Z5"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        FSSAI License
                      </label>
                      <input
                        type="text"
                        name="fssaiLicense"
                        value={formData.fssaiLicense}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="12345678901234"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        PAN Number
                      </label>
                      <input
                        type="text"
                        name="panNumber"
                        value={formData.panNumber}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="AABCL1234M"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CIN Number
                      </label>
                      <input
                        type="text"
                        name="cinNumber"
                        value={formData.cinNumber}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="U74999DL2015PTC123456"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        MSME Registration
                      </label>
                      <input
                        type="text"
                        name="msmeRegistration"
                        value={formData.msmeRegistration}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="UDYAM-DL-03-0012345"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Trade License
                      </label>
                      <input
                        type="text"
                        name="tradeLicense"
                        value={formData.tradeLicense}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="TL/DL/2023/001234"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Establishment Year
                      </label>
                      <input
                        type="number"
                        name="establishmentYear"
                        value={formData.establishmentYear}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="2015"
                        min="1900"
                        max="2024"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Business Category
                      </label>
                      <input
                        type="text"
                        name="businessCategory"
                        value={formData.businessCategory}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Online Food Delivery & Organic Products"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updating}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {updating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Update Company
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}