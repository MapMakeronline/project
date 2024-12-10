import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ToolLabelProps {
  tool?: {
    id: string;
    label: string;
    description: string;
    icon: LucideIcon;
  };
  isSelected: boolean;
}

export function ToolLabel({ tool, isSelected }: ToolLabelProps) {
  if (!tool) return null;

  return (
    <div className={`fixed bottom-4 right-4 transition-all duration-300 z-50 ${
      isSelected ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
    }`}>
      <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-3">
        <div className="flex items-start gap-3">
          <tool.icon className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-gray-900">{tool.label}</h3>
            <p className="text-sm text-gray-600">{tool.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}