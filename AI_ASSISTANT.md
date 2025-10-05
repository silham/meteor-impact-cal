# AI Impact Analysis Assistant

## Overview

The AI Impact Analysis Assistant uses Google's Gemini AI to provide detailed, natural language analysis of meteor impact scenarios. It takes the calculated impact parameters and generates comprehensive reports covering immediate effects, regional consequences, global climate impacts, and survival recommendations.

---

## Setup Instructions

### 1. Get a Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### 2. Configure Environment Variable

Add your Gemini API key to `.env.local`:

```bash
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

**Important:** Never commit your API key to version control. The `.env.local` file is already in `.gitignore`.

### 3. Restart Development Server

After adding the API key:

```bash
npm run dev
```

---

## Features

### 🤖 Intelligent Analysis

The AI assistant analyzes:

- **Immediate Impact Effects**: What happens at ground zero, blast wave propagation, thermal effects
- **Regional Effects**: Area affected, population at risk, infrastructure damage, estimated casualties
- **Global/Climate Effects**: Atmospheric changes, climate impact, long-term consequences (for large impacts)
- **Historical Comparisons**: Comparison to known events (Tunguska, Chelyabinsk, nuclear weapons)
- **Survival Guidance**: Safe distances, immediate actions, recovery challenges

### 📍 Location-Aware Analysis

- Uses reverse geocoding to identify the impact location (city, state, country)
- Provides context-specific analysis based on the actual location
- Considers population density and geographic features

### 🎨 Rich Text Formatting

The assistant output includes:

- **Headers** for clear section organization
- **Bold text** for important numbers and key terms
- **Bullet points** and numbered lists
- **Blockquotes** for emphasis
- **Code formatting** for technical values
- Fully responsive dark theme styling

---

## How to Use

### Step 1: Configure Your Impact

1. Select an asteroid from the NASA database or use preset scenarios
2. Adjust diameter, velocity, and composition as needed
3. Click on the map to select an impact location

### Step 2: Get AI Analysis

1. Once results are calculated, the "🤖 AI Impact Analysis" button becomes active
2. Click the button to generate analysis
3. Wait 3-10 seconds for the AI to process (indicated by loading animation)

### Step 3: Read the Analysis

- The analysis appears in a scrollable panel below the results
- Sections are clearly marked with headers
- Key statistics and comparisons are highlighted
- Close the analysis panel when done or generate a new one after changing parameters

---

## API Architecture

### Client-Side Component

**File:** `/components/UI/AIAssistant.tsx`

- React component with loading states and error handling
- Calls the API route with impact parameters
- Renders markdown-formatted response with custom styling

### API Route (Server-Side)

**File:** `/app/api/impact-analysis/route.ts`

- Next.js API route (runs on server, keeps API key secure)
- Receives impact parameters from client
- Calls Gemini API with structured prompt
- Returns formatted analysis

### Gemini Integration

**File:** `/lib/gemini-api.ts`

- Wrapper functions for Gemini API
- Reverse geocoding for location names
- Structured prompt engineering for consistent, high-quality responses

---

## Example Analysis Output

For a **100m stony asteroid at 25 km/s impacting New York City**, the AI generates:

```markdown
## Immediate Impact Effects

The 100-meter stony asteroid strikes New York City with a devastating 
129 megaton explosion (8,600 times more powerful than the Hiroshima bomb)...

### Ground Zero
Within the 280-meter radius of 20 PSI overpressure, total destruction occurs...

### Thermal Flash
The initial fireball reaches temperatures of millions of degrees...

## Regional Effects

### Affected Area
- Total destruction: 0.25 km²
- Severe damage: 2.4 km²
- Moderate damage: 16 km²

### Estimated Casualties
Given the population density of Manhattan (~27,000 people/km²):
- Immediate deaths: 150,000 - 200,000
- Severe injuries: 500,000+
...
```

---

## Prompt Engineering

The system sends a detailed prompt to Gemini including:

### Input Data
- Asteroid diameter, composition, velocity
- Impact coordinates and location name
- Impact type (airburst vs surface)
- Energy in megatons
- Crater size (if applicable)
- Blast radii (20 PSI, 5 PSI, 1 PSI)
- Thermal radius
- Seismic magnitude

### Analysis Instructions
- Provide 5 main sections: Immediate, Regional, Global, Comparisons, Survival
- Use specific numbers and scientific accuracy
- Compare to historical events
- Write for general audiences but maintain scientific credibility
- Format with clear markdown structure

---

## Cost & Rate Limits

### Gemini API Pricing (as of 2024)

**Gemini Pro (free tier):**
- Free up to 60 requests per minute
- Sufficient for personal/demo use

**Gemini Pro (paid tier):**
- $0.00025 per 1K input tokens
- $0.0005 per 1K output tokens
- Typical analysis costs ~$0.001 - $0.005

### Rate Limiting

The API includes basic error handling. For production:

1. Implement request throttling on client-side
2. Add caching for identical scenarios
3. Consider user quotas for public deployments

---

## Error Handling

### Common Errors

**"Gemini API key not configured"**
- Solution: Add `GEMINI_API_KEY` to `.env.local`

**"Failed to generate analysis"**
- Possible causes: Network error, API rate limit, invalid API key
- Solution: Check console logs, verify API key, wait and retry

**"Please select an impact location first"**
- Solution: Click on the map to select coordinates

### Debugging

Enable detailed logging:

```typescript
// In /lib/gemini-api.ts
console.log('Prompt:', prompt);
console.log('Response:', response);
```

---

## Customization

### Adjusting Analysis Style

Edit the prompt in `/lib/gemini-api.ts`:

```typescript
const prompt = `You are an expert planetary defense scientist...

**Please provide analysis covering:**
1. Your custom section
2. Another custom section
...

Use [formal/casual/technical] language.
Format with [specific instructions].
`;
```

### Changing AI Model

Switch to different Gemini models:

```typescript
// Gemini Pro (default, free)
const model = client.getGenerativeModel({ model: 'gemini-pro' });

// Gemini Pro Vision (if using images)
const model = client.getGenerativeModel({ model: 'gemini-pro-vision' });
```

### Custom Markdown Styling

Modify the ReactMarkdown components in `/components/UI/AIAssistant.tsx`:

```typescript
h1: ({ children }: { children: React.ReactNode }) => (
  <h1 className="your-custom-classes" style={{ color: 'your-color' }}>
    {children}
  </h1>
),
```

---

## Future Enhancements

Potential improvements:

1. **Image Generation**: Show impact zones, damage maps
2. **Multi-language Support**: Generate analysis in different languages
3. **Comparison Mode**: Compare multiple scenarios side-by-side
4. **Export Options**: PDF, text file download
5. **Citation System**: Add references to scientific papers
6. **Interactive Q&A**: Chat interface for follow-up questions
7. **Voice Output**: Text-to-speech for accessibility

---

## Privacy & Security

### Data Handling

- Impact parameters are sent to Gemini API for analysis
- No personal user data is collected or stored
- API key is stored server-side only (not exposed to client)
- Location data is used only for context in analysis

### Best Practices

1. Never expose API keys in client-side code
2. Use environment variables for all secrets
3. Implement rate limiting for production
4. Monitor API usage and costs
5. Add user consent notices if collecting data

---

## Troubleshooting

### Analysis Not Appearing

1. Check browser console for errors
2. Verify `.env.local` has correct API key
3. Ensure dev server was restarted after adding API key
4. Check network tab for API request/response

### Slow Response Times

- Gemini typically responds in 3-10 seconds
- Large impacts with complex scenarios may take longer
- Network latency can affect response time
- Consider adding timeout handling (30s recommended)

### Formatting Issues

- Gemini returns markdown text
- ReactMarkdown handles rendering
- Custom components handle dark theme styling
- Check browser console for React component errors

---

## Technical Stack

- **AI Model**: Google Gemini Pro
- **SDK**: `@google/generative-ai` (official Google SDK)
- **Markdown Rendering**: `react-markdown`
- **API Architecture**: Next.js 13+ API Routes
- **Reverse Geocoding**: OpenStreetMap Nominatim (free, no API key)
- **Type Safety**: Full TypeScript support

---

## Credits

- **AI Provider**: Google Gemini
- **Impact Physics**: Based on Collins et al. (2005) scaling laws
- **Geocoding**: OpenStreetMap / Nominatim
- **Markdown Rendering**: `react-markdown` by remarkjs

---

*Last Updated: October 2025*
*Version: 1.0*
