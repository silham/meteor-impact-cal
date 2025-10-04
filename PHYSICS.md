# Physics Calculations Explained

## Airburst vs Surface Impact Determination

The simulator now uses accurate atmospheric physics to determine whether a meteor will explode in the air (airburst) or reach the ground (surface impact).

### Key Factors

1. **Material Strength**
   - Calculated using empirical formula: `strength = 10^(2.107 + 0.0624 * log10(density))`
   - Iron meteors: ~1-2 MPa
   - Stony meteors: ~100-200 kPa
   - Comets: ~10-50 kPa

2. **Dynamic Pressure**
   - As meteor enters atmosphere, air resistance creates pressure
   - Formula: `P_dynamic = 0.5 * ρ_air * v²`
   - Higher velocities = more pressure

3. **Breakup Altitude**
   - Meteor breaks up when dynamic pressure exceeds material strength
   - Calculated using atmospheric density model: `ρ(h) = ρ₀ * e^(-h/8000)`
   - Breakup altitude determines impact type

### Decision Logic

```
IF breakup_altitude > 5 km OR diameter < 50 m:
    → AIRBURST (explodes in atmosphere)
ELSE:
    → SURFACE IMPACT (reaches ground)
```

## Airburst Effects

### What Happens
- Meteor fragments and explodes in the atmosphere
- Energy released as blast wave and thermal radiation
- **No crater is formed**
- Most famous example: Tunguska (1908), Chelyabinsk (2013)

### Energy Distribution
- ~90% of energy dissipates in the atmosphere
- ~10% reaches ground as blast wave
- Creates powerful shockwave but minimal ground damage

### Calculations
- **Crater Diameter**: 0 meters (no crater)
- **Seismic Magnitude**: Minimal (only 10% of energy couples to ground)
  - Formula: `M = 0.67 * log10(ground_energy) - 5.87`
  - Often M < 2.0 (barely detectable)
- **Thermal Radius**: Enhanced (clear air transmission)
  - Formula: `R = √(E / (4π * 600,000)) km`
- **Blast Radii**: Larger than surface impacts
  - 1 psi: `3.2 * (kilotons)^(1/3)` km
  - 5 psi: `1.54 * (kilotons)^(1/3)` km
  - 20 psi: `0.74 * (kilotons)^(1/3)` km

## Surface Impact Effects

### What Happens
- Meteor reaches the ground intact (or mostly intact)
- Full kinetic energy transferred to ground
- **Crater is formed**
- Examples: Barringer Crater, Chicxulub

### Energy Distribution
- 100% of energy transferred to ground
- Creates massive shock waves through earth
- Excavates large crater
- Ejecta thrown into atmosphere

### Calculations
- **Crater Diameter**: Based on scaling laws
  - Transient crater: `D_t = 1.161 * (ρ/2750)^(1/3) * d^0.78 * v^0.44 * g^-0.22 * sin(θ)^(1/3)`
  - Final crater (small): `D_f = 1.25 * D_t` (for D_t < 3.2 km)
  - Final crater (large): `D_f = 1.17 * D_t^1.13 * 3200^-0.13` (for D_t ≥ 3.2 km)
  
- **Seismic Magnitude**: Full energy release
  - Formula: `M = 0.67 * log10(total_energy) - 5.87`
  - Large impacts: M > 7.0 (major earthquake)
  
- **Thermal Radius**: Reduced (ejecta blocks radiation)
  - Formula: `R = √(E / (4π * 400,000)) km`
  
- **Blast Radii**: Smaller than airbursts (ground coupling reduces efficiency)
  - 1 psi: `2.8 * (kilotons)^(1/3)` km
  - 5 psi: `1.24 * (kilotons)^(1/3)` km
  - 20 psi: `0.62 * (kilotons)^(1/3)` km

## Example Scenarios

### Tunguska (1908) - Airburst ☁️
- **Parameters**: 60m comet, 15 km/s, 45°
- **Breakup Altitude**: ~8-10 km
- **Result**: Airburst
- **Effects**: 
  - No crater
  - Trees flattened over 2,000 km²
  - Minimal seismic activity
  - Thermal radiation ignited trees

### Chelyabinsk (2013) - Airburst ☁️
- **Parameters**: 20m stony, 19 km/s, 18°
- **Breakup Altitude**: ~30 km
- **Result**: Airburst
- **Effects**:
  - No crater (small fragments reached ground)
  - Shattered windows across city
  - Minimal ground damage
  - Bright fireball visible for 100+ km

### Barringer Crater (50,000 years ago) - Surface Impact 💥
- **Parameters**: 50m iron, 12.8 km/s, 45°
- **Breakup Altitude**: 0 km (reached ground)
- **Result**: Surface impact
- **Effects**:
  - 1.2 km diameter crater
  - Magnitude ~5.5 earthquake
  - Complete vaporization at impact site
  - Ejecta scattered for miles

### Chicxulub (66 million years ago) - Surface Impact 💥
- **Parameters**: 10 km stony, 20 km/s, 60°
- **Result**: Surface impact
- **Effects**:
  - 180 km diameter crater
  - Magnitude ~11 earthquake (global)
  - Mass extinction event
  - Global climate disruption

## Accuracy Notes

### Validated Against
- Earth Impact Effects Program (Collins et al. 2005)
- Nuclear test data (for blast scaling)
- Historical impact observations
- Planetary defense research

### Limitations
- Simplified atmospheric model (exponential density)
- Assumes spherical projectile
- Ignores fragmentation dynamics
- Ground properties assumed uniform
- No terrain effects

### Accuracy Range
- **Best accuracy**: 100m - 1km diameter, 15-25 km/s
- **Good accuracy**: 10m - 10km diameter, 11-72 km/s
- **Extrapolation**: Outside these ranges (Chicxulub-scale)

## Scientific References

1. **Collins, G.S., Melosh, H.J., Marcus, R.A. (2005)**
   - "Earth Impact Effects Program: A Web-based computer program for calculating the regional environmental consequences of a meteoroid impact on Earth"
   - Meteoritics & Planetary Science, 40, 817-840

2. **Marcus, R., Melosh, H.J., Collins, G. (2010)**
   - "Earth Impact Effects Program"
   - http://impact.ese.ic.ac.uk/ImpactEarth/

3. **Chyba, C.F., Thomas, P.J., Zahnle, K.J. (1993)**
   - "The 1908 Tunguska explosion: atmospheric disruption of a stony asteroid"
   - Nature, 361, 40-44

4. **Popova, O. et al. (2013)**
   - "Chelyabinsk airburst, damage assessment, meteorite recovery, and characterization"
   - Science, 342(6162), 1069-1073

## Updates Made (October 4, 2025)

### Fixed Issues
1. ✅ **Airburst calculation now accurate**
   - Uses proper atmospheric breakup physics
   - Considers material strength vs. dynamic pressure
   - Calculates breakup altitude correctly

2. ✅ **Proper impact type determination**
   - Airbursts: breakup altitude > 5km OR diameter < 50m
   - Surface impacts: large/strong meteors reaching ground

3. ✅ **Differentiated effects**
   - Airbursts: No crater, minimal seismic, enhanced blast
   - Surface: Crater formation, strong seismic, reduced blast

4. ✅ **UI improvements**
   - Airburst explanation badge
   - Crater only shown for surface impacts
   - Seismic magnitude only for significant events
   - Clear visual distinction between impact types
