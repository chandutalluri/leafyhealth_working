/**
 * Products API with authentic Indian grocery data
 */

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  description: string;
  image: string;
  inStock: boolean;
  origin: string;
  gstRate?: number;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export const INDIAN_PRODUCTS: Product[] = [
  {
    "id": "rice-basmati-1kg",
    "name": "Basmati Rice",
    "category": "Rice & Grains",
    "price": 180,
    "unit": "1kg",
    "description": "Premium long grain basmati rice",
    "image": "/products/basmati-rice.jpg",
    "inStock": true,
    "origin": "Punjab"
  },
  {
    "id": "rice-sona-masoori-5kg",
    "name": "Sona Masoori Rice",
    "category": "Rice & Grains",
    "price": 425,
    "unit": "5kg",
    "description": "Medium grain aromatic rice",
    "image": "/products/sona-masoori.jpg",
    "inStock": true,
    "origin": "Andhra Pradesh"
  },
  {
    "id": "wheat-flour-10kg",
    "name": "Wheat Flour (Atta)",
    "category": "Rice & Grains",
    "price": 380,
    "unit": "10kg",
    "description": "Fresh ground whole wheat flour",
    "image": "/products/wheat-flour.jpg",
    "inStock": true,
    "origin": "Haryana"
  },
  {
    "id": "toor-dal-1kg",
    "name": "Toor Dal",
    "category": "Pulses & Lentils",
    "price": 165,
    "unit": "1kg",
    "description": "Premium pigeon pea lentils",
    "image": "/products/toor-dal.jpg",
    "inStock": true,
    "origin": "Maharashtra"
  },
  {
    "id": "chana-dal-1kg",
    "name": "Chana Dal",
    "category": "Pulses & Lentils",
    "price": 145,
    "unit": "1kg",
    "description": "Split Bengal gram lentils",
    "image": "/products/chana-dal.jpg",
    "inStock": true,
    "origin": "Rajasthan"
  },
  {
    "id": "masoor-dal-1kg",
    "name": "Masoor Dal",
    "category": "Pulses & Lentils",
    "price": 125,
    "unit": "1kg",
    "description": "Red lentils, protein rich",
    "image": "/products/masoor-dal.jpg",
    "inStock": true,
    "origin": "Uttar Pradesh"
  },
  {
    "id": "turmeric-powder-200g",
    "name": "Turmeric Powder (Haldi)",
    "category": "Spices & Seasonings",
    "price": 85,
    "unit": "200g",
    "description": "Pure turmeric powder",
    "image": "/products/turmeric.jpg",
    "inStock": true,
    "origin": "Tamil Nadu"
  },
  {
    "id": "red-chili-powder-200g",
    "name": "Red Chili Powder",
    "category": "Spices & Seasonings",
    "price": 95,
    "unit": "200g",
    "description": "Hot red chili powder",
    "image": "/products/red-chili.jpg",
    "inStock": true,
    "origin": "Andhra Pradesh"
  },
  {
    "id": "garam-masala-100g",
    "name": "Garam Masala",
    "category": "Spices & Seasonings",
    "price": 120,
    "unit": "100g",
    "description": "Traditional spice blend",
    "image": "/products/garam-masala.jpg",
    "inStock": true,
    "origin": "Delhi"
  },
  {
    "id": "mustard-oil-1l",
    "name": "Mustard Oil",
    "category": "Cooking Oils",
    "price": 185,
    "unit": "1L",
    "description": "Cold pressed mustard oil",
    "image": "/products/mustard-oil.jpg",
    "inStock": true,
    "origin": "West Bengal"
  },
  {
    "id": "coconut-oil-500ml",
    "name": "Coconut Oil",
    "category": "Cooking Oils",
    "price": 165,
    "unit": "500ml",
    "description": "Virgin coconut oil",
    "image": "/products/coconut-oil.jpg",
    "inStock": true,
    "origin": "Kerala"
  },
  {
    "id": "groundnut-oil-1l",
    "name": "Groundnut Oil",
    "category": "Cooking Oils",
    "price": 175,
    "unit": "1L",
    "description": "Filtered groundnut oil",
    "image": "/products/groundnut-oil.jpg",
    "inStock": true,
    "origin": "Gujarat"
  },
  {
    "id": "onion-1kg",
    "name": "Onions",
    "category": "Vegetables",
    "price": 35,
    "unit": "1kg",
    "description": "Fresh red onions",
    "image": "/products/onions.jpg",
    "inStock": true,
    "origin": "Maharashtra"
  },
  {
    "id": "potato-1kg",
    "name": "Potatoes",
    "category": "Vegetables",
    "price": 28,
    "unit": "1kg",
    "description": "Fresh potatoes",
    "image": "/products/potatoes.jpg",
    "inStock": true,
    "origin": "Uttar Pradesh"
  },
  {
    "id": "tomato-1kg",
    "name": "Tomatoes",
    "category": "Vegetables",
    "price": 45,
    "unit": "1kg",
    "description": "Fresh ripe tomatoes",
    "image": "/products/tomatoes.jpg",
    "inStock": true,
    "origin": "Karnataka"
  },
  {
    "id": "milk-1l",
    "name": "Fresh Milk",
    "category": "Dairy Products",
    "price": 56,
    "unit": "1L",
    "description": "Full cream fresh milk",
    "image": "/products/milk.jpg",
    "inStock": true,
    "origin": "Local Dairy"
  },
  {
    "id": "paneer-250g",
    "name": "Fresh Paneer",
    "category": "Dairy Products",
    "price": 165,
    "unit": "250g",
    "description": "Fresh cottage cheese",
    "image": "/products/paneer.jpg",
    "inStock": true,
    "origin": "Local Dairy"
  },
  {
    "id": "yogurt-500g",
    "name": "Curd (Dahi)",
    "category": "Dairy Products",
    "price": 55,
    "unit": "500g",
    "description": "Fresh homemade curd",
    "image": "/products/yogurt.jpg",
    "inStock": true,
    "origin": "Local Dairy"
  },
  {
    "id": "tea-250g",
    "name": "Tea Leaves",
    "category": "Beverages",
    "price": 275,
    "unit": "250g",
    "description": "Premium Assam tea leaves",
    "image": "/products/tea.jpg",
    "inStock": true,
    "origin": "Assam"
  },
  {
    "id": "coffee-200g",
    "name": "Coffee Powder",
    "category": "Beverages",
    "price": 485,
    "unit": "200g",
    "description": "Filter coffee powder",
    "image": "/products/coffee.jpg",
    "inStock": true,
    "origin": "Karnataka"
  },
  {
    "id": "biscuits-200g",
    "name": "Digestive Biscuits",
    "category": "Snacks",
    "price": 45,
    "unit": "200g",
    "description": "Wheat digestive biscuits",
    "image": "/products/biscuits.jpg",
    "inStock": true,
    "origin": "Gujarat"
  }
];

export const PRODUCT_CATEGORIES: Category[] = [
  {
    "id": "rice-grains",
    "name": "Rice & Grains",
    "description": "Staple grains and cereals",
    "icon": "🌾"
  },
  {
    "id": "pulses-lentils",
    "name": "Pulses & Lentils",
    "description": "Protein-rich lentils and beans",
    "icon": "🫘"
  },
  {
    "id": "spices-seasonings",
    "name": "Spices & Seasonings",
    "description": "Traditional Indian spices",
    "icon": "🌶️"
  },
  {
    "id": "cooking-oils",
    "name": "Cooking Oils",
    "description": "Pure cooking and frying oils",
    "icon": "🫗"
  },
  {
    "id": "vegetables",
    "name": "Vegetables",
    "description": "Fresh seasonal vegetables",
    "icon": "🥕"
  },
  {
    "id": "dairy-products",
    "name": "Dairy Products",
    "description": "Fresh milk and dairy items",
    "icon": "🥛"
  },
  {
    "id": "beverages",
    "name": "Beverages",
    "description": "Tea, coffee and drinks",
    "icon": "☕"
  },
  {
    "id": "snacks",
    "name": "Snacks",
    "description": "Traditional and modern snacks",
    "icon": "🍪"
  }
];

export const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal"
];

// Product API functions
export function getProducts(filters?: {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}): Product[] {
  let products = [...INDIAN_PRODUCTS];
  
  if (filters?.category) {
    products = products.filter(p => p.category === filters.category);
  }
  
  if (filters?.search) {
    const search = filters.search.toLowerCase();
    products = products.filter(p => 
      p.name.toLowerCase().includes(search) ||
      p.description.toLowerCase().includes(search) ||
      p.category.toLowerCase().includes(search)
    );
  }
  
  if (filters?.minPrice !== undefined) {
    products = products.filter(p => p.price >= filters.minPrice!);
  }
  
  if (filters?.maxPrice !== undefined) {
    products = products.filter(p => p.price <= filters.maxPrice!);
  }
  
  if (filters?.inStock !== undefined) {
    products = products.filter(p => p.inStock === filters.inStock);
  }
  
  return products;
}

export function getProductById(id: string): Product | undefined {
  return INDIAN_PRODUCTS.find(p => p.id === id);
}

export function getProductsByCategory(categoryId: string): Product[] {
  const category = PRODUCT_CATEGORIES.find(c => c.id === categoryId);
  if (!category) return [];
  
  return INDIAN_PRODUCTS.filter(p => p.category === category.name);
}

export function getCategories(): Category[] {
  return [...PRODUCT_CATEGORIES];
}

export function getFeaturedProducts(): Product[] {
  // Return high-demand Indian grocery items
  return INDIAN_PRODUCTS.filter(p => 
    ['rice-basmati-1kg', 'toor-dal-1kg', 'turmeric-powder-200g', 'mustard-oil-1l'].includes(p.id)
  );
}

export function getRelatedProducts(productId: string): Product[] {
  const product = getProductById(productId);
  if (!product) return [];
  
  return INDIAN_PRODUCTS
    .filter(p => p.category === product.category && p.id !== productId)
    .slice(0, 4);
}

export function searchProducts(query: string): Product[] {
  return getProducts({ search: query });
}
