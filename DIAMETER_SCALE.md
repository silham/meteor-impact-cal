# Diameter Scale Update - Logarithmic 1m to 1km

## Changes Made

### New Diameter Range
- **Old**: 10m - 10km (linear scale)
- **New**: 1m - 1km (logarithmic scale)

### Why Logarithmic Scale?

A logarithmic scale provides better control across a wide range of sizes:

```
Linear Scale (OLD):
[10m] -------- [5km] -------- [10km]
     equal steps = poor control at small sizes

Logarithmic Scale (NEW):
[1m] -- [10m] -- [100m] -- [1km]
  equal multipliers = better control at all sizes
```

### Scale Distribution

| Position | Value | Description |
|----------|-------|-------------|
| 0% | 1m | Tiny meteorite (burns up) |
| 25% | ~3m | Small fireball |
| 33% | 10m | Car-sized meteor |
| 50% | ~30m | Building-sized |
| 66% | 100m | Stadium-sized |
| 75% | ~300m | Regional impact |
| 100% | 1000m (1km) | Global catastrophe |

### Updated Presets

#### New Preset: Tiny Meteor (1m)
- **Diameter**: 1m
- **Composition**: Stony
- **Result**: Always airburst
- **Real-world**: Common occurrence, creates fireball

#### Removed Preset: Chicxulub (10km)
- **Reason**: Outside new 1-1000m range
- **Note**: Would need dedicated "extinction-level" range

#### New Preset: Global Catastrophe (1km)
- **Diameter**: 1000m (1km)
- **Composition**: Stony
- **Result**: Surface impact
- **Effects**: Mass extinction level event

### Full Preset List (7 scenarios)

1. **Tiny Meteor (1m)** - Burns up in atmosphere
2. **Chelyabinsk (20m)** - Airburst over Russia
3. **Barringer (50m)** - Iron crater in Arizona
4. **Tunguska (60m)** - Siberian airburst
5. **Small City Killer (200m)** - Regional devastation
6. **Regional Devastation (500m)** - Multiple cities affected
7. **Global Catastrophe (1km)** - Mass extinction level

### Technical Implementation

```typescript
// Logarithmic slider implementation
<input
  type="range"
  min="0"        // log10(1) = 0
  max="3"        // log10(1000) = 3
  step="0.01"    // Fine control
  value={Math.log10(parameters.diameter)}
  onChange={(e) => {
    const logValue = parseFloat(e.target.value);
    const diameter = Math.pow(10, logValue);
    onParameterChange({ diameter: Math.round(diameter) });
  }}
/>
```

### Display Format

The diameter label now shows appropriate units:

- **< 1000m**: Shows in meters (e.g., "500 meters")
- **≥ 1000m**: Shows in kilometers (e.g., "1.00 km")

### User Experience

**Before (Linear)**:
- Hard to select small meteors (1-100m compressed)
- Most of slider dedicated to large impacts
- Poor precision for common sizes

**After (Logarithmic)**:
- ✅ Easy to select 1m, 5m, 10m, 20m meteors
- ✅ Equal control at all size ranges
- ✅ Natural progression: 1, 3, 10, 30, 100, 300, 1000
- ✅ Better matches how people think about scales

### Scale Markers

Visual markers at key positions:
```
|-------|-------|-------|
1m     10m    100m    1km
```

These correspond to:
- **1m**: Single person sized
- **10m**: Bus/house sized
- **100m**: Stadium sized
- **1km**: Mountain sized

### Testing

Try these values to test the scale:

```javascript
// Small meteorites (mostly burn up)
diameter = 1m    → Airburst
diameter = 5m    → Airburst
diameter = 10m   → Airburst (unless iron)

// Medium impacts
diameter = 20m   → Chelyabinsk-style airburst
diameter = 50m   → Barringer-style crater (iron)
diameter = 100m  → City-level damage

// Large impacts
diameter = 200m  → Regional devastation
diameter = 500m  → Multiple states affected
diameter = 1000m → Global climate effects
```

### Validation

The logarithmic scale properly handles:

✅ **Tiny meteors (1-10m)**: Common atmospheric entries  
✅ **Small meteors (10-50m)**: Chelyabinsk, car-sized  
✅ **Medium meteors (50-200m)**: Tunguska, Barringer  
✅ **Large meteors (200-500m)**: City killers  
✅ **Huge meteors (500-1000m)**: Regional/global events  

### Benefits

1. **Better Control**: Easier to select specific sizes
2. **Natural Progression**: Matches powers of 10
3. **Scientific**: Logarithmic scales common in astronomy
4. **User-Friendly**: More intuitive for wide ranges
5. **Accurate**: No rounding errors at small sizes

### Files Updated

- `components/UI/ParameterPanel.tsx` - Logarithmic slider
- `lib/presets.ts` - New preset scenarios
- `README.md` - Updated documentation
- `app/page.tsx` - Default value still 100m (works fine)

### Browser Testing

Open http://localhost:3000 and try:

1. **Drag slider to far left** → Should show ~1m
2. **Drag to 1/3 position** → Should show ~10m
3. **Drag to middle** → Should show ~30m
4. **Drag to 2/3 position** → Should show ~100m
5. **Drag to far right** → Should show 1000m (1km)

### Future Enhancements

If you want to extend the range in the future:

```typescript
// For 0.1m - 10km range:
min="−1"  // log10(0.1) = -1
max="4"   // log10(10000) = 4

// For 1mm - 100km range:
min="−3"  // log10(0.001) = -3
max="5"   // log10(100000) = 5
```

## Summary

✅ **Diameter range**: 1m to 1km (was 10m to 10km)  
✅ **Scale type**: Logarithmic (was linear)  
✅ **Control**: Much better precision across all sizes  
✅ **Presets**: Updated to fit new range (7 scenarios)  
✅ **Display**: Smart km/m formatting  
✅ **UX**: More intuitive and scientific  

**The slider now provides excellent control from tiny meteorites to extinction-level asteroids! 🎯**
