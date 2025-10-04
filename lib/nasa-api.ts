/**
 * NASA Near Earth Object (NEO) API Integration
 * Documentation: https://api.nasa.gov/
 */

export interface NASAAsteroid {
  id: string;
  name: string;
  nasa_jpl_url: string;
  estimated_diameter: {
    kilometers: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
    meters: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
  };
  is_potentially_hazardous_asteroid: boolean;
  close_approach_data?: Array<{
    close_approach_date: string;
    relative_velocity: {
      kilometers_per_second: string;
    };
    miss_distance: {
      kilometers: string;
    };
  }>;
}

export interface NASANeoResponse {
  links: {
    next: string;
    prev: string;
    self: string;
  };
  page: {
    size: number;
    total_elements: number;
    total_pages: number;
    number: number;
  };
  near_earth_objects: NASAAsteroid[];
}

const NASA_API_BASE = 'https://api.nasa.gov/neo/rest/v1';
const API_KEY = process.env.NEXT_PUBLIC_NASA_API_KEY || 'DEMO_KEY';

/**
 * Browse all Near Earth Objects in NASA's database
 * @param page Page number (0-based)
 * @param size Number of results per page (max 20)
 */
export async function browseNEOs(
  page: number = 0,
  size: number = 20
): Promise<NASANeoResponse> {
  const url = `${NASA_API_BASE}/neo/browse?page=${page}&size=${size}&api_key=${API_KEY}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`NASA API Error: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Get a specific asteroid by its ID
 * @param asteroidId NASA JPL Small Body Database ID
 */
export async function getAsteroidById(asteroidId: string): Promise<NASAAsteroid> {
  const url = `${NASA_API_BASE}/neo/${asteroidId}?api_key=${API_KEY}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`NASA API Error: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Search for asteroids approaching Earth within a date range
 * @param startDate Format: YYYY-MM-DD
 * @param endDate Format: YYYY-MM-DD (max 7 days from start)
 */
export async function getAsteroidsByDate(
  startDate: string,
  endDate: string
): Promise<any> {
  const url = `${NASA_API_BASE}/feed?start_date=${startDate}&end_date=${endDate}&api_key=${API_KEY}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`NASA API Error: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Convert NASA asteroid data to our app's MeteorParameters format
 */
export function convertNASAAsteroidToParams(asteroid: NASAAsteroid) {
  // Use average of min/max diameter
  const diameterKm = (
    asteroid.estimated_diameter.kilometers.estimated_diameter_min +
    asteroid.estimated_diameter.kilometers.estimated_diameter_max
  ) / 2;
  
  const diameterMeters = diameterKm * 1000;
  
  // Get velocity from close approach data if available
  let velocity = 20; // Default to 20 km/s (typical asteroid velocity)
  if (asteroid.close_approach_data && asteroid.close_approach_data.length > 0) {
    velocity = parseFloat(asteroid.close_approach_data[0].relative_velocity.kilometers_per_second);
  }
  
  return {
    diameter: Math.round(diameterMeters),
    velocity: velocity,
    composition: 'stony' as const, // Most NEOs are stony
    angle: 45,
    name: asteroid.name,
    nasaId: asteroid.id,
    isPotentiallyHazardous: asteroid.is_potentially_hazardous_asteroid,
  };
}

/**
 * Get a curated list of famous/interesting asteroids
 */
export async function getFamousAsteroids(): Promise<NASAAsteroid[]> {
  try {
    const allAsteroids: NASAAsteroid[] = [];
    
    // Fetch multiple pages to get more asteroids
    // We'll fetch up to 5 pages (100 asteroids total) to find enough in our size range
    for (let page = 0; page < 5; page++) {
      const response = await browseNEOs(page, 20);
      
      // Filter for asteroids smaller than 1km with minimum size of 50m
      const filteredAsteroids = response.near_earth_objects.filter(asteroid => {
        const avgDiameter = (
          asteroid.estimated_diameter.meters.estimated_diameter_min +
          asteroid.estimated_diameter.meters.estimated_diameter_max
        ) / 2;
        // Only include asteroids between 50m and 1000m (1km)
        return avgDiameter >= 50 && avgDiameter < 1000;
      });
      
      allAsteroids.push(...filteredAsteroids);
      
      // If we have enough asteroids, stop fetching
      if (allAsteroids.length >= 20) {
        break;
      }
    }
    
    // If we don't have many asteroids in the 50m-1km range, also include smaller ones
    if (allAsteroids.length < 10) {
      for (let page = 0; page < 3; page++) {
        const response = await browseNEOs(page, 20);
        
        const smallerAsteroids = response.near_earth_objects.filter(asteroid => {
          const avgDiameter = (
            asteroid.estimated_diameter.meters.estimated_diameter_min +
            asteroid.estimated_diameter.meters.estimated_diameter_max
          ) / 2;
          // Include asteroids from 10m to 50m as well
          return avgDiameter >= 10 && avgDiameter < 50;
        });
        
        allAsteroids.push(...smallerAsteroids);
        
        if (allAsteroids.length >= 20) {
          break;
        }
      }
    }
    
    // Return up to 20 asteroids, sorted by size (largest first for visual interest)
    return allAsteroids
      .sort((a, b) => {
        const avgA = (a.estimated_diameter.meters.estimated_diameter_min + 
                     a.estimated_diameter.meters.estimated_diameter_max) / 2;
        const avgB = (b.estimated_diameter.meters.estimated_diameter_min + 
                     b.estimated_diameter.meters.estimated_diameter_max) / 2;
        return avgB - avgA; // Descending order
      })
      .slice(0, 20);
  } catch (error) {
    console.error('Error fetching famous asteroids:', error);
    return [];
  }
}
