import React from 'react';
import { X } from 'lucide-react';
import { usePropertyStore } from '../../store/propertyStore';
import { PriceRangeFilter } from './PriceRangeFilter';
import { AreaFilter } from './AreaFilter';
import { StatusFilter } from './StatusFilter';

interface FilterModalProps {
  onClose: () => void;
}

export function FilterModal({ onClose }: FilterModalProps) {
  const { filters, setFilters } = usePropertyStore((state) => ({
    filters: state.filters,
    setFilters: state.setFilters,
  }));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Filter Properties</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-6">
          <PriceRangeFilter 
            value={filters.priceRange}
            onChange={(range) => setFilters({ ...filters, priceRange: range })}
          />
          <AreaFilter 
            value={filters.areaRange}
            onChange={(range) => setFilters({ ...filters, areaRange: range })}
          />
          <StatusFilter 
            value={filters.status}
            onChange={(status) => setFilters({ ...filters, status })}
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => setFilters({})}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
          >
            Reset
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}