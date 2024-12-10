import { create } from 'zustand';
import { Property } from '../types/property';

interface Filters {
  priceRange?: { min: number; max: number };
  areaRange?: { min: number; max: number };
  status?: 'available' | 'reserved' | 'sold';
  search?: string;
}

interface PropertyStore {
  properties: Property[];
  selectedProperty: Property | null;
  filters: Filters;
  setSelectedProperty: (property: Property | null) => void;
  addProperty: (property: Property) => void;
  updateProperty: (id: string, property: Partial<Property>) => void;
  setFilters: (filters: Filters) => void;
  searchProperties: (query: string) => void;
  filteredProperties: Property[];
}

export const usePropertyStore = create<PropertyStore>((set, get) => ({
  properties: [],
  selectedProperty: null,
  filters: {},
  filteredProperties: [],
  
  setSelectedProperty: (property) => set({ selectedProperty: property }),
  
  addProperty: (property) => 
    set((state) => ({ properties: [...state.properties, property] })),
  
  updateProperty: (id, updatedProperty) =>
    set((state) => ({
      properties: state.properties.map((property) =>
        property.id === id ? { ...property, ...updatedProperty } : property
      ),
    })),
  
  setFilters: (filters) => {
    set({ filters });
    const state = get();
    state.applyFilters();
  },
  
  searchProperties: (query) => {
    set((state) => ({
      filters: { ...state.filters, search: query },
    }));
    const state = get();
    state.applyFilters();
  },
  
  applyFilters: () => {
    const { properties, filters } = get();
    let filtered = [...properties];

    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(
        (property) =>
          property.title.toLowerCase().includes(search) ||
          property.description.toLowerCase().includes(search) ||
          property.district.toLowerCase().includes(search)
      );
    }

    if (filters.priceRange) {
      filtered = filtered.filter(
        (property) =>
          property.price >= filters.priceRange!.min &&
          property.price <= filters.priceRange!.max
      );
    }

    if (filters.areaRange) {
      filtered = filtered.filter(
        (property) =>
          property.area >= filters.areaRange!.min &&
          property.area <= filters.areaRange!.max
      );
    }

    if (filters.status) {
      filtered = filtered.filter(
        (property) => property.status === filters.status
      );
    }

    set({ filteredProperties: filtered });
  },
}));