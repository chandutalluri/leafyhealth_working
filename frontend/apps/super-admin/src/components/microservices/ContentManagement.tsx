import React, { useState, useEffect } from 'react';
import { apiClient } from '../../lib/apiClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { FileText, Image, Video, Upload, Eye, Edit, Trash2, Plus, Filter } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface ContentItem {
  id: string;
  title: string;
  content: string;
  type: 'page' | 'blog_post' | 'product_description' | 'banner' | 'announcement' | 'faq';
  status: 'draft' | 'published' | 'archived' | 'scheduled';
  language: string;
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
  featuredImage?: string;
  tags: string[];
  authorId: string;
  authorName: string;
  publishedAt?: string;
  scheduledAt?: string;
  viewCount: number;
  branchId?: string;
  branchName?: string;
  createdAt: string;
  updatedAt: string;
}

interface MediaFile {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  type: 'image' | 'video' | 'audio' | 'document' | 'other';
  url: string;
  altText?: string;
  description?: string;
  uploadedBy: string;
  uploaderName: string;
  folder: string;
  isPublic: boolean;
  createdAt: string;
}

interface ContentTemplate {
  id: string;
  name: string;
  type: 'page' | 'blog_post' | 'product_description' | 'banner' | 'announcement' | 'faq';
  structure: any;
  fields: string[];
  isActive: boolean;
  createdAt: string;
}

export default function ContentManagement() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [media, setMedia] = useState<MediaFile[]>([]);
  const [templates, setTemplates] = useState<ContentTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'content' | 'media' | 'templates'>('content');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isContentDialogOpen, setIsContentDialogOpen] = useState(false);

  useEffect(() => {
    fetchContentData();
  }, [statusFilter, typeFilter, searchTerm]);

  const fetchContentData = async () => {
    try {
      setLoading(true);
      const [contentData, mediaData, templatesData] = await Promise.all([
        apiClient.get('/api/direct-data/content', {
          status: statusFilter !== 'all' ? statusFilter : undefined,
          type: typeFilter !== 'all' ? typeFilter : undefined,
          search: searchTerm
        }),
        apiClient.get('/api/direct-data/media'),
        apiClient.get('/api/direct-data/content-templates')
      ]);
      setContent(contentData || []);
      setMedia(mediaData || []);
      setTemplates(templatesData || []);
    } catch (error) {
      console.error('Failed to fetch content data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateContentStatus = async (contentId: string, newStatus: string) => {
    try {
      await apiClient.put(`/api/direct-data/content/${contentId}`, { 
        status: newStatus,
        publishedAt: newStatus === 'published' ? new Date().toISOString() : undefined
      });
      fetchContentData();
    } catch (error) {
      console.error('Failed to update content status:', error);
    }
  };

  const createContent = async (contentData: Partial<ContentItem>) => {
    try {
      await apiClient.post('/api/direct-data/content', {
        ...contentData,
        slug: contentData.title?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      });
      fetchContentData();
      setIsContentDialogOpen(false);
    } catch (error) {
      console.error('Failed to create content:', error);
    }
  };

  const deleteContent = async (contentId: string) => {
    try {
      await apiClient.delete(`/api/direct-data/content/${contentId}`);
      fetchContentData();
    } catch (error) {
      console.error('Failed to delete content:', error);
    }
  };

  const uploadMedia = async (file: File, folder: string = 'general') => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);
      
      await apiClient.post('/api/direct-data/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fetchContentData();
    } catch (error) {
      console.error('Failed to upload media:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'default';
      case 'draft': return 'secondary';
      case 'scheduled': return 'outline';
      case 'archived': return 'destructive';
      default: return 'secondary';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      case 'page':
      case 'blog_post':
      case 'faq':
        return <FileText className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredContent = content.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalContent = content.length;
  const publishedContent = content.filter(c => c.status === 'published').length;
  const draftContent = content.filter(c => c.status === 'draft').length;
  const totalViews = content.reduce((sum, c) => sum + c.viewCount, 0);

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading content management...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
          <p className="text-gray-500">Manage digital content, media assets, and templates</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isContentDialogOpen} onOpenChange={setIsContentDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Content
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Create New Content</DialogTitle>
                <DialogDescription>Add new content to your website or application</DialogDescription>
              </DialogHeader>
              <ContentForm onSubmit={createContent} onCancel={() => setIsContentDialogOpen(false)} />
            </DialogContent>
          </Dialog>
          <input
            type="file"
            id="media-upload"
            multiple
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              files.forEach(file => uploadMedia(file));
            }}
            className="hidden"
          />
          <Button variant="outline" onClick={() => document.getElementById('media-upload')?.click()}>
            <Upload className="h-4 w-4 mr-2" />
            Upload Media
          </Button>
        </div>
      </div>

      {/* Content Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Content</CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalContent}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <Eye className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{publishedContent}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            <Edit className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{draftContent}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{totalViews.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b">
        {['content', 'media', 'templates'].map((tab) => (
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

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Search content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="page">Page</SelectItem>
                <SelectItem value="blog_post">Blog Post</SelectItem>
                <SelectItem value="product_description">Product Description</SelectItem>
                <SelectItem value="banner">Banner</SelectItem>
                <SelectItem value="announcement">Announcement</SelectItem>
                <SelectItem value="faq">FAQ</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Content based on active tab */}
      {activeTab === 'content' && (
        <Card>
          <CardHeader>
            <CardTitle>Content Items</CardTitle>
            <CardDescription>All content items and their publication status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Title</th>
                    <th className="text-left py-3 px-4 font-medium">Type</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Author</th>
                    <th className="text-left py-3 px-4 font-medium">Views</th>
                    <th className="text-left py-3 px-4 font-medium">Last Updated</th>
                    <th className="text-left py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContent.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="font-medium">{item.title}</div>
                        <div className="text-sm text-gray-500">/{item.slug}</div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className="gap-1">
                          {getTypeIcon(item.type)}
                          {item.type.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={getStatusColor(item.status)}>
                          {item.status.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">{item.authorName}</td>
                      <td className="py-3 px-4">{item.viewCount}</td>
                      <td className="py-3 px-4 text-sm">
                        {new Date(item.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Select 
                            value={item.status} 
                            onValueChange={(status) => updateContentStatus(item.id, status)}
                          >
                            <SelectTrigger className="w-28">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="draft">Draft</SelectItem>
                              <SelectItem value="published">Published</SelectItem>
                              <SelectItem value="scheduled">Scheduled</SelectItem>
                              <SelectItem value="archived">Archived</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => deleteContent(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
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

      {activeTab === 'media' && (
        <Card>
          <CardHeader>
            <CardTitle>Media Library</CardTitle>
            <CardDescription>All uploaded media files and assets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {media.map((file) => (
                <Card key={file.id}>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                        {file.type === 'image' ? (
                          <img 
                            src={file.url} 
                            alt={file.altText || file.filename}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="text-gray-400">
                            {getTypeIcon(file.type)}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-sm truncate">{file.originalName}</div>
                        <div className="text-xs text-gray-500">{formatFileSize(file.size)}</div>
                        <div className="text-xs text-gray-500">{file.mimeType}</div>
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3" />
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

      {activeTab === 'templates' && (
        <Card>
          <CardHeader>
            <CardTitle>Content Templates</CardTitle>
            <CardDescription>Reusable content templates and structures</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map((template) => (
                <Card key={template.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <CardDescription>{template.type.replace('_', ' ')} template</CardDescription>
                      </div>
                      <Badge variant={template.isActive ? 'default' : 'outline'}>
                        {template.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm font-medium">Fields</div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {template.fields.map((field, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {field}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Edit Template
                        </Button>
                        <Button size="sm">
                          Use Template
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

function ContentForm({ 
  onSubmit, 
  onCancel 
}: { 
  onSubmit: (data: Partial<ContentItem>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'page' as const,
    metaTitle: '',
    metaDescription: '',
    language: 'en'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      status: 'draft' as const,
      tags: []
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="type">Content Type</Label>
          <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="page">Page</SelectItem>
              <SelectItem value="blog_post">Blog Post</SelectItem>
              <SelectItem value="product_description">Product Description</SelectItem>
              <SelectItem value="banner">Banner</SelectItem>
              <SelectItem value="announcement">Announcement</SelectItem>
              <SelectItem value="faq">FAQ</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          rows={8}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="metaTitle">Meta Title</Label>
          <Input
            id="metaTitle"
            value={formData.metaTitle}
            onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="language">Language</Label>
          <Select value={formData.language} onValueChange={(value) => setFormData({ ...formData, language: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="te">Telugu</SelectItem>
              <SelectItem value="hi">Hindi</SelectItem>
              <SelectItem value="ta">Tamil</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="metaDescription">Meta Description</Label>
        <Textarea
          id="metaDescription"
          value={formData.metaDescription}
          onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Create Content
        </Button>
      </div>
    </form>
  );
}