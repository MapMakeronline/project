import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { PropertyForm } from './PropertyForm';

export function AddPropertyButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700"
      >
        <Plus className="w-6 h-6" />
      </button>
      {isOpen && <PropertyForm onClose={() => setIsOpen(false)} />}
    </>
  );
}