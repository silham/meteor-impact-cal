'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { MeteorParameters, ImpactResults, ImpactZone } from '@/types/impact.types';
import { ImpactCalculator } from '@/lib/impactCalculator';
import ParameterPanel from '@/components/UI/ParameterPanel';
import ResultsPanel from '@/components/UI/ResultsPanel';
import TestCalculations from '@/components/TestCalculations';

// Dynamic import to avoid SSR issues with Leaflet
const InteractiveMap = dynamic(() => import('@/components/Map/InteractiveMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
      <p className="text-gray-500">Loading map...</p>
    </div>
  ),
});

export default function Home() {
  const [parameters, setParameters] = useState<MeteorParameters>({
    diameter: 100,
    velocity: 20,
    composition: 'stony',
    location: { lat: 0, lng: 0 },
  });

  const [results, setResults] = useState<ImpactResults | null>(null);
  const [impactZones, setImpactZones] = useState<ImpactZone[]>([]);

  // Calculate impact whenever parameters change
  useEffect(() => {
    if (parameters.location.lat === 0 && parameters.location.lng === 0) {
      setResults(null);
      setImpactZones([]);
      return;
    }

    const newResults = ImpactCalculator.calculateImpact(parameters);
    setResults(newResults);

    // Generate impact zones for visualization
    const zones: ImpactZone[] = [];

    // Crater (only for surface impacts)
    if (newResults.impactType === 'surface' && newResults.craterDiameter > 0) {
      zones.push({
        lat: parameters.location.lat,
        lng: parameters.location.lng,
        radius: newResults.craterDiameter / 2,
        color: '#8B4513',
        label: 'Crater',
      });
    }

    // Thermal radiation zone
    if (newResults.thermalRadius > 0) {
      zones.push({
        lat: parameters.location.lat,
        lng: parameters.location.lng,
        radius: newResults.thermalRadius * 1000,
        color: '#FF8C00',
        label: 'Thermal Radiation (3rd degree burns)',
      });
    }

    // Air blast zones
    if (newResults.blastRadius.twentyPsi > 0) {
      zones.push({
        lat: parameters.location.lat,
        lng: parameters.location.lng,
        radius: newResults.blastRadius.twentyPsi * 1000,
        color: '#DC143C',
        label: '20 psi overpressure',
      });
    }

    if (newResults.blastRadius.fivePsi > 0) {
      zones.push({
        lat: parameters.location.lat,
        lng: parameters.location.lng,
        radius: newResults.blastRadius.fivePsi * 1000,
        color: '#FF6347',
        label: '5 psi overpressure',
      });
    }

    if (newResults.blastRadius.onePsi > 0) {
      zones.push({
        lat: parameters.location.lat,
        lng: parameters.location.lng,
        radius: newResults.blastRadius.onePsi * 1000,
        color: '#FFD700',
        label: '1 psi overpressure',
      });
    }

    setImpactZones(zones);
  }, [parameters]);

  const handleParameterChange = (newParams: Partial<MeteorParameters>) => {
    setParameters((prev) => ({ ...prev, ...newParams }));
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setParameters((prev) => ({ ...prev, location: { lat, lng } }));
  };

  return (
    <div className="fixed inset-0 flex overflow-hidden">
      {/* Test calculations component (check browser console) */}
      <TestCalculations />
      
      {/* Full Screen Map */}
      <div className="flex-1 relative">
        <InteractiveMap
          impactLocation={
            parameters.location.lat !== 0 || parameters.location.lng !== 0
              ? parameters.location
              : null
          }
          impactZones={impactZones}
          onLocationSelect={handleLocationSelect}
        />
        
        {/* Top Left Logo/Title */}
        <div className="absolute top-4 left-4 z-[1000] pointer-events-none">
          <h1 className="text-2xl font-bold text-white drop-shadow-lg">
            METEOR IMPACT
          </h1>
        </div>

        {/* Bottom Center Click Prompt */}
        {(!parameters.location.lat && !parameters.location.lng) && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-[1000] pointer-events-none">
            <button className="bg-white px-6 py-3 rounded-full shadow-lg font-semibold text-gray-800 hover:bg-gray-100 transition-colors pointer-events-auto">
              CLICK IMPACT LOCATION
            </button>
          </div>
        )}
      </div>

      {/* Right Side Panel */}
      <div className="w-96 bg-white shadow-2xl overflow-y-auto z-[1000] flex flex-col">
        <div className="p-6 flex-1">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            ASTEROID LAUNCHER
          </h2>
          
          <ParameterPanel
            parameters={parameters}
            onParameterChange={handleParameterChange}
          />

          {results && (
            <div className="mt-6">
              <ResultsPanel
                results={results}
                hasLocation={parameters.location.lat !== 0 || parameters.location.lng !== 0}
              />
            </div>
          )}
        </div>

        {/* Bottom action area */}
        {parameters.location.lat !== 0 || parameters.location.lng !== 0 ? (
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-600 text-center">
              Impact location selected
            </p>
          </div>
        ) : (
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-600 text-center">
              Select an impact location
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
