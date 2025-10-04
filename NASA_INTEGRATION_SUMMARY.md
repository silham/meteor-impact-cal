# NASA Asteroid Integration - Quick Reference

## What's New? 🆕

Your meteor impact simulator now includes **real asteroid data from NASA**!

## Visual Changes

### In the Sidebar

1. **New "Real NASA Asteroids" button**
   - Located between the asteroid preview and preset scenarios
   - Gradient blue-to-purple design with 🛸 icon
   - Click to expand/collapse the asteroid list

2. **Asteroid List (when expanded)**
   - Shows up to 10 real asteroids from NASA's database
   - Each asteroid shows:
     - Official NASA name
     - Estimated diameter (in meters or kilometers)
     - Approach velocity (in km/s)
     - PHA badge (⚠️ Potentially Hazardous Asteroid) if applicable
   - Click any asteroid to load its parameters

3. **Asteroid Name Display**
   - When a NASA asteroid is selected, its name appears below the asteroid icon
   - Shows PHA warning if applicable

## How It Works

### User Flow

```
1. Click "Real NASA Asteroids" button
   ↓
2. App fetches data from NASA API
   ↓
3. Browse list of real asteroids
   ↓
4. Click an asteroid
   ↓
5. Diameter & velocity auto-filled
   ↓
6. Click map to choose impact location
   ↓
7. See realistic impact simulation!
```

### API Key Setup

**Option 1: Quick Test (DEMO_KEY)**
- Already configured in `.env.local`
- Limited to 30 requests/hour
- Good for initial testing

**Option 2: Production (Your Own Key)**
1. Go to [https://api.nasa.gov/](https://api.nasa.gov/)
2. Enter your name and email
3. Receive key instantly
4. Update `.env.local`:
   ```
   NEXT_PUBLIC_NASA_API_KEY=your_actual_key_here
   ```
5. Restart dev server: `npm run dev`

## Files Added

```
lib/nasa-api.ts                          # NASA API client & data conversion
components/UI/NASAAsteroidSelector.tsx   # Asteroid browser component
.env.local                               # API key configuration
NASA_API_INTEGRATION.md                  # Full documentation
```

## Files Modified

```
types/impact.types.ts                    # Added NASA fields to MeteorParameters
components/UI/ParameterPanel.tsx         # Integrated asteroid selector
README.md                                # Added NASA feature section
```

## Example Asteroids You'll See

- **Medium-sized asteroids** (50m - 1km diameter)
- Objects suitable for realistic impact simulations
- Asteroids with known approach velocities
- Recent discoveries and tracked objects
- **Note**: Asteroids larger than 1km are excluded (extinction-level events)

## Testing the Feature

### Method 1: In Browser
1. Start dev server: `npm run dev`
2. Open http://localhost:3000
3. Look for "Real NASA Asteroids" button in sidebar
4. Click to expand and browse
5. Select an asteroid and see its data populate

### Method 2: Check API Response
```bash
# Test NASA API directly
curl "https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=DEMO_KEY&size=5"
```

## Troubleshooting

### "Loading NASA asteroids..." never finishes
- Check internet connection
- Verify API key is correct in `.env.local`
- Check browser console for errors
- Try clicking "Try again" button

### Rate limit exceeded
- You've used all 30 DEMO_KEY requests this hour
- Get your own API key for 1,000/hour
- Or wait an hour for limits to reset

### Asteroids load but clicking doesn't work
- Check browser console for errors
- Verify the component is properly integrated
- Try refreshing the page

## Next Steps

Potential enhancements:
- [ ] Search asteroids by name
- [ ] Filter by size or hazard level
- [ ] Show asteroid's actual orbit/trajectory
- [ ] Link to NASA JPL page for each asteroid
- [ ] Display historical close approach data
- [ ] Add more asteroid properties (albedo, rotation, etc.)

## API Limits Reference

| Key Type | Hourly Limit | Daily Limit | Cost |
|----------|--------------|-------------|------|
| DEMO_KEY | 30 requests  | 50 requests | Free |
| Personal | 1,000 requests | Unlimited | Free |

## Support

For issues:
1. Check [NASA_API_INTEGRATION.md](./NASA_API_INTEGRATION.md) for full docs
2. Verify API key setup in `.env.local`
3. Check browser console for detailed errors
4. Test API directly with curl (see above)

## Credits

- **Data**: NASA/JPL Near Earth Object Program
- **API**: NASA Open Data Initiative  
- **Source**: Center for Near Earth Object Studies (CNEOS)
