import React, { useRef, useState } from 'react';
import { FileUp, PenLine, X, FolderPlus, ChevronLeft, Plus } from 'lucide-react';
import { useCustomSectionsStore, CustomSection } from '../../store/customSectionsStore';
import { useLayerOrderStore } from '../../store/layerOrderStore';
import { SectionNameModal } from '../LayerTree/SectionCreation';

interface AddDataModalProps {
  onClose: () => void;
}

type ModalStep = 'initial' | 'section-select' | 'file-upload';
type ActionType = 'upload' | 'draw' | null;

export function AddDataModal({ onClose }: AddDataModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<ModalStep>('initial');
  const [selectedAction, setSelectedAction] = useState<ActionType>(null);
  const [selectedSection, setSelectedSection] = useState<CustomSection | null>(null);
  const [isCreateSectionModalOpen, setIsCreateSectionModalOpen] = useState(false);
  
  const { sections, addSection, addLayer } = useCustomSectionsStore();
  const { addSection: addSectionToOrder } = useLayerOrderStore();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedSection) return;

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

      // Add layer to selected section
      const layerName = file.name.split('.')[0]; // Use filename without extension as layer name
      addLayer(selectedSection.id, layerName);
      onClose();
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleActionSelect = (action: ActionType) => {
    setSelectedAction(action);
    setStep('section-select');
  };

  const handleBack = () => {
    if (step === 'section-select') {
      setStep('initial');
      setSelectedAction(null);
    } else if (step === 'file-upload') {
      setStep('section-select');
      setSelectedSection(null);
    }
  };

  const handleCreateSection = (name: string) => {
    const sectionId = addSection(name);
    // Add section to layer order as well
    addSectionToOrder(sectionId);
    const newSection = sections.find(s => s.id === sectionId);
    if (newSection) {
      setSelectedSection(newSection);
      setStep('file-upload');
    }
  };

  const handleSelectSection = (section: CustomSection) => {
    setSelectedSection(section);
    setStep('file-upload');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 md:items-center">
      <div className={`bg-white w-full max-w-sm rounded-t-xl md:rounded-xl shadow-xl relative overflow-hidden`}>
        <div className="flex flex-row" style={{ transform: `translateX(-${step === 'initial' ? '0' : step === 'section-select' ? '100' : '200'}%)`, transition: 'transform 0.3s ease-in-out' }}>
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

              <button
                className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg group"
                onClick={() => handleActionSelect('upload')}
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

          {/* Section Selection View */}
          <div className="flex-shrink-0 w-full">
            <div className="flex justify-between items-center p-4 border-b">
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleBack}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h2 className="text-lg font-semibold">Select Section</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <button
                onClick={() => setIsCreateSectionModalOpen(true)}
                className="w-full flex items-center gap-2 p-3 text-blue-500 hover:bg-blue-50 rounded-lg"
              >
                <Plus className="w-5 h-5" />
                Create New Section
              </button>

              <div className="space-y-2">
                <h3 className="font-medium">Existing Sections</h3>
                <div className="space-y-1">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => handleSelectSection(section)}
                      className="w-full p-3 text-left hover:bg-gray-50 rounded-lg"
                    >
                      {section.name}
                    </button>
                  ))}
                  {sections.length === 0 && (
                    <p className="text-sm text-gray-500 p-2">No sections yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* File Upload View */}
          <div className="flex-shrink-0 w-full">
            <div className="flex justify-between items-center p-4 border-b">
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleBack}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h2 className="text-lg font-semibold">Upload File</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4">
              <div className="text-sm text-gray-600 mb-4">
                Selected section: <span className="font-medium">{selectedSection?.name}</span>
              </div>
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept=".geojson,.kml,.shp,.csv,.gml"
                className="hidden"
              />

              <button
                className="w-full flex items-center justify-center gap-2 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                onClick={() => fileInputRef.current?.click()}
              >
                <FileUp className="w-5 h-5" />
                Choose File
              </button>
            </div>
          </div>
        </div>

        {/* Section Creation Modal */}
        <SectionNameModal
          isOpen={isCreateSectionModalOpen}
          onClose={() => setIsCreateSectionModalOpen(false)}
          onSubmit={handleCreateSection}
          title="Create New Section"
        />
      </div>
    </div>
  );
}
