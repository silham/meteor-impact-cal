'use client';

import { ImpactResults } from '@/types/impact.types';

interface ResultsPanelProps {
  results: ImpactResults | null;
  hasLocation: boolean;
}

export default function ResultsPanel({ results, hasLocation }: ResultsPanelProps) {
  if (!hasLocation) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Impact Results</h2>
        <p className="text-gray-500 italic">
          Click on the map to select an impact location
        </p>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Impact Results</h2>
        <p className="text-gray-500 italic">Calculating...</p>
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
    <div className="bg-white p-6 rounded-lg shadow-lg space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Impact Results</h2>

      {/* Impact Type Badge */}
      <div className="flex items-center gap-2">
        <span
          className={`px-4 py-2 rounded-full text-sm font-semibold ${
            results.impactType === 'airburst'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {results.impactType === 'airburst' ? '☁️ Airburst' : '💥 Surface Impact'}
        </span>
      </div>

      {/* Energy */}
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">
          Impact Energy
        </h3>
        <p className="text-3xl font-bold text-gray-900">
          {formatNumber(results.energyTNT)} Mt
        </p>
        <p className="text-sm text-gray-500 mt-1">
          TNT equivalent (1 Mt = 1 million tons)
        </p>
        {results.energyTNT > 0.001 && (
          <p className="text-xs text-gray-600 mt-2">
            ≈ {formatNumber(results.energyTNT / 0.015)} Hiroshima bombs
          </p>
        )}
      </div>

      {/* Crater */}
      {results.impactType === 'surface' && results.craterDiameter > 0 && (
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            Crater Diameter
          </h3>
          <p className="text-3xl font-bold text-gray-900">
            {formatNumber(results.craterDiameter)} m
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {(results.craterDiameter / 1000).toFixed(2)} kilometers
          </p>
        </div>
      )}

      {/* Airburst Explanation */}
      {results.impactType === 'airburst' && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <p className="text-sm font-semibold text-blue-900">
            ☁️ Atmospheric Explosion
          </p>
          <p className="text-xs text-blue-700 mt-1">
            This meteor breaks up in the atmosphere before reaching the ground. No crater is formed, but significant blast and thermal effects occur.
          </p>
        </div>
      )}

      {/* Seismic - Only show for surface impacts or significant airbursts */}
      {(results.impactType === 'surface' || results.seismicMagnitude > 2) && (
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            Seismic Magnitude
          </h3>
          <p className="text-3xl font-bold text-gray-900">
            {results.seismicMagnitude.toFixed(1)}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {results.impactType === 'airburst' 
              ? 'Ground shaking from airburst (Richter scale)'
              : 'Earthquake magnitude (Richter scale)'}
          </p>
        </div>
      )}

      {/* Thermal Radiation */}
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">
          🔥 Thermal Radiation
        </h3>
        <p className="text-2xl font-bold text-orange-600">
          {results.thermalRadius.toFixed(2)} km
        </p>
        <p className="text-sm text-gray-500 mt-1">
          3rd degree burns radius
        </p>
      </div>

      {/* Blast Damage */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-700">
          💨 Air Blast Overpressure
        </h3>
        
        <div className="bg-red-50 p-3 rounded-lg">
          <p className="text-sm font-semibold text-red-900">
            20 psi: {results.blastRadius.twentyPsi.toFixed(2)} km
          </p>
          <p className="text-xs text-gray-600 mt-1">
            Heavily built concrete buildings severely damaged
          </p>
        </div>

        <div className="bg-orange-50 p-3 rounded-lg">
          <p className="text-sm font-semibold text-orange-900">
            5 psi: {results.blastRadius.fivePsi.toFixed(2)} km
          </p>
          <p className="text-xs text-gray-600 mt-1">
            Most buildings collapse, widespread fatalities
          </p>
        </div>

        <div className="bg-yellow-50 p-3 rounded-lg">
          <p className="text-sm font-semibold text-yellow-900">
            1 psi: {results.blastRadius.onePsi.toFixed(2)} km
          </p>
          <p className="text-xs text-gray-600 mt-1">
            Window glass shatters, minor injuries
          </p>
        </div>
      </div>

      {/* Warning Message for Large Impacts */}
      {results.energyTNT > 100 && (
        <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded">
          <p className="text-sm font-semibold text-red-900">
            ⚠️ Extinction-Level Event
          </p>
          <p className="text-xs text-red-700 mt-1">
            This impact would cause global climate disruption and mass extinctions
          </p>
        </div>
      )}
    </div>
  );
}
