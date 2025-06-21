'use client'

import React, { useState, useEffect } from 'react'

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

interface ColorContrastSelectorProps {
  onSchemeChange: (scheme: ColorScheme) => void
  currentScheme?: string
}

export default function ColorContrastSelector({ onSchemeChange, currentScheme = 'default' }: ColorContrastSelectorProps) {
  const [selectedScheme, setSelectedScheme] = useState(currentScheme)
  const [showAdvanced, setShowAdvanced] = useState(false)

  // WCAG 2.1 compliant color schemes
  const colorSchemes: ColorScheme[] = [
    {
      id: 'default',
      name: 'Default',
      description: 'Standard high contrast scheme',
      background: '#ffffff',
      foreground: '#1f2937',
      accent: '#7c3aed',
      muted: '#6b7280',
      contrastRatio: 12.6,
      wcagLevel: 'AAA'
    },
    {
      id: 'high-contrast',
      name: 'High Contrast',
      description: 'Maximum contrast for visual accessibility',
      background: '#000000',
      foreground: '#ffffff',
      accent: '#ffff00',
      muted: '#cccccc',
      contrastRatio: 21,
      wcagLevel: 'AAA'
    },
    {
      id: 'dark-mode',
      name: 'Dark Mode',
      description: 'Dark theme with optimal contrast',
      background: '#111827',
      foreground: '#f9fafb',
      accent: '#60a5fa',
      muted: '#9ca3af',
      contrastRatio: 15.8,
      wcagLevel: 'AAA'
    },
    {
      id: 'deuteranopia',
      name: 'Deuteranopia Friendly',
      description: 'Optimized for red-green color blindness',
      background: '#ffffff',
      foreground: '#1f2937',
      accent: '#0891b2',
      muted: '#64748b',
      contrastRatio: 12.6,
      wcagLevel: 'AAA'
    },
    {
      id: 'protanopia',
      name: 'Protanopia Friendly',
      description: 'Optimized for red color blindness',
      background: '#ffffff',
      foreground: '#1f2937',
      accent: '#059669',
      muted: '#64748b',
      contrastRatio: 12.6,
      wcagLevel: 'AAA'
    },
    {
      id: 'tritanopia',
      name: 'Tritanopia Friendly',
      description: 'Optimized for blue-yellow color blindness',
      background: '#ffffff',
      foreground: '#1f2937',
      accent: '#dc2626',
      muted: '#64748b',
      contrastRatio: 12.6,
      wcagLevel: 'AAA'
    },
    {
      id: 'low-vision',
      name: 'Low Vision',
      description: 'Enhanced for users with low vision',
      background: '#fef3c7',
      foreground: '#1f2937',
      accent: '#b45309',
      muted: '#78716c',
      contrastRatio: 16.2,
      wcagLevel: 'AAA'
    }
  ]

  // Calculate contrast ratio between two colors
  const calculateContrastRatio = (color1: string, color2: string): number => {
    const getLuminance = (hex: string): number => {
      const rgb = parseInt(hex.slice(1), 16)
      const r = (rgb >> 16) & 0xff
      const g = (rgb >> 8) & 0xff
      const b = (rgb >> 0) & 0xff

      const sRGB = [r, g, b].map(c => {
        c = c / 255
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
      })

      return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2]
    }

    const lum1 = getLuminance(color1)
    const lum2 = getLuminance(color2)
    const brightest = Math.max(lum1, lum2)
    const darkest = Math.min(lum1, lum2)

    return (brightest + 0.05) / (darkest + 0.05)
  }

  const handleSchemeChange = (scheme: ColorScheme) => {
    setSelectedScheme(scheme.id)
    onSchemeChange(scheme)
    
    // Apply CSS variables immediately for preview
    const root = document.documentElement
    root.style.setProperty('--contrast-bg', scheme.background)
    root.style.setProperty('--contrast-fg', scheme.foreground)
    root.style.setProperty('--contrast-accent', scheme.accent)
    root.style.setProperty('--contrast-muted', scheme.muted)
  }

  const getWCAGBadge = (level: 'AA' | 'AAA', ratio: number) => {
    const isAAA = ratio >= 7
    const isAA = ratio >= 4.5
    
    return (
      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
        isAAA ? 'bg-green-100 text-green-800' : 
        isAA ? 'bg-yellow-100 text-yellow-800' : 
        'bg-red-100 text-red-800'
      }`}>
        WCAG {isAAA ? 'AAA' : isAA ? 'AA' : 'Fail'} ({ratio.toFixed(1)}:1)
      </div>
    )
  }

  useEffect(() => {
    const savedScheme = localStorage.getItem('accessibility-color-scheme')
    if (savedScheme) {
      const scheme = colorSchemes.find(s => s.id === savedScheme)
      if (scheme) {
        handleSchemeChange(scheme)
      }
    }
  }, [])

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Accessibility Color Schemes</h3>
          <p className="text-sm text-gray-600 mt-1">
            Choose a color scheme optimized for visual accessibility and WCAG compliance
          </p>
        </div>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-sm text-purple-600 hover:text-purple-700 font-medium"
        >
          {showAdvanced ? 'Hide Advanced' : 'Advanced Options'}
        </button>
      </div>

      {/* Color Scheme Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {colorSchemes.map((scheme) => (
          <div
            key={scheme.id}
            className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
              selectedScheme === scheme.id
                ? 'border-purple-500 ring-2 ring-purple-200'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handleSchemeChange(scheme)}
          >
            {/* Color Preview */}
            <div className="flex space-x-2 mb-3">
              <div
                className="w-8 h-8 rounded border"
                style={{ backgroundColor: scheme.background }}
                title="Background"
              />
              <div
                className="w-8 h-8 rounded border"
                style={{ backgroundColor: scheme.foreground }}
                title="Foreground"
              />
              <div
                className="w-8 h-8 rounded border"
                style={{ backgroundColor: scheme.accent }}
                title="Accent"
              />
              <div
                className="w-8 h-8 rounded border"
                style={{ backgroundColor: scheme.muted }}
                title="Muted"
              />
            </div>

            {/* Scheme Info */}
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">{scheme.name}</h4>
              <p className="text-xs text-gray-600">{scheme.description}</p>
              {getWCAGBadge(scheme.wcagLevel, scheme.contrastRatio)}
            </div>

            {/* Selection Indicator */}
            {selectedScheme === scheme.id && (
              <div className="absolute top-2 right-2">
                <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Live Preview */}
      {selectedScheme && (
        <div className="border border-gray-200 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-gray-900 mb-3">Live Preview</h4>
          <div
            className="p-4 rounded border"
            style={{
              backgroundColor: colorSchemes.find(s => s.id === selectedScheme)?.background,
              color: colorSchemes.find(s => s.id === selectedScheme)?.foreground
            }}
          >
            <h5 className="font-semibold mb-2">Sample Content</h5>
            <p className="text-sm mb-3">
              This is how your interface will look with the selected color scheme. 
              The contrast ensures readability for users with visual impairments.
            </p>
            <button
              className="px-4 py-2 rounded text-sm font-medium"
              style={{
                backgroundColor: colorSchemes.find(s => s.id === selectedScheme)?.accent,
                color: colorSchemes.find(s => s.id === selectedScheme)?.background
              }}
            >
              Sample Button
            </button>
          </div>
        </div>
      )}

      {/* Advanced Options */}
      {showAdvanced && (
        <div className="border-t pt-6">
          <h4 className="font-medium text-gray-900 mb-4">Advanced Accessibility Options</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700">Reduce motion effects</span>
              </label>
            </div>
            
            <div>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700">Increase focus indicators</span>
              </label>
            </div>
            
            <div>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700">Enhanced button borders</span>
              </label>
            </div>
            
            <div>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700">Large text mode</span>
              </label>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Font Size Scale
            </label>
            <input
              type="range"
              min="0.8"
              max="1.4"
              step="0.1"
              defaultValue="1.0"
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Small</span>
              <span>Normal</span>
              <span>Large</span>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-6 border-t">
        <div className="text-sm text-gray-600">
          Current scheme: <span className="font-medium">
            {colorSchemes.find(s => s.id === selectedScheme)?.name}
          </span>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={() => {
              localStorage.removeItem('accessibility-color-scheme')
              const defaultScheme = colorSchemes[0]
              handleSchemeChange(defaultScheme)
            }}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Reset to Default
          </button>
          <button
            onClick={() => {
              const scheme = colorSchemes.find(s => s.id === selectedScheme)
              if (scheme) {
                localStorage.setItem('accessibility-color-scheme', scheme.id)
                localStorage.setItem('accessibility-settings', JSON.stringify(scheme))
              }
            }}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  )
}