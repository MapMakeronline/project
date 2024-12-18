import React from 'react';
import { HelpCircle } from 'lucide-react';
import { useHeaderStore } from '../../store/headerStore';

export function HelpButton() {
  const { setIsHelpOpen } = useHeaderStore();

  return (
    <button
      onClick={() => setIsHelpOpen(true)}
      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
      title="Help Guide"
    >
      <HelpCircle className="w-5 h-5 text-gray-600" />
    </button>
  );
}
