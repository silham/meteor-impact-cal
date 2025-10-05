import { MeteorParameters, ImpactResults } from '@/types/impact.types';

export class ImpactCalculator {
  private static readonly DENSITIES = {
    iron: 7800,
    stony: 3000,
    carbonaceous: 2000,
    comet: 1000,
  };

  // Atmospheric constants
  private static readonly AIR_DENSITY_SEA_LEVEL = 1.29; // kg/m³
  private static readonly SCALE_HEIGHT = 8000; // meters
  private static readonly GRAVITY = 9.81; // m/s²

  static calculateImpact(params: MeteorParameters): ImpactResults {
    const density = this.DENSITIES[params.composition];
    // Use 45° as the most probable impact angle (sin(45°) = 0.707)
    // This is statistically the most common angle for random impacts
    const angleRad = Math.PI / 4; // 45 degrees in radians

    // Mass: spherical volume × density (kg)
    const radius = params.diameter / 2;
    const volume = (4 / 3) * Math.PI * Math.pow(radius, 3);
    const mass = volume * density;

    // Kinetic energy: E = ½mv² (Joules)
    const velocityMs = params.velocity * 1000; // convert km/s to m/s
    const energy = 0.5 * mass * Math.pow(velocityMs, 2);
    const energyMegatons = energy / 4.18e15;

    // Determine if airburst or surface impact using proper physics
    // Based on Collins et al. 2005 and Hills & Goda 1993
    
    // Step 1: Calculate material strength (Pa)
    // Empirical formula from Collins et al. 2005
    const strength = Math.pow(10, 2.107 + 0.0624 * Math.log10(density));

    // Step 2: Calculate the atmospheric density needed to break up the meteor
    // Breakup occurs when ram pressure exceeds strength: ρ_air * v² ≥ strength
    const criticalAirDensity = strength / Math.pow(velocityMs, 2);

    // Step 3: Calculate breakup altitude
    // ρ(h) = ρ₀ * exp(-h/H)
    let breakupAltitude: number;
    if (criticalAirDensity >= this.AIR_DENSITY_SEA_LEVEL) {
      // Meteor would break up at or below sea level - definitely reaches ground
      breakupAltitude = 0;
    } else {
      // Calculate altitude where air density equals critical density
      breakupAltitude = -this.SCALE_HEIGHT * Math.log(criticalAirDensity / this.AIR_DENSITY_SEA_LEVEL);
    }

    // Step 4: Calculate the dispersion length (how much fragments spread)
    // L_d = H * ρ₀ / (C_d * ρ_m * sin(θ))
    const dragCoefficient = 2.0;
    // Note: dispersion length calculation - used for theoretical reference
    // const dispersionLength = this.SCALE_HEIGHT * this.AIR_DENSITY_SEA_LEVEL / 
    //                          (dragCoefficient * density * Math.sin(angleRad));

    // Step 5: Determine if meteor reaches ground intact
    // If dispersion length >> diameter, fragments separate and airburst
    // If dispersion length << diameter, reaches ground as coherent mass
    
    // Critical ratio from Hills & Goda (1993): 
    // Airburst if: breakup_altitude / dispersion_length > 3 * diameter
    // Note: impact parameter calculation - used for theoretical reference
    // const impactParameter = breakupAltitude / (params.diameter * Math.sin(angleRad));
    
    // More sophisticated determination:
    // 1. Very large meteors (>200m) almost always reach ground
    // 2. Very small meteors (<20m) usually airburst
    // 3. Medium meteors depend on strength, velocity, and angle
    
    let isAirburst: boolean;
    
    if (params.diameter > 200) {
      // Large meteors (>200m) always reach ground
      isAirburst = false;
    } else if (params.diameter < 10) {
      // Very small meteors (<10m) always airburst
      isAirburst = true;
    } else {
      // Medium meteors: use physics-based determination
      // Airburst if meteor breaks up high enough that fragments disperse
      // Formula from Collins et al. 2005: compare breakup altitude to penetration depth
      const penetrationDepth = (density * params.diameter * Math.sin(angleRad)) / 
                               (dragCoefficient * this.AIR_DENSITY_SEA_LEVEL);
      
      // If penetration depth > breakup altitude, reaches ground
      // If breakup altitude > 2 * penetration depth, definitely airburst
      if (breakupAltitude === 0 || penetrationDepth > breakupAltitude * 2) {
        isAirburst = false; // Reaches ground
      } else if (breakupAltitude > penetrationDepth * 3) {
        isAirburst = true; // High altitude airburst
      } else {
        // Marginal case - check if fragments can survive
        // Iron meteors more likely to survive, comets more likely to airburst
        const survivalFactor = density / 3000; // normalized to stony
        isAirburst = breakupAltitude > penetrationDepth * (1 + survivalFactor);
      }
    }

    if (isAirburst) {
      // Airburst calculations
      // For airbursts, most energy dissipates in atmosphere
      // Only ~10% reaches ground as blast wave
      const groundEnergy = energy * 0.1;
      
      // Seismic magnitude is minimal for airbursts (energy absorbed by atmosphere)
      const seismicMagnitude = groundEnergy > 0 
        ? Math.max(0, 0.67 * Math.log10(groundEnergy) - 5.87)
        : 0;

      // Thermal radiation (more efficient for airbursts in clear air)
      const thermalRadius = Math.pow(energy / (4 * Math.PI * 6e5), 0.5) / 1000;

      // Air blast radii (airburst produces larger blast zones)
      const kilotonsTNT = energyMegatons * 1000;
      
      return {
        impactType: 'airburst',
        craterDiameter: 0,
        energyTNT: energyMegatons,
        seismicMagnitude,
        thermalRadius,
        blastRadius: {
          // Airburst blast radii (scaling from nuclear airbursts)
          onePsi: Math.pow(kilotonsTNT, 1 / 3) * 3.2,
          fivePsi: Math.pow(kilotonsTNT, 1 / 3) * 1.54,
          twentyPsi: Math.pow(kilotonsTNT, 1 / 3) * 0.74,
        },
      };
    } else {
      // Surface impact calculations
      // Full energy transferred to ground
      
      // Seismic magnitude (full energy release)
      const seismicMagnitude = 0.67 * Math.log10(energy) - 5.87;

      // Crater formation using scaling laws
      const transientCrater =
        1.161 *
        Math.pow(density / 2750, 1 / 3) *
        Math.pow(params.diameter, 0.78) *
        Math.pow(velocityMs, 0.44) *
        Math.pow(9.81, -0.22) *
        Math.pow(Math.sin(angleRad), 1 / 3);

      // Final crater diameter (accounting for crater collapse)
      const finalCrater =
        transientCrater < 3200
          ? 1.25 * transientCrater
          : 1.17 * Math.pow(transientCrater, 1.13) * Math.pow(3200, -0.13);

      // Thermal radiation (less efficient for surface impacts due to ejecta)
      const thermalRadius = Math.pow(energy / (4 * Math.PI * 4e5), 0.5) / 1000;

      // Air blast radii (surface burst produces smaller blast zones)
      const kilotonsTNT = energyMegatons * 1000;

      return {
        impactType: 'surface',
        craterDiameter: finalCrater,
        energyTNT: energyMegatons,
        seismicMagnitude,
        thermalRadius,
        blastRadius: {
          // Surface impact blast radii (reduced due to ground coupling)
          onePsi: Math.pow(kilotonsTNT, 1 / 3) * 2.8,
          fivePsi: Math.pow(kilotonsTNT, 1 / 3) * 1.24,
          twentyPsi: Math.pow(kilotonsTNT, 1 / 3) * 0.62,
        },
      };
    }
  }
}
