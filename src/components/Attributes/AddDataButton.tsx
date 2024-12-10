import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { AddDataModal } from './AddDataModal';

export function AddDataButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="absolute -left-16 bottom-4 bg-white hover:bg-gray-50 active:bg-gray-100 p-3 rounded-full shadow-lg transition-colors"
        title="Add Data"
      >
        <Plus className="w-6 h-6" />
      </button>
      {isModalOpen && <AddDataModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
}