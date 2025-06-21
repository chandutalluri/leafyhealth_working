
// Global unhandled promise rejection handler
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    console.warn('Unhandled promise rejection:', event.reason);
    event.preventDefault();
  });
}
const API_BASE_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:8080'

export async function fetchProducts() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/products`)
    const data = await response.json()
    return data.products || data || []
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

export async function fetchCategories() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/categories`)
    const data = await response.json()
    return data.categories || data || []
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}