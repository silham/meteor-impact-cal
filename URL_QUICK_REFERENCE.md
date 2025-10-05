# URL Parameters - Quick Reference

## 🚀 Quick Examples

### Example 1: Basic Impact
```
/?diameter=100&velocity=20&composition=stony
```
100m stony asteroid at 20 km/s

### Example 2: NYC Impact
```
/?diameter=200&velocity=25&composition=iron&lat=40.7128&lng=-74.0060
```
200m iron asteroid hitting New York City

### Example 3: Tunguska Recreation
```
/?diameter=60&velocity=27&composition=stony&lat=60.8867&lng=101.8931
```
Tunguska-like event at original location

## 📋 All Parameters

| Parameter | Aliases | Type | Range | Example |
|-----------|---------|------|-------|---------|
| `diameter` | - | Number | > 0 | `diameter=500` |
| `velocity` | `speed` | Number | 11-72 | `velocity=25` |
| `composition` | `type` | String | See below | `composition=iron` |
| `lat` | `latitude` | Number | -90 to 90 | `lat=40.7128` |
| `lng` | `lon`, `longitude` | Number | -180 to 180 | `lng=-74.0060` |

## 🎯 Valid Compositions

- `iron` - Iron asteroid (dense)
- `stony` - Stony asteroid (common)
- `carbonaceous` - Carbonaceous asteroid (low density)
- `comet` - Comet (icy)

## 🌍 Major City Coordinates

Copy-paste ready URLs:

### New York City
```
/?diameter=150&velocity=22&composition=stony&lat=40.7128&lng=-74.0060
```

### London
```
/?diameter=150&velocity=22&composition=stony&lat=51.5074&lng=-0.1278
```

### Tokyo
```
/?diameter=150&velocity=22&composition=stony&lat=35.6762&lng=139.6503
```

### Paris
```
/?diameter=150&velocity=22&composition=stony&lat=48.8566&lng=2.3522
```

### Los Angeles
```
/?diameter=150&velocity=22&composition=stony&lat=34.0522&lng=-118.2437
```

### Sydney
```
/?diameter=150&velocity=22&composition=stony&lat=-33.8688&lng=151.2093
```

### Dubai
```
/?diameter=150&velocity=22&composition=stony&lat=25.2048&lng=55.2708
```

### Singapore
```
/?diameter=150&velocity=22&composition=stony&lat=1.3521&lng=103.8198
```

## 📱 Share Feature

### How to Share
1. Set up your impact scenario
2. Click "🔗 Share This Impact" button
3. Link copied to clipboard automatically
4. Paste and share anywhere!

### What Gets Shared
The URL includes:
- ✅ Asteroid diameter
- ✅ Impact velocity
- ✅ Composition type
- ✅ Impact location (if selected)

## ⚠️ Validation Rules

### What Works ✅
```
/?diameter=100          ✅ Positive number
/?velocity=25           ✅ Within 11-72 range
/?composition=iron      ✅ Valid type
/?lat=40.7&lng=-74.0    ✅ Both coordinates valid
```

### What Doesn't Work ❌
```
/?diameter=-100         ❌ Negative number (ignored)
/?velocity=1000         ❌ Out of range (ignored)
/?composition=invalid   ❌ Invalid type (ignored)
/?lat=40.7              ❌ Missing lng (ignored)
```

## 🎓 Educational Use Cases

### Physics Class
"What happens if a 100m asteroid hits our city?"
```
/?diameter=100&velocity=20&composition=stony&lat=YOUR_LAT&lng=YOUR_LNG
```

### Comparison Study
"Iron vs. Stony asteroid impact comparison"

Iron:
```
/?diameter=150&velocity=25&composition=iron&lat=40.7128&lng=-74.0060
```

Stony:
```
/?diameter=150&velocity=25&composition=stony&lat=40.7128&lng=-74.0060
```

### Historical Events

**Tunguska (1908):**
```
/?diameter=60&velocity=27&composition=stony&lat=60.8867&lng=101.8931
```

**Chelyabinsk (2013):**
```
/?diameter=20&velocity=19&composition=stony&lat=55.1644&lng=61.4368
```

## 💡 Pro Tips

1. **Bookmark Your Scenarios**: Save interesting scenarios as bookmarks
2. **Share on Social Media**: Create dramatic scenarios to share
3. **Educational Tools**: Create lesson plans with pre-configured URLs
4. **Research**: Share specific scenarios with colleagues
5. **Testing**: Quickly reload specific configurations during development

## 🔧 Troubleshooting

**Parameters not loading?**
- Check spelling of parameter names
- Verify values are within valid ranges
- Use `&` to separate parameters
- Check browser console for errors

**Share button not visible?**
- Click on the map to select an impact location first
- Button appears at bottom of right sidebar

**Link not working when shared?**
- Ensure full URL is copied (including `http://` or `https://`)
- Check for any truncation in messaging apps
- Try opening in incognito/private window

## 📊 Testing Your URLs

Quick test checklist:
- [ ] URL loads without errors
- [ ] Diameter is correct
- [ ] Velocity is correct
- [ ] Composition is correct
- [ ] Map shows impact location (if coordinates provided)
- [ ] Impact zones display correctly

## 🌐 Browser Compatibility

| Browser | URL Parameters | Share Button |
|---------|---------------|--------------|
| Chrome | ✅ | ✅ |
| Firefox | ✅ | ✅ |
| Safari | ✅ | ✅ |
| Edge | ✅ | ✅ |
| Mobile | ✅ | ✅ |

## 📱 Mobile Share

On mobile devices, the share button opens native share dialog:
- Share to Messages, Email, WhatsApp, etc.
- Share to social media apps
- Copy link directly
- AirDrop to nearby devices (iOS)

## 🔗 Integration Examples

### Embed in Webpage
```html
<a href="https://your-domain.com/?diameter=100&velocity=20&composition=stony&lat=40.7128&lng=-74.0060">
  Simulate NYC Impact
</a>
```

### QR Code
Generate QR codes for URLs to use in:
- Presentations
- Posters
- Educational materials
- Museum exhibits

### Documentation
Link to specific scenarios in documentation:
```markdown
[See Tunguska simulation](/?diameter=60&velocity=27&composition=stony&lat=60.8867&lng=101.8931)
```

## 📈 Usage Analytics Ideas

Track which scenarios are most shared:
- Most common impact locations
- Preferred asteroid sizes
- Popular composition types
- Educational vs. entertainment use

## 🎯 Future Ideas

Potential enhancements:
- [ ] Preset scenario URLs (e.g., `/?preset=tunguska`)
- [ ] Named locations (e.g., `/?city=new-york`)
- [ ] URL shortening integration
- [ ] QR code generation in-app
- [ ] Save favorite scenarios
- [ ] Scenario collections/playlists

---

**Full Documentation**: See [URL_PARAMETERS.md](./URL_PARAMETERS.md) for complete technical details.
