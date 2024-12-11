import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

interface LayerSectionProps {
  id: string;
  children: React.ReactNode;
}

export function LayerSection({ id, children }: LayerSectionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`relative ${isDragging ? 'z-50' : 'z-0'}`}
    >
      <div className="group relative">
        <div
          {...attributes}
          {...listeners}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[calc(100%+0.5rem)] p-1.5 cursor-grab active:cursor-grabbing hover:bg-gray-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <GripVertical className="w-4 h-4 text-gray-400" />
        </div>
        <div className={isDragging ? 'opacity-50' : ''}>{children}</div>
      </div>
    </div>
  );
}