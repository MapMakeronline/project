import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { SearchModal } from './SearchModal';

export function SearchButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-white p-3 rounded-full shadow-lg hover:bg-gray-50"
        title="Search Properties"
      >
        <Search className="w-6 h-6 text-gray-700" />
      </button>
      {isOpen && <SearchModal onClose={() => setIsOpen(false)} />}
    </>
  );
}