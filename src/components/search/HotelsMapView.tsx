'use client';

import { useState, useCallback, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, OverlayView } from '@react-google-maps/api';
import { SearchHotelResult } from '@/types/api';
import { X, ChevronLeft, Star, MapPin, Heart } from 'lucide-react';
import Image from 'next/image';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

interface HotelsMapViewProps {
  hotels: SearchHotelResult[];
  onClose: () => void;
  searchParams?: URLSearchParams;
}

interface HotelMarkerProps {
  isSelected: boolean;
  onClick: () => void;
  price: number;
  hasDiscount: boolean;
  discountPercent: number;
}

// Custom price marker component like Trip.com
function HotelPriceMarker({ isSelected, onClick, price, hasDiscount, discountPercent }: HotelMarkerProps) {
  const formatPrice = (p: number) => {
    if (p >= 1000000) return `₮${(p / 1000000).toFixed(1)}M`;
    if (p >= 1000) return `₮${Math.round(p / 1000)}K`;
    return `₮${p}`;
  };

  return (
    <button
      onClick={onClick}
      className={`
        relative px-2 py-1 rounded-lg font-semibold text-sm shadow-lg
        transition-all duration-200 transform hover:scale-110 hover:z-50
        ${isSelected 
          ? 'bg-primary text-white scale-110 z-40' 
          : hasDiscount 
            ? 'bg-red-500 text-white hover:bg-red-600' 
            : 'bg-white text-gray-900 hover:bg-gray-50 border border-gray-200'
        }
      `}
      style={{ 
        minWidth: '60px',
        whiteSpace: 'nowrap'
      }}
    >
      {hasDiscount && !isSelected && (
        <span className="absolute -top-2 -right-2 bg-yellow-400 text-gray-900 text-xs px-1 rounded font-bold">
          -{discountPercent}%
        </span>
      )}
      {formatPrice(price)}
      {/* Arrow pointer */}
      <div 
        className={`absolute left-1/2 -bottom-2 w-0 h-0 -translate-x-1/2
          border-l-[6px] border-l-transparent
          border-r-[6px] border-r-transparent
          border-t-[8px] ${isSelected ? 'border-t-primary' : hasDiscount ? 'border-t-red-500' : 'border-t-white'}
        `}
      />
    </button>
  );
}

// Hotel card in sidebar
interface HotelSidebarCardProps {
  hotel: SearchHotelResult;
  isSelected: boolean;
  onClick: () => void;
  searchParams?: URLSearchParams;
}

function HotelSidebarCard({ hotel, isSelected, onClick, searchParams }: HotelSidebarCardProps) {
  const getStarRating = (rating: string) => {
    const match = rating.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  };

  const stars = getStarRating(hotel.rating_stars.value);
  
  const getPricingInfo = () => {
    const cheapest = hotel.cheapest_room;
    if (!cheapest) return { hasDiscount: false, price: 0, originalPrice: 0, discountPercent: 0 };
    
    const rawPrice = cheapest.price_per_night_raw || cheapest.price_per_night;
    const adjustedPrice = cheapest.price_per_night_adjusted || cheapest.price_per_night;
    const hasDiscount = rawPrice > adjustedPrice;
    const discountPercent = hasDiscount ? Math.round((1 - adjustedPrice / rawPrice) * 100) : 0;
    
    return { hasDiscount, price: adjustedPrice, originalPrice: rawPrice, discountPercent };
  };

  const pricing = getPricingInfo();
  const formatPrice = (price: number) => new Intl.NumberFormat('mn-MN').format(price);

  const buildHotelUrl = () => {
    let url = `/hotel/${hotel.hotel_id}`;
    if (searchParams) url += `?${searchParams.toString()}`;
    return url;
  };

  const imageUrl = typeof hotel.images?.cover === 'string' 
    ? hotel.images.cover 
    : hotel.images?.cover?.url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop';

  return (
    <div
      onClick={onClick}
      className={`
        flex gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200
        ${isSelected 
          ? 'bg-blue-50 border-2 border-primary shadow-md' 
          : 'bg-white border border-gray-200 hover:border-gray-300 hover:shadow-sm'
        }
      `}
    >
      {/* Image */}
      <div className="relative w-24 h-20 flex-shrink-0 rounded-lg overflow-hidden">
        <Image
          src={imageUrl}
          alt={hotel.property_name}
          fill
          className="object-cover"
          sizes="96px"
          unoptimized
        />
        {pricing.hasDiscount && (
          <div className="absolute top-1 left-1 bg-red-500 text-white text-xs px-1 rounded font-bold">
            -{pricing.discountPercent}%
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-900 text-sm line-clamp-1 hover:text-primary">
          <a href={buildHotelUrl()} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
            {hotel.property_name}
          </a>
        </h4>
        
        {stars > 0 && (
          <div className="flex mt-0.5">
            {[...Array(stars)].map((_, i) => (
              <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
            ))}
          </div>
        )}

        <div className="flex items-center text-gray-500 text-xs mt-1">
          <MapPin className="w-3 h-3 mr-0.5" />
          <span className="line-clamp-1">
            {hotel.location.soum || hotel.location.district || hotel.location.province_city}
          </span>
        </div>

        {/* Price */}
        <div className="mt-1.5">
          {pricing.hasDiscount && (
            <span className="text-gray-400 text-xs line-through mr-1">
              ₮{formatPrice(pricing.originalPrice)}
            </span>
          )}
          <span className="text-primary font-bold text-sm">
            ₮{formatPrice(pricing.price)}
          </span>
        </div>
      </div>

      {/* Favorite Button */}
      <button 
        className="p-1 h-fit hover:bg-gray-100 rounded-full"
        onClick={(e) => e.stopPropagation()}
      >
        <Heart className="w-4 h-4 text-gray-400" />
      </button>
    </div>
  );
}

export default function HotelsMapView({ hotels, onClose, searchParams }: HotelsMapViewProps) {
  const { t } = useHydratedTranslation();
  const [selectedHotelId, setSelectedHotelId] = useState<number | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

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
      .map(hotel => ({
        hotel,
        coords: extractCoordinates(hotel.google_map),
        pricing: (() => {
          const cheapest = hotel.cheapest_room;
          if (!cheapest) return { price: 0, hasDiscount: false, discountPercent: 0 };
          const rawPrice = cheapest.price_per_night_raw || cheapest.price_per_night;
          const adjustedPrice = cheapest.price_per_night_adjusted || cheapest.price_per_night;
          const hasDiscount = rawPrice > adjustedPrice;
          const discountPercent = hasDiscount ? Math.round((1 - adjustedPrice / rawPrice) * 100) : 0;
          return { price: adjustedPrice, hasDiscount, discountPercent };
        })()
      }))
      .filter(item => item.coords !== null) as Array<{
        hotel: SearchHotelResult;
        coords: { lat: number; lng: number };
        pricing: { price: number; hasDiscount: boolean; discountPercent: number };
      }>;
  }, [hotels, extractCoordinates]);

  // Calculate center and bounds
  const defaultCenter = useMemo(() => {
    if (hotelsWithCoords.length === 0) {
      return { lat: 47.918873, lng: 106.917017 }; // Ulaanbaatar default
    }
    const avgLat = hotelsWithCoords.reduce((sum, h) => sum + h.coords.lat, 0) / hotelsWithCoords.length;
    const avgLng = hotelsWithCoords.reduce((sum, h) => sum + h.coords.lng, 0) / hotelsWithCoords.length;
    return { lat: avgLat, lng: avgLng };
  }, [hotelsWithCoords]);

  const onMapLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
    
    // Fit bounds to show all hotels
    if (hotelsWithCoords.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      hotelsWithCoords.forEach(item => {
        bounds.extend(item.coords);
      });
      mapInstance.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });
    }
  }, [hotelsWithCoords]);

  const handleHotelSelect = useCallback((hotelId: number, coords: { lat: number; lng: number }) => {
    setSelectedHotelId(hotelId);
    if (map) {
      map.panTo(coords);
      map.setZoom(16);
    }
  }, [map]);

  const selectedHotel = hotelsWithCoords.find(h => h.hotel.hotel_id === selectedHotelId);

  if (loadError) {
    return (
      <div className="fixed inset-0 z-50 bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-semibold mb-2">Google Maps ачаалахад алдаа гарлаа</p>
          <button onClick={onClose} className="text-primary hover:underline">
            Буцах
          </button>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="fixed inset-0 z-50 bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-gray-600">{t('loading', 'Ачааллаж байна...')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-white flex">
      {/* Sidebar with hotel list */}
      <div className="w-[320px] h-full flex flex-col border-r border-gray-200 bg-gray-50">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-white">
          <button
            onClick={onClose}
            className="flex items-center gap-1 text-primary hover:text-primary/80 font-medium text-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            {t('backToList', 'Жагсаалт руу буцах')}
          </button>
        </div>

        {/* Hotels List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {hotelsWithCoords.map((item) => (
            <HotelSidebarCard
              key={item.hotel.hotel_id}
              hotel={item.hotel}
              isSelected={item.hotel.hotel_id === selectedHotelId}
              onClick={() => handleHotelSelect(item.hotel.hotel_id, item.coords)}
              searchParams={searchParams}
            />
          ))}
          
          {hotelsWithCoords.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <MapPin className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>{t('noHotelsWithLocation', 'Байршилтай зочид буудал олдсонгүй')}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-gray-200 bg-white">
          <p className="text-sm text-gray-600 text-center">
            {hotelsWithCoords.length} {t('hotelsOnMap', 'зочид буудал газрын зураг дээр')}
          </p>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={defaultCenter}
          zoom={13}
          onLoad={onMapLoad}
          options={{
            zoomControl: true,
            streetViewControl: true,
            mapTypeControl: true,
            fullscreenControl: true,
            // Use default Google Maps style for maximum detail
          }}
        >
          {hotelsWithCoords.map((item) => (
            <OverlayView
              key={item.hotel.hotel_id}
              position={item.coords}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            >
              <HotelPriceMarker
                isSelected={item.hotel.hotel_id === selectedHotelId}
                onClick={() => handleHotelSelect(item.hotel.hotel_id, item.coords)}
                price={item.pricing.price}
                hasDiscount={item.pricing.hasDiscount}
                discountPercent={item.pricing.discountPercent}
              />
            </OverlayView>
          ))}
        </GoogleMap>

        {/* Close button on map */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* Selected hotel preview card */}
        {selectedHotel && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[400px] max-w-[90%] bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
            <HotelPreviewCard 
              hotel={selectedHotel.hotel} 
              pricing={selectedHotel.pricing}
              searchParams={searchParams}
              onClose={() => setSelectedHotelId(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// Preview card that appears when a hotel is selected on the map
interface HotelPreviewCardProps {
  hotel: SearchHotelResult;
  pricing: { price: number; hasDiscount: boolean; discountPercent: number };
  searchParams?: URLSearchParams;
  onClose: () => void;
}

function HotelPreviewCard({ hotel, pricing, searchParams, onClose }: HotelPreviewCardProps) {
  const { t } = useHydratedTranslation();
  
  const getStarRating = (rating: string) => {
    const match = rating.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  };

  const stars = getStarRating(hotel.rating_stars.value);
  const formatPrice = (price: number) => new Intl.NumberFormat('mn-MN').format(price);

  const buildHotelUrl = () => {
    let url = `/hotel/${hotel.hotel_id}`;
    if (searchParams) url += `?${searchParams.toString()}`;
    return url;
  };

  const imageUrl = typeof hotel.images?.cover === 'string' 
    ? hotel.images.cover 
    : hotel.images?.cover?.url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop';

  return (
    <div className="flex">
      {/* Image */}
      <div className="relative w-36 h-28 flex-shrink-0">
        <Image
          src={imageUrl}
          alt={hotel.property_name}
          fill
          className="object-cover"
          sizes="144px"
          unoptimized
        />
        {pricing.hasDiscount && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded font-bold">
            -{pricing.discountPercent}%
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 p-3 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-full"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>

        <h4 className="font-semibold text-gray-900 pr-6 line-clamp-1">
          {hotel.property_name}
        </h4>
        
        {stars > 0 && (
          <div className="flex mt-0.5">
            {[...Array(stars)].map((_, i) => (
              <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
            ))}
          </div>
        )}

        <div className="flex items-center text-gray-500 text-xs mt-1">
          <MapPin className="w-3 h-3 mr-0.5" />
          <span>{hotel.location.soum || hotel.location.district || hotel.location.province_city}</span>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div>
            <span className="text-primary font-bold">
              ₮{formatPrice(pricing.price)}
            </span>
            <span className="text-xs text-gray-500 ml-1">
              / {t('perNight', 'шөнө')}
            </span>
          </div>
          <a
            href={buildHotelUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary hover:bg-primary/90 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
          >
            {t('viewDetails', 'Дэлгэрэнгүй')}
          </a>
        </div>
      </div>
    </div>
  );
}
