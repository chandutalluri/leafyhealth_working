import React, { useState, useEffect } from 'react';
import NextImage from 'next/image';

interface LogoProps {
  variant?: 'header' | 'sidebar' | 'favicon' | 'full';
  className?: string;
  width?: number;
  height?: number;
  alt?: string;
}

const LOGO_VARIANTS = {
  header: { width: 180, height: 60 },
  sidebar: { width: 120, height: 40 },
  favicon: { width: 32, height: 32 },
  full: { width: 300, height: 100 }
};

export default function Logo({ 
  variant = 'header', 
  className = '', 
  width, 
  height, 
  alt = 'LeafyHealth Logo' 
}: LogoProps) {
  const [logoUrl, setLogoUrl] = useState('/api/image-management/serve/leafyhealthlogo_copy_25991930-2a1c-4593-95db-1965eea84310.png');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCurrentLogo = async () => {
      try {
        const response = await fetch('/api/image-management?category=brand&limit=1');
        if (response.ok) {
          const data = await response.json();
          if (data.images && data.images.length > 0) {
            const logo = data.images[0];
            
            // Try to get the appropriate variant
            if (logo.variants && logo.variants.length > 0) {
              const variantMap = {
                header: 'medium',
                sidebar: 'small', 
                favicon: 'thumbnail',
                full: 'large'
              };
              
              const targetVariant = variantMap[variant];
              const variantLogo = logo.variants.find(v => v.name === targetVariant);
              
              if (variantLogo) {
                setLogoUrl(variantLogo.url);
              } else {
                setLogoUrl(logo.url);
              }
            } else {
              setLogoUrl(logo.url);
            }
          }
        }
      } catch (error) {
        console.error('Error loading logo:', error);
        // Keep default logo
      } finally {
        setLoading(false);
      }
    };

    loadCurrentLogo();
  }, [variant]);

  const dimensions = LOGO_VARIANTS[variant];
  const logoWidth = width || dimensions.width;
  const logoHeight = height || dimensions.height;

  if (loading) {
    return (
      <div 
        className={`bg-gray-200 animate-pulse rounded ${className}`}
        style={{ width: logoWidth, height: logoHeight }}
      />
    );
  }

  return (
    <div className={`relative ${className}`} style={{ width: logoWidth, height: logoHeight }}>
      <NextImage
        src={logoUrl}
        alt={alt}
        fill
        className="object-contain"
        onError={() => {
          // Fallback to default logo on error
          setLogoUrl('/api/image-management/serve/leafyhealthlogo_copy_25991930-2a1c-4593-95db-1965eea84310.png');
        }}
      />
    </div>
  );
}