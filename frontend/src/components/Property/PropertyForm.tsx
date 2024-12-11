import React, { useState } from 'react';
import { usePropertyStore } from '../../store/propertyStore';

interface PropertyFormProps {
  onClose: () => void;
}

export function PropertyForm({ onClose }: PropertyFormProps) {
  const addProperty = usePropertyStore((state) => state.addProperty);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    area: '',
    plotNumber: '',
    district: '',
    location: {
      lat: '',
      lng: '',
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProperty = {
      id: crypto.randomUUID(),
      ...formData,
      price: parseFloat(formData.price),
      area: parseFloat(formData.area),
      location: {
        lat: parseFloat(formData.location.lat),
        lng: parseFloat(formData.location.lng),
      },
      status: 'available' as const,
      features: [],
      images: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addProperty(newProperty);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6">Add New Property</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Plot Number
              </label>
              <input
                type="text"
                required
                value={formData.plotNumber}
                onChange={(e) => setFormData({ ...formData, plotNumber: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price
              </label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Area (m²)
              </label>
              <input
                type="number"
                required
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Latitude
              </label>
              <input
                type="number"
                required
                step="any"
                value={formData.location.lat}
                onChange={(e) => setFormData({
                  ...formData,
                  location: { ...formData.location, lat: e.target.value }
                })}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Longitude
              </label>
              <input
                type="number"
                required
                step="any"
                value={formData.location.lng}
                onChange={(e) => setFormData({
                  ...formData,
                  location: { ...formData.location, lng: e.target.value }
                })}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              District
            </label>
            <input
              type="text"
              required
              value={formData.district}
              onChange={(e) => setFormData({ ...formData, district: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border rounded-md h-32"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add Property
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}