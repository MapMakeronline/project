import React from 'react';

interface StatusFilterProps {
  value?: 'available' | 'reserved' | 'sold';
  onChange: (status: 'available' | 'reserved' | 'sold' | undefined) => void;
}

export function StatusFilter({ value, onChange }: StatusFilterProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">Status</label>
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value as any || undefined)}
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All</option>
        <option value="available">Available</option>
        <option value="reserved">Reserved</option>
        <option value="sold">Sold</option>
      </select>
    </div>
  );
}