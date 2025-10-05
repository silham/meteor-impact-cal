'use client';

import { MeteorParameters } from '@/types/impact.types';
import { PRESET_SCENARIOS } from '@/lib/presets';
import NASAAsteroidSelector from './NASAAsteroidSelector';

interface ParameterPanelProps {
  parameters: MeteorParameters;
  onParameterChange: (params: Partial<MeteorParameters>) => void;
}

export default function ParameterPanel({
  parameters,
  onParameterChange,
}: ParameterPanelProps) {
  const handlePresetSelect = (presetName: string) => {
    const preset = PRESET_SCENARIOS.find((p) => p.name === presetName);
    if (preset) {
      onParameterChange(preset.parameters);
    }
  };

  return (
    <div className="space-y-6">
      {/* NASA Asteroid Name Display - Only show if from NASA */}
      {parameters.name && (
        <div className="space-y-2">
          <div className="text-center p-3 rounded-lg" style={{ background: 'rgb(30, 30, 48)' }}>
            <p className="text-sm" style={{ color: '#9ca3af' }}>
              <strong>NASA Asteroid:</strong> {parameters.name}
              {parameters.isPotentiallyHazardous && (
                <span className="ml-2 text-red-500 font-bold">⚠️ PHA</span>
              )}
            </p>
          </div>
        </div>
      )}

      {/* NASA Real Asteroids Selector */}
      <NASAAsteroidSelector onSelectAsteroid={onParameterChange} />

      {/* Preset Scenarios */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold" style={{ color: '#e5e5e5' }}>
          Preset Scenarios
        </label>
        <select
          className="w-full px-4 py-3 border-2 rounded-lg focus:ring-2 font-medium"
          style={{ 
            background: 'rgb(30, 30, 48)', 
            borderColor: 'rgba(255, 255, 255, 0.1)', 
            color: '#e5e5e5' 
          }}
          onChange={(e) => handlePresetSelect(e.target.value)}
          defaultValue=""
        >
          <option value="" disabled>
            Choose a scenario...
          </option>
          {PRESET_SCENARIOS.map((preset) => (
            <option key={preset.name} value={preset.name}>
              {preset.name}
            </option>
          ))}
        </select>
      </div>

      {/* Diameter Slider */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold flex items-center gap-2" style={{ color: '#e5e5e5' }}>
            <span>📏</span> Diameter
          </label>
          <span className="text-lg font-bold" style={{ color: '#e5e5e5' }}>
            {parameters.diameter >= 1000 
              ? `${(parameters.diameter / 1000).toFixed(2)} km` 
              : `${parameters.diameter.toLocaleString()} m`}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="3"
          step="0.01"
          value={Math.log10(parameters.diameter)}
          onChange={(e) => {
            const logValue = parseFloat(e.target.value);
            const diameter = Math.pow(10, logValue);
            onParameterChange({ diameter: Math.round(diameter) });
          }}
          className="w-full h-3 rounded-lg appearance-none cursor-pointer"
          style={{ background: 'rgba(255, 255, 255, 0.1)' }}
        />
      </div>

      {/* Speed Slider */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold flex items-center gap-2" style={{ color: '#e5e5e5' }}>
            <span>⚡</span> Speed
          </label>
          <span className="text-lg font-bold" style={{ color: '#e5e5e5' }}>
            {parameters.velocity.toFixed(1)} km/s
          </span>
        </div>
        <input
          type="range"
          min="11"
          max="72"
          step="0.5"
          value={parameters.velocity}
          onChange={(e) =>
            onParameterChange({ velocity: parseFloat(e.target.value) })
          }
          className="w-full h-3 rounded-lg appearance-none cursor-pointer"
          style={{ background: 'rgba(255, 255, 255, 0.1)' }}
        />
      </div>

      {/* Composition Selector */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold" style={{ color: '#e5e5e5' }}>
          Composition Type
        </label>
        <div className="grid grid-cols-2 gap-2">
          {(['iron', 'stony', 'carbonaceous', 'comet'] as const).map((comp) => (
            <button
              key={comp}
              onClick={() => onParameterChange({ composition: comp })}
              className="px-4 py-3 rounded-lg font-medium transition-all"
              style={
                parameters.composition === comp
                  ? { background: '#3b82f6', color: '#fff' }
                  : { background: 'rgb(30, 30, 48)', color: '#9ca3af', border: '1px solid rgba(255, 255, 255, 0.1)' }
              }
            >
              {comp.charAt(0).toUpperCase() + comp.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Location Display */}
      {parameters.location.lat !== 0 && parameters.location.lng !== 0 && (
        <div className="pt-4 border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
          <label className="block text-sm font-semibold mb-2" style={{ color: '#e5e5e5' }}>
            📍 Impact Coordinates
          </label>
          <div className="text-sm p-3 rounded-lg space-y-1" style={{ background: 'rgb(30, 30, 48)', color: '#9ca3af' }}>
            <p>
              <span className="font-medium">Lat:</span> {parameters.location.lat.toFixed(4)}°
            </p>
            <p>
              <span className="font-medium">Lng:</span> {parameters.location.lng.toFixed(4)}°
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
