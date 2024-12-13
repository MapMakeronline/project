import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Plus, Folder } from 'lucide-react';
import { useLayerFolderStore } from '../../store/layerFolderStore';
import { useNotificationStore } from '../../store/notificationStore';

export function LayerFolders() {
  const [isExpanded, setIsExpanded] = React.useState(true);
  const { folders, addFolder } = useLayerFolderStore();
  const setActiveLabel = useNotificationStore((state) => state.setActiveLabel);

  const handleAddFolder = () => {
    const folderName = `New Folder ${folders.length + 1}`;
    addFolder(folderName);
  };

  return (
    <div className="rounded-lg overflow-hidden">
      <div className="px-3 py-2 flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-lg">
        <button
          className="flex items-center gap-2 flex-1"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
          <span className="font-medium text-sm text-gray-600">Folders</span>
        </button>
        <button
          className="p-1 hover:bg-gray-200 rounded"
          title="Add Folder"
          onClick={handleAddFolder}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      
      {isExpanded && (
        <div className="pl-3 space-y-0.5 mt-1">
          {folders.length === 0 ? (
            <p className="px-2 py-1.5 text-sm text-gray-500 italic">
              No folders created yet
            </p>
          ) : (
            folders.map(folder => (
              <div
                key={folder.id}
                className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-100/50 active:bg-gray-200/50 rounded-lg touch-manipulation"
                onMouseEnter={() => setActiveLabel(folder.name)}
                onMouseLeave={() => setActiveLabel(null)}
              >
                <Folder className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500">{folder.name}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
