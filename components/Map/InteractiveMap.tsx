'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ImpactZone } from '@/types/impact.types';

// Fix for default marker icons in React
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';

interface InteractiveMapProps {
  impactLocation: { lat: number; lng: number } | null;
  impactZones: ImpactZone[];
  onLocationSelect: (lat: number, lng: number) => void;
}

export default function InteractiveMap({
  impactLocation,
  impactZones,
  onLocationSelect,
}: InteractiveMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const circlesRef = useRef<L.Circle[]>([]);

  useEffect(() => {
    // Initialize map only once
    if (!mapRef.current) {
      const map = L.map('map', {
        center: [20, 0],
        zoom: 2,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap contributors © CARTO',
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      // Add click handler
      map.on('click', (e: L.LeafletMouseEvent) => {
        onLocationSelect(e.latlng.lat, e.latlng.lng);
      });

      mapRef.current = map;
    }

    return () => {
      // Cleanup on unmount
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [onLocationSelect]);

  // Update impact marker
  useEffect(() => {
    if (!mapRef.current) return;

    // Remove old marker
    if (markerRef.current) {
      markerRef.current.remove();
    }

    // Add new marker
    if (impactLocation) {
      const marker = L.marker([impactLocation.lat, impactLocation.lng], {
        title: 'Impact Location',
      }).addTo(mapRef.current);

      marker.bindPopup('Impact Location').openPopup();
      markerRef.current = marker;
    }
  }, [impactLocation]);

  // Update impact zones
  useEffect(() => {
    if (!mapRef.current) return;

    // Remove old circles
    circlesRef.current.forEach((circle) => circle.remove());
    circlesRef.current = [];

    // Add new circles
    if (impactLocation && impactZones.length > 0) {
      impactZones.forEach((zone) => {
        const circle = L.circle([zone.lat, zone.lng], {
          radius: zone.radius,
          color: zone.color,
          fillColor: zone.color,
          fillOpacity: 0.2,
          weight: 2,
        }).addTo(mapRef.current!);

        circle.bindPopup(`<strong>${zone.label}</strong><br>Radius: ${(zone.radius / 1000).toFixed(2)} km`);
        circlesRef.current.push(circle);
      });

      // Auto-zoom to fit all impact zones
      // Calculate bounds by finding the furthest extent of all circles
      const bounds = L.latLngBounds([]);
      
      impactZones.forEach((zone) => {
        // Calculate the geographic bounds of each circle mathematically
        // Using approximation: 1 degree latitude ≈ 111km
        const radiusInKm = zone.radius / 1000;
        const latOffset = radiusInKm / 111;
        const lngOffset = radiusInKm / (111 * Math.cos(zone.lat * Math.PI / 180));

        // Extend bounds to include circle's extent
        bounds.extend([zone.lat + latOffset, zone.lng + lngOffset]);
        bounds.extend([zone.lat - latOffset, zone.lng - lngOffset]);
        bounds.extend([zone.lat + latOffset, zone.lng - lngOffset]);
        bounds.extend([zone.lat - latOffset, zone.lng + lngOffset]);
      });

      // Fit the map to show all zones with some padding
      if (bounds.isValid()) {
        mapRef.current.fitBounds(bounds, {
          padding: [50, 50], // 50px padding on all sides
          maxZoom: 15, // Don't zoom in too close for small impacts
          animate: true,
          duration: 0.5,
        });
      }
    }
  }, [impactLocation, impactZones]);

  return (
    <div className="relative w-full h-full">
      <div id="map" className="w-full h-full" />
    </div>
  );
}
