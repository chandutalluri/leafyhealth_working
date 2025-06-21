import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/outline';
import { CheckIcon } from '@heroicons/react/24/solid';

import GlassCard from '@/components/ui/GlassCard';
import { useBranchStore, Branch } from '@/lib/stores/useBranchStore';

interface BranchSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BranchSelectorModal({ isOpen, onClose }: BranchSelectorModalProps) {
  const [selectedBranchId, setSelectedBranchId] = useState<string>('');
  
  const { 
    branches, 
    selectedBranch, 
    setSelectedBranch, 
    fetchBranches, 
    detectLocation,
    isLoadingLocation 
  } = useBranchStore();

  useEffect(() => {
    if (isOpen && branches.length === 0) {
      fetchBranches();
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedBranch) {
      setSelectedBranchId(selectedBranch.id);
    }
  }, [selectedBranch]);

  const handleBranchSelect = (branch: Branch) => {
    setSelectedBranchId(branch.id);
  };

  const handleConfirm = () => {
    const branch = branches.find(b => b.id === selectedBranchId);
    if (branch) {
      setSelectedBranch(branch);
      onClose();
    }
  };

  const handleDetectLocation = async () => {
    try {
      await detectLocation();
    } catch (error) {
      console.error('Location detection failed:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="absolute inset-x-4 top-1/2 transform -translate-y-1/2 max-w-md mx-auto"
        >
          <GlassCard variant="strong" className="max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Select Your Location</h2>
                <p className="text-sm text-gray-600 mt-1">Choose a branch for delivery</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              
              {/* Detect Location Button */}
              <button
                onClick={handleDetectLocation}
                disabled={isLoadingLocation}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <MapPinIcon className="h-5 w-5" />
                <span>
                  {isLoadingLocation ? 'Detecting Location...' : 'Use My Current Location'}
                </span>
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or choose manually</span>
                </div>
              </div>

              {/* Branch List */}
              <div className="space-y-3">
                {branches.map((branch) => (
                  <motion.div
                    key={branch.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleBranchSelect(branch)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedBranchId === branch.id
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 bg-white hover:border-green-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-gray-900">{branch.name}</h4>
                          {selectedBranchId === branch.id && (
                            <CheckIcon className="h-5 w-5 text-green-500" />
                          )}
                        </div>
                        
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <MapPinIcon className="h-4 w-4 flex-shrink-0" />
                            <span>{branch.address}, {branch.city}</span>
                          </div>
                          
                          {branch.workingHours && (
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <ClockIcon className="h-4 w-4 flex-shrink-0" />
                              <span>
                                {branch.workingHours.isOpen24Hours
                                  ? '24/7 Open'
                                  : `${branch.workingHours.open} - ${branch.workingHours.close}`
                                }
                              </span>
                            </div>
                          )}
                        </div>

                        {branch.features && branch.features.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {branch.features.slice(0, 3).map((feature, index) => (
                              <span
                                key={index}
                                className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {branches.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No branches available in your area</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200">
              <button
                onClick={handleConfirm}
                disabled={!selectedBranchId}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Selection
              </button>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}