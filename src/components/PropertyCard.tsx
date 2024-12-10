import React from 'react';
import { MapPin, Home, Square } from 'lucide-react';
import { Property } from '../types/property';

interface PropertyCardProps {
  property: Property;
  onClick?: () => void;
}

export function PropertyCard({ property, onClick }: PropertyCardProps) {
  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <div className="relative h-48">
        <img
          src={property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-sm font-semibold">
          {property.status}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{property.title}</h3>
        <div className="flex items-center gap-4 text-gray-600 mb-2">
          <div className="flex items-center gap-1">
            <Square className="w-4 h-4" />
            <span>{property.area} m²</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{property.district}</span>
          </div>
        </div>
        <p className="text-2xl font-bold text-blue-600">
          ${property.price.toLocaleString()}
        </p>
      </div>
    </div>
  );
}