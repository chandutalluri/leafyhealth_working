import React, { useState, useEffect } from 'react';
import { apiClient } from '../../lib/apiClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Globe, Languages, Edit, Plus, Download, Upload, Filter } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface Language {
  id: string;
  name: string;
  code: string;
  nativeName: string;
  isActive: boolean;
  isDefault: boolean;
  isRTL: boolean;
  translationProgress: number;
  totalKeys: number;
  translatedKeys: number;
  createdAt: string;
}

interface Translation {
  id: string;
  key: string;
  languageId: string;
  languageCode: string;
  value: string;
  context?: string;
  category: string;
  isApproved: boolean;
  translatedBy?: string;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
}

interface TranslationKey {
  id: string;
  key: string;
  defaultValue: string;
  description?: string;
  category: string;
  context?: string;
  isPlural: boolean;
  createdAt: string;
}

export default function MultiLanguageManagement() {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [translationKeys, setTranslationKeys] = useState<TranslationKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'languages' | 'translations' | 'keys'>('languages');
  const [languageFilter, setLanguageFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLanguageDialogOpen, setIsLanguageDialogOpen] = useState(false);

  useEffect(() => {
    fetchLanguageData();
  }, [languageFilter, categoryFilter, searchTerm]);

  const fetchLanguageData = async () => {
    try {
      setLoading(true);
      const [languagesData, translationsData, keysData] = await Promise.all([
        apiClient.get('/api/direct-data/languages'),
        apiClient.get('/api/direct-data/translations', {
          language: languageFilter !== 'all' ? languageFilter : undefined,
          category: categoryFilter !== 'all' ? categoryFilter : undefined,
          search: searchTerm
        }),
        apiClient.get('/api/direct-data/translation-keys')
      ]);
      setLanguages(languagesData || []);
      setTranslations(translationsData || []);
      setTranslationKeys(keysData || []);
    } catch (error) {
      console.error('Failed to fetch language data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createLanguage = async (languageData: Partial<Language>) => {
    try {
      await apiClient.post('/api/direct-data/languages', languageData);
      fetchLanguageData();
      setIsLanguageDialogOpen(false);
    } catch (error) {
      console.error('Failed to create language:', error);
    }
  };

  const updateLanguageStatus = async (languageId: string, isActive: boolean) => {
    try {
      await apiClient.put(`/api/direct-data/languages/${languageId}`, { isActive });
      fetchLanguageData();
    } catch (error) {
      console.error('Failed to update language status:', error);
    }
  };

  const setDefaultLanguage = async (languageId: string) => {
    try {
      await apiClient.put(`/api/direct-data/languages/${languageId}/set-default`);
      fetchLanguageData();
    } catch (error) {
      console.error('Failed to set default language:', error);
    }
  };

  const updateTranslation = async (translationId: string, value: string) => {
    try {
      await apiClient.put(`/api/direct-data/translations/${translationId}`, { value });
      fetchLanguageData();
    } catch (error) {
      console.error('Failed to update translation:', error);
    }
  };

  const approveTranslation = async (translationId: string) => {
    try {
      await apiClient.put(`/api/direct-data/translations/${translationId}/approve`);
      fetchLanguageData();
    } catch (error) {
      console.error('Failed to approve translation:', error);
    }
  };

  const exportTranslations = async (languageCode: string) => {
    try {
      const response = await apiClient.get(`/api/direct-data/translations/export/${languageCode}`);
      // Handle file download
      const blob = new Blob([JSON.stringify(response, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `translations_${languageCode}.json`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export translations:', error);
    }
  };

  const filteredTranslations = translations.filter(translation =>
    translation.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
    translation.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredKeys = translationKeys.filter(key =>
    key.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
    key.defaultValue.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalLanguages = languages.length;
  const activeLanguages = languages.filter(l => l.isActive).length;
  const totalTranslations = translations.length;
  const approvedTranslations = translations.filter(t => t.isApproved).length;
  const translationProgress = totalTranslations > 0 ? Math.round((approvedTranslations / totalTranslations) * 100) : 0;

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading multi-language management...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Multi-Language Management</h1>
          <p className="text-gray-500">Manage languages, translations, and localization</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isLanguageDialogOpen} onOpenChange={setIsLanguageDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Language
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Language</DialogTitle>
                <DialogDescription>Add a new language for translation support</DialogDescription>
              </DialogHeader>
              <LanguageForm onSubmit={createLanguage} onCancel={() => setIsLanguageDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Language Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Languages</CardTitle>
            <Globe className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLanguages}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Languages</CardTitle>
            <Languages className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeLanguages}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Translations</CardTitle>
            <Edit className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{totalTranslations}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Translation Progress</CardTitle>
            <Languages className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{translationProgress}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b">
        {['languages', 'translations', 'keys'].map((tab) => (
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
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {activeTab === 'translations' && (
              <>
                <Select value={languageFilter} onValueChange={setLanguageFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Languages</SelectItem>
                    {languages.map((lang) => (
                      <SelectItem key={lang.id} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="ui">UI Elements</SelectItem>
                    <SelectItem value="navigation">Navigation</SelectItem>
                    <SelectItem value="forms">Forms</SelectItem>
                    <SelectItem value="messages">Messages</SelectItem>
                    <SelectItem value="products">Products</SelectItem>
                    <SelectItem value="orders">Orders</SelectItem>
                  </SelectContent>
                </Select>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Content based on active tab */}
      {activeTab === 'languages' && (
        <Card>
          <CardHeader>
            <CardTitle>Supported Languages</CardTitle>
            <CardDescription>Manage available languages and their settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Language</th>
                    <th className="text-left py-3 px-4 font-medium">Code</th>
                    <th className="text-left py-3 px-4 font-medium">Progress</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Default</th>
                    <th className="text-left py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {languages.map((language) => (
                    <tr key={language.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="font-medium">{language.name}</div>
                        <div className="text-sm text-gray-500">{language.nativeName}</div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">{language.code}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${language.translationProgress}%` }}
                            />
                          </div>
                          <span className="text-sm">{language.translationProgress}%</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {language.translatedKeys}/{language.totalKeys} keys
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={language.isActive ? 'default' : 'outline'}>
                          {language.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        {language.isDefault ? (
                          <Badge variant="default">Default</Badge>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setDefaultLanguage(language.id)}
                          >
                            Set Default
                          </Button>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => exportTranslations(language.code)}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Export
                          </Button>
                          <Button
                            size="sm"
                            variant={language.isActive ? 'destructive' : 'default'}
                            onClick={() => updateLanguageStatus(language.id, !language.isActive)}
                          >
                            {language.isActive ? 'Deactivate' : 'Activate'}
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

      {activeTab === 'translations' && (
        <Card>
          <CardHeader>
            <CardTitle>Translation Management</CardTitle>
            <CardDescription>Manage translations for all supported languages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Key</th>
                    <th className="text-left py-3 px-4 font-medium">Language</th>
                    <th className="text-left py-3 px-4 font-medium">Translation</th>
                    <th className="text-left py-3 px-4 font-medium">Category</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTranslations.map((translation) => (
                    <tr key={translation.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="font-mono text-sm">{translation.key}</div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">{translation.languageCode}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="max-w-xs truncate">{translation.value}</div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">{translation.category}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={translation.isApproved ? 'default' : 'secondary'}>
                          {translation.isApproved ? 'Approved' : 'Pending'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          {!translation.isApproved && (
                            <Button
                              size="sm"
                              onClick={() => approveTranslation(translation.id)}
                            >
                              Approve
                            </Button>
                          )}
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

      {activeTab === 'keys' && (
        <Card>
          <CardHeader>
            <CardTitle>Translation Keys</CardTitle>
            <CardDescription>Manage translation keys and their default values</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Key</th>
                    <th className="text-left py-3 px-4 font-medium">Default Value</th>
                    <th className="text-left py-3 px-4 font-medium">Category</th>
                    <th className="text-left py-3 px-4 font-medium">Description</th>
                    <th className="text-left py-3 px-4 font-medium">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredKeys.map((key) => (
                    <tr key={key.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="font-mono text-sm">{key.key}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="max-w-xs truncate">{key.defaultValue}</div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">{key.category}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-gray-500">{key.description || '-'}</div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={key.isPlural ? 'secondary' : 'outline'}>
                          {key.isPlural ? 'Plural' : 'Singular'}
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

function LanguageForm({ 
  onSubmit, 
  onCancel 
}: { 
  onSubmit: (data: Partial<Language>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    nativeName: '',
    isRTL: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      isActive: true,
      isDefault: false,
      translationProgress: 0,
      totalKeys: 0,
      translatedKeys: 0
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Language Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="English"
            required
          />
        </div>
        <div>
          <Label htmlFor="code">Language Code</Label>
          <Input
            id="code"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            placeholder="en"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="nativeName">Native Name</Label>
        <Input
          id="nativeName"
          value={formData.nativeName}
          onChange={(e) => setFormData({ ...formData, nativeName: e.target.value })}
          placeholder="English"
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          id="isRTL"
          type="checkbox"
          checked={formData.isRTL}
          onChange={(e) => setFormData({ ...formData, isRTL: e.target.checked })}
        />
        <Label htmlFor="isRTL">Right-to-Left (RTL) Language</Label>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Add Language
        </Button>
      </div>
    </form>
  );
}