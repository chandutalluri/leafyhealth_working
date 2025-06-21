import React, { useState, useEffect } from 'react';
import { Upload, Image, BarChart3, Settings, Trash2, Download, Eye, FolderOpen } from 'lucide-react';
import NextImage from 'next/image';

interface ImageData {
  id: string;
  filename: string;
  originalName: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
  isPublic: boolean;
  category: string;
  entityType: string;
  url: string;
  variants: string[];
}

interface Stats {
  overview: {
    totalImages: number;
    totalSize: number;
    totalSizeFormatted: string;
    publicImages: number;
    privateImages: number;
  };
  breakdown: {
    categories: Array<{ name: string; count: number }>;
    entityTypes: Array<{ name: string; count: number }>;
  };
  recentActivity: {
    uploadsToday: number;
    uploadsThisWeek: number;
  };
}

export default function ImageManagement() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  const API_BASE = '/api/image-management';

  useEffect(() => {
    loadImages();
    loadStats();
  }, []);

  const loadImages = async () => {
    try {
      const response = await fetch(API_BASE);
      if (response.ok) {
        const data = await response.json();
        setImages(data.images || []);
      }
    } catch (error) {
      console.error('Error loading images:', error);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch(`${API_BASE}/stats`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(event.target.files);
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      alert('Logo file must be less than 2MB');
      return;
    }

    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Logo must be PNG, JPG, SVG, or WebP format');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        
        // Update image to mark as brand logo
        const updateResponse = await fetch(`${API_BASE}/${result.image.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            category: 'brand',
            entityType: 'logo',
            isPublic: true
          }),
        });

        if (updateResponse.ok) {
          alert('Brand logo updated successfully! It will appear across all applications.');
          await loadImages();
          await loadStats();
          
          // Refresh the page to show new logo
          window.location.reload();
        } else {
          alert('Logo uploaded but failed to set as brand logo');
        }
      } else {
        const errorData = await response.json();
        alert(`Logo upload failed: ${errorData.message || errorData.error}`);
      }
    } catch (error) {
      console.error('Logo upload error:', error);
      alert(`Logo upload error: ${error.message}`);
    }
  };

  const handleUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) return;
    
    setUploading(true);
    const formData = new FormData();
    
    // Upload files one by one since backend expects single file uploads
    for (const file of Array.from(selectedFiles)) {
      // Validate file size (2MB limit)
      if (file.size > 2 * 1024 * 1024) {
        alert(`File "${file.name}" is too large. Maximum size is 2MB.`);
        continue;
      }

      // Validate file type
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp', 'image/bmp', 'image/svg+xml'];
      if (!validTypes.includes(file.type)) {
        alert(`File "${file.name}" is not a supported image format. Please use PNG, JPG, GIF, WebP, BMP, or SVG.`);
        continue;
      }

      const singleFormData = new FormData();
      singleFormData.append('file', file);
      
      try {
        const response = await fetch(`${API_BASE}/upload`, {
          method: 'POST',
          body: singleFormData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Upload failed for file:', file.name, errorData);
          alert(`Upload failed for ${file.name}: ${errorData.message || errorData.error}`);
          continue;
        }
      } catch (error) {
        console.error('Upload error for file:', file.name, error);
        alert(`Upload error for ${file.name}: ${error.message}`);
        continue;
      }
    }

    // Refresh data after all uploads
    await loadImages();
    await loadStats();
    setSelectedFiles(null);
    
    // Reset file input
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
    
    setUploading(false);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDeleteImage = async (imageId: string, imageName: string) => {
    if (!confirm(`Are you sure you want to delete "${imageName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/${imageId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadImages();
        await loadStats();
        alert('Image deleted successfully');
      } else {
        const errorData = await response.json();
        alert(`Failed to delete image: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Error deleting image. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Image Management...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Image Management</h1>
          <p className="mt-2 text-gray-600">Upload, manage, and organize images across the platform</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Image className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Images</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats?.overview?.totalImages || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BarChart3 className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Size</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats?.overview?.totalSizeFormatted || '0 Bytes'}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Upload className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Today's Uploads</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats?.recentActivity?.uploadsToday || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Settings className="h-8 w-8 text-orange-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Public Images</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats?.overview?.publicImages || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Logo Management Section */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Brand Logo Management</h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Settings className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-blue-800">Current Brand Logo</h4>
                  <p className="text-sm text-blue-700 mt-1">This logo will appear across all applications</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-4">
                <div className="w-32 h-16 bg-white border border-gray-200 rounded flex items-center justify-center">
                  <img
                    src="/api/image-management/serve/leafyhealthlogo_copy_25991930-2a1c-4593-95db-1965eea84310.png"
                    alt="Current Logo"
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjQwIiB2aWV3Qm94PSIwIDAgMTAwIDQwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iNDAiIGZpbGw9IiNGM0Y0RjYiLz48dGV4dCB4PSI1MCIgeT0iMjQiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzZCNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+TG9nbzwvdGV4dD48L3N2Zz4=';
                    }}
                  />
                </div>
                <div>
                  <label htmlFor="logo-upload" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer">
                    <Upload className="h-4 w-4 mr-2" />
                    Update Brand Logo
                    <input
                      id="logo-upload"
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={handleLogoUpload}
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG, SVG up to 2MB</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Upload Images</h3>
            
            <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                    <span>Choose files</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      multiple
                      accept="image/*"
                      onChange={handleFileSelect}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF, WebP up to 2MB</p>
              </div>
            </div>

            {selectedFiles && selectedFiles.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-2">
                  {selectedFiles.length} file(s) selected
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {uploading ? 'Uploading...' : 'Upload Files'}
                  </button>
                  <button
                    onClick={() => setSelectedFiles(null)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Images Gallery */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Uploaded Images</h3>
            
            {images.length === 0 ? (
              <div className="text-center py-12">
                <FolderOpen className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No images uploaded yet</h3>
                <p className="mt-1 text-sm text-gray-500">Upload some images to see them here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {images.map((image) => (
                  <div key={image.id} className="bg-gray-50 rounded-lg overflow-hidden">
                    <div className="aspect-w-1 aspect-h-1 w-full">
                      <div className="relative h-48 bg-gray-200">
                        <NextImage
                          src={`/api/image-management/serve/${image.filename}`}
                          alt={image.originalName}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = `
                                <div class="flex items-center justify-center h-full">
                                  <div class="text-center">
                                    <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <p class="text-xs text-gray-500 mt-1">Failed to load</p>
                                  </div>
                                </div>
                              `;
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {image.originalName}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatBytes(image.size)} • {image.mimeType}
                      </p>
                      <div className="mt-2 flex gap-2">
                        <button
                          onClick={() => window.open(`/api/image-management/serve/${image.filename}`, '_blank')}
                          className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </button>
                        <button
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = `/api/image-management/serve/${image.filename}`;
                            link.download = image.originalName;
                            link.click();
                          }}
                          className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </button>
                        <button
                          onClick={() => handleDeleteImage(image.id, image.originalName)}
                          className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Feature Tags */}
        <div className="mt-8 flex flex-wrap gap-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Image upload and processing
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Image variant generation
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Image serving and delivery
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            Statistics and analytics
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            CRUD operations
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
            Entity-based image management
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Bulk operations
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
            Advanced filtering
          </span>
        </div>
      </div>
    </div>
  );
}