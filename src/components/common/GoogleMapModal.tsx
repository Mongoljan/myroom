'use client';

import { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import GoogleMapDisplay from './GoogleMapDisplay';
import { 
  X, ExternalLink, Train, Landmark, Utensils, ShoppingBag, 
  Star, MapPin, Plane, Navigation, Loader2
} from 'lucide-react';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import { useNearbyPlaces } from '@/hooks/useNearbyPlaces';

interface NearbyPlace {
  name: string;
  distance: string;
  duration?: string;
  category: 'transport' | 'landmarks' | 'dining' | 'shopping';
}

interface HotelInfo {
  id?: number;
  name: string;
  address?: string;
  rating?: number;
  reviewCount?: number;
  reviewScore?: number;
  reviewLabel?: string;
  imageUrl?: string;
  price?: number;
  onSelectRooms?: () => void;
}

interface GoogleMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  googleMapUrl?: string;
  hotelName?: string;
  hotelAddress?: string;
  defaultLat?: number;
  defaultLng?: number;
  zoom?: number;
  nearbyPlaces?: NearbyPlace[];
  hotelInfo?: HotelInfo;
}

type Category = 'transport' | 'landmarks' | 'dining' | 'shopping';

const categoryConfig = {
  transport: { 
    icon: Train, 
    label: 'Transport',
  },
  landmarks: { icon: Landmark, label: 'Landmarks' },
  dining: { icon: Utensils, label: 'Dining' },
  shopping: { icon: ShoppingBag, label: 'Shopping' },
};

/**
 * Extract coordinates from Google Maps URL
 */
function extractCoordsFromUrl(url: string): { lat: number; lng: number } | null {
  if (!url) return null;
  
  // Try format: https://www.google.com/maps?q=lat,lng
  const match1 = url.match(/q=([-\d.]+),([-\d.]+)/);
  if (match1) {
    return { lat: parseFloat(match1[1]), lng: parseFloat(match1[2]) };
  }

  // Try format: https://www.google.com/maps/@lat,lng,zoom
  const match2 = url.match(/@([-\d.]+),([-\d.]+)/);
  if (match2) {
    return { lat: parseFloat(match2[1]), lng: parseFloat(match2[2]) };
  }

  // Try format: https://maps.google.com/maps/place/.../@lat,lng
  const match3 = url.match(/place\/.*\/@([-\d.]+),([-\d.]+)/);
  if (match3) {
    return { lat: parseFloat(match3[1]), lng: parseFloat(match3[2]) };
  }

  return null;
}

/**
 * GoogleMapModal Component - Trip.com/Booking.com/Hotels.com Style
 *
 * Large modal that displays an interactive embedded Google Map
 * with hotel info card and nearby places/surroundings
 * 
 * Uses Google Places API to fetch real nearby places dynamically
 */
export default function GoogleMapModal({
  isOpen,
  onClose,
  googleMapUrl,
  hotelName = 'Hotel Location',
  hotelAddress,
  defaultLat,
  defaultLng,
  zoom = 15,
  nearbyPlaces: providedNearbyPlaces = [],
  hotelInfo,
}: GoogleMapModalProps) {
  const { t } = useHydratedTranslation();
  const [activeCategory, setActiveCategory] = useState<Category>('transport');
  const [activeTab, setActiveTab] = useState<'surroundings' | 'nearby'>('surroundings');

  // Extract coordinates from Google Maps URL or use provided defaults
  const coordinates = useMemo(() => {
    const urlCoords = extractCoordsFromUrl(googleMapUrl || '');
    if (urlCoords) return urlCoords;
    if (defaultLat && defaultLng) return { lat: defaultLat, lng: defaultLng };
    return null;
  }, [googleMapUrl, defaultLat, defaultLng]);

  // Fetch nearby places using Google Places API
  const { 
    places: fetchedPlaces, 
    transportPlaces,
    landmarkPlaces,
    diningPlaces,
    shoppingPlaces,
    isLoading: isLoadingPlaces,
    error: placesError,
  } = useNearbyPlaces({
    lat: coordinates?.lat,
    lng: coordinates?.lng,
    enabled: isOpen && !!coordinates,
    radius: 10000, // 10km radius to find airports
  });

  // Convert fetched places to NearbyPlace format
  const dynamicPlaces: NearbyPlace[] = useMemo(() => {
    return fetchedPlaces.map(p => ({
      name: p.name,
      distance: p.duration ? `${p.distance} (${p.duration})` : p.distance,
      duration: p.duration,
      category: p.category,
    }));
  }, [fetchedPlaces]);

  // Use provided places, dynamic places, or empty array
  const places = providedNearbyPlaces.length > 0 
    ? providedNearbyPlaces 
    : dynamicPlaces;

  const filteredPlaces = places.filter(place => place.category === activeCategory);

  // Group transport places by type
  const trainStations = places.filter(p => p.category === 'transport' && !p.name.toLowerCase().includes('airport'));
  const airports = places.filter(p => p.category === 'transport' && p.name.toLowerCase().includes('airport'));

  // Category counts from API response
  const categoryCounts = {
    transport: transportPlaces.length || places.filter(p => p.category === 'transport').length,
    landmarks: landmarkPlaces.length || places.filter(p => p.category === 'landmarks').length,
    dining: diningPlaces.length || places.filter(p => p.category === 'dining').length,
    shopping: shoppingPlaces.length || places.filter(p => p.category === 'shopping').length,
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[1800px] w-[98vw] h-[95vh] p-0 gap-0 overflow-hidden bg-gray-100">
        <DialogTitle className="sr-only">{hotelName}</DialogTitle>

        {/* Close Button - Floating */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        <div className="flex h-full">
          {/* Map Section - Full Width */}
          <div className="flex-1 relative">
            <GoogleMapDisplay
              googleMapUrl={googleMapUrl}
              defaultLat={defaultLat}
              defaultLng={defaultLng}
              zoom={zoom}
              height="100%"
              containerClassName="h-full"
            />

            {/* Reset Map Button */}
            <button className="absolute top-4 left-4 bg-white px-3 py-2 rounded-lg shadow-md text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
              <Navigation className="w-4 h-4" />
              {t('hotelDetails.resetMap', 'Reset Map')}
            </button>
          </div>

          {/* Right Sidebar - Hotel Info & Surroundings */}
          <div className="w-[380px] bg-white flex flex-col border-l border-gray-200 shadow-xl">
            {/* Hotel Info Card */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-lg font-bold text-gray-900 line-clamp-1">
                      {hotelInfo?.name || hotelName}
                    </h2>
                    {(hotelInfo?.rating || 0) > 0 && (
                      <div className="flex shrink-0">
                        {[...Array(hotelInfo?.rating || 0)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Address */}
                  <div className="flex items-start gap-1 text-sm text-gray-600 mb-2">
                    <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">
                      {hotelInfo?.address || hotelAddress || 'Ulaanbaatar, Mongolia'}
                    </span>
                  </div>

                  {/* Rating Badge */}
                  {hotelInfo?.reviewScore && (
                    <div className="flex items-center gap-2">
                      <span className="bg-blue-600 text-white text-sm font-bold px-2 py-1 rounded">
                        {hotelInfo.reviewScore.toFixed(1)}
                      </span>
                      <div>
                        <span className="text-blue-600 font-semibold text-sm">
                          {hotelInfo.reviewLabel || t('hotelDetails.veryGood', 'Very good')}
                        </span>
                        {hotelInfo.reviewCount && (
                          <span className="text-gray-500 text-xs ml-1">
                            {hotelInfo.reviewCount} {t('hotelDetails.reviews', 'reviews')}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Select Rooms Button */}
              <button 
                onClick={hotelInfo?.onSelectRooms || onClose}
                className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors"
              >
                {t('hotelDetails.selectRooms', 'Select Rooms')}
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('surroundings')}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'surroundings'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {t('hotelDetails.surroundings', 'Surroundings')}
              </button>
              <button
                onClick={() => setActiveTab('nearby')}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'nearby'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {t('hotelDetails.nearbyProperties', 'Nearby Properties')}
              </button>
            </div>

            {/* Category Pills */}
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
              <div className="flex gap-2 overflow-x-auto">
                {(Object.keys(categoryConfig) as Category[]).map((cat) => {
                  const config = categoryConfig[cat];
                  const Icon = config.icon;
                  const count = categoryCounts[cat];
                  
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                        activeCategory === cat
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {t(`hotelDetails.${cat}`, config.label)}
                      {count > 0 && (
                        <span className={`text-xs ${activeCategory === cat ? 'text-blue-200' : 'text-gray-400'}`}>
                          ({count})
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Places List */}
            <div className="flex-1 overflow-y-auto">
              {/* Loading State */}
              {isLoadingPlaces && (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-3" />
                  <p className="text-sm">{t('hotelDetails.loadingNearbyPlaces', 'Loading nearby places...')}</p>
                </div>
              )}

              {/* Error State */}
              {placesError && !isLoadingPlaces && (
                <div className="p-4 text-center text-gray-500 text-sm">
                  <p>{t('hotelDetails.nearbyPlacesError', 'Could not load nearby places')}</p>
                  <p className="text-xs text-gray-400 mt-1">{placesError}</p>
                </div>
              )}

              {/* Places Content */}
              {!isLoadingPlaces && activeCategory === 'transport' ? (
                <div className="p-4 space-y-4">
                  {/* Train Stations */}
                  {trainStations.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Train className="w-4 h-4 text-gray-600" />
                        <h3 className="text-sm font-semibold text-gray-900">
                          {t('hotelDetails.trainStation', 'Train station')}
                        </h3>
                      </div>
                      <div className="space-y-2">
                        {trainStations.map((place, idx) => (
                          <div key={idx} className="pl-6">
                            <p className="text-sm font-medium text-blue-600 hover:underline cursor-pointer">
                              {place.name}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {place.distance}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Airports */}
                  {airports.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Plane className="w-4 h-4 text-gray-600" />
                        <h3 className="text-sm font-semibold text-gray-900">
                          {t('hotelDetails.airport', 'Airport')}
                        </h3>
                      </div>
                      <div className="space-y-2">
                        {airports.map((place, idx) => (
                          <div key={idx} className="pl-6">
                            <p className="text-sm font-medium text-blue-600 hover:underline cursor-pointer">
                              {place.name}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {place.distance}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Empty transport state */}
                  {trainStations.length === 0 && airports.length === 0 && (
                    <div className="text-center py-8 text-gray-500 text-sm">
                      {t('hotelDetails.noTransportNearby', 'No transport stations found nearby')}
                    </div>
                  )}
                </div>
              ) : !isLoadingPlaces && (
                <div className="p-4 space-y-2">
                  {filteredPlaces.length > 0 ? (
                    filteredPlaces.map((place, idx) => (
                      <div 
                        key={idx} 
                        className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                      >
                        <p className="text-sm text-gray-900">{place.name}</p>
                        <p className="text-sm text-gray-500 shrink-0 ml-2">{place.distance}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500 text-sm">
                      {t('hotelDetails.noPlacesInCategory', 'No places in this category')}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer with external link */}
            {googleMapUrl && (
              <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                <a
                  href={googleMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  {t('hotelDetails.openInGoogleMaps', 'Open in Google Maps')}
                </a>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export type { NearbyPlace, GoogleMapModalProps, HotelInfo };
