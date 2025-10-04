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
      {/* Asteroid Type Carousel (simplified as dropdown for now) */}
      <div className="space-y-3">
        <div className="text-center">
          <div className="w-32 h-32 mx-auto mb-3 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-4xl">☄️</span>
          </div>
          <h3 className="text-lg font-bold text-gray-800 capitalize">
            {parameters.composition} Asteroid
          </h3>
          {parameters.name && (
            <p className="text-sm text-gray-600 mt-1">
              <strong>NASA:</strong> {parameters.name}
              {parameters.isPotentiallyHazardous && (
                <span className="ml-2 text-red-600 font-bold">⚠️ PHA</span>
              )}
            </p>
          )}
        </div>
      </div>

      {/* NASA Real Asteroids Selector */}
      <NASAAsteroidSelector onSelectAsteroid={onParameterChange} />

      {/* Preset Scenarios */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          Preset Scenarios
        </label>
        <select
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-800 font-medium"
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
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <span>📏</span> Diameter
          </label>
          <span className="text-lg font-bold text-gray-900">
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
          className="w-full h-3 bg-gray-300 rounded-lg appearance-none cursor-pointer slider-black"
        />
      </div>

      {/* Speed Slider */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <span>⚡</span> Speed
          </label>
          <span className="text-lg font-bold text-gray-900">
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
          className="w-full h-3 bg-gray-300 rounded-lg appearance-none cursor-pointer slider-black"
        />
      </div>

      {/* Composition Selector */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          Composition Type
        </label>
        <div className="grid grid-cols-2 gap-2">
          {(['iron', 'stony', 'carbonaceous', 'comet'] as const).map((comp) => (
            <button
              key={comp}
              onClick={() => onParameterChange({ composition: comp })}
              className={`px-4 py-3 rounded-lg font-medium transition-all ${
                parameters.composition === comp
                  ? 'bg-gray-800 text-white shadow-lg'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {comp.charAt(0).toUpperCase() + comp.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Location Display */}
      {parameters.location.lat !== 0 && parameters.location.lng !== 0 && (
        <div className="pt-4 border-t border-gray-200">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            📍 Impact Coordinates
          </label>
          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg space-y-1">
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
