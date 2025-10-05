'use client';

import { ImpactResults } from '@/types/impact.types';

interface ResultsPanelProps {
  results: ImpactResults | null;
  hasLocation: boolean;
}

export default function ResultsPanel({ results, hasLocation }: ResultsPanelProps) {
  if (!hasLocation) {
    return (
      <div className="p-4 rounded-lg border" style={{ background: 'rgb(30, 30, 48)', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
        <p className="text-sm text-center italic" style={{ color: '#9ca3af' }}>
          Select an impact location on the map
        </p>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="p-4 rounded-lg border" style={{ background: 'rgb(30, 30, 48)', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
        <p className="text-sm text-center italic" style={{ color: '#9ca3af' }}>Calculating...</p>
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
      <div className="border-t pt-4" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
        <h3 className="text-lg font-bold mb-3" style={{ color: '#e5e5e5' }}>Impact Results</h3>
        
        {/* Impact Type Badge */}
        <div className="mb-4">
          <span
            className="inline-block px-4 py-2 rounded-full text-sm font-semibold"
            style={
              results.impactType === 'airburst'
                ? { background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa' }
                : { background: 'rgba(239, 68, 68, 0.2)', color: '#f87171' }
            }
          >
            {results.impactType === 'airburst' ? '☁️ Airburst' : '💥 Surface Impact'}
          </span>
        </div>

        {/* Compact Stats */}
        <div className="space-y-3">
          {/* Energy */}
          <div className="p-3 rounded-lg" style={{ background: 'rgb(30, 30, 48)' }}>
            <p className="text-xs mb-1" style={{ color: '#9ca3af' }}>Impact Energy</p>
            <p className="text-xl font-bold" style={{ color: '#e5e5e5' }}>
              {formatNumber(results.energyTNT)} Mt TNT
            </p>
          </div>

          {/* Crater */}
          {results.impactType === 'surface' && results.craterDiameter > 0 && (
            <div className="p-3 rounded-lg" style={{ background: 'rgb(30, 30, 48)' }}>
              <p className="text-xs mb-1" style={{ color: '#9ca3af' }}>Crater Diameter</p>
              <p className="text-xl font-bold" style={{ color: '#e5e5e5' }}>
                {(results.craterDiameter / 1000).toFixed(2)} km
              </p>
            </div>
          )}

          {/* Seismic - Only show for surface impacts */}
          {results.impactType === 'surface' && (
            <div className="p-3 rounded-lg" style={{ background: 'rgb(30, 30, 48)' }}>
              <p className="text-xs mb-1" style={{ color: '#9ca3af' }}>Seismic Magnitude</p>
              <p className="text-xl font-bold" style={{ color: '#e5e5e5' }}>
                {results.seismicMagnitude.toFixed(1)}
              </p>
            </div>
          )}

          {/* Blast Radii */}
          <div className="p-3 rounded-lg" style={{ background: 'rgb(30, 30, 48)' }}>
            <p className="text-xs mb-2" style={{ color: '#9ca3af' }}>Blast Radii</p>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span style={{ color: '#9ca3af' }}>20 psi:</span>
                <span className="font-semibold" style={{ color: '#e5e5e5' }}>{results.blastRadius.twentyPsi.toFixed(1)} km</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: '#9ca3af' }}>5 psi:</span>
                <span className="font-semibold" style={{ color: '#e5e5e5' }}>{results.blastRadius.fivePsi.toFixed(1)} km</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: '#9ca3af' }}>1 psi:</span>
                <span className="font-semibold" style={{ color: '#e5e5e5' }}>{results.blastRadius.onePsi.toFixed(1)} km</span>
              </div>
            </div>
          </div>

          {/* Thermal */}
          <div className="p-3 rounded-lg" style={{ background: 'rgb(30, 30, 48)' }}>
            <p className="text-xs mb-1" style={{ color: '#9ca3af' }}>🔥 Thermal Radius</p>
            <p className="text-xl font-bold" style={{ color: '#e5e5e5' }}>
              {results.thermalRadius.toFixed(1)} km
            </p>
            <p className="text-xs mt-1" style={{ color: '#6b7280' }}>3rd degree burns</p>
          </div>
        </div>

        {/* Airburst Note */}
        {results.impactType === 'airburst' && (
          <div className="mt-4 border-l-4 p-3 rounded" style={{ background: 'rgba(59, 130, 246, 0.1)', borderColor: '#3b82f6' }}>
            <p className="text-xs font-medium" style={{ color: '#60a5fa' }}>
              Atmospheric explosion - no crater formed
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

