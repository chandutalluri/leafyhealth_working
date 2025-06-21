import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { toast } from 'react-hot-toast';

interface ImageStats {
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

interface ServiceHealth {
  status: string;
  service: string;
  timestamp: string;
  version: string;
  port: string;
  features: string[];
}

const ImageManagementPage = () => {
  const [stats, setStats] = useState<ImageStats | null>(null);
  const [health, setHealth] = useState<ServiceHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const API_BASE_URL = '/api/image-management';

  useEffect(() => {
    fetchServiceData();
  }, []);

  const fetchServiceData = async () => {
    try {
      setLoading(true);
      
      // Fetch health status
      const healthResponse = await fetch(`${API_BASE_URL}/health`);
      if (healthResponse.ok) {
        const healthData = await healthResponse.json();
        setHealth(healthData);
        toast.success('Service healthy');
      } else {
        toast.error('Service unavailable');
      }

      // Fetch statistics
      const statsResponse = await fetch(`${API_BASE_URL}/stats`);
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      } else {
        toast.error(`Stats API returned: ${statsResponse.status}`);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      toast.error('Service unavailable');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      alert('File must be less than 2MB');
      return;
    }

    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp', 'image/bmp', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      alert('Please select a valid image file (PNG, JPG, GIF, WebP, BMP, SVG)');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(`Image uploaded: ${result.image.filename}`);
        fetchServiceData(); // Refresh stats
      } else {
        toast.error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const testService = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      if (response.ok) {
        toast.success('Service test successful');
        fetchServiceData();
      } else {
        toast.error('Service test failed');
      }
    } catch (error) {
      toast.error('Service unavailable');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading Image Management Service...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Image Management</h1>
        <Button onClick={testService} variant="outline">
          Test Service
        </Button>
      </div>

      {/* Service Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-3 ${
                health?.status === 'healthy' ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <div>
                <div className="text-2xl font-bold">
                  {stats?.overview.totalImages || 0}
                </div>
                <p className="text-xs text-muted-foreground">Total Images</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-3 bg-blue-500"></div>
              <div>
                <div className="text-2xl font-bold">
                  {stats?.overview.totalSizeFormatted || '0 Bytes'}
                </div>
                <p className="text-xs text-muted-foreground">Storage Used</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-3 bg-orange-500"></div>
              <div>
                <div className="text-2xl font-bold">3070</div>
                <p className="text-xs text-muted-foreground">Service Port</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upload Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Upload Images</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={uploading}
              className="w-full"
            />
            <p className="text-sm text-gray-500 mt-2">
              Supported formats: JPEG, PNG, GIF, WebP (Max 2MB per file)
            </p>
            {uploading && (
              <div className="mt-4 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Uploading...</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Image Gallery Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Images</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <p>No images uploaded yet. Upload some images to see them here.</p>
          </div>
        </CardContent>
      </Card>

      {/* Service Information */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Service Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Service URL:</strong> Port 8080 (via gateway)
            </div>
            <div>
              <strong>Upload Endpoint:</strong> /api/image-management/upload
            </div>
            <div>
              <strong>Health Status:</strong> {health?.status || 'Unknown'}
            </div>
            <div>
              <strong>Version:</strong> {health?.version || 'Unknown'}
            </div>
          </div>
          {health?.features && (
            <div className="mt-4">
              <strong>Features:</strong>
              <div className="flex flex-wrap gap-2 mt-2">
                {health.features.map((feature, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ImageManagementPage;