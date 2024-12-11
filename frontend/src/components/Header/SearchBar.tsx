import React from 'react';
import { Search } from 'lucide-react';
import { usePropertyStore } from '../../store/propertyStore';

export function SearchBar() {
  const searchProperties = usePropertyStore((state) => state.searchProperties);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    searchProperties(e.target.value);
  };

  return (
    <div className="relative flex-1 md:flex-none">
      <input
        type="text"
        placeholder="Search properties..."
        className="w-full md:w-64 pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        onChange={handleSearch}
      />
      <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
    </div>
  );
}