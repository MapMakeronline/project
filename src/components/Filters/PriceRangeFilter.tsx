import React from 'react';

interface PriceRangeFilterProps {
  value?: { min: number; max: number };
  onChange: (range: { min: number; max: number } | undefined) => void;
}

export function PriceRangeFilter({ value, onChange }: PriceRangeFilterProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">Price Range</label>
      <div className="flex gap-4">
        <div className="flex-1">
          <input
            type="number"
            placeholder="Min"
            value={value?.min || ''}
            onChange={(e) => {
              const min = parseInt(e.target.value);
              onChange(min ? { min, max: value?.max || Infinity } : undefined);
            }}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex-1">
          <input
            type="number"
            placeholder="Max"
            value={value?.max || ''}
            onChange={(e) => {
              const max = parseInt(e.target.value);
              onChange(max ? { min: value?.min || 0, max } : undefined);
            }}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
}