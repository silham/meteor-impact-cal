# URL Parameters Feature

## Overview
The Meteor Impact Simulator now supports URL parameters for deep linking and sharing specific impact scenarios. You can pass diameter, speed, composition, and impact coordinates directly through the URL.

## Supported URL Parameters

### 1. `diameter` (meters)
- **Description**: Asteroid diameter in meters
- **Type**: Number (positive)
- **Example**: `diameter=500`
- **Valid Range**: Any positive number (app limits: 1m - 1000m)

### 2. `velocity` or `speed` (km/s)
- **Description**: Impact velocity in kilometers per second
- **Type**: Number
- **Aliases**: Both `velocity` and `speed` work
- **Example**: `velocity=25` or `speed=25`
- **Valid Range**: 11 - 72 km/s (cosmic velocities)

### 3. `composition` or `type`
- **Description**: Asteroid composition type
- **Type**: String (case-insensitive)
- **Aliases**: Both `composition` and `type` work
- **Valid Values**:
  - `iron` - Iron asteroid (dense, high penetration)
  - `stony` - Stony asteroid (most common)
  - `carbonaceous` - Carbonaceous asteroid (low density)
  - `comet` - Comet (icy composition)
- **Example**: `composition=iron` or `type=stony`

### 4. Impact Location Coordinates

#### Latitude
- **Parameters**: `lat` or `latitude`
- **Description**: Impact latitude
- **Type**: Number
- **Valid Range**: -90 to 90
- **Example**: `lat=40.7128` (New York City)

#### Longitude
- **Parameters**: `lng`, `lon`, or `longitude`
- **Description**: Impact longitude
- **Type**: Number
- **Valid Range**: -180 to 180
- **Example**: `lng=-74.0060` (New York City)

**Note**: Both latitude and longitude must be provided together for the location to be set.

## Example URLs

### Basic Examples

#### 1. Simple Asteroid Impact
```
https://your-domain.com/?diameter=100&velocity=20&composition=stony
```
Sets a 100m stony asteroid at 20 km/s

#### 2. Large Iron Asteroid
```
https://your-domain.com/?diameter=500&speed=30&type=iron
```
Sets a 500m iron asteroid at 30 km/s (using `speed` and `type` aliases)

#### 3. Complete Impact Scenario
```
https://your-domain.com/?diameter=200&velocity=25&composition=stony&lat=40.7128&lng=-74.0060
```
Sets a 200m stony asteroid hitting New York City at 25 km/s

### Real-World Examples

#### Tunguska Event (1908)
```
https://your-domain.com/?diameter=60&velocity=27&composition=stony&lat=60.8867&lng=101.8931
```

#### Chelyabinsk Meteor (2013)
```
https://your-domain.com/?diameter=20&velocity=19&composition=stony&lat=55.1644&lng=61.4368
```

#### Hypothetical Impact on London
```
https://your-domain.com/?diameter=150&velocity=22&composition=iron&lat=51.5074&lng=-0.1278
```

#### Hypothetical Impact on Tokyo
```
https://your-domain.com/?diameter=300&velocity=28&composition=carbonaceous&lat=35.6762&lng=139.6503
```

## How It Works

### 1. Loading Parameters from URL

When the page loads, the app:
1. Reads URL search parameters
2. Validates each parameter
3. Applies valid parameters to the simulation
4. Ignores invalid or out-of-range values

### 2. Sharing Current Scenario

Users can share their current scenario by:
1. Setting up parameters and impact location
2. Clicking the "🔗 Share This Impact" button
3. The app generates a shareable URL with all current parameters
4. URL is copied to clipboard or shared via native share dialog

### 3. URL Generation

The share feature creates URLs in this format:
```
https://domain.com/?diameter=VALUE&velocity=VALUE&composition=VALUE&lat=VALUE&lng=VALUE
```

All numeric values are properly formatted:
- Diameter: Whole number
- Velocity: Decimal (1 place)
- Latitude/Longitude: 6 decimal places (±11cm precision)

## Technical Details

### Parameter Parsing

```typescript
// Diameter parsing
const diameter = searchParams.get('diameter');
if (diameter) {
  const parsed = parseFloat(diameter);
  if (!isNaN(parsed) && parsed > 0) {
    params.diameter = parsed;
  }
}

// Velocity parsing (accepts 'velocity' or 'speed')
const velocity = searchParams.get('velocity') || searchParams.get('speed');
if (velocity) {
  const parsed = parseFloat(velocity);
  if (!isNaN(parsed) && parsed >= 11 && parsed <= 72) {
    params.velocity = parsed;
  }
}

// Composition parsing (case-insensitive)
const composition = searchParams.get('composition') || searchParams.get('type');
if (composition) {
  const normalized = composition.toLowerCase();
  if (['iron', 'stony', 'carbonaceous', 'comet'].includes(normalized)) {
    params.composition = normalized;
  }
}

// Location parsing (requires both lat and lng)
const lat = searchParams.get('lat') || searchParams.get('latitude');
const lng = searchParams.get('lng') || searchParams.get('lon') || searchParams.get('longitude');
if (lat && lng) {
  const parsedLat = parseFloat(lat);
  const parsedLng = parseFloat(lng);
  if (!isNaN(parsedLat) && !isNaN(parsedLng) && 
      parsedLat >= -90 && parsedLat <= 90 && 
      parsedLng >= -180 && parsedLng <= 180) {
    params.location = { lat: parsedLat, lng: parsedLng };
  }
}
```

### URL Generation

```typescript
const generateShareURL = () => {
  const baseURL = window.location.origin + window.location.pathname;
  const params = new URLSearchParams();
  
  params.set('diameter', parameters.diameter.toString());
  params.set('velocity', parameters.velocity.toString());
  params.set('composition', parameters.composition);
  
  if (parameters.location.lat !== 0 || parameters.location.lng !== 0) {
    params.set('lat', parameters.location.lat.toFixed(6));
    params.set('lng', parameters.location.lng.toFixed(6));
  }
  
  return `${baseURL}?${params.toString()}`;
};
```

## Validation Rules

### Diameter
- ✅ Any positive number accepted
- ❌ Negative numbers ignored
- ❌ Non-numeric values ignored
- ❌ Zero or empty values ignored

### Velocity
- ✅ Values between 11-72 km/s accepted
- ❌ Values outside this range ignored
- ❌ Non-numeric values ignored
- 📝 Range represents realistic cosmic velocities

### Composition
- ✅ Exact matches (case-insensitive): iron, stony, carbonaceous, comet
- ❌ Any other values ignored
- 📝 Partial matches not supported

### Location
- ✅ Valid latitude (-90 to 90) AND longitude (-180 to 180)
- ❌ Either coordinate invalid = entire location ignored
- ❌ Only one coordinate provided = location ignored
- 📝 Both coordinates required for location to be set

## Share Functionality

### Share Button Behavior

1. **Web Share API Available** (Mobile devices, some browsers)
   - Opens native share dialog
   - User can share to apps, contacts, etc.
   - Includes title, description, and URL

2. **Clipboard API Fallback** (Most desktop browsers)
   - Copies URL to clipboard
   - Shows "Share link copied to clipboard!" alert
   - User can paste anywhere

3. **Prompt Fallback** (Older browsers)
   - Shows URL in a prompt dialog
   - User manually copies the URL
   - Ensures functionality on all browsers

### Share Button Visibility

The "🔗 Share This Impact" button appears:
- ✅ When an impact location has been selected
- ❌ Hidden until user clicks on the map
- 📍 Located at the bottom of the right sidebar

## Use Cases

### 1. Educational Scenarios
Teachers can create specific impact scenarios and share URLs with students:
```
https://your-domain.com/?diameter=100&velocity=20&composition=stony&lat=38.8977&lng=-77.0365
```
"What would happen if a 100m asteroid hit Washington DC?"

### 2. Research Collaboration
Researchers can share specific scenarios for discussion:
```
https://your-domain.com/?diameter=750&velocity=30&composition=iron&lat=35.6762&lng=139.6503
```

### 3. Social Media Sharing
Users can share interesting impact scenarios on social platforms

### 4. Bookmarking Scenarios
Save favorite or common scenarios as browser bookmarks

### 5. Embedding Parameters
Applications can link to the simulator with pre-filled parameters

## Browser Compatibility

### URL Parameter Support
- ✅ All modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)
- ✅ Next.js 15 with App Router

### Share Functionality
| Feature | Chrome | Firefox | Safari | Edge | Mobile |
|---------|--------|---------|--------|------|--------|
| Web Share API | ✅ | ❌ | ✅ | ✅ | ✅ |
| Clipboard API | ✅ | ✅ | ✅ | ✅ | ✅ |
| Prompt Fallback | ✅ | ✅ | ✅ | ✅ | ✅ |

## Security Considerations

### Input Validation
- All URL parameters are validated before use
- Invalid values are silently ignored (fail-safe)
- No server-side processing of user input
- Client-side only validation

### XSS Protection
- URL parameters are parsed as numbers/strings only
- No HTML or script execution possible
- React's built-in XSS protection applies

### Data Privacy
- No parameters are stored on the server
- No tracking of shared URLs
- All processing happens client-side

## Testing

### Manual Testing

1. **Test Basic Parameters**
   ```
   /?diameter=100&velocity=20&composition=stony
   ```
   Verify parameters are applied

2. **Test Location**
   ```
   /?lat=40.7128&lng=-74.0060
   ```
   Verify map centers on New York

3. **Test Invalid Values**
   ```
   /?diameter=-100&velocity=1000&composition=invalid
   ```
   Verify defaults are used

4. **Test Share Button**
   - Select location on map
   - Click "Share This Impact"
   - Verify URL is copied/shared

### Automated Testing Ideas

```typescript
describe('URL Parameter Parsing', () => {
  it('should parse valid diameter', () => {
    const params = new URLSearchParams('diameter=100');
    const result = parseURLParams(params);
    expect(result.diameter).toBe(100);
  });
  
  it('should ignore invalid velocity', () => {
    const params = new URLSearchParams('velocity=1000');
    const result = parseURLParams(params);
    expect(result.velocity).toBeUndefined();
  });
  
  it('should parse location coordinates', () => {
    const params = new URLSearchParams('lat=40.7128&lng=-74.0060');
    const result = parseURLParams(params);
    expect(result.location).toEqual({ lat: 40.7128, lng: -74.0060 });
  });
});
```

## Troubleshooting

### Parameters Not Loading
- Check URL format: `?param1=value1&param2=value2`
- Verify parameter names are spelled correctly
- Check values are within valid ranges
- Open browser console for any errors

### Share Button Not Working
- Ensure impact location is selected first
- Check browser supports Clipboard API
- Check browser console for errors
- Try different browser if issues persist

### Location Not Appearing
- Verify both `lat` and `lng` parameters are provided
- Check coordinates are within valid ranges (-90 to 90, -180 to 180)
- Verify decimal format is correct (use dot, not comma)

## Future Enhancements

Potential additions:
- 🔧 Angle parameter support
- 📊 Multiple impact scenarios in one URL
- 🎨 Custom color schemes via URL
- 🔍 Named location support (e.g., `location=new-york`)
- 📱 QR code generation for URLs
- 📑 URL shortening integration
- 💾 Save/load scenarios to browser storage

## Credits

- Built with Next.js 15 App Router
- Uses Next.js `useSearchParams` hook
- Web Share API for native sharing
- Clipboard API for fallback copying
