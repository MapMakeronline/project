import React from 'react';
import { X } from 'lucide-react';

interface BaseToolPanelProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export function BaseToolPanel({ title, onClose, children }: BaseToolPanelProps) {
  return (
    <div className="w-80 border-l bg-white/90 backdrop-blur-sm">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="font-medium">{title}</h3>
        <button 
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-6 max-h-[calc(100vh-4rem)] overflow-y-auto">
        {children}
      </div>
    </div>
  );
}