/**
 * Utility functions for Indian e-commerce
 */

export function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function formatWeight(weight: number, unit: string): string {
  return `${weight}${unit}`;
}

export function calculateGST(amount: number, rate: number = 18): number {
  return Math.round((amount * rate) / 100);
}

export function calculateTotal(subtotal: number, gstRate: number = 18): number {
  const gst = calculateGST(subtotal, gstRate);
  return subtotal + gst;
}

export function getDeliveryCharge(pincode: string, amount: number): number {
  // Free delivery for orders above ₹500
  if (amount >= 500) return 0;
  
  // Metro cities: ₹40, Others: ₹60
  const metroPincodes = ['110', '400', '560', '600', '700', '500'];
  const isMetro = metroPincodes.some(code => pincode.startsWith(code));
  
  return isMetro ? 40 : 60;
}

export function validatePincode(pincode: string): boolean {
  // Indian pincode format: 6 digits
  return /^[1-9][0-9]{5}$/.test(pincode);
}

export function getStateFromPincode(pincode: string): string {
  const stateMapping: Record<string, string> = {
    '1': 'Delhi',
    '2': 'Haryana',
    '3': 'Punjab',
    '4': 'Maharashtra',
    '5': 'Telangana',
    '6': 'Tamil Nadu',
    '7': 'West Bengal',
    '8': 'Odisha',
    '9': 'Gujarat'
  };
  
  return stateMapping[pincode[0]] || 'Unknown';
}

export function getLanguageByState(state: string): string {
  const stateLanguages: Record<string, string> = {
    'Tamil Nadu': 'ta',
    'West Bengal': 'bn',
    'Telangana': 'te',
    'Gujarat': 'gu',
    'Karnataka': 'kn',
    'Kerala': 'ml',
    'Maharashtra': 'mr',
    'Punjab': 'pa',
    'Odisha': 'or',
    'Assam': 'as'
  };
  
  return stateLanguages[state] || 'hi'; // Default to Hindi
}

export function getRegionalProducts(state: string): string[] {
  const regionalSpecialties: Record<string, string[]> = {
    'West Bengal': ['Hilsa Fish', 'Mishti Doi', 'Rosogolla'],
    'Tamil Nadu': ['Idli Rice', 'Filter Coffee', 'Coconut Oil'],
    'Punjab': ['Basmati Rice', 'Makhan', 'Lassi'],
    'Kerala': ['Coconut Oil', 'Cardamom', 'Black Pepper'],
    'Gujarat': ['Dhokla Mix', 'Groundnut Oil', 'Jaggery'],
    'Maharashtra': ['Jowar', 'Kokum', 'Puran Poli Mix']
  };
  
  return regionalSpecialties[state] || [];
}

export function isProductAvailableInRegion(productId: string, state: string): boolean {
  // All basic products available everywhere
  const basicProducts = ['rice', 'dal', 'oil', 'spices'];
  if (basicProducts.some(item => productId.includes(item))) {
    return true;
  }
  
  // Regional availability for special products
  return true; // Simplified for now
}
