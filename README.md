# 🌠 Meteor Impact Simulator

An interactive web application for simulating asteroid and comet impacts on Earth, built for NASA Space Apps 2025.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![React](https://img.shields.io/badge/React-18-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8)

## Features

- **🛸 Real NASA Asteroids**: Browse and simulate impacts from actual Near Earth Objects in NASA's database
- **Interactive World Map**: Click anywhere on Earth to select an impact location using OpenStreetMap
- **Real-time Physics Calculations**: Accurate impact modeling based on Earth Impact Effects Program equations
- **Multiple Impact Zones**: Visual representation of crater, thermal radiation, and blast damage zones
- **Historical Presets**: Simulate famous impacts like Tunguska, Chelyabinsk, Chicxulub, and more
- **Customizable Parameters**: Adjust meteor size, velocity, angle, and composition
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## NASA API Integration

This app now includes **real asteroid data** from NASA's Near Earth Object Web Service (NeoWs)!

### Getting Started with NASA Data

1. **Get a free API key** at [api.nasa.gov](https://api.nasa.gov/) (takes 30 seconds)
2. Add it to `.env.local`:
   ```bash
   NEXT_PUBLIC_NASA_API_KEY=your_key_here
   ```
3. Click "Real NASA Asteroids" in the sidebar to browse actual asteroids
4. Select any asteroid to simulate its impact with real diameter and velocity data

**Features:**
- Browse real Near Earth Objects from NASA's database
- View official names, diameters, and approach velocities
- See which asteroids are classified as Potentially Hazardous (PHA)
- Auto-fill impact parameters with real NASA data

For detailed documentation, see [NASA_API_INTEGRATION.md](./NASA_API_INTEGRATION.md)

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

## Usage

1. **Select Impact Location**: Click anywhere on the interactive map
2. **Choose a Preset** (optional): Select from historical events like Tunguska or Chicxulub
3. **Adjust Parameters**: Use sliders to customize:
   - Diameter (1m - 1km, logarithmic scale)
   - Velocity (11 - 72 km/s)
   - Impact Angle (15° - 90°)
   - Composition (Iron, Stony, Carbonaceous, Comet)
4. **View Results**: See energy released, crater size, seismic magnitude, and damage zones

## Impact Zones

- **🟤 Crater**: Impact crater (surface impacts only)
- **🟠 Thermal**: 3rd degree burn radius
- **🔴 20 psi**: Concrete buildings severely damaged
- **🟡 5 psi**: Most buildings collapse
- **🟡 1 psi**: Glass shatters, minor injuries

## Physics Calculations

The simulator uses equations from Collins et al. (2005) and Marcus et al. (2010):

- **Kinetic Energy**: E = ½mv²
- **Crater Formation**: Based on transient crater scaling
- **Air Blast**: TNT-equivalent scaling laws
- **Thermal Radiation**: Radiative energy distribution
- **Seismic Effects**: Richter scale magnitude

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Mapping**: React Leaflet + OpenStreetMap
- **Styling**: Tailwind CSS
- **Physics**: Custom impact calculator based on scientific research

## Project Structure

```
meteor-impact-cal2/
├── app/
│   ├── page.tsx              # Main application component
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   ├── Map/
│   │   └── InteractiveMap.tsx    # Leaflet map component
│   └── UI/
│       ├── ParameterPanel.tsx    # Input controls
│       └── ResultsPanel.tsx      # Impact results display
├── lib/
│   ├── impactCalculator.ts   # Physics calculations
│   └── presets.ts            # Historical scenarios
└── types/
    └── impact.types.ts       # TypeScript type definitions
```

## Scientific References

- Collins, G.S., Melosh, H.J., Marcus, R.A. (2005). "Earth Impact Effects Program"
- Marcus, R., Melosh, H.J., Collins, G. (2010). "Earth Impact Effects Program: A Web-based computer program for calculating the regional environmental consequences of a meteoroid impact on Earth"

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

## License

MIT

## Author

Built for NASA Space Apps 2025

