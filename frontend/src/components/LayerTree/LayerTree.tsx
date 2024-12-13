import { useState } from 'react';
import { Plus } from 'lucide-react';
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
import { CustomSection } from './CustomSection';
import { LayerSection } from './LayerSection';
import { useLayerOrderStore, BuiltInSectionId } from '../../store/layerOrderStore';
import { useCustomSectionsStore } from '../../store/customSectionsStore';
import { SectionNameModal } from './SectionCreation';

const builtInComponents = {
  base: BaseLayers,
  postgis: PostGISLayers,
  sheets: GoogleSheetsLayers,
} as const;

export function LayerTree() {
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const headerIsMinimized = useHeaderStore((state) => state.isMinimized);
  const { order, setOrder, addSection } = useLayerOrderStore();
  const { addSection: addCustomSection } = useCustomSectionsStore();

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
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = order.indexOf(active.id as string);
      const newIndex = order.indexOf(over.id as string);
      setOrder(arrayMove(order, oldIndex, newIndex));
    }

    setActiveId(null);
  };

  const handleCreateSection = (name: string) => {
    const id = addCustomSection(name);
    addSection(id);
  };

  const isBuiltInSection = (id: string): id is BuiltInSectionId => {
    return id in builtInComponents;
  };

  const renderSection = (id: string) => {
    if (isBuiltInSection(id)) {
      const Component = builtInComponents[id];
      return <Component />;
    }
    return <CustomSection sectionId={id} />;
  };

  return (
    <SwipeHandler onSwipe={handleSwipe} className={`fixed left-0 transition-all duration-300 bg-white/90 backdrop-blur-sm shadow-lg z-40 ${
      headerIsMinimized ? 'top-0 h-screen' : 'top-16 h-[calc(100vh-4rem)]'
    } ${
      isMinimized ? '-translate-x-full' : 'translate-x-0'
    }`}>
      <div className="w-full md:w-72 h-full relative">
        <div className="p-2 space-y-2 overflow-auto h-[calc(100%-4rem)]">
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full px-3 py-2 flex items-center gap-2 bg-gray-50 hover:bg-gray-100 rounded-lg"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm text-gray-600">Add New Section</span>
          </button>

          <SectionNameModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleCreateSection}
          />

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={order}
              strategy={verticalListSortingStrategy}
            >
              {order.map((id) => (
                <LayerSection key={id} id={id}>
                  {renderSection(id)}
                </LayerSection>
              ))}
            </SortableContext>

            <DragOverlay>
              {activeId ? (
                <div className="opacity-80 bg-white rounded-lg shadow-lg">
                  {renderSection(activeId)}
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
        
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
