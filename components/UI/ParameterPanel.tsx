'use client';

import { MeteorParameters } from '@/types/impact.types';
import { PRESET_SCENARIOS } from '@/lib/presets';

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
    <div className="bg-white p-6 rounded-lg shadow-lg space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Meteor Parameters
      </h2>

      {/* Preset Scenarios */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          Preset Scenarios
        </label>
        <select
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          onChange={(e) => handlePresetSelect(e.target.value)}
          defaultValue=""
        >
          <option value="" disabled>
            Select a preset scenario...
          </option>
          {PRESET_SCENARIOS.map((preset) => (
            <option key={preset.name} value={preset.name}>
              {preset.name}
            </option>
          ))}
        </select>
      </div>

      {/* Diameter - Logarithmic scale for better control */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          Diameter: {parameters.diameter >= 1000 
            ? `${(parameters.diameter / 1000).toFixed(2)} km` 
            : `${parameters.diameter.toLocaleString()} meters`}
        </label>
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
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>1m</span>
          <span>10m</span>
          <span>100m</span>
          <span>1km</span>
        </div>
      </div>

      {/* Velocity */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          Velocity: {parameters.velocity.toFixed(1)} km/s
        </label>
        <input
          type="range"
          min="11"
          max="72"
          step="0.5"
          value={parameters.velocity}
          onChange={(e) =>
            onParameterChange({ velocity: parseFloat(e.target.value) })
          }
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>11 km/s</span>
          <span>72 km/s</span>
        </div>
      </div>

      {/* Impact Angle */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          Impact Angle: {parameters.impactAngle}°
        </label>
        <input
          type="range"
          min="15"
          max="90"
          step="5"
          value={parameters.impactAngle}
          onChange={(e) =>
            onParameterChange({ impactAngle: parseFloat(e.target.value) })
          }
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>15° (grazing)</span>
          <span>90° (vertical)</span>
        </div>
      </div>

      {/* Composition */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          Composition
        </label>
        <select
          value={parameters.composition}
          onChange={(e) =>
            onParameterChange({
              composition: e.target.value as MeteorParameters['composition'],
            })
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="iron">Iron (7,800 kg/m³)</option>
          <option value="stony">Stony (3,000 kg/m³)</option>
          <option value="carbonaceous">Carbonaceous (2,000 kg/m³)</option>
          <option value="comet">Comet Ice (1,000 kg/m³)</option>
        </select>
      </div>

      {/* Location Display */}
      {parameters.location.lat !== 0 && parameters.location.lng !== 0 && (
        <div className="pt-4 border-t border-gray-200">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Impact Location
          </label>
          <div className="text-sm text-gray-600 space-y-1">
            <p>
              Latitude: {parameters.location.lat.toFixed(4)}°
            </p>
            <p>
              Longitude: {parameters.location.lng.toFixed(4)}°
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
