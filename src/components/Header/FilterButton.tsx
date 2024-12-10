import React, { useState } from 'react';
import { Filter } from 'lucide-react';
import { FilterModal } from '../Filters/FilterModal';

export function FilterButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
        onClick={() => setIsOpen(true)}
      >
        <Filter className="w-5 h-5" />
        Filters
      </button>
      {isOpen && <FilterModal onClose={() => setIsOpen(false)} />}
    </>
  );
}