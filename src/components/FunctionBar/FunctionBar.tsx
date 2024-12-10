import React, { useState } from 'react';
import { 
  Info, 
  Ruler, 
  Pencil, 
  MapPin, 
  Download, 
  Share2,
  Trash2,
  ChevronUp,
  ChevronDown,
  Settings,
  Palette
} from 'lucide-react';
import { MinimizeButton } from '../common/MinimizeButton';
import { SwipeHandler } from '../common/SwipeHandler';
import { useNotificationStore } from '../../store/notificationStore';
import { useHeaderStore } from '../../store/headerStore';
import { useToolStore } from '../../store/toolStore';
import * as Tools from './tools';

const tools = [
  { id: 'settings', icon: Settings, label: 'Map Settings', panel: Tools.MapSettingsPanel },
  { id: 'identify', icon: Info, label: 'Identify', panel: Tools.IdentifyPanel },
  { id: 'measure', icon: Ruler, label: 'Measure', panel: Tools.MeasurePanel },
  { id: 'draw', icon: Pencil, label: 'Draw', panel: Tools.DrawPanel },
  { id: 'pin', icon: MapPin, label: 'Add Pin', panel: Tools.PinPanel },
  { id: 'style', icon: Palette, label: 'Layer Styles', panel: Tools.StylePanel },
  { id: 'export', icon: Download, label: 'Export', panel: Tools.ExportPanel },
  { id: 'share', icon: Share2, label: 'Share', panel: Tools.SharePanel },
  { id: 'delete', icon: Trash2, label: 'Delete', panel: Tools.DeletePanel },
];

const VISIBLE_TOOLS = 5;

export function FunctionBar() {
  const [isMinimized, setIsMinimized] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const setActiveLabel = useNotificationStore((state) => state.setActiveLabel);
  const headerIsMinimized = useHeaderStore((state) => state.isMinimized);
  const { activeTool, setActiveTool } = useToolStore();

  const visibleTools = tools.slice(startIndex, startIndex + VISIBLE_TOOLS);
  const hasMoreAbove = startIndex > 0;
  const hasMoreBelow = startIndex + VISIBLE_TOOLS < tools.length;

  const handleSwipe = (direction: 'left' | 'right' | 'up' | 'down') => {
    if (direction === 'left') {
      setIsMinimized(true);
    } else if (direction === 'right') {
      setIsMinimized(false);
    } else if (direction === 'up' && hasMoreBelow) {
      setStartIndex(Math.min(startIndex + 1, tools.length - VISIBLE_TOOLS));
    } else if (direction === 'down' && hasMoreAbove) {
      setStartIndex(Math.max(startIndex - 1, 0));
    }
  };

  const handleToolClick = (toolId: string) => {
    if (activeTool === toolId) {
      setActiveTool(null);
    } else {
      setActiveTool(toolId);
    }
  };

  const selectedToolComponent = activeTool && tools.find(t => t.id === activeTool)?.panel;

  return (
    <SwipeHandler onSwipe={handleSwipe} className={`fixed right-0 bg-white/90 backdrop-blur-sm shadow-lg z-40 transition-all duration-300 ${
      headerIsMinimized ? 'top-4' : 'top-20'
    } ${
      isMinimized ? 'translate-x-full' : 'translate-x-0'
    }`}>
      <div className="relative flex">
        <MinimizeButton
          direction="right"
          isMinimized={isMinimized}
          onClick={() => setIsMinimized(!isMinimized)}
          className="absolute -left-4 top-1/2 transform -translate-x-full -translate-y-1/2"
        />

        <div className="relative py-2">
          <button
            onClick={() => setStartIndex(Math.max(startIndex - 1, 0))}
            className={`w-full p-1.5 hover:bg-gray-100 text-gray-500 transition-colors ${
              !hasMoreAbove ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={!hasMoreAbove}
          >
            <ChevronUp className="w-4 h-4 mx-auto" />
          </button>

          <div className="space-y-1 py-1">
            {visibleTools.map(tool => (
              <button
                key={tool.id}
                className={`w-12 h-12 flex items-center justify-center rounded-lg group relative touch-manipulation transition-colors ${
                  activeTool === tool.id 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'hover:bg-gray-100 active:bg-gray-200'
                }`}
                onClick={() => handleToolClick(tool.id)}
                onMouseEnter={() => setActiveLabel(tool.label)}
                onMouseLeave={() => setActiveLabel(null)}
              >
                <tool.icon className="w-5 h-5" />
              </button>
            ))}
          </div>

          <button
            onClick={() => setStartIndex(Math.min(startIndex + 1, tools.length - VISIBLE_TOOLS))}
            className={`w-full p-1.5 hover:bg-gray-100 text-gray-500 transition-colors ${
              !hasMoreBelow ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={!hasMoreBelow}
          >
            <ChevronDown className="w-4 h-4 mx-auto" />
          </button>
        </div>

        {selectedToolComponent && (
          <div className="border-l">
            {React.createElement(selectedToolComponent, {
              onClose: () => setActiveTool(null)
            })}
          </div>
        )}
      </div>
    </SwipeHandler>
  );
}