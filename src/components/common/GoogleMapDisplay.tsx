'use client';

import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { useState } from 'react';

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

interface GoogleMapDisplayProps {
  googleMapUrl?: string;
  defaultLat?: number;
  defaultLng?: number;
  zoom?: number;
  editable?: boolean;
  onLocationChange?: (lat: number, lng: number) => void;
  height?: string; // Custom height (default: '400px')
  containerClassName?: string; // Additional container classes
}

/**
 * GoogleMapDisplay Component
 *
 * Displays an interactive Google Map with a marker.
 * Can be used in read-only mode or editable mode where users can click to set location.
 *
 * @param googleMapUrl - Optional Google Maps URL in format: https://www.google.com/maps?q=lat,lng
 * @param defaultLat - Default latitude if no URL provided (default: Ulaanbaatar)
 * @param defaultLng - Default longitude if no URL provided (default: Ulaanbaatar)
 * @param zoom - Map zoom level (default: 15)
 * @param editable - Allow clicking map to change location (default: false)
 * @param onLocationChange - Callback when location changes (only in editable mode)
 */
export default function GoogleMapDisplay({
  googleMapUrl,
  defaultLat = 47.918873, // Ulaanbaatar, Mongolia
  defaultLng = 106.917017,
  zoom = 15,
  editable = false,
  onLocationChange,
  height = '400px',
  containerClassName = '',
}: GoogleMapDisplayProps) {

  // Extract coordinates from Google Maps URL
  const extractCoordinates = (url: string) => {
    const match = url.match(/q=([-\d.]+),([-\d.]+)/);
    if (match) {
      const [, lat, lng] = match;
      return { lat: parseFloat(lat), lng: parseFloat(lng) };
    }
    return null;
  };

  const coords = googleMapUrl ? extractCoordinates(googleMapUrl) : null;
  const [position, setPosition] = useState({
    lat: coords?.lat || defaultLat,
    lng: coords?.lng || defaultLng,
  });

  const { isLoaded, loadError} = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  const mapContainerStyle = {
    width: '100%',
    height: height,
    borderRadius: '8px',
  };

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (!editable || !e.latLng) return;

    const lat = e.latLng.lat();
    const lng = e.latLng.lng();

    setPosition({ lat, lng });
    onLocationChange?.(lat, lng);
  };

  // Error state
  if (loadError) {
    return (
      <div className={`w-full bg-red-50 border border-red-200 rounded-lg flex items-center justify-center ${containerClassName}`} style={{ height }}>
        <div className="text-center p-4">
          <p className="text-red-600 font-semibold mb-2">Error loading Google Maps</p>
          <p className="text-red-500 text-sm">{loadError.message}</p>
          <p className="text-gray-600 text-xs mt-2">
            Please check your API key configuration in .env.local
          </p>
        </div>
      </div>
    );
  }

  // Loading state
  if (!isLoaded) {
    return (
      <div className={`w-full bg-gray-100 rounded-lg flex items-center justify-center ${containerClassName}`} style={{ height }}>
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  // Map loaded
  return (
    <div className={`relative ${containerClassName}`}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={position}
        zoom={zoom}
        onClick={handleMapClick}
        options={{
          streetViewControl: true,
          mapTypeControl: true,
          fullscreenControl: true,
          zoomControl: true,
          // Use default Google Maps style for maximum detail
        }}
      >
        <Marker position={position} />
      </GoogleMap>

      {editable && (
        <div className="mt-2 text-sm text-gray-600">
          Click on the map to set location: {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
        </div>
      )}
    </div>
  );
}
