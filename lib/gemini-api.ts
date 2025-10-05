/**
 * Gemini AI Integration for Impact Analysis
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { MeteorParameters, ImpactResults } from '@/types/impact.types';

const API_KEY = process.env.GEMINI_API_KEY || '';

let genAI: GoogleGenerativeAI | null = null;

// Initialize Gemini API
function getGeminiClient() {
  if (!genAI && API_KEY) {
    genAI = new GoogleGenerativeAI(API_KEY);
  }
  return genAI;
}

export interface ImpactAnalysisRequest {
  parameters: MeteorParameters;
  results: ImpactResults;
  locationName?: string;
}

/**
 * Get detailed impact analysis from Gemini AI
 */
export async function getImpactAnalysis(
  request: ImpactAnalysisRequest
): Promise<string> {
  const client = getGeminiClient();
  
  if (!client) {
    throw new Error('Gemini API key not configured. Please add GEMINI_API_KEY to your .env.local file.');
  }

  const model = client.getGenerativeModel({ model: 'gemini-flash-latest' });

  const { parameters, results, locationName } = request;

  // Create a comprehensive prompt for Gemini
  const prompt = `You are an expert about NEOs analyzing a hypothetical asteroid impact scenario. Provide a brief, comprehensive analysis in natural language.

**Impact Scenario:**
- **Asteroid Details:**
  - Diameter: ${parameters.diameter >= 1000 ? `${(parameters.diameter / 1000).toFixed(2)} km` : `${parameters.diameter} meters`}
  - Composition: ${parameters.composition}
  - Velocity: ${parameters.velocity} km/s
  ${parameters.name ? `- Name: ${parameters.name} (NASA asteroid)` : ''}
  ${parameters.isPotentiallyHazardous ? '- Classification: Potentially Hazardous Asteroid (PHA)' : ''}

- **Impact Location:**
  - Coordinates: ${parameters.location.lat.toFixed(4)}°, ${parameters.location.lng.toFixed(4)}°
  ${locationName ? `- Location: ${locationName}` : ''}

- **Calculated Impact Effects:**
  - Impact Type: ${results.impactType === 'airburst' ? 'Atmospheric Airburst' : 'Surface Impact'}
  - Impact Energy: ${results.energyTNT.toFixed(2)} Megatons TNT equivalent
  ${results.impactType === 'surface' && results.craterDiameter > 0 ? `- Crater Diameter: ${(results.craterDiameter / 1000).toFixed(2)} km` : ''}
  - Seismic Magnitude: ${results.seismicMagnitude.toFixed(1)}
  - Thermal Radiation Radius: ${results.thermalRadius.toFixed(1)} km (3rd degree burns)
  - Air Blast Radii:
    * 20 PSI (total destruction): ${results.blastRadius.twentyPsi.toFixed(1)} km
    * 5 PSI (severe damage): ${results.blastRadius.fivePsi.toFixed(1)} km
    * 1 PSI (moderate damage): ${results.blastRadius.onePsi.toFixed(1)} km

**Please provide a brief analysis covering:**

1. **Immediate Impact Effects** (first few seconds to minutes):
   - What happens at ground zero
   - Blast wave propagation
   - Thermal effects and firestorms
   - Initial casualties

2. **Regional Effects** (hours to days):
   - Area affected and population at risk
   - Infrastructure damage
   - Estimated death toll and injuries
   - Secondary effects (fires, building collapse)

3. **Global/Climate Effects** (if applicable for large impacts):
   - Atmospheric effects
   - Climate impact
   - Global temperature changes
   - Long-term consequences

4. **Comparison to Historical Events**:
   - Compare to similar known impacts or nuclear weapons
   - Put the energy scale in perspective

5. **Survival and Mitigation**:
   - Safe distances
   - Immediate actions for people in affected areas
   - Long-term recovery challenges

Please write in short, clear, engaging language suitable for general audiences but scientifically accurate. ).

 Be realistic about casualties but remain educational.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to generate impact analysis. Please try again.');
  }
}

/**
 * Get location name from coordinates using reverse geocoding
 */
export async function getLocationName(lat: number, lng: number): Promise<string> {
  try {
    // Using a free reverse geocoding API (no API key required)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10`,
      {
        headers: {
          'User-Agent': 'Meteor Impact Calculator',
        },
      }
    );

    if (!response.ok) {
      return 'Unknown location';
    }

    const data = await response.json();
    
    // Build location name from available data
    const parts = [];
    if (data.address?.city) parts.push(data.address.city);
    else if (data.address?.town) parts.push(data.address.town);
    else if (data.address?.village) parts.push(data.address.village);
    
    if (data.address?.state) parts.push(data.address.state);
    if (data.address?.country) parts.push(data.address.country);
    
    return parts.length > 0 ? parts.join(', ') : 'Ocean/Remote area';
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return 'Unknown location';
  }
}
