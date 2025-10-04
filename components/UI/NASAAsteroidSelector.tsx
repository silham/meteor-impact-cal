'use client';

import { useState, useEffect } from 'react';
import { NASAAsteroid, getFamousAsteroids, convertNASAAsteroidToParams } from '@/lib/nasa-api';
import { MeteorParameters } from '@/types/impact.types';

interface NASAAsteroidSelectorProps {
  onSelectAsteroid: (params: Partial<MeteorParameters>) => void;
}

export default function NASAAsteroidSelector({ onSelectAsteroid }: NASAAsteroidSelectorProps) {
  const [asteroids, setAsteroids] = useState<NASAAsteroid[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    loadAsteroids();
  }, []);

  const loadAsteroids = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getFamousAsteroids();
      setAsteroids(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load asteroids');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAsteroid = (asteroid: NASAAsteroid) => {
    const params = convertNASAAsteroidToParams(asteroid);
    onSelectAsteroid(params);
    setExpanded(false);
  };

  const formatDiameter = (asteroid: NASAAsteroid) => {
    const avgMeters = (
      asteroid.estimated_diameter.meters.estimated_diameter_min +
      asteroid.estimated_diameter.meters.estimated_diameter_max
    ) / 2;
    
    if (avgMeters >= 1000) {
      return `${(avgMeters / 1000).toFixed(2)} km`;
    }
    return `${avgMeters.toFixed(0)} m`;
  };

  if (loading) {
    return (
      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-blue-700">
          <div className="animate-spin h-5 w-5 border-2 border-blue-700 border-t-transparent rounded-full"></div>
          <span className="font-medium">Loading NASA asteroids...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
        <p className="text-sm text-red-700">
          <strong>⚠️ Error:</strong> {error}
        </p>
        <button
          onClick={loadAsteroids}
          className="mt-2 text-sm text-red-700 underline hover:text-red-900"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!asteroids.length) {
    return null;
  }

  return (
    <div className="space-y-2">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-between shadow-lg"
      >
        <span className="flex items-center gap-2">
          <span className="text-xl">🛸</span>
          <span>Real NASA Asteroids</span>
        </span>
        <span className={`transform transition-transform ${expanded ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {expanded && (
        <div className="space-y-2 max-h-96 overflow-y-auto bg-gray-50 rounded-lg p-3 border-2 border-gray-200">
          <p className="text-xs text-gray-600 mb-3 px-2">
            <strong>{asteroids.length} real asteroids</strong> from NASA (up to 1km). Click to simulate:
          </p>
          
          {asteroids.map((asteroid) => (
            <button
              key={asteroid.id}
              onClick={() => handleSelectAsteroid(asteroid)}
              className="w-full text-left bg-white hover:bg-blue-50 border border-gray-300 hover:border-blue-400 rounded-lg p-3 transition-all group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-gray-900 text-sm truncate">
                      {asteroid.name}
                    </span>
                    {asteroid.is_potentially_hazardous_asteroid && (
                      <span className="flex-shrink-0 bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-medium">
                        ⚠️ PHA
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3 text-xs text-gray-600">
                    <span className="flex items-center gap-1">
                      <span>📏</span>
                      <span>{formatDiameter(asteroid)}</span>
                    </span>
                    {asteroid.close_approach_data && asteroid.close_approach_data.length > 0 && (
                      <span className="flex items-center gap-1">
                        <span>⚡</span>
                        <span>
                          {parseFloat(asteroid.close_approach_data[0].relative_velocity.kilometers_per_second).toFixed(1)} km/s
                        </span>
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex-shrink-0 text-blue-600 group-hover:text-blue-700 opacity-0 group-hover:opacity-100 transition-opacity">
                  →
                </div>
              </div>
            </button>
          ))}
          
          <div className="mt-3 pt-3 border-t border-gray-300">
            <p className="text-xs text-gray-500 px-2">
              <strong>Note:</strong> PHA = Potentially Hazardous Asteroid (NASA classification for objects that could pose a threat to Earth)
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
