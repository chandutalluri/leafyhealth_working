/**
 * Centralized Logo Configuration System
 * Manages logo uploads and distribution across all applications
 */

const LOGO_CONFIG = {
  DEFAULT_LOGO: '/api/image-management/serve/leafyhealthlogo_copy_25991930-2a1c-4593-95db-1965eea84310.png',
  LOGO_VARIANTS: {
    header: 'medium', // 600x600 for headers
    sidebar: 'small', // 300x300 for sidebars
    favicon: 'thumbnail', // 150x150 for favicons
    full: 'large' // 1200x1200 for full display
  },
  LOGO_CATEGORIES: ['brand', 'header', 'icon'],
  SUPPORTED_FORMATS: ['.png', '.jpg', '.jpeg', '.svg', '.webp']
};

// Get current logo from image management system
export async function getCurrentLogo() {
  try {
    const response = await fetch('/api/image-management?category=brand&limit=1');
    if (response.ok) {
      const data = await response.json();
      if (data.images && data.images.length > 0) {
        return data.images[0];
      }
    }
  } catch (error) {
    console.error('Error fetching current logo:', error);
  }
  
  return {
    url: LOGO_CONFIG.DEFAULT_LOGO,
    filename: 'default-logo.png',
    variants: []
  };
}

// Get logo URL for specific variant
export function getLogoVariant(logo, variant = 'header') {
  if (!logo) return LOGO_CONFIG.DEFAULT_LOGO;
  
  if (logo.variants && logo.variants.length > 0) {
    const variantLogo = logo.variants.find(v => v.name === LOGO_CONFIG.LOGO_VARIANTS[variant]);
    if (variantLogo) return variantLogo.url;
  }
  
  return logo.url || LOGO_CONFIG.DEFAULT_LOGO;
}

// Upload new logo and mark as brand logo
export async function uploadBrandLogo(file) {
  if (!file) throw new Error('No file provided');
  
  // Validate file type
  const ext = '.' + file.name.split('.').pop().toLowerCase();
  if (!LOGO_CONFIG.SUPPORTED_FORMATS.includes(ext)) {
    throw new Error(`Unsupported format. Use: ${LOGO_CONFIG.SUPPORTED_FORMATS.join(', ')}`);
  }
  
  // Upload file
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch('/api/image-management/upload', {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || errorData.error || 'Upload failed');
  }
  
  const result = await response.json();
  
  // Update image to mark as brand logo
  const updateResponse = await fetch(`/api/image-management/${result.image.id}`, {
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
  
  if (!updateResponse.ok) {
    console.warn('Failed to update logo category, but upload succeeded');
  }
  
  return result.image;
}

// React hook for logo management
export function useLogo() {
  const [logo, setLogo] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  
  const loadLogo = async () => {
    try {
      const currentLogo = await getCurrentLogo();
      setLogo(currentLogo);
    } catch (error) {
      console.error('Error loading logo:', error);
      setLogo({ url: LOGO_CONFIG.DEFAULT_LOGO });
    } finally {
      setLoading(false);
    }
  };
  
  React.useEffect(() => {
    loadLogo();
  }, []);
  
  const updateLogo = async (file) => {
    setLoading(true);
    try {
      const newLogo = await uploadBrandLogo(file);
      setLogo(newLogo);
      return newLogo;
    } catch (error) {
      console.error('Error updating logo:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  return {
    logo,
    loading,
    updateLogo,
    getVariant: (variant) => getLogoVariant(logo, variant)
  };
}

export default LOGO_CONFIG;