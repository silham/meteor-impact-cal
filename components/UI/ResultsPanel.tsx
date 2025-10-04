'use client';

import { ImpactResults } from '@/types/impact.types';

interface ResultsPanelProps {
  results: ImpactResults | null;
  hasLocation: boolean;
}

export default function ResultsPanel({ results, hasLocation }: ResultsPanelProps) {
  if (!hasLocation) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <p className="text-gray-500 text-sm text-center italic">
          Select an impact location on the map
        </p>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <p className="text-gray-500 text-sm text-center italic">Calculating...</p>
      </div>
    );
  }

  const formatNumber = (num: number, decimals: number = 2) => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(decimals)} billion`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(decimals)} million`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(decimals)} thousand`;
    return num.toFixed(decimals);
  };

  return (
    <div className="space-y-4">
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-lg font-bold text-gray-800 mb-3">Impact Results</h3>
        
        {/* Impact Type Badge */}
        <div className="mb-4">
          <span
            className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
              results.impactType === 'airburst'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {results.impactType === 'airburst' ? '☁️ Airburst' : '💥 Surface Impact'}
          </span>
        </div>

        {/* Compact Stats */}
        <div className="space-y-3">
          {/* Energy */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">Impact Energy</p>
            <p className="text-xl font-bold text-gray-900">
              {formatNumber(results.energyTNT)} Mt TNT
            </p>
          </div>

          {/* Crater */}
          {results.impactType === 'surface' && results.craterDiameter > 0 && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Crater Diameter</p>
              <p className="text-xl font-bold text-gray-900">
                {(results.craterDiameter / 1000).toFixed(2)} km
              </p>
            </div>
          )}

          {/* Seismic */}
          {(results.impactType === 'surface' || results.seismicMagnitude > 2) && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Seismic Magnitude</p>
              <p className="text-xl font-bold text-gray-900">
                {results.seismicMagnitude.toFixed(1)}
              </p>
            </div>
          )}

          {/* Blast Radii */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-600 mb-2">Blast Radii</p>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">20 psi:</span>
                <span className="font-semibold">{results.blastRadius.twentyPsi.toFixed(1)} km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">5 psi:</span>
                <span className="font-semibold">{results.blastRadius.fivePsi.toFixed(1)} km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">1 psi:</span>
                <span className="font-semibold">{results.blastRadius.onePsi.toFixed(1)} km</span>
              </div>
            </div>
          </div>

          {/* Thermal */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">🔥 Thermal Radius</p>
            <p className="text-xl font-bold text-gray-900">
              {results.thermalRadius.toFixed(1)} km
            </p>
            <p className="text-xs text-gray-500 mt-1">3rd degree burns</p>
          </div>
        </div>

        {/* Airburst Note */}
        {results.impactType === 'airburst' && (
          <div className="mt-4 bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
            <p className="text-xs text-blue-900 font-medium">
              Atmospheric explosion - no crater formed
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

