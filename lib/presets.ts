import { PresetScenario } from '@/types/impact.types';

export const PRESET_SCENARIOS: PresetScenario[] = [
  {
    name: 'Tiny Meteor (1m)',
    description: '1m meteorite - burns up in atmosphere',
    parameters: {
      diameter: 1,
      velocity: 17,
      impactAngle: 45,
      composition: 'stony',
    },
  },
  {
    name: 'Chelyabinsk Meteor (2013)',
    description: '20m stony meteor airburst over Russia',
    parameters: {
      diameter: 20,
      velocity: 19,
      impactAngle: 18,
      composition: 'stony',
    },
  },
  {
    name: 'Barringer Crater (50,000 years ago)',
    description: '50m iron meteorite in Arizona',
    parameters: {
      diameter: 50,
      velocity: 12.8,
      impactAngle: 45,
      composition: 'iron',
    },
  },
  {
    name: 'Tunguska Event (1908)',
    description: '60m comet airburst over Siberia',
    parameters: {
      diameter: 60,
      velocity: 15,
      impactAngle: 45,
      composition: 'comet',
    },
  },
  {
    name: 'Small City Killer',
    description: 'Hypothetical 200m asteroid',
    parameters: {
      diameter: 200,
      velocity: 17,
      impactAngle: 45,
      composition: 'stony',
    },
  },
  {
    name: 'Regional Devastation',
    description: 'Hypothetical 500m asteroid',
    parameters: {
      diameter: 500,
      velocity: 20,
      impactAngle: 45,
      composition: 'stony',
    },
  },
  {
    name: 'Global Catastrophe',
    description: '1km asteroid - mass extinction level',
    parameters: {
      diameter: 1000,
      velocity: 20,
      impactAngle: 60,
      composition: 'stony',
    },
  },
];
