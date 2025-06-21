'use client'

import React, { useState, useEffect } from 'react'
import { SuperAdminLayout } from '../components/layout/SuperAdminLayout'
import ColorContrastSelector from '../components/ui/ColorContrastSelector'


interface ColorScheme {
  id: string
  name: string
  description: string
  background: string
  foreground: string
  accent: string
  muted: string
  contrastRatio: number
  wcagLevel: 'AA' | 'AAA'
}

export default function AccessibilityPage() {
  const [currentScheme, setCurrentScheme] = useState<ColorScheme | null>(null)

  const handleSchemeChange = (scheme: ColorScheme) => {
    setCurrentScheme(scheme)
    
    // Apply the color scheme to the entire application
    const root = document.documentElement
    root.style.setProperty('--bg-primary', scheme.background)
    root.style.setProperty('--text-primary', scheme.foreground)
    root.style.setProperty('--accent-primary', scheme.accent)
    root.style.setProperty('--text-muted', scheme.muted)
    
    // Add CSS classes for accessibility
    document.body.classList.add('accessibility-mode')
    
    // Save to local storage
    localStorage.setItem('accessibility-color-scheme', scheme.id)
    localStorage.setItem('accessibility-scheme-data', JSON.stringify(scheme))
  }

  return (
    <SuperAdminLayout title="Accessibility Settings" subtitle="Configure visual accessibility and WCAG compliance settings">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 text-lg font-semibold">♿</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Accessibility Settings</h1>
              <p className="text-gray-600 mt-1">Configure visual accessibility and WCAG compliance settings</p>
            </div>
          </div>
          
          {/* Accessibility Status */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <span className="text-blue-600 font-medium">🛡️ Accessibility Status</span>
              {currentScheme && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                  {currentScheme.wcagLevel} Compliant
                </span>
              )}
            </div>
            <p className="text-blue-700 text-sm mt-1">
              {currentScheme 
                ? `Using "${currentScheme.name}" with ${currentScheme.contrastRatio.toFixed(1)}:1 contrast ratio`
                : 'Select an accessibility-friendly color scheme to improve user experience'
              }
            </p>
          </div>
        </div>

        {/* Color Contrast Selector */}
        <div className="mb-8">
          <ColorContrastSelector 
            onSchemeChange={handleSchemeChange}
            currentScheme={currentScheme?.id}
          />
        </div>

        {/* Additional Accessibility Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Screen Reader Support */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Screen Reader Support</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Enhanced ARIA Labels</p>
                  <p className="text-sm text-gray-600">Improved screen reader navigation</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Skip Navigation Links</p>
                  <p className="text-sm text-gray-600">Allow keyboard users to skip to main content</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Live Region Announcements</p>
                  <p className="text-sm text-gray-600">Announce dynamic content changes</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Keyboard Navigation */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Keyboard Navigation</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Enhanced Focus Indicators</p>
                  <p className="text-sm text-gray-600">High-visibility focus outlines</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Logical Tab Order</p>
                  <p className="text-sm text-gray-600">Predictable keyboard navigation flow</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Keyboard Shortcuts</p>
                  <p className="text-sm text-gray-600">Enable custom keyboard shortcuts</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Motion & Animation */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Motion & Animation</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Reduce Motion</p>
                  <p className="text-sm text-gray-600">Minimize animations for sensitive users</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Auto-play Media</p>
                  <p className="text-sm text-gray-600">Prevent automatic media playback</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Parallax Effects</p>
                  <p className="text-sm text-gray-600">Disable parallax scrolling effects</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Text & Display */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Text & Display</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Font Size
                </label>
                <input
                  type="range"
                  min="12"
                  max="24"
                  defaultValue="16"
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Small (12px)</span>
                  <span>Normal (16px)</span>
                  <span>Large (24px)</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Line Height
                </label>
                <input
                  type="range"
                  min="1.2"
                  max="2.0"
                  step="0.1"
                  defaultValue="1.5"
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Tight</span>
                  <span>Normal</span>
                  <span>Loose</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Dyslexia-Friendly Font</p>
                  <p className="text-sm text-gray-600">Use OpenDyslexic font family</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* WCAG Compliance Summary */}
        <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-900 mb-4">WCAG 2.1 Compliance Summary</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl text-green-600">✓</span>
              </div>
              <h4 className="font-medium text-green-900">Perceivable</h4>
              <p className="text-sm text-green-700">Color contrast, text alternatives, and resizable text</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl text-green-600">✓</span>
              </div>
              <h4 className="font-medium text-green-900">Operable</h4>
              <p className="text-sm text-green-700">Keyboard navigation and seizure-safe content</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl text-green-600">✓</span>
              </div>
              <h4 className="font-medium text-green-900">Understandable</h4>
              <p className="text-sm text-green-700">Readable text and predictable functionality</p>
            </div>
          </div>
        </div>
      </div>
    </SuperAdminLayout>
  )
}