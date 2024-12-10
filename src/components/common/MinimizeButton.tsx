import React from 'react';
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react';

interface MinimizeButtonProps {
  direction: 'left' | 'right' | 'up' | 'down';
  isMinimized: boolean;
  onClick: () => void;
  className?: string;
}

export function MinimizeButton({ direction, isMinimized, onClick, className = '' }: MinimizeButtonProps) {
  const Icon = {
    left: isMinimized ? ChevronRight : ChevronLeft,
    right: isMinimized ? ChevronLeft : ChevronRight,
    up: isMinimized ? ChevronDown : ChevronUp,
    down: isMinimized ? ChevronUp : ChevronDown,
  }[direction];

  return (
    <button
      onClick={onClick}
      className={`p-2 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-colors ${className}`}
      title={isMinimized ? 'Expand' : 'Minimize'}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}