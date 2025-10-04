'use client';

import { useEffect } from 'react';
import { ImpactCalculator } from '@/lib/impactCalculator';

export default function TestCalculations() {
  useEffect(() => {
    console.log('🧪 Testing Impact Calculations (45° angle assumed)...\n');

    // Test 1: Large meteor (1000m stony) - MUST be surface impact
    const large = ImpactCalculator.calculateImpact({
      diameter: 1000,
      velocity: 20,
      composition: 'stony',
      location: { lat: 0, lng: 0 },
    });
    console.log('Test 1 - 1000m stony meteor:');
    console.log(`  Type: ${large.impactType} (should be 'surface')`);
    console.log(`  Energy: ${large.energyTNT.toFixed(2)} Mt`);
    console.log(`  Crater: ${(large.craterDiameter / 1000).toFixed(2)} km`);
    console.log('  ✅' + (large.impactType === 'surface' ? ' PASS' : ' ❌ FAIL'));
    console.log('');

    // Test 2: Chicxulub (10km) - MUST be surface impact
    const chicxulub = ImpactCalculator.calculateImpact({
      diameter: 10000,
      velocity: 20,
      composition: 'stony',
      location: { lat: 0, lng: 0 },
    });
    console.log('Test 2 - Chicxulub (10km):');
    console.log(`  Type: ${chicxulub.impactType} (should be 'surface')`);
    console.log(`  Energy: ${chicxulub.energyTNT.toFixed(0)} Mt`);
    console.log(`  Crater: ${(chicxulub.craterDiameter / 1000).toFixed(1)} km`);
    console.log('  ✅' + (chicxulub.impactType === 'surface' ? ' PASS' : ' ❌ FAIL'));
    console.log('');

    // Test 3: Chelyabinsk (20m stony) - should be airburst
    const chelyabinsk = ImpactCalculator.calculateImpact({
      diameter: 20,
      velocity: 19,
      composition: 'stony',
      location: { lat: 0, lng: 0 },
    });
    console.log('Test 3 - Chelyabinsk (20m stony):');
    console.log(`  Type: ${chelyabinsk.impactType} (should be 'airburst')`);
    console.log(`  Energy: ${chelyabinsk.energyTNT.toFixed(4)} Mt`);
    console.log(`  Crater: ${chelyabinsk.craterDiameter.toFixed(0)} m`);
    console.log('  ✅' + (chelyabinsk.impactType === 'airburst' ? ' PASS' : ' ❌ FAIL'));
    console.log('');

    // Test 4: Tunguska (60m comet) - should be airburst
    const tunguska = ImpactCalculator.calculateImpact({
      diameter: 60,
      velocity: 15,
      composition: 'comet',
      location: { lat: 0, lng: 0 },
    });
    console.log('Test 4 - Tunguska (60m comet):');
    console.log(`  Type: ${tunguska.impactType} (should be 'airburst')`);
    console.log(`  Energy: ${tunguska.energyTNT.toFixed(2)} Mt`);
    console.log(`  Crater: ${tunguska.craterDiameter.toFixed(0)} m`);
    console.log('  ✅' + (tunguska.impactType === 'airburst' ? ' PASS' : ' ❌ FAIL'));
    console.log('');

    // Test 5: Barringer (50m iron) - should be surface
    const barringer = ImpactCalculator.calculateImpact({
      diameter: 50,
      velocity: 12.8,
      composition: 'iron',
      location: { lat: 0, lng: 0 },
    });
    console.log('Test 5 - Barringer (50m iron):');
    console.log(`  Type: ${barringer.impactType} (should be 'surface')`);
    console.log(`  Energy: ${barringer.energyTNT.toFixed(4)} Mt`);
    console.log(`  Crater: ${(barringer.craterDiameter / 1000).toFixed(2)} km`);
    console.log('  ✅' + (barringer.impactType === 'surface' ? ' PASS' : ' ❌ FAIL'));
    console.log('');

    // Test 6: 500m iron - MUST be surface
    const large2 = ImpactCalculator.calculateImpact({
      diameter: 500,
      velocity: 17,
      composition: 'iron',
      location: { lat: 0, lng: 0 },
    });
    console.log('Test 6 - 500m iron meteor:');
    console.log(`  Type: ${large2.impactType} (should be 'surface')`);
    console.log(`  Energy: ${large2.energyTNT.toFixed(0)} Mt`);
    console.log(`  Crater: ${(large2.craterDiameter / 1000).toFixed(2)} km`);
    console.log('  ✅' + (large2.impactType === 'surface' ? ' PASS' : ' ❌ FAIL'));
    console.log('');

    console.log('🎯 Check the console above to verify all tests pass!');
  }, []);

  return null;
}
