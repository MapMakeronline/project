import React, { useState, useEffect } from 'react';
import { X, MapPin, Github, Globe } from 'lucide-react';

interface WelcomeModalProps {
  onClose: () => void;
}

export function WelcomeModal({ onClose }: WelcomeModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl">
        <div className="p-6 md:p-8">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <MapPin className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold">Welcome to PlotFinder</h1>
                <p className="text-gray-600">Interactive Property Management Platform</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-6 space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">About the Project</h2>
              <p className="text-gray-600">
                PlotFinder is an advanced property management platform that combines interactive mapping with powerful data management tools. Perfect for real estate professionals, urban planners, and property developers.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Key Features</h2>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="select-none mt-1">•</span>
                  <span>Interactive map with multiple base layers and custom overlays</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="select-none mt-1">•</span>
                  <span>Integration with Google Sheets for dynamic data management</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="select-none mt-1">•</span>
                  <span>Advanced property filtering and search capabilities</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="select-none mt-1">•</span>
                  <span>Measurement and drawing tools for property analysis</span>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Project Information</h2>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2 text-gray-600">
                  <Globe className="w-4 h-4" />
                  <span>Version 1.0.0</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Github className="w-4 h-4" />
                  <a 
                    href="https://github.com/yourusername/plotfinder"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View on GitHub
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-b-lg border-t">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}