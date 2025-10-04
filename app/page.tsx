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
    impactAngle: 45,
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Test calculations component (check browser console) */}
      <TestCalculations />
      
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold text-white mb-2">
            🌠 Meteor Impact Simulator
          </h1>
          <p className="text-gray-300">
            NASA Space Apps 2025 - Interactive Asteroid Impact Calculator
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Parameters */}
          <div className="lg:col-span-1">
            <ParameterPanel
              parameters={parameters}
              onParameterChange={handleParameterChange}
            />
          </div>

          {/* Center - Map */}
          <div className="lg:col-span-2 h-[600px]">
            <InteractiveMap
              impactLocation={
                parameters.location.lat !== 0 || parameters.location.lng !== 0
                  ? parameters.location
                  : null
              }
              impactZones={impactZones}
              onLocationSelect={handleLocationSelect}
            />
          </div>

          {/* Right Sidebar - Results */}
          <div className="lg:col-span-1">
            <ResultsPanel
              results={results}
              hasLocation={parameters.location.lat !== 0 || parameters.location.lng !== 0}
            />
          </div>
        </div>

        {/* Legend */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Impact Zone Legend</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#8B4513] border-2 border-gray-300"></div>
              <span className="text-sm text-gray-700">Crater (surface only)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#FF8C00] border-2 border-gray-300"></div>
              <span className="text-sm text-gray-700">Thermal radiation</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#DC143C] border-2 border-gray-300"></div>
              <span className="text-sm text-gray-700">20 psi blast</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#FF6347] border-2 border-gray-300"></div>
              <span className="text-sm text-gray-700">5 psi blast</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#FFD700] border-2 border-gray-300"></div>
              <span className="text-sm text-gray-700">1 psi blast</span>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 bg-black/30 backdrop-blur-sm p-6 rounded-lg border border-white/10">
          <h3 className="text-lg font-bold text-white mb-3">About This Simulator</h3>
          <p className="text-gray-300 text-sm leading-relaxed mb-3">
            This simulator uses physics equations from the Earth Impact Effects Program to calculate 
            the destructive effects of asteroid and comet impacts. Enter meteor parameters or choose 
            from historical events like Tunguska, Chelyabinsk, or the Chicxulub impact that ended 
            the dinosaurs.
          </p>
          <p className="text-gray-400 text-xs">
            Physics calculations based on Collins et al. (2005) and Marcus et al. (2010). 
            Map data © OpenStreetMap contributors.
          </p>
        </div>
      </main>
    </div>
  );
}
