'use client';

import Image from 'next/image';
import { Star, MapPin, CheckCircle, Heart, Wifi, Car, Utensils, Users, Dumbbell, Clock } from 'lucide-react';
import { SearchHotelResult, AdditionalInfo, PropertyDetails, RoomPrice, Room } from '@/types/api';
import { SEARCH_DESIGN_SYSTEM, getRoomCapacityIcon, getBedTypeIcon } from '@/styles/search-design-system';
import { useState, useEffect } from 'react';
import { ApiService } from '@/services/api';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';

interface HotelCardProps {
  hotel: SearchHotelResult;
  searchParams?: URLSearchParams;
  viewMode?: 'grid' | 'list';
}

const facilityIcons: { [key: string]: React.ReactNode } = {
  'Free Wi-Fi': <Wifi className="w-3 h-3 text-green-600" />,
  'Free WiFi': <Wifi className="w-3 h-3 text-green-600" />,
  'Parking': <Car className="w-3 h-3 text-blue-600" />,
  'Restaurant': <Utensils className="w-3 h-3 text-orange-600" />,
  'Room Service': <Users className="w-3 h-3 text-purple-600" />,
  'Fitness Center': <Dumbbell className="w-3 h-3 text-red-600" />,
  '24-hour Front Desk': <Clock className="w-3 h-3 text-gray-600" />,
  'Pool': <Users className="w-3 h-3 text-cyan-600" />,
};

export default function BookingStyleHotelCard({ hotel, searchParams, viewMode = 'list' }: HotelCardProps) {
  const { t } = useHydratedTranslation();
  const [propertyDetails, setPropertyDetails] = useState<PropertyDetails | null>(null);
  const [additionalInfo, setAdditionalInfo] = useState<AdditionalInfo | null>(null);
  const [roomPrices, setRoomPrices] = useState<RoomPrice[]>([]);
  const [cheapestRoom, setCheapestRoom] = useState<Room | null>(null);
  const [cheapestPrice, setCheapestPrice] = useState<RoomPrice | null>(null);
  interface RoomReferenceData {
    room_types?: { id: number; name: string }[];
    room_rates?: { id: number; name: string }[];
    bed_types?: { id: number; name: string }[];
  }
  const [roomData, setRoomData] = useState<RoomReferenceData | null>(null);
  const [roomAvailability, setRoomAvailability] = useState<number | null>(null);
  const [availableRoomsWithPrice, setAvailableRoomsWithPrice] = useState<number>(0);
  
  // Get search parameters
  const adults = parseInt(searchParams?.get('adults') || '2');
  const children = parseInt(searchParams?.get('children') || '0');
  const rooms = parseInt(searchParams?.get('rooms') || '1');
  const checkIn = searchParams?.get('check_in') || '';
  const checkOut = searchParams?.get('check_out') || '';
  
  // Calculate nights
  const nights = checkIn && checkOut ? 
    Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))) : 1;
  
  const formatPrice = (price: number) => new Intl.NumberFormat('mn-MN').format(price);
  const getStarRating = (rating: string) => {
    const match = rating.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  };

  // Helper functions to get names from IDs
  const getRoomTypeName = (id: number) => {
    return roomData?.room_types?.find(rt => rt.id === id)?.name || 'Room';
  };

  const getRoomCategoryName = (id: number) => {
    return roomData?.room_rates?.find(rr => rr.id === id)?.name || 'Room';
  };

  // Helper to render capacity icon based on room capacity
  const renderCapacityIcon = (adults: number, children: number = 0) => {
    const icon = getRoomCapacityIcon(adults, children);
    return (
      <span className="text-sm" title={`${adults + children} ${t('search.guests')}`}>
        {icon}
      </span>
    );
  };

  // Helper to get bed icon based on bed type
  const renderBedIcon = (bedTypeId: number) => {
  const bedType = roomData?.bed_types?.find(bt => bt.id === bedTypeId);
    if (!bedType) return <span className="text-sm">🛏️</span>;

    const icon = getBedTypeIcon(bedType.name);
    return (
      <span className="text-sm" title={bedType.name}>
        {icon}
      </span>
    );
  };

  const stars = getStarRating(hotel.rating_stars.value);
  
  // Use ONLY actual hotel data - no made up calculations
  const roomPrice = hotel.cheapest_room?.price_per_night || hotel.min_estimated_total || 0;
  const totalPrice = roomPrice * nights * rooms;
  

  const buildHotelUrl = () => {
    let url = `/hotel/${hotel.hotel_id}`;
    if (searchParams) url += `?${searchParams.toString()}`;
    return url;
  };

  // Load property details, additional info, and room prices
  useEffect(() => {
    if (!hotel.hotel_id) return; // Guard against falsy hotel_id

    const loadPropertyData = async () => {
      try {
        // Load room reference data from API
        const roomDataResponse = await fetch('https://dev.kacc.mn/api/all-room-data/');
        const roomDataJson = await roomDataResponse.json();
        setRoomData(roomDataJson);

        // Load property details
        const detailsArray = await ApiService.getPropertyDetails(hotel.hotel_id);
        const details = detailsArray?.[0];
        if (details) {
          setPropertyDetails(details);
          if (details.Additional_Information) {
            const addInfo = await ApiService.getAdditionalInfo(details.Additional_Information);
            setAdditionalInfo(addInfo);
          }
        }

        // Load room prices
        const prices = await ApiService.getRoomPrices(hotel.hotel_id);
        if (prices && prices.length > 0) {
          setRoomPrices(prices);

          // Find cheapest price
          const sortedPrices = [...prices].sort((a, b) => a.base_price - b.base_price);
          const cheapest = sortedPrices[0];
          setCheapestPrice(cheapest);

          // Load room details for cheapest room
          if (cheapest) {
            try {
              const roomsResponse = await ApiService.getRoomsInHotel(hotel.hotel_id);
              // Ensure we have a valid array response
              const rooms = Array.isArray(roomsResponse) ? roomsResponse : [];

              if (rooms.length > 0) {
                const matchingRoom = rooms.find(
                  r => r.room_type === cheapest.room_type && r.room_category === cheapest.room_category
                );
                const finalRoom = matchingRoom || rooms[0];
                setCheapestRoom(finalRoom);

                // Calculate rooms that have both price AND availability
                const roomsWithPriceAndAvailability = rooms.filter(room => {
                  // Check if this room has a price
                  const hasPrice = prices.some(price =>
                    price.room_type === room.room_type &&
                    price.room_category === room.room_category &&
                    price.base_price > 0
                  );
                  // Check if room has availability to sell
                  const hasAvailability = room.number_of_rooms_to_sell > 0;
                  return hasPrice && hasAvailability;
                });

                // Sum up available rooms with prices
                const totalAvailableWithPrice = roomsWithPriceAndAvailability.reduce(
                  (sum, room) => sum + room.number_of_rooms_to_sell, 0
                );
                setAvailableRoomsWithPrice(totalAvailableWithPrice);

                // Check real-time availability for the cheapest room if dates provided
                if (finalRoom && checkIn && checkOut) {
                  try {
                    const availabilityResponse = await ApiService.checkAvailability(
                      hotel.hotel_id,
                      cheapest.room_type,
                      cheapest.room_category,
                      checkIn,
                      checkOut
                    );
                    setRoomAvailability(availabilityResponse.available_rooms);
                  } catch (availError) {
                    console.error('Failed to check room availability:', availError);
                    setRoomAvailability(null);
                  }
                }
              } else {
                console.warn('No rooms data available for hotel:', hotel.hotel_id);
                setCheapestRoom(null);
              }
            } catch (roomError) {
              console.error('Failed to load room details:', roomError);
              setCheapestRoom(null);
            }
          }
        }
      } catch (error) {
        console.error('Failed to load property data:', error);
      }
    };

    loadPropertyData();
  }, [hotel.hotel_id]);


  if (viewMode === 'list') {
    return (
        <div
          className={`${SEARCH_DESIGN_SYSTEM.COLORS.BG_WHITE} ${SEARCH_DESIGN_SYSTEM.RADIUS.LARGE} ${SEARCH_DESIGN_SYSTEM.COLORS.BORDER_DEFAULT} border ${SEARCH_DESIGN_SYSTEM.SHADOWS.HOVER} ${SEARCH_DESIGN_SYSTEM.TRANSITIONS.DEFAULT} overflow-hidden group cursor-pointer`}
          onClick={() => window.location.href = buildHotelUrl()}
        >
          <div className="flex flex-col md:flex-row">
            {/* Hotel Image */}
            <div className="relative w-full md:w-48 h-40 md:h-40 flex-shrink-0 overflow-hidden">
              <Image
                src={propertyDetails?.property_photos?.[0]?.image || 
                     (typeof hotel.images?.cover === 'string' ? hotel.images.cover : 
                      hotel.images?.cover?.url || 
                      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop')}
                alt={hotel.property_name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="224px"
                unoptimized
              />
              
              
              <button className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full hover:bg-white transition-colors">
                <Heart className="w-3 h-3 text-gray-600" />
              </button>
            </div>

            {/* Hotel Details - Compact */}
            <div className="flex-1 p-2.5 min-w-0">
              <div className="flex justify-between items-start mb-1">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className={`${SEARCH_DESIGN_SYSTEM.TYPOGRAPHY.HOTEL_NAME_SMALL} line-clamp-1 group-hover:${SEARCH_DESIGN_SYSTEM.COLORS.TEXT_BLUE} ${SEARCH_DESIGN_SYSTEM.TRANSITIONS.DEFAULT}`}>
                      {hotel.property_name}
                    </h3>
                    {stars > 0 && (
                      <div className="flex">
                        {[...Array(stars)].map((_, i) => (
                          <Star key={i} className="w-2.5 h-2.5 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className={`flex items-center gap-1 ${SEARCH_DESIGN_SYSTEM.TYPOGRAPHY.DESCRIPTION_SMALL} mb-1`}>
                    <MapPin className="w-3 h-3" />
                    <span>{hotel.location.province_city}</span>
                      {hotel.google_map && (
                    <a
                      href={hotel.google_map}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className={`${SEARCH_DESIGN_SYSTEM.TYPOGRAPHY.LINK} whitespace-nowrap`}
                    >
                      View on Map
                    </a>
                  )}
                  </div>
                </div>
              </div>


              {/* Hotel room capacity info (not search criteria) */}
             

              {/* Enhanced Hotel Info */}
              <div className="mb-2">
   
             

                {/* Hotel Amenities - Enhanced */}
                {hotel.general_facilities && hotel.general_facilities.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {hotel.general_facilities.slice(0, 6).map((facility, index) => (
                      <span key={index} className="inline-flex items-center gap-0.5 text-xs text-gray-600 bg-gray-50 rounded px-1.5 py-0.5 ">
                        {facilityIcons[facility] || <CheckCircle className="w-2.5 h-2.5 text-gray-500" />}
                        <span>{facility}</span>
                      </span>
                    ))}
                    {hotel.general_facilities.length > 6 && (
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        +{hotel.general_facilities.length - 6} more
                      </span>
                    )}
                  </div>
                )}

               
              </div>

              {/* Room Info Section - Middle of Card */}
              {cheapestPrice && cheapestRoom && (
                <div className="border-t border-gray-100 pt-2 mb-2">
                  <div className={`${SEARCH_DESIGN_SYSTEM.COLORS.BG_BLUE_LIGHT} ${SEARCH_DESIGN_SYSTEM.RADIUS.DEFAULT} ${SEARCH_DESIGN_SYSTEM.SPACING.CARD_PADDING_SMALL} space-y-1.5`}>
                    {/* Room Header */}
                    <div className="flex items-center justify-between text-xs">
                      <div className={SEARCH_DESIGN_SYSTEM.TYPOGRAPHY.LABEL}>
                        {getRoomCategoryName(cheapestRoom.room_category)} - {getRoomTypeName(cheapestRoom.room_type)}
                      </div>
                      {((roomAvailability !== null ? roomAvailability : availableRoomsWithPrice) > 0) && (
                        <div className={`${SEARCH_DESIGN_SYSTEM.COLORS.TEXT_GREEN} ${SEARCH_DESIGN_SYSTEM.TYPOGRAPHY.BUTTON_TEXT_SMALL}`}>
                          {roomAvailability !== null ? roomAvailability : availableRoomsWithPrice} {t('hotel.available')}
                        </div>
                      )}
                    </div>

                    {/* Room Details */}
                    <div className={`flex items-center ${SEARCH_DESIGN_SYSTEM.SPACING.SECTION_GAP} ${SEARCH_DESIGN_SYSTEM.TYPOGRAPHY.DESCRIPTION_SMALL}`}>
                      {/* Room capacity */}
                      <div className="flex items-center gap-1">
                        {renderCapacityIcon(cheapestRoom.adultQty || 2, cheapestRoom.childQty || 0)}
                      </div>

                      {/* Bed type with proper icon */}
                      {cheapestRoom.bed_type && (
                        <div className="flex items-center gap-1">
                          {renderBedIcon(cheapestRoom.bed_type)}
                        </div>
                      )}

                      {/* Room size */}
                      {cheapestRoom.room_size && (
                        <div className="flex items-center gap-1">
                          <span className="text-gray-500">{cheapestRoom.room_size}</span>
                        </div>
                      )}

                      {cheapestRoom.is_Bathroom && (
                        <div className="text-blue-600">
                          <span>{t('roomCard.bathroom')}</span>
                        </div>
                      )}
                    </div>

                    {/* Pricing - Clean */}
                    <div className="flex items-center justify-between pt-1.5 border-t border-blue-100">
                      <div className="text-xs text-gray-500">
                        {nights} {nights > 1 ? t('hotel.nights') : t('hotel.night')}, {rooms} {t('hotel.rooms')}
                      </div>
                      <div className="text-right">
                        <div className={SEARCH_DESIGN_SYSTEM.TYPOGRAPHY.PRICE_SECONDARY}>{formatPrice(cheapestPrice.base_price * nights * rooms)}₮</div>
                        {/* <div className="text-xs text-gray-500">total</div> */}
                      </div>
                    </div>
                       <div className="flex items-end justify-between mt-auto">
                <div>
                  
                </div>
                <button className={`bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 ${SEARCH_DESIGN_SYSTEM.RADIUS.DEFAULT} ${SEARCH_DESIGN_SYSTEM.TYPOGRAPHY.BUTTON_TEXT_SMALL} ${SEARCH_DESIGN_SYSTEM.TRANSITIONS.DEFAULT}`}>
              {t('hotel.bookNow')}
                </button>
              </div>
                  </div>
                  
                </div>
              )}

              {/* Pricing Information - Compact */}
           
            </div>
          </div>
        </div>
    );
  }

  // Grid View - Compact
  return (
      <div
        className={`${SEARCH_DESIGN_SYSTEM.COLORS.BG_WHITE} ${SEARCH_DESIGN_SYSTEM.RADIUS.LARGE} ${SEARCH_DESIGN_SYSTEM.COLORS.BORDER_DEFAULT} border ${SEARCH_DESIGN_SYSTEM.SHADOWS.HOVER} ${SEARCH_DESIGN_SYSTEM.TRANSITIONS.DEFAULT} overflow-hidden group h-full flex flex-col cursor-pointer`}
        onClick={() => window.location.href = buildHotelUrl()}
      >
        {/* Hotel Image */}
        <div className="relative h-32 overflow-hidden flex-shrink-0">
          <Image
            src={propertyDetails?.property_photos?.[0]?.image || 
                 (typeof hotel.images?.cover === 'string' ? hotel.images.cover : 
                  hotel.images?.cover?.url || 
                  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop')}
            alt={hotel.property_name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="280px"
            unoptimized
          />
          
          <button className="absolute top-2 right-2 p-1 bg-white/90 rounded-full hover:bg-white transition-colors">
            <Heart className="w-3 h-3 text-gray-600" />
          </button>
        </div>

        {/* Hotel Info - Compact */}
        <div className="p-2.5 flex flex-col flex-1">
          <div className="mb-1">
            <h3 className={`${SEARCH_DESIGN_SYSTEM.TYPOGRAPHY.DESCRIPTION} font-semibold line-clamp-1 group-hover:${SEARCH_DESIGN_SYSTEM.COLORS.TEXT_BLUE} ${SEARCH_DESIGN_SYSTEM.TRANSITIONS.DEFAULT}`}>
              {hotel.property_name}
            </h3>
            {stars > 0 && (
              <div className="flex mt-0.5">
                {[...Array(stars)].map((_, i) => (
                  <Star key={i} className="w-2.5 h-2.5 text-yellow-400 fill-current" />
                ))}
              </div>
            )}
          </div>
          
          <div className={`flex items-center ${SEARCH_DESIGN_SYSTEM.COLORS.TEXT_SECONDARY} mb-1.5`}>
            <MapPin className="w-3 h-3 mr-1" />
            <span className="text-xs line-clamp-1">{hotel.location.province_city}</span>
          </div>

          {/* Key amenities */}
          {hotel.general_facilities && hotel.general_facilities.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {hotel.general_facilities.slice(0, 2).map((facility, index) => (
                <span key={index} className={`${SEARCH_DESIGN_SYSTEM.TYPOGRAPHY.DESCRIPTION_SMALL} ${SEARCH_DESIGN_SYSTEM.COLORS.BG_GRAY_LIGHT} ${SEARCH_DESIGN_SYSTEM.RADIUS.SMALL} px-1 py-0.5`}>
                  {facility}
                </span>
              ))}
            </div>
          )}

          {/* Price - always at bottom */}
          <div className="mt-auto">
            {hotel.cheapest_room && (
              <div className="border-t border-gray-100 pt-1.5">
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-xs text-gray-500">{t('hotel.cheapestRoom')}</div>
                    <div className={SEARCH_DESIGN_SYSTEM.TYPOGRAPHY.PRICE_SMALL}>₮{formatPrice(roomPrice)}</div>
                  </div>
                  <button className={`bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1 ${SEARCH_DESIGN_SYSTEM.RADIUS.DEFAULT} ${SEARCH_DESIGN_SYSTEM.TYPOGRAPHY.BUTTON_TEXT_SMALL} ${SEARCH_DESIGN_SYSTEM.TRANSITIONS.DEFAULT}`}>
                    {t('hotel.viewDetails')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
  );
}