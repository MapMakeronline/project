import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import { SearchBar } from './SearchBar';
import { FilterButton } from './FilterButton';
import { MinimizeButton } from '../common/MinimizeButton';
import { SwipeHandler } from '../common/SwipeHandler';
import { useHeaderStore } from '../../store/headerStore';
import { HelpGuide } from './HelpGuide';

export function Header() {
  const { isMinimized, setIsMinimized } = useHeaderStore();

  const handleSwipe = (direction: 'left' | 'right' | 'up' | 'down') => {
    if (direction === 'up') {
      setIsMinimized(false);
    } else if (direction === 'down') {
      setIsMinimized(true);
    }
  };

  return (
    <SwipeHandler onSwipe={handleSwipe}>
      <header className={`fixed top-0 left-0 right-0 bg-white shadow-sm z-50 transition-all duration-300 transform ${
        isMinimized ? '-translate-y-full' : 'translate-y-0'
      }`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-7 h-7 md:w-6 md:h-6 text-blue-600" />
                <span className="text-2xl md:text-xl font-bold">PlotFinder</span>
              </div>
              <HelpGuide />
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <SearchBar />
              <FilterButton />
            </div>
          </div>
        </div>
        
        <MinimizeButton
          direction="down"
          isMinimized={isMinimized}
          onClick={() => setIsMinimized(!isMinimized)}
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full"
        />
      </header>
    </SwipeHandler>
  );
}