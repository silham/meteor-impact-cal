# NASA API Integration

## Overview
This application now integrates with **NASA's Near Earth Object Web Service (NeoWs)** to provide real asteroid data including names, diameters, velocities, and hazard classifications.

## Features

### 🛸 Real NASA Asteroids
- Browse actual asteroids from NASA's database
- See official NASA names and classifications
- View estimated diameters and approach velocities
- Identify Potentially Hazardous Asteroids (PHAs)

### 📊 Data Provided
Each asteroid includes:
- **Name**: Official NASA designation (e.g., "(2023 AB7)")
- **Diameter**: Estimated size in meters/kilometers
- **Velocity**: Relative velocity in km/s (when available)
- **PHA Status**: Whether it's classified as potentially hazardous
- **NASA ID**: Unique identifier in JPL Small Body Database

## Setup Instructions

### 1. Get a NASA API Key (Recommended)

While you can use `DEMO_KEY` for testing, it has strict rate limits:
- **30 requests per hour** per IP address
- **50 requests per day** per IP address

To get unlimited access (1,000 requests/hour):

1. Visit [https://api.nasa.gov/](https://api.nasa.gov/)
2. Fill out the "Generate API Key" form
3. You'll receive your API key instantly via email
4. Update your `.env.local` file:

```bash
NEXT_PUBLIC_NASA_API_KEY=your_actual_api_key_here
```

### 2. Environment Configuration

The `.env.local` file has been created with `DEMO_KEY` by default:

```bash
# .env.local
NEXT_PUBLIC_NASA_API_KEY=DEMO_KEY
```

**Important**: Replace `DEMO_KEY` with your actual NASA API key for production use.

### 3. Restart Development Server

After updating the API key, restart your Next.js server:

```bash
npm run dev
```

## How to Use

### In the Application

1. **Open the sidebar** - Look for the "Real NASA Asteroids" button
2. **Click to expand** - View the list of real asteroids
3. **Select an asteroid** - Click on any asteroid to load its parameters
4. **Simulate impact** - The asteroid's diameter and velocity will be applied
5. **Click on map** - Choose an impact location to see the results

### Features

- **Asteroid Names**: See the official NASA designation displayed at the top
- **PHA Badge**: Red "⚠️ PHA" badge for potentially hazardous asteroids
- **Auto-fill Parameters**: Diameter and velocity are automatically set
- **Composition**: Defaults to "stony" (most common NEO type)

## API Endpoints Used

### 1. Browse NEOs
```
GET https://api.nasa.gov/neo/rest/v1/neo/browse
```
- Returns paginated list of all Near Earth Objects
- We fetch multiple pages (up to 100 asteroids) to find suitable matches
- Primary filter: 50m - 1km diameter
- Fallback filter: 10m - 50m if not enough larger asteroids found
- Returns up to 20 asteroids sorted by size (largest first)

### 2. Get Asteroid by ID
```
GET https://api.nasa.gov/neo/rest/v1/neo/{asteroid_id}
```
- Retrieves detailed information for a specific asteroid
- Includes close approach data and orbital parameters

### 3. Feed by Date Range
```
GET https://api.nasa.gov/neo/rest/v1/feed
```
- Get asteroids approaching Earth within a date range
- Maximum 7-day range per request

## Technical Details

### Data Conversion

NASA asteroid data is converted to our app's format:

```typescript
{
  diameter: Math.round(avgDiameterInMeters),
  velocity: parseFloat(approachVelocity) || 20, // km/s
  composition: 'stony', // Most NEOs are stony
  name: asteroid.name,
  nasaId: asteroid.id,
  isPotentiallyHazardous: asteroid.is_potentially_hazardous_asteroid
}
```

### Diameter Calculation
- NASA provides min/max diameter estimates
- We use the average: `(min + max) / 2`
- Converted to meters for consistency

### Velocity
- Extracted from close approach data when available
- Falls back to 20 km/s (typical asteroid velocity)
- Displayed in km/s (metric standard)

## Rate Limits & Best Practices

### DEMO_KEY Limits
- ⚠️ 30 requests/hour per IP
- ⚠️ 50 requests/day per IP
- Use only for initial testing

### Personal API Key Limits
- ✅ 1,000 requests/hour
- ✅ No daily limit
- ✅ Free forever

### Tips to Avoid Rate Limits
1. Get your own API key (takes 30 seconds)
2. Results are loaded once on component mount
3. Selecting asteroids doesn't make new API calls
4. Data is cached in component state

## Error Handling

The application handles these scenarios:
- **API unavailable**: Shows error message with retry button
- **Rate limit exceeded**: Displays friendly error
- **Invalid API key**: Clear error message
- **Network issues**: Automatic retry option

## Example Asteroids

Here are some interesting asteroids you might find:

- **433 Eros**: Large near-Earth asteroid (~17 km)
- **99942 Apophis**: Famous PHA (340 m diameter)
- **1566 Icarus**: Fast-moving NEO
- **Many unnamed PHAs**: Objects being tracked by NASA

## API Documentation

For more information:
- **NASA API Portal**: [https://api.nasa.gov/](https://api.nasa.gov/)
- **NeoWs Documentation**: [https://api.nasa.gov/neo/](https://api.nasa.gov/neo/)
- **JPL Small Body Database**: [https://ssd.jpl.nasa.gov/](https://ssd.jpl.nasa.gov/)

## Future Enhancements

Potential additions:
- 🔍 Search asteroids by name
- 📅 Filter by approach date
- 📊 Sort by size, velocity, or hazard level
- 🔗 Link to NASA JPL page for each asteroid
- 📈 Historical close approach data
- 🎯 Show asteroid's actual trajectory on map

## Support

If you encounter issues:
1. Check your API key is correct in `.env.local`
2. Verify you haven't exceeded rate limits
3. Check browser console for detailed errors
4. Try the "Try again" button if loading fails

## Credits

- **Data Source**: NASA/JPL Near Earth Object Program
- **API**: NASA's Open Data Initiative
- **Classification**: Center for Near Earth Object Studies (CNEOS)
