import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Branch {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
  latitude?: number;
  longitude?: number;
  isActive: boolean;
  deliveryRadius: number;
  workingHours?: {
    open: string;
    close: string;
    isOpen24Hours: boolean;
  };
  features?: string[];
  deliveryFee?: number;
}

interface BranchStore {
  selectedBranch: Branch | null;
  branches: Branch[];
  userLocation: { latitude: number; longitude: number } | null;
  isLoadingLocation: boolean;
  error: string | null;
  
  // Actions
  setSelectedBranch: (branch: Branch) => void;
  setBranches: (branches: Branch[]) => void;
  setUserLocation: (location: { latitude: number; longitude: number } | null) => void;
  setLoadingLocation: (loading: boolean) => void;
  detectLocation: () => Promise<void>;
  fetchBranches: () => Promise<void>;
  fetchNearbyBranches: (lat: number, lng: number) => Promise<Branch[]>;
  getNearestBranch: () => Branch | null;
  calculateDistance: (branch: Branch) => number | null;
}

export const useBranchStore = create<BranchStore>()(
  persist(
    (set, get) => ({
      selectedBranch: null,
      branches: [],
      userLocation: null,
      isLoadingLocation: false,
      error: null,
      
      setSelectedBranch: (branch) => {
        set({ selectedBranch: branch });
        localStorage.setItem('selectedBranchId', branch.id);
      },
      
      setBranches: (branches) => set({ branches }),
      
      setUserLocation: (location) => set({ userLocation: location }),
      
      setLoadingLocation: (loading) => set({ isLoadingLocation: loading }),

      detectLocation: async () => {
        set({ isLoadingLocation: true, error: null });
        
        try {
          if (!navigator.geolocation) {
            throw new Error('Geolocation is not supported');
          }

          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 300000, // 5 minutes
            });
          });

          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };

          set({ userLocation: location });

          // Fetch nearby branches
          const nearbyBranches = await get().fetchNearbyBranches(location.latitude, location.longitude);
          
          if (nearbyBranches.length > 0 && !get().selectedBranch) {
            get().setSelectedBranch(nearbyBranches[0]);
          }
        } catch (error) {
          console.error('Location detection failed:', error);
          set({ error: 'Unable to detect location' });
          
          // Fallback: fetch all branches
          await get().fetchBranches();
        } finally {
          set({ isLoadingLocation: false });
        }
      },

      fetchBranches: async () => {
        try {
          const response = await fetch('/api/branches');
          if (!response.ok) throw new Error('Failed to fetch branches');
          
          const data = await response.json();
          const branches = Array.isArray(data) ? data : data.data || [];
          
          set({ branches });
          
          // Auto-select first branch if none selected
          if (branches.length > 0 && !get().selectedBranch) {
            get().setSelectedBranch(branches[0]);
          }
        } catch (error) {
          console.error('Error fetching branches:', error);
          // Fallback to mock data for demo
          const mockBranches = [
            {
              id: '1',
              name: 'Hyderabad Central',
              address: 'Road No. 36, Jubilee Hills',
              city: 'Hyderabad',
              state: 'Telangana',
              postalCode: '500033',
              phone: '+91 9876543210',
              isActive: true,
              deliveryRadius: 15,
              workingHours: {
                open: '06:00',
                close: '22:00',
                isOpen24Hours: false
              },
              features: ['Home Delivery', 'Fresh Produce', 'Organic']
            }
          ];
          set({ branches: mockBranches });
          if (!get().selectedBranch) {
            get().setSelectedBranch(mockBranches[0]);
          }
        }
      },

      fetchNearbyBranches: async (lat: number, lng: number) => {
        try {
          const response = await fetch(`/api/branches/nearby?lat=${lat}&lng=${lng}&radius=50`);
          if (!response.ok) throw new Error('Failed to fetch nearby branches');
          
          const data = await response.json();
          const branches = Array.isArray(data) ? data : data.data || [];
          
          set({ branches });
          return branches;
        } catch (error) {
          console.error('Error fetching nearby branches:', error);
          // Fallback to existing branches
          await get().fetchBranches();
          return get().branches;
        }
      },
      
      getNearestBranch: () => {
        const { branches, userLocation } = get();
        if (!userLocation || branches.length === 0) return null;
        
        let nearest = branches[0];
        let minDistance = Infinity;
        
        branches.forEach(branch => {
          const distance = get().calculateDistance(branch);
          if (distance && distance < minDistance) {
            minDistance = distance;
            nearest = branch;
          }
        });
        
        return nearest;
      },
      
      calculateDistance: (branch) => {
        const { userLocation } = get();
        if (!userLocation || !branch.latitude || !branch.longitude) return null;
        
        const R = 6371; // Earth's radius in kilometers
        const dLat = (branch.latitude - userLocation.latitude) * Math.PI / 180;
        const dLon = (branch.longitude - userLocation.longitude) * Math.PI / 180;
        const a = 
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(userLocation.latitude * Math.PI / 180) * Math.cos(branch.latitude * Math.PI / 180) * 
          Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
      }
    }),
    {
      name: 'leafy-branch-storage',
      partialize: (state) => ({
        selectedBranch: state.selectedBranch,
        userLocation: state.userLocation,
      }),
    }
  )
);