'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { MeteorParameters, ImpactResults, ImpactZone } from '@/types/impact.types';
import { ImpactCalculator } from '@/lib/impactCalculator';
import ParameterPanel from '@/components/UI/ParameterPanel';
import ResultsPanel from '@/components/UI/ResultsPanel';
import AIAssistant from '@/components/UI/AIAssistant';
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

/**
 * Parse URL parameters to get initial meteor parameters
 */
function parseURLParams(searchParams: URLSearchParams): Partial<MeteorParameters> {
  const params: Partial<MeteorParameters> = {};
  
  // Parse diameter
  const diameter = searchParams.get('diameter');
  if (diameter) {
    const parsed = parseFloat(diameter);
    if (!isNaN(parsed) && parsed > 0) {
      params.diameter = parsed;
    }
  }
  
  // Parse velocity/speed
  const velocity = searchParams.get('velocity') || searchParams.get('speed');
  if (velocity) {
    const parsed = parseFloat(velocity);
    if (!isNaN(parsed) && parsed >= 11 && parsed <= 72) {
      params.velocity = parsed;
    }
  }
  
  // Parse composition
  const composition = searchParams.get('composition') || searchParams.get('type');
  if (composition) {
    const normalized = composition.toLowerCase();
    if (['iron', 'stony', 'carbonaceous', 'comet'].includes(normalized)) {
      params.composition = normalized as 'iron' | 'stony' | 'carbonaceous' | 'comet';
    }
  }
  
  // Parse location coordinates
  const lat = searchParams.get('lat') || searchParams.get('latitude');
  const lng = searchParams.get('lng') || searchParams.get('lon') || searchParams.get('longitude');
  if (lat && lng) {
    const parsedLat = parseFloat(lat);
    const parsedLng = parseFloat(lng);
    if (!isNaN(parsedLat) && !isNaN(parsedLng) && 
        parsedLat >= -90 && parsedLat <= 90 && 
        parsedLng >= -180 && parsedLng <= 180) {
      params.location = { lat: parsedLat, lng: parsedLng };
    }
  }
  
  return params;
}

export default function Home() {
  const searchParams = useSearchParams();
  const [isInitialized, setIsInitialized] = useState(false);
  
  const [parameters, setParameters] = useState<MeteorParameters>({
    diameter: 100,
    velocity: 20,
    composition: 'stony',
    location: { lat: 0, lng: 0 },
  });

  const [results, setResults] = useState<ImpactResults | null>(null);
  const [impactZones, setImpactZones] = useState<ImpactZone[]>([]);

  // Initialize parameters from URL on component mount
  useEffect(() => {
    if (!isInitialized && searchParams) {
      const urlParams = parseURLParams(searchParams);
      if (Object.keys(urlParams).length > 0) {
        setParameters((prev) => ({ ...prev, ...urlParams }));
      }
      setIsInitialized(true);
    }
  }, [searchParams, isInitialized]);

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

  // Generate shareable URL with current parameters
  const generateShareURL = () => {
    const baseURL = window.location.origin + window.location.pathname;
    const params = new URLSearchParams();
    
    params.set('diameter', parameters.diameter.toString());
    params.set('velocity', parameters.velocity.toString());
    params.set('composition', parameters.composition);
    
    if (parameters.location.lat !== 0 || parameters.location.lng !== 0) {
      params.set('lat', parameters.location.lat.toFixed(6));
      params.set('lng', parameters.location.lng.toFixed(6));
    }
    
    return `${baseURL}?${params.toString()}`;
  };

  const handleShare = async () => {
    const shareURL = generateShareURL();
    
    // Try to use Web Share API if available
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Meteor Impact Simulation',
          text: `Check out this meteor impact scenario: ${parameters.diameter}m ${parameters.composition} asteroid at ${parameters.velocity} km/s`,
          url: shareURL,
        });
        return;
      } catch {
        // User cancelled or share failed, fall back to clipboard
      }
    }
    
    // Fall back to copying to clipboard
    try {
      await navigator.clipboard.writeText(shareURL);
      alert('Share link copied to clipboard!');
    } catch {
      // If clipboard API fails, show the URL in a prompt
      prompt('Copy this URL to share:', shareURL);
    }
  };

  return (
    <div className="fixed inset-0 flex overflow-hidden" style={{ background: 'rgb(15, 15, 28)' }}>
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

        {/* Bottom Center Click Prompt */}
        {(!parameters.location.lat && !parameters.location.lng) && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-[1000] pointer-events-none">
            <button 
              className="px-6 py-3 rounded-full shadow-lg font-semibold transition-colors pointer-events-auto"
              style={{ background: 'rgb(30, 30, 48)', color: '#e5e5e5', border: '1px solid rgba(255, 255, 255, 0.1)' }}
            >
              CLICK IMPACT LOCATION
            </button>
          </div>
        )}
      </div>

      {/* Right Side Panel */}
      <div className="w-96 shadow-2xl overflow-y-auto z-[1000] flex flex-col" style={{ background: 'rgb(25, 25, 40)', borderLeft: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <div className="p-6 flex-1">
          <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: '#e5e5e5' }}>
            ASTEROID LAUNCHER
          </h2>
          
          <ParameterPanel
            parameters={parameters}
            onParameterChange={handleParameterChange}
          />

          {results && (
            <div className="mt-6 space-y-6">
              <ResultsPanel
                results={results}
                hasLocation={parameters.location.lat !== 0 || parameters.location.lng !== 0}
              />
              
              {/* AI Assistant */}
              <AIAssistant
                parameters={parameters}
                results={results}
                hasLocation={parameters.location.lat !== 0 || parameters.location.lng !== 0}
              />
            </div>
          )}
        </div>

        {/* Bottom action area */}
        {parameters.location.lat !== 0 || parameters.location.lng !== 0 ? (
          <div className="p-6 border-t space-y-3" style={{ borderColor: 'rgba(255, 255, 255, 0.1)', background: 'rgb(30, 30, 48)' }}>
            <button
              onClick={handleShare}
              className="w-full font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md"
              style={{ background: '#3b82f6', color: '#fff' }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#2563eb'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#3b82f6'}
            >
              <span>🔗</span>
              <span>Share This Impact</span>
            </button>
            <p className="text-xs text-center" style={{ color: '#9ca3af' }}>
              Share this scenario with a unique link
            </p>
          </div>
        ) : (
          <div className="p-6 border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.1)', background: 'rgb(30, 30, 48)' }}>
            <p className="text-sm text-center" style={{ color: '#9ca3af' }}>
              Select an impact location on the map
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
