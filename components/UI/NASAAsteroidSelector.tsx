'use client';

import { useState, useEffect, useMemo } from 'react';
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
  const [searchQuery, setSearchQuery] = useState('');

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
    setSearchQuery('');
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

  // Filter asteroids based on search query
  const filteredAsteroids = useMemo(() => {
    if (!searchQuery.trim()) return asteroids;
    
    const query = searchQuery.toLowerCase();
    return asteroids.filter(asteroid => 
      asteroid.name.toLowerCase().includes(query)
    );
  }, [asteroids, searchQuery]);

  if (loading) {
    return (
      <div className="border-2 rounded-lg p-4" style={{ background: 'rgba(59, 130, 246, 0.1)', borderColor: 'rgba(59, 130, 246, 0.3)' }}>
        <div className="flex flex-col items-center gap-2" style={{ color: '#60a5fa' }}>
          <div className="animate-spin h-5 w-5 border-2 border-t-transparent rounded-full" style={{ borderColor: '#60a5fa' }}></div>
          <span className="font-medium">Loading NASA asteroids...</span>
          <span className="text-xs" style={{ color: '#93c5fd' }}>Fetching 200+ asteroids from NASA database</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border-2 rounded-lg p-4" style={{ background: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
        <p className="text-sm" style={{ color: '#f87171' }}>
          <strong>⚠️ Error:</strong> {error}
        </p>
        <button
          onClick={loadAsteroids}
          className="mt-2 text-sm underline"
          style={{ color: '#f87171' }}
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
        className="w-full font-semibold py-3 px-4 rounded-lg transition-all flex items-center justify-between border-2"
        style={{ 
          background: 'rgb(30, 30, 48)', 
          borderColor: 'rgba(255, 255, 255, 0.1)', 
          color: '#e5e5e5' 
        }}
      >
        <span className="flex items-center gap-2">
          <span className="text-xl">🛸</span>
          <span>Real NASA Asteroids ({asteroids.length})</span>
        </span>
        <span className={`transform transition-transform ${expanded ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {expanded && (
        <div className="space-y-2 rounded-lg p-3 border-2" style={{ background: 'rgb(30, 30, 48)', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
          <div className="space-y-2 mb-3">
            <input
              type="text"
              placeholder="Search asteroids by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border-2 rounded-lg text-sm"
              style={{ 
                background: 'rgb(25, 25, 40)', 
                borderColor: 'rgba(255, 255, 255, 0.1)', 
                color: '#e5e5e5' 
              }}
            />
            <p className="text-xs px-2" style={{ color: '#9ca3af' }}>
              Showing <strong>{filteredAsteroids.length}</strong> asteroids below 1km diameter
            </p>
          </div>
          
          <div className="max-h-96 overflow-y-auto space-y-2">
            {filteredAsteroids.map((asteroid) => (
              <button
                key={asteroid.id}
                onClick={() => handleSelectAsteroid(asteroid)}
                className="w-full text-left border rounded-lg p-3 transition-all group"
                style={{ background: 'rgb(25, 25, 40)', borderColor: 'rgba(255, 255, 255, 0.1)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgb(25, 25, 40)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-sm truncate" style={{ color: '#e5e5e5' }}>
                        {asteroid.name}
                      </span>
                      {asteroid.is_potentially_hazardous_asteroid && (
                        <span className="flex-shrink-0 text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#f87171' }}>
                          ⚠️ PHA
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3 text-xs" style={{ color: '#9ca3af' }}>
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
                  
                  <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#60a5fa' }}>
                    →
                  </div>
                </div>
              </button>
            ))}
          </div>
          
          <div className="mt-3 pt-3 border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
            <p className="text-xs px-2" style={{ color: '#6b7280' }}>
              <strong>Note:</strong> PHA = Potentially Hazardous Asteroid (NASA classification for objects that could pose a threat to Earth)
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
