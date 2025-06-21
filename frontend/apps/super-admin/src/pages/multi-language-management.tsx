'use client';

import { useState, useEffect } from 'react'
import { SuperAdminLayout } from '../components/layout/SuperAdminLayout'

interface LanguageItem {
  id: number
  language: string
  code: string
  region: string
  status: 'active' | 'inactive' | 'pending'
  completion: number
  lastUpdated: string
  translator?: string
}

interface TranslationStats {
  totalLanguages: number
  activeLanguages: number
  completionAverage: number
  pendingTranslations: number
}

export default function MultiLanguageManagement() {
  const [languages, setLanguages] = useState<LanguageItem[]>([])
  const [stats, setStats] = useState<TranslationStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'languages' | 'translations' | 'settings'>('overview')
  const [showLanguageCreator, setShowLanguageCreator] = useState(false)
  const [newLanguage, setNewLanguage] = useState({
    language: '',
    code: '',
    region: '',
    status: 'pending' as 'active' | 'inactive' | 'pending'
  })

  useEffect(() => {
    loadLanguageData()
  }, [])

  const loadLanguageData = async () => {
    try {
      setLoading(true)
      
      // Fetch from actual multi-language microservice
      const response = await fetch('/api/multi-language-management')
      const data = await response.json()
      
      if (data.success && data.data) {
        setLanguages(data.data)
        
        // Calculate statistics from real data
        const totalLanguages = data.data.length
        const activeLanguages = data.data.filter((lang: LanguageItem) => lang.status === 'active').length
        const completionAverage = data.data.reduce((sum: number, lang: LanguageItem) => sum + lang.completion, 0) / totalLanguages
        const pendingTranslations = data.data.filter((lang: LanguageItem) => lang.status === 'pending').length
        
        setStats({
          totalLanguages,
          activeLanguages,
          completionAverage: Math.round(completionAverage),
          pendingTranslations
        })
      }
    } catch (error) {
      console.error('Error loading language data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateLanguage = async () => {
    try {
      const response = await fetch('/api/multi-language-management', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newLanguage,
          completion: 0,
          lastUpdated: new Date().toISOString()
        })
      })

      if (response.ok) {
        await loadLanguageData()
        setShowLanguageCreator(false)
        setNewLanguage({ language: '', code: '', region: '', status: 'pending' })
        console.log('Language added successfully')
      }
    } catch (error) {
      console.error('Error creating language:', error)
    }
  }

  const handleDeleteLanguage = async (languageId: number) => {
    if (!confirm('Are you sure you want to delete this language?')) return
    
    try {
      const response = await fetch(`/api/multi-language-management/${languageId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        await loadLanguageData()
        console.log('Language deleted successfully')
      }
    } catch (error) {
      console.error('Error deleting language:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCompletionColor = (completion: number) => {
    if (completion >= 90) return 'text-green-600'
    if (completion >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (loading) {
    return (
      <SuperAdminLayout
        title="Multi-Language Management"
        subtitle="Internationalization and Localization Control"
        icon="🌐"
        showBackButton={true}
      >
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </SuperAdminLayout>
    )
  }

  return (
    <SuperAdminLayout
      title="Multi-Language Management"
      subtitle="Internationalization and Localization Control"
      icon="🌐"
      showBackButton={true}
    >
      {/* System Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">🌍</span>
          <div>
            <h3 className="text-lg font-semibold text-blue-800">Multi-Language System</h3>
            <p className="text-blue-700 text-sm">
              Manage platform translations, regional settings, and internationalization features for global user support.
            </p>
          </div>
        </div>
      </div>

      {/* Language Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-2xl">🗣️</span>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Languages</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.totalLanguages}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-2xl">✅</span>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Active Languages</dt>
                    <dd className="text-lg font-medium text-green-600">{stats.activeLanguages}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-2xl">📊</span>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Avg Completion</dt>
                    <dd className={`text-lg font-medium ${getCompletionColor(stats.completionAverage)}`}>
                      {stats.completionAverage}%
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-2xl">⏳</span>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Pending</dt>
                    <dd className="text-lg font-medium text-yellow-600">{stats.pendingTranslations}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: '📊' },
              { id: 'languages', name: 'Languages', icon: '🗣️' },
              { id: 'translations', name: 'Translations', icon: '📝' },
              { id: 'settings', name: 'Settings', icon: '⚙️' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
              >
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'languages' && (
        <div className="space-y-6">
          {/* Language Management Header */}
          <div className="bg-white shadow-lg rounded-xl border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Language Management</h3>
              <button 
                onClick={() => setShowLanguageCreator(true)}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Add New Language
              </button>
            </div>
            
            {/* Languages Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Language</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Region</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completion</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {languages.map((language) => (
                    <tr key={language.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{language.language}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{language.code}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{language.region}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(language.status)}`}>
                          {language.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="bg-purple-600 h-2 rounded-full" 
                              style={{ width: `${language.completion}%` }}
                            ></div>
                          </div>
                          <span className={`text-sm font-medium ${getCompletionColor(language.completion)}`}>
                            {language.completion}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button className="text-purple-600 hover:text-purple-900">Edit</button>
                        <button 
                          onClick={() => handleDeleteLanguage(language.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Language Creator Modal */}
      {showLanguageCreator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Language</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Language Name (e.g., Spanish)"
                value={newLanguage.language}
                onChange={(e) => setNewLanguage({ ...newLanguage, language: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Language Code (e.g., es)"
                value={newLanguage.code}
                onChange={(e) => setNewLanguage({ ...newLanguage, code: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Region (e.g., Spain, Mexico)"
                value={newLanguage.region}
                onChange={(e) => setNewLanguage({ ...newLanguage, region: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <select
                value={newLanguage.status}
                onChange={(e) => setNewLanguage({ ...newLanguage, status: e.target.value as any })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button 
                onClick={() => setShowLanguageCreator(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateLanguage}
                disabled={!newLanguage.language.trim() || !newLanguage.code.trim()}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Language
              </button>
            </div>
          </div>
        </div>
      )}
    </SuperAdminLayout>
  )
}