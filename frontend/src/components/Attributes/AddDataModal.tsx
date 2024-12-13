import React, { useRef, useState } from 'react';
import { FileUp, PenLine, X, FolderPlus, ChevronLeft, Folder as FolderIcon } from 'lucide-react';
import { useLayerFolderStore, Folder } from '../../store/layerFolderStore'
interface AddDataModalProps {
  onClose: () => void;
}

type ModalStep = 'initial' | 'folder-select';
type ActionType = 'upload' | 'draw' | null;

export function AddDataModal({ onClose }: AddDataModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<ModalStep>('initial');
  const [selectedAction, setSelectedAction] = useState<ActionType>(null);
  const [newFolderName, setNewFolderName] = useState('');
  
  const { folders, addFolder, addLayerToFolder } = useLayerFolderStore();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('https://backend-1004166685896.europe-central2.run.app/api/upload/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      // Po udanym uploadzie, pokazujemy wybór folderu
      handleActionSelect('upload');
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleActionSelect = (action: ActionType) => {
    setSelectedAction(action);
    setStep('folder-select');
  };

  const handleBack = () => {
    setStep('initial');
    setSelectedAction(null);
  };

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    
    // Tworzymy nowy folder
    addFolder(newFolderName);
    
    // Resetujemy stan i zamykamy modal
    setNewFolderName('');
    onClose();
  };

  const handleSelectFolder = (folderId: string) => {
    // Dodajemy warstwę do wybranego folderu
    // TODO: Dodać rzeczywiste ID warstwy
    const tempLayerId = `layer-${Date.now()}`;
    addLayerToFolder(folderId, tempLayerId);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 md:items-center">
      <div className={`bg-white w-full max-w-sm rounded-t-xl md:rounded-xl shadow-xl relative overflow-hidden`}>
        <div className="flex flex-row" style={{ transform: `translateX(-${step === 'folder-select' ? '100' : '0'}%)`, transition: 'transform 0.3s ease-in-out' }}>
          {/* Initial View */}
          <div className="flex-shrink-0 w-full">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Add Data</h2>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 space-y-2">
              <button
                className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg group"
                onClick={() => handleActionSelect('draw')}
              >
                <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200">
                  <PenLine className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-medium">Draw Data</div>
                  <div className="text-sm text-gray-600">Draw shapes and points on the map</div>
                </div>
              </button>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept=".geojson,.kml,.shp,.csv,.gml"
                className="hidden"
              />

              <button
                className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg group"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200">
                  <FileUp className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-medium">Import File</div>
                  <div className="text-sm text-gray-600">Upload GeoJSON, KML, or Shapefile</div>
                </div>
              </button>
            </div>
          </div>

          {/* Folder Selection View */}
          <div className="flex-shrink-0 w-full">
            <div className="flex justify-between items-center p-4 border-b">
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleBack}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h2 className="text-lg font-semibold">Select Folder</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">Create New Folder</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="Folder name"
                    className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleCreateFolder}
                    className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                    disabled={!newFolderName.trim()}
                  >
                    <FolderPlus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Existing Folders</h3>
                <div className="space-y-1">
                  {folders.map((folder: Folder) => (
                    <button
                      key={folder.id}
                      onClick={() => handleSelectFolder(folder.id)}
                      className="w-full p-2 text-left hover:bg-gray-50 rounded-lg flex items-center gap-2"
                    >
                      <FolderIcon className="w-4 h-4" />
                      {folder.name}
                    </button>
                  ))}
                  {folders.length === 0 && (
                    <p className="text-sm text-gray-500 p-2">No folders yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
