import React from 'react';
import { X } from 'lucide-react';
import { useHeaderStore } from '../../store/headerStore';

interface GuideSection {
  title: string;
  content: string[];
}

const guideContent: GuideSection[] = [
  {
    title: 'Navigation Tools',
    content: [
      'Use the mouse wheel or pinch gestures to zoom in/out',
      'Click and drag to pan around the map',
      'Double click to zoom in on a specific location'
    ]
  },
  {
    title: 'Layer Management',
    content: [
      'Toggle different map layers using the layer panel on the left',
      'Switch between different base maps (OpenStreetMap, Satellite, etc.)',
      'Control visibility of property markers and other overlays'
    ]
  },
  {
    title: 'Property Tools',
    content: [
      'Click on markers to view property details',
      'Use filters to narrow down property search',
      'Click the "Add Property" button to list a new property'
    ]
  },
  {
    title: 'Map Tools',
    content: [
      'Measure distances and areas',
      'Draw shapes and annotations',
      'Export map views',
      'Share specific locations'
    ]
  }
];

export function HelpGuide() {
  const { isHelpOpen, setIsHelpOpen } = useHeaderStore();

  if (!isHelpOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Map Guide</h2>
          <button
            onClick={() => setIsHelpOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="space-y-8">
            {guideContent.map((section, index) => (
              <div key={index}>
                <h3 className="text-lg font-medium mb-3 text-gray-900">
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.content.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-2 text-gray-600">
                      <span className="select-none mt-1.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Tip:</strong> Hover over any tool icon to see a quick description of its function.
              For more detailed information about specific features, click the help icon next to each section.
            </p>
          </div>
        </div>

        <div className="p-4 border-t bg-gray-50 rounded-b-lg">
          <button
            onClick={() => setIsHelpOpen(false)}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
}
