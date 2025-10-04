import { ImpactCalculator } from './impactCalculator';
import { MeteorParameters } from '@/types/impact.types';

// Test cases to verify airburst vs surface impact determination
// All tests now use fixed 45° impact angle (most probable)
const testCases: Array<{name: string, params: Omit<MeteorParameters, 'location'>, expected: 'airburst' | 'surface'}> = [
  {
    name: "Chelyabinsk - Small stony meteor (should be airburst)",
    params: {
      diameter: 20,
      velocity: 19,
      composition: 'stony',
    },
    expected: 'airburst'
  },
  {
    name: "Tunguska - Medium comet (should be airburst)",
    params: {
      diameter: 60,
      velocity: 15,
      composition: 'comet',
    },
    expected: 'airburst'
  },
  {
    name: "Barringer Crater - Small iron meteor (should be surface)",
    params: {
      diameter: 50,
      velocity: 12.8,
      composition: 'iron',
    },
    expected: 'surface'
  },
  {
    name: "Large stony meteor 200m (should be surface)",
    params: {
      diameter: 200,
      velocity: 20,
      composition: 'stony',
    },
    expected: 'surface'
  },
  {
    name: "Huge stony meteor 1000m (should be surface)",
    params: {
      diameter: 1000,
      velocity: 20,
      composition: 'stony',
    },
    expected: 'surface'
  },
  {
    name: "Chicxulub - 10km asteroid (should be surface)",
    params: {
      diameter: 10000,
      velocity: 20,
      composition: 'stony',
    },
    expected: 'surface'
  },
  {
    name: "Very small comet 5m (should be airburst)",
    params: {
      diameter: 5,
      velocity: 30,
      composition: 'comet',
    },
    expected: 'airburst'
  },
  {
    name: "Medium iron meteor 100m (should be surface)",
    params: {
      diameter: 100,
      velocity: 15,
      composition: 'iron',
    },
    expected: 'surface'
  },
  {
    name: "Medium carbonaceous 80m (should be airburst)",
    params: {
      diameter: 80,
      velocity: 25,
      composition: 'carbonaceous',
    },
    expected: 'airburst'
  },
];

export function runTests() {
  console.log('🧪 Running Impact Calculator Tests (45° angle assumed)...\n');
  
  let passed = 0;
  let failed = 0;

  testCases.forEach((test) => {
    const params: MeteorParameters = {
      ...test.params,
      location: { lat: 0, lng: 0 }
    };

    const result = ImpactCalculator.calculateImpact(params);
    const success = result.impactType === test.expected;

    if (success) {
      console.log(`✅ PASS: ${test.name}`);
      console.log(`   Result: ${result.impactType}, Energy: ${result.energyTNT.toFixed(2)} Mt, Crater: ${result.craterDiameter.toFixed(0)}m\n`);
      passed++;
    } else {
      console.log(`❌ FAIL: ${test.name}`);
      console.log(`   Expected: ${test.expected}, Got: ${result.impactType}`);
      console.log(`   Energy: ${result.energyTNT.toFixed(2)} Mt, Crater: ${result.craterDiameter.toFixed(0)}m\n`);
      failed++;
    }
  });

  console.log(`\n📊 Results: ${passed} passed, ${failed} failed out of ${testCases.length} tests`);
  
  if (failed === 0) {
    console.log('🎉 All tests passed!');
  }

  return { passed, failed, total: testCases.length };
}

// Run tests if this file is executed directly
if (typeof window === 'undefined') {
  runTests();
}
