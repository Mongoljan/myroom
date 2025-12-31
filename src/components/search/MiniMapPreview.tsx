'use client';

import { useMemo, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, OverlayView } from '@react-google-maps/api';
import { SearchHotelResult } from '@/types/api';
import { MapPin } from 'lucide-react';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

interface MiniMapPreviewProps {
  hotels: SearchHotelResult[];
  onShowFullMap: () => void;
  className?: string;
}

// Simple dot marker for mini map
function SimpleDotMarker({ hasDiscount }: { hasDiscount: boolean }) {
  return (
    <div 
      className={`
        w-3 h-3 rounded-full border-2 border-white shadow-md
        ${hasDiscount ? 'bg-red-500' : 'bg-primary'}
      `}
    />
  );
}

export default function MiniMapPreview({ hotels, onShowFullMap, className = '' }: MiniMapPreviewProps) {
  const { t } = useHydratedTranslation();

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  // Extract coordinates from google_map URL
  const extractCoordinates = useCallback((url: string): { lat: number; lng: number } | null => {
    if (!url) return null;
    const match = url.match(/q=([-\d.]+),([-\d.]+)/);
    if (match) {
      return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
    }
    return null;
  }, []);

  // Get hotels with valid coordinates
  const hotelsWithCoords = useMemo(() => {
    return hotels
      .map(hotel => {
        const coords = extractCoordinates(hotel.google_map);
        const cheapest = hotel.cheapest_room;
        const rawPrice = cheapest?.price_per_night_raw || cheapest?.price_per_night || 0;
        const adjustedPrice = cheapest?.price_per_night_adjusted || cheapest?.price_per_night || 0;
        const hasDiscount = rawPrice > adjustedPrice;
        
        return { hotel, coords, hasDiscount };
      })
      .filter(item => item.coords !== null) as Array<{
        hotel: SearchHotelResult;
        coords: { lat: number; lng: number };
        hasDiscount: boolean;
      }>;
  }, [hotels, extractCoordinates]);

  // Calculate center
  const center = useMemo(() => {
    if (hotelsWithCoords.length === 0) {
      return { lat: 47.918873, lng: 106.917017 }; // Ulaanbaatar default
    }
    const avgLat = hotelsWithCoords.reduce((sum, h) => sum + h.coords.lat, 0) / hotelsWithCoords.length;
    const avgLng = hotelsWithCoords.reduce((sum, h) => sum + h.coords.lng, 0) / hotelsWithCoords.length;
    return { lat: avgLat, lng: avgLng };
  }, [hotelsWithCoords]);

  const onMapLoad = useCallback((mapInstance: google.maps.Map) => {
    if (hotelsWithCoords.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      hotelsWithCoords.forEach(item => {
        bounds.extend(item.coords);
      });
      mapInstance.fitBounds(bounds, { top: 20, right: 20, bottom: 20, left: 20 });
    }
  }, [hotelsWithCoords]);

  // Loading state
  if (!isLoaded) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`} style={{ height: '180px' }}>
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          <p className="text-xs text-gray-500">{t('loading', 'Ачааллаж байна...')}</p>
        </div>
      </div>
    );
  }

  // Error state
  if (loadError) {
    return (
      <div className={`bg-red-50 rounded-lg flex items-center justify-center ${className}`} style={{ height: '180px' }}>
        <div className="text-center p-4">
          <MapPin className="w-8 h-8 mx-auto mb-2 text-red-400" />
          <p className="text-xs text-red-600">{t('mapError', 'Газрын зураг ачаалахад алдаа гарлаа')}</p>
        </div>
      </div>
    );
  }

  // No hotels with coordinates
  if (hotelsWithCoords.length === 0) {
    return (
      <div className={`bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200 ${className}`} style={{ height: '180px' }}>
        <div className="text-center p-4">
          <MapPin className="w-8 h-8 mx-auto mb-2 text-gray-300" />
          <p className="text-xs text-gray-500">{t('noHotelsWithLocation', 'Байршилтай зочид буудал алга')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative rounded-lg overflow-hidden ${className}`}>
      {/* Map */}
      <div style={{ height: '180px' }}>
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={center}
          zoom={12}
          onLoad={onMapLoad}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
            scaleControl: false,
            rotateControl: false,
            panControl: false,
            scrollwheel: false,
            draggable: false,
            disableDoubleClickZoom: true,
            clickableIcons: false,
            styles: [
              {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }]
              },
              {
                featureType: 'transit',
                stylers: [{ visibility: 'off' }]
              }
            ]
          }}
        >
          {hotelsWithCoords.map((item) => (
            <OverlayView
              key={item.hotel.hotel_id}
              position={item.coords}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            >
              <SimpleDotMarker hasDiscount={item.hasDiscount} />
            </OverlayView>
          ))}
        </GoogleMap>
      </div>

      {/* Overlay button to show full map */}
      <button
        onClick={onShowFullMap}
        className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center group"
      >
        <div className="bg-white/95 backdrop-blur-sm text-primary px-4 py-2 rounded-lg shadow-lg font-medium text-sm flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:scale-100 scale-95">
          <MapPin className="w-4 h-4" />
          {t('showOnMap', 'Газрын зураг дээр харах')}
        </div>
      </button>

      {/* Hotel count badge */}
      <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-sm text-gray-700 px-2 py-1 rounded text-xs font-medium shadow-sm">
        {hotelsWithCoords.length} {t('hotels', 'зочид буудал')}
      </div>
    </div>
  );
}
