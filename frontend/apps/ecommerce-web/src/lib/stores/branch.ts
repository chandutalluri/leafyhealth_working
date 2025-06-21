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
}

interface BranchStore {
  selectedBranch: Branch | null;
  branches: Branch[];
  userLocation: { latitude: number; longitude: number } | null;
  isLoadingLocation: boolean;
  setSelectedBranch: (branch: Branch) => void;
  setBranches: (branches: Branch[]) => void;
  setUserLocation: (location: { latitude: number; longitude: number } | null) => void;
  setLoadingLocation: (loading: boolean) => void;
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
      
      setSelectedBranch: (branch) => set({ selectedBranch: branch }),
      
      setBranches: (branches) => set({ branches }),
      
      setUserLocation: (location) => set({ userLocation: location }),
      
      setLoadingLocation: (loading) => set({ isLoadingLocation: loading }),
      
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
      name: 'branch-storage',
    }
  )
);