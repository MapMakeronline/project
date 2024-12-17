import {useEffect, useState} from 'react';
import {Plus} from 'lucide-react';
import {
    closestCenter,
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors
} from '@dnd-kit/core';
import {arrayMove, SortableContext, verticalListSortingStrategy} from '@dnd-kit/sortable';
import {MinimizeButton} from '../common/MinimizeButton';
import {SwipeHandler} from '../common/SwipeHandler';
import {useHeaderStore} from '../../store/headerStore';
import {CustomSection} from './CustomSection';
import {LayerSection} from './LayerSection';
import {useLayerOrderStore} from '../../store/layerOrderStore';
import {useCustomSectionsStore} from '../../store/customSectionsStore';
import {SectionNameModal} from './SectionCreation';

// Common headers with CSRF token
function getCsrfToken(): string | null {
    const name = 'csrftoken';
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }

    if (!cookieValue) {
        const metaTag = document.querySelector('meta[name="csrf-token"]');
        if (metaTag) {
            cookieValue = metaTag.getAttribute('content');
        }
    }

    return cookieValue;
}

async function ensureCsrfCookie(): Promise<void> {
    try {
        await fetch('http://127.0.0.1:8000/api/csrf/', {
            method: 'GET',
            credentials: 'include',
        });
    } catch (error) {
        console.error('Error setting CSRF cookie:', error);
    }
}

const getHeaders = () => {
    const csrfToken = getCsrfToken();
    if (!csrfToken) {
        console.warn('CSRF token not found');
    }
    return {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken || '',
    };
};

export const sectionsApi = {
    getSections: async (): Promise<CustomSection[]> => {
        await ensureCsrfCookie();
        console.log(getHeaders())
        const response = await fetch('http://127.0.0.1:8000/api/sections/', {
            method: 'GET',
            headers: getHeaders(),
            credentials: 'include'
        });
        if (!response.ok) {
            throw new Error('Failed to fetch sections');
        }
        return response.json();
    },

    createSection: async (name: string): Promise<CustomSection> => {
        await ensureCsrfCookie();
        console.log(getHeaders())
        const response = await fetch('http://127.0.0.1:8000/api/sections/', {
            method: 'POST',
            headers: getHeaders(),
            credentials: 'include',
            body: JSON.stringify({ name })
        });
        if (!response.ok) {
            throw new Error('Failed to create section');
        }
        return response.json();
    },

    updateSection: async (sectionId: string, data: any): Promise<CustomSection> => {
        const response = await fetch(`http://127.0.0.1:8000/api/sections/${sectionId}/`, {
            method: 'PUT',
            headers: getHeaders(),
            credentials: 'include',
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error('Failed to update section');
        }
        return response.json();
    },

    deleteSection: async (sectionId: string): Promise<void> => {
        const response = await fetch(`http://127.0.0.1:8000/api/sections/${sectionId}/`, {
            method: 'DELETE',
            headers: getHeaders(),
            credentials: 'include'
        });
        if (!response.ok) {
            throw new Error('Failed to delete section');
        }
    }
};

export function LayerTree() {
    const [isMinimized, setIsMinimized] = useState(false);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const headerIsMinimized = useHeaderStore((state) => state.isMinimized);
    const {order, setOrder, addSection, removeSection} = useLayerOrderStore();
    const {addCustomSection, removeCustomSection} = useCustomSectionsStore();

    useEffect(() => {
        const loadSections = async () => {
            try {
                const sections = await sectionsApi.getSections();
                const sectionIds = sections.map((section: CustomSection) => section.id);
                setOrder(sectionIds);
                sections.forEach((section: CustomSection) => {
                    addCustomSection(section);
                });
                setIsLoading(false);
            } catch (error) {
                console.error('Error loading sections:', error);
                setIsLoading(false);
            }
        };

        loadSections();
    }, [setOrder, addCustomSection]);

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

    const handleDragEnd = async (event: DragEndEvent) => {
        const {active, over} = event;

        if (over && active.id !== over.id) {
            const oldIndex = order.indexOf(active.id as string);
            const newIndex = order.indexOf(over.id as string);
            const newOrder = arrayMove(order, oldIndex, newIndex);

            try {
                // Instead of using a separate reorder endpoint, we'll update each section's order
                await Promise.all(
                    newOrder.map((id, index) =>
                        sectionsApi.updateSection(id, { order: index })
                    )
                );
                setOrder(newOrder);
            } catch (error) {
                console.error('Error updating order:', error);
                setOrder(order);
            }
        }

        setActiveId(null);
    };

    const handleCreateSection = async (name: string) => {
        try {
            const section = await sectionsApi.createSection(name);
            addCustomSection(section);
            addSection(section.id);
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error creating section:', error);
        }
    };

    const handleDeleteSection = async (sectionId: string) => {
        try {
            await sectionsApi.deleteSection(sectionId);
            removeSection(sectionId);
            removeCustomSection(sectionId);
        } catch (error) {
            console.error('Error deleting section:', error);
        }
    };

    const renderSection = (id: string) => {
        return (
            <CustomSection
                sectionId={id}
                onDelete={() => handleDeleteSection(id)}
            />
        );
    };

    if (isLoading) {
        return <div className="p-4">Loading sections...</div>;
    }

    return (
        <SwipeHandler
            onSwipe={handleSwipe}
            className={`fixed left-0 transition-all duration-300 bg-white/90 backdrop-blur-sm shadow-lg z-30 ${
                headerIsMinimized ? 'top-0 h-screen' : 'top-16 h-[calc(100vh-4rem)]'
            } ${
                isMinimized ? '-translate-x-full' : 'translate-x-0'
            }`}
        >
            <div className="w-full md:w-72 h-full relative">
                <div className="p-2 space-y-2 overflow-auto h-[calc(100%-4rem)]">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="w-full px-3 py-2 flex items-center gap-2 bg-gray-50 hover:bg-gray-100 rounded-lg"
                    >
                        <Plus className="w-4 h-4"/>
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
                            <div className="space-y-2">
                                {order.map((id) => (
                                    <LayerSection key={id} id={id}>
                                        {renderSection(id)}
                                    </LayerSection>
                                ))}
                            </div>
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