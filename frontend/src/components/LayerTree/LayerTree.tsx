import React, { useState } from 'react';
import { Layers } from 'lucide-react';
import { 
  DndContext, 
  DragEndEvent, 
  closestCenter,
  DragStartEvent,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor
} from '@dnd-kit/core';
import { 
  SortableContext, 
  verticalListSortingStrategy,
  arrayMove
} from '@dnd-kit/sortable';
import { MinimizeButton } from '../common/MinimizeButton';
import { SwipeHandler } from '../common/SwipeHandler';
import { useHeaderStore } from '../../store/headerStore';
import { BaseLayers } from './BaseLayers';
import { PostGISLayers } from './PostGISLayers';
import { GoogleSheetsLayers } from './GoogleSheetsLayers';
import { LayerSection } from './LayerSection';
import { useLayerOrderStore, LayerSectionId } from '../../store/layerOrderStore';

const layerComponents = {
  base: BaseLayers,
  postgis: PostGISLayers,
  sheets: GoogleSheetsLayers,
};

export function LayerTree() {
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeId, setActiveId] = useState<LayerSectionId | null>(null);
  const headerIsMinimized = useHeaderStore((state) => state.isMinimized);
  const { order, setOrder } = useLayerOrderStore();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleSwipe = (direction: 'left' | 'right' | 'up' | 'down') => {
    if (direction === 'left') {
      setIsMinimized(true);
    } else if (direction === 'right') {
      setIsMinimized(false);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as LayerSectionId);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = order.indexOf(active.id as LayerSectionId);
      const newIndex = order.indexOf(over.id as LayerSectionId);
      setOrder(arrayMove(order, oldIndex, newIndex));
    }

    setActiveId(null);
  };

  return (
    <SwipeHandler
  onSwipe={handleSwipe}
  className={`fixed left-0 transition-all duration-300 bg-white/90 backdrop-blur-sm shadow-lg z-40 ${
    headerIsMinimized ? 'top-0 h-screen' : 'top-16 h-[calc(100vh-4rem)]'
  } ${
    isMinimized ? '-translate-x-full' : 'translate-x-0'
  }`}
>
  <div className="w-full md:w-72 h-full relative">
    
    <div className="p-4 border-b">
      <div className="flex items-center gap-2">
        <Layers className="w-5 h-5 text-blue-600" />
        <h2 className="font-semibold">Layers</h2>
      </div>
    </div>

    
    <div className="p-2 space-y-2 overflow-auto h-[calc(100%-8rem)]">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={order.filter((id) => id !== 'base')} 
          strategy={verticalListSortingStrategy}
        >
          {order
            .filter((id) => id !== 'base') 
            .map((id) => {
              const Component = layerComponents[id];
              return (
                <LayerSection key={id} id={id}>
                  <Component />
                </LayerSection>
              );
            })}
        </SortableContext>

        <DragOverlay>
          {activeId ? (
            <div className="opacity-80 bg-white rounded-lg shadow-lg">
              {React.createElement(layerComponents[activeId])}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>

  

    {/* Minimize Button */}
    <MinimizeButton
      direction="left"
      isMinimized={isMinimized}
      onClick={() => setIsMinimized(!isMinimized)}
      className="absolute -right-4 top-1/2 transform translate-x-full -translate-y-1/2"
    />
  </div>
</SwipeHandler>

  );
}