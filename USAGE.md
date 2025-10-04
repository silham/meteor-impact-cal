# Meteor Impact Simulator - User Guide

## Getting Started

### Installation
```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## How to Use

### 1. Select Impact Location
- Click anywhere on the interactive world map to choose where the meteor will impact
- The map will zoom to your selected location
- A marker will appear at the impact point

### 2. Choose Impact Parameters

#### Quick Start with Presets
Select from famous historical impacts:
- **Tunguska Event (1908)**: 60m comet airburst that flattened 2,000 km² of Siberian forest
- **Chelyabinsk Meteor (2013)**: 20m stony meteor that exploded over Russia
- **Chicxulub Impact**: 10km asteroid that caused the dinosaur extinction
- **Barringer Crater**: 50m iron meteorite that created Arizona's famous crater
- **Small City Killer**: Hypothetical 200m asteroid scenario

#### Custom Parameters
Adjust sliders to customize your meteor:

**Diameter (10m - 10km)**
- Small (10-100m): City-scale damage
- Medium (100-1000m): Regional devastation
- Large (1-10km): Global catastrophe

**Velocity (11-72 km/s)**
- 11 km/s: Minimum Earth escape velocity
- 20 km/s: Average asteroid impact speed
- 72 km/s: Maximum possible (head-on collision)

**Impact Angle (15-90°)**
- 15°: Grazing impact (elongated crater)
- 45°: Most common angle
- 90°: Vertical impact (maximum energy transfer)

**Composition**
- Iron (7,800 kg/m³): Dense, creates deeper craters
- Stony (3,000 kg/m³): Most common type
- Carbonaceous (2,000 kg/m³): Primitive material
- Comet Ice (1,000 kg/m³): Often causes airburst

### 3. Understand the Results

#### Impact Type
- **Airburst**: Meteor explodes in atmosphere (like Tunguska)
- **Surface Impact**: Meteor reaches ground and creates crater

#### Energy Released
Measured in megatons (Mt) of TNT equivalent
- 1 Mt = 1 million tons of TNT
- Hiroshima bomb ≈ 0.015 Mt
- Large volcano ≈ 1,000 Mt

#### Crater Size
Only for surface impacts
- Diameter shown in meters and kilometers
- Depth approximately 1/3 of diameter

#### Seismic Magnitude
Richter scale equivalent:
- 3.0-4.0: Often felt, rarely causes damage
- 5.0-6.0: Slight damage to buildings
- 7.0-8.0: Serious damage over large areas
- 9.0+: Devastating effects

#### Damage Zones

**🟤 Crater (Brown)**
- Complete vaporization
- Only shown for surface impacts

**🟠 Thermal Radiation (Orange)**
- 3rd degree burns to exposed skin
- Ignition of flammable materials
- Can cause fires up to this radius

**🔴 20 psi Overpressure (Dark Red)**
- Heavily reinforced concrete buildings severely damaged
- Near-total fatalities
- Maximum damage zone

**🟡 5 psi Overpressure (Tomato Red)**
- Most residential buildings collapse
- Widespread fatalities
- Serious injuries to survivors

**🟡 1 psi Overpressure (Gold)**
- Glass windows shatter
- Some injuries from flying debris
- Minor structural damage

## Understanding the Physics

### Energy Calculation
The kinetic energy of the meteor is calculated using:
```
E = ½mv²
```
Where:
- m = mass (calculated from diameter and density)
- v = velocity

### Airburst vs Surface Impact
The simulator determines if the meteor will explode in the air or reach the ground based on:
- Meteor strength (composition)
- Atmospheric deceleration
- Impact angle

### Crater Formation
For surface impacts, crater size depends on:
- Impactor energy
- Impact angle
- Target material properties
- Gravity

## Example Scenarios

### Scenario 1: Urban Impact
1. Click on New York City
2. Set diameter to 50m
3. Set velocity to 17 km/s
4. Choose "stony" composition
5. Observe city-wide devastation

### Scenario 2: Ocean Impact
1. Click in the middle of the Pacific Ocean
2. Use "Chicxulub Impact" preset
3. Note the massive energy release
4. This would cause global tsunamis and climate change

### Scenario 3: Desert Impact
1. Click on the Sahara Desert
2. Set diameter to 100m
3. Choose "iron" composition
4. Compare crater size to familiar landmarks

## Tips for Accurate Results

1. **Use realistic values**: Most asteroids are 10-100m in diameter
2. **Consider composition**: Stony asteroids are most common (~94%)
3. **Average velocity**: 20 km/s is typical for asteroids
4. **Most likely angle**: 45° impacts are most common statistically

## Known Limitations

- Does not model tsunami effects for ocean impacts
- Does not calculate global climate effects
- Assumes flat terrain
- Simplified atmospheric model
- Does not account for meteor fragmentation

## Scientific Basis

This simulator uses peer-reviewed equations from:
- Collins, G.S., Melosh, H.J., Marcus, R.A. (2005)
- Earth Impact Effects Program (Imperial College London / Purdue University)

## Troubleshooting

**Map not loading?**
- Check your internet connection (map tiles load from OpenStreetMap)
- Try refreshing the page

**No impact zones showing?**
- Make sure you've clicked on the map to select a location
- Check that parameters are set to reasonable values

**Performance issues?**
- Try reducing map zoom level
- Close other browser tabs
- Use a modern browser (Chrome, Firefox, Edge, Safari)

## Educational Use

This simulator is designed for:
- Science education
- Risk assessment training
- Public awareness of asteroid impacts
- NASA Space Apps Challenge projects

## Credits

- Physics: Earth Impact Effects Program
- Maps: OpenStreetMap contributors
- Framework: Next.js, React, TypeScript
- Mapping: Leaflet
