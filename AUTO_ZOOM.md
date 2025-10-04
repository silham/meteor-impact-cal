# Auto-Zoom Feature Documentation

## Overview
The meteor impact simulator now includes an intelligent auto-zoom feature that automatically adjusts the map view to display all impact zones when a location is selected.

## Implementation Details

### How It Works
1. **Zone Bounds Calculation**: When impact zones are rendered, the system calculates the geographic bounds of each circular zone
2. **Bounds Aggregation**: All zone bounds are combined into a single bounding box
3. **Automatic Fitting**: The map automatically zooms and pans to fit all zones within the viewport

### Key Features

#### Smart Padding
- **50px padding** on all sides ensures zones aren't cut off at the edges
- Provides visual breathing room around the outermost impact zones

#### Maximum Zoom Constraint
- **maxZoom: 15** prevents excessive zoom for very small impacts
- Maintains geographical context even for tiny meteors (1-10m)
- Balances detail visibility with map readability

#### Smooth Animation
- **animate: true** with **0.5 second duration**
- Provides smooth, non-jarring transitions when changing parameters
- Enhances user experience during preset selection or manual adjustments

### Technical Implementation

```typescript
// Auto-zoom to fit all impact zones
const bounds = L.latLngBounds([]);

impactZones.forEach((zone) => {
  // Calculate the bounds of each circle
  const circle = L.circle([zone.lat, zone.lng], { radius: zone.radius });
  bounds.extend(circle.getBounds());
});

// Fit the map to show all zones with some padding
if (bounds.isValid()) {
  mapRef.current.fitBounds(bounds, {
    padding: [50, 50],
    maxZoom: 15,
    animate: true,
    duration: 0.5,
  });
}
```

### Zone Radius Handling

The auto-zoom feature works seamlessly across the entire diameter range:

| Meteor Diameter | Typical Largest Zone | Zoom Behavior |
|----------------|---------------------|---------------|
| 1m | ~10m (airburst thermal) | Zooms to city/neighborhood level |
| 10m | ~100m (airburst thermal) | Zooms to neighborhood level |
| 20m (Chelyabinsk) | ~20km (thermal radiation) | Zooms to city level |
| 60m (Tunguska) | ~40km (air blast) | Zooms to regional level |
| 200m (City Killer) | ~300km (crater ejecta) | Zooms to multi-state level |
| 500m (Regional) | ~800km (seismic effects) | Zooms to continental level |
| 1000m (Global) | ~1500km (crater ejecta) | Zooms to transcontinental level |

## User Experience Benefits

### 1. Automatic Context
- No manual zooming required after selecting impact location
- Immediately see the full extent of damage zones
- Especially useful when switching between presets

### 2. Scale Awareness
- Instantly understand the impact scale based on zoom level
- Small meteors (1-20m) show local neighborhood effects
- Large meteors (200-1000m) show continental-scale devastation

### 3. Parameter Comparison
- Easy comparison when adjusting diameter, velocity, or angle
- Watch the map zoom out as damage zones expand
- Visual feedback for physics changes

### 4. Preset Exploration
- Switching from "Tiny (1m)" to "Global (1km)" shows dramatic zoom difference
- Educational value in understanding scale differences
- Helps visualize historical events (Chelyabinsk, Tunguska, Barringer)

## Edge Cases Handled

### Very Small Impacts (1-5m)
- MaxZoom constraint prevents zooming too close
- Maintains street-level context
- Shows that even tiny meteors have measurable effects

### Very Large Impacts (500-1000m)
- Map zooms out to show entire continents
- Multiple impact zones (crater, air blast, seismic) all visible
- Clearly demonstrates global catastrophe potential

### Airburst vs Surface Impact
- Airburst: Typically shows thermal and air blast zones
- Surface Impact: Shows crater, ejecta, and seismic zones
- Auto-zoom adapts to different zone configurations

### Single Location, Multiple Parameters
- Smooth transitions when only changing meteor parameters
- Map re-centers and re-zooms with animation
- Prevents disorienting jumps

## Testing the Feature

### Test Scenarios

1. **Preset Comparison**
   - Select "Tiny (1m)" → Map zooms to neighborhood
   - Switch to "Global (1km)" → Map zooms out to show continent
   - Verify all zones visible in both cases

2. **Manual Parameter Adjustment**
   - Select location (e.g., New York City)
   - Start at 1m diameter → Observe tight zoom
   - Slide to 1000m diameter → Watch map zoom out smoothly
   - Confirm largest zone (seismic/ejecta) is fully visible

3. **Angle and Velocity Impact**
   - Select location
   - Set diameter to 100m
   - Change angle from 90° to 15° → Observe zone changes
   - Verify map re-zooms to accommodate new zone sizes

4. **Different Locations**
   - Select location in ocean
   - Select location on land
   - Select location near poles
   - Verify auto-zoom works correctly in all cases

### Expected Behavior

✅ **Correct**: All impact zones visible with padding  
✅ **Correct**: Smooth 0.5s animation between zooms  
✅ **Correct**: Never zooms in beyond level 15  
✅ **Correct**: Marker remains visible at center  

❌ **Incorrect**: Zones cut off at edge of map  
❌ **Incorrect**: Jarring instant zoom changes  
❌ **Incorrect**: Over-zooming for small impacts  
❌ **Incorrect**: Marker not visible after zoom  

## Performance Considerations

### Efficiency
- Bounds calculation is O(n) where n = number of zones (typically 3-7)
- Temporary circles created for bounds only, not added to map
- Minimal performance impact even with many zones

### Memory Usage
- Temporary circle objects are garbage collected
- No memory leaks from bounds calculation
- Efficient use of Leaflet's native fitBounds API

## Future Enhancements

Potential improvements for future versions:

1. **User Control Option**
   - Toggle to disable auto-zoom
   - Allow manual zoom preference to persist
   - "Fit to zones" button for manual trigger

2. **Smart Zoom Levels**
   - Different maxZoom based on meteor size
   - Adaptive padding based on screen size
   - Consider viewport aspect ratio

3. **Zone Highlighting**
   - Temporarily highlight zones during zoom
   - Fade-in effect for zones after zoom completes
   - Pulsing animation for new impact location

4. **Multi-Impact Comparison**
   - Side-by-side map views with different parameters
   - Synchronized zoom across multiple maps
   - Overlay multiple impact scenarios

## Related Files

- `/components/Map/InteractiveMap.tsx` - Main implementation
- `/types/impact.types.ts` - ImpactZone interface definition
- `/app/page.tsx` - Zone generation and state management
- `/lib/impactCalculator.ts` - Physics calculations that determine zone sizes

## Conclusion

The auto-zoom feature significantly enhances the user experience by automatically framing all impact zones in the viewport. This provides immediate visual context for the scale of destruction and makes comparing different scenarios effortless. The implementation is robust, performant, and handles edge cases gracefully across the entire 1m-1000m diameter range.
