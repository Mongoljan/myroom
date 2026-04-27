'use client';

import { useCallback, useMemo, useState } from 'react';
import { GoogleMap, useJsApiLoader, OverlayView } from '@react-google-maps/api';
import { SearchHotelResult } from '@/types/api';
import { Maximize2 } from 'lucide-react';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

interface HotelsMapPreviewProps {
  hotels: SearchHotelResult[];
  onExpand: () => void;
  height?: number;
}

const extractCoordinates = (url: string): { lat: number; lng: number } | null => {
  if (!url) return null;
  const match = url.match(/q=([-\d.]+),([-\d.]+)/);
  if (match) return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
  return null;
};

const formatPrice = (p: number) => {
  if (p >= 1000000) return `₮${(p / 1000000).toFixed(1)}M`;
  if (p >= 1000) return `₮${Math.round(p / 1000)}K`;
  return `₮${p}`;
};

export default function HotelsMapPreview({ hotels, onExpand, height = 280 }: HotelsMapPreviewProps) {
  const { t } = useHydratedTranslation();
  const [, setMap] = useState<google.maps.Map | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  const hotelsWithCoords = useMemo(() => {
    return hotels
      .map(h => {
        const coords = extractCoordinates(h.google_map);
        const cheapest = h.cheapest_room;
        const price = cheapest?.price_per_night_adjusted || cheapest?.price_per_night || 0;
        return coords ? { hotel: h, coords, price } : null;
      })
      .filter(Boolean) as Array<{ hotel: SearchHotelResult; coords: { lat: number; lng: number }; price: number }>;
  }, [hotels]);

  const center = useMemo(() => {
    if (hotelsWithCoords.length === 0) return { lat: 47.918873, lng: 106.917017 };
    const lat = hotelsWithCoords.reduce((s, h) => s + h.coords.lat, 0) / hotelsWithCoords.length;
    const lng = hotelsWithCoords.reduce((s, h) => s + h.coords.lng, 0) / hotelsWithCoords.length;
    return { lat, lng };
  }, [hotelsWithCoords]);

  const onMapLoad = useCallback((m: google.maps.Map) => {
    setMap(m);
    if (hotelsWithCoords.length > 1) {
      const bounds = new google.maps.LatLngBounds();
      hotelsWithCoords.forEach(h => bounds.extend(h.coords));
      m.fitBounds(bounds, 60);
    }
  }, [hotelsWithCoords]);

  if (loadError) return null;

  return (
    <div
      className="relative w-full rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 mb-4"
      style={{ height }}
    >
      {!isLoaded ? (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
        </div>
      ) : (
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={center}
          zoom={12}
          onLoad={onMapLoad}
          options={{
            disableDefaultUI: true,
            zoomControl: true,
            gestureHandling: 'cooperative',
            clickableIcons: false,
          }}
        >
          {hotelsWithCoords.map(({ hotel, coords, price }) => (
            <OverlayView
              key={hotel.hotel_id}
              position={coords}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
              getPixelPositionOffset={(w, h) => ({ x: -(w / 2), y: -h })}
            >
              <button
                onClick={onExpand}
                className="px-2 py-0.5 rounded-md text-xs font-semibold bg-white text-gray-900 border border-gray-300 shadow hover:bg-primary hover:text-white transition-colors"
              >
                {price > 0 ? formatPrice(price) : '•'}
              </button>
            </OverlayView>
          ))}
        </GoogleMap>
      )}

      <button
        onClick={onExpand}
        className="absolute top-3 right-3 z-10 inline-flex items-center gap-1.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <Maximize2 className="w-3.5 h-3.5" />
        {t('search.showOnMap', 'Газрын зураг дэлгэрэнгүй')}
      </button>
    </div>
  );
}
