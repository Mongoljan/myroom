'use client';

import Image from 'next/image';
import { Star, MapPin, CheckCircle, Heart, Wifi, Car, Utensils, Users, Dumbbell, Clock, User, Bed, BedDouble, BedSingle } from 'lucide-react';
import { FaChild } from 'react-icons/fa';
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

  // Helper to render person icons based on capacity - Trip.com style
  const renderPersonIcons = (adults: number, children: number = 0) => {
    return (
      <div className="flex items-center gap-0.5" title={`${adults} adults${children > 0 ? `, ${children} children` : ''}`}>
        {/* Adult icons - larger */}
        {Array.from({ length: adults }).map((_, i) => (
          <User key={`adult-${i}`} className="w-4 h-4 text-gray-700" strokeWidth={2.5} />
        ))}
        {/* Child icons - smaller with different style */}
        {children > 0 && Array.from({ length: children }).map((_, i) => (
          <FaChild key={`child-${i}`} className="w-3 h-3 text-gray-500" />
        ))}
      </div>
    );
  };

  // Helper to render bed icons - Trip.com style with appropriate bed types
  const renderBedIcons = (bedTypeId: number, bedCount: number = 1) => {
    const bedType = roomData?.bed_types?.find(bt => bt.id === bedTypeId);
    const bedName = bedType?.name || 'Bed';

    // Determine bed type based on name - Trip.com uses visual cues
    const isSingleBed = bedName.toLowerCase().includes('single') ||
                        bedName.toLowerCase().includes('1 хүний') ||
                        bedName.toLowerCase().includes('ганц');

    const isDoubleBed = bedName.toLowerCase().includes('double') ||
                        bedName.toLowerCase().includes('king') ||
                        bedName.toLowerCase().includes('queen') ||
                        bedName.toLowerCase().includes('2 хүний') ||
                        bedName.toLowerCase().includes('давхар');

    // Use appropriate icon: BedSingle for single beds, BedDouble for double/king/queen
    const BedIcon = isSingleBed ? BedSingle : isDoubleBed ? BedDouble : Bed;

    return (
      <div className="flex items-center gap-1" title={bedName}>
        {Array.from({ length: bedCount }).map((_, i) => (
          <BedIcon
            key={i}
            className={`${isDoubleBed ? 'w-5 h-5' : 'w-4 h-4'} text-gray-600`}
            strokeWidth={2}
          />
        ))}
      </div>
    );
  };

  const stars = getStarRating(hotel.rating_stars.value);
  
  // Calculate pricing with discount support
  const getPricingInfo = () => {
    const cheapest = hotel.cheapest_room;
    if (!cheapest) return {
      hasDiscount: false,
      originalPrice: 0,
      discountedPrice: 0,
      discountPercent: 0,
      pricePerNight: 0,
      originalPricePerNight: 0
    };

    const pricesetting = cheapest.pricesetting;
    const hasDiscount = pricesetting && pricesetting.adjustment_type === 'SUB';

    // Use the raw and adjusted prices from API if available
    const rawPrice = cheapest.price_per_night_raw || cheapest.price_per_night;
    const adjustedPrice = cheapest.price_per_night_adjusted || cheapest.price_per_night;

    let discountPercent = 0;

    // Calculate discount percentage regardless of whether pricesetting exists
    // This handles cases where API provides raw/adjusted prices but pricesetting might be missing
    if (rawPrice > 0 && adjustedPrice < rawPrice) {
      const actualDiscount = rawPrice - adjustedPrice;
      const calculatedPercent = (actualDiscount / rawPrice) * 100;
      // Use Math.ceil to ensure even small discounts show at least 1%
      discountPercent = calculatedPercent > 0 ? Math.max(1, Math.round(calculatedPercent)) : 0;
    }

    // If pricesetting exists and is PERCENT type, use the API value for accuracy
    if (hasDiscount && pricesetting && pricesetting.value_type === 'PERCENT') {
      discountPercent = Math.max(1, Math.round(pricesetting.value));
    }

    // Determine if there's an actual discount (either from pricesetting or price difference)
    const hasActualDiscount = hasDiscount || (rawPrice > adjustedPrice && discountPercent > 0);

    return {
      hasDiscount: hasActualDiscount,
      originalPrice: rawPrice * nights * rooms,
      discountedPrice: adjustedPrice * nights * rooms,
      discountPercent,
      pricePerNight: adjustedPrice || 0,
      originalPricePerNight: rawPrice || 0
    };
  };

  const pricingInfo = getPricingInfo();

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
            <div className="relative w-60 flex-shrink-0 overflow-hidden" style={{ aspectRatio: '4/3' }}>
              <Image
                src={propertyDetails?.property_photos?.[0]?.image ||
                     (typeof hotel.images?.cover === 'string' ? hotel.images.cover :
                      hotel.images?.cover?.url ||
                      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop')}
                alt={hotel.property_name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="240px"
                unoptimized
              />
         
              {/* Discount Badge - Top Left (Trip.com Style) */}
              {pricingInfo.hasDiscount && (
                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                  {Math.round(pricingInfo.discountPercent)}% off
                </div>
              )}
              
              <button className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full hover:bg-white transition-colors">
                <Heart className="w-3 h-3 text-gray-600" />
              </button>
            </div>

            {/* Hotel Details - Compact */}
            <div className="flex-1 p-3 min-w-0">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
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
                  
                  <div className={`flex items-center gap-1 ${SEARCH_DESIGN_SYSTEM.TYPOGRAPHY.DESCRIPTION_SMALL} mb-1.5`}>
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
             

              {/* Enhanced Hotel Info - Removed old amenities display */}
              <div className="mb-2">
                {/* Amenities will be shown in room info section below */}
              </div>

              {/* Room Info Section - Figma Design Style */}
              {cheapestPrice && cheapestRoom && (
                <div className="mt-3 border-t border-gray-200 pt-3 flex ">
                  <div className="flex-2">
                  {/* Room Type Header with Icons */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-gray-900">
                        {getRoomTypeName(cheapestRoom.room_type)}
                      </h4>
                      {/* Capacity Icons */}
                      <div className="flex items-center gap-1">
                        {renderPersonIcons(cheapestRoom.adultQty || 2, cheapestRoom.childQty || 0)}
                        {cheapestRoom.bed_type && (
                          <>
                            <span className="text-gray-300 mx-1">|</span>
                            {renderBedIcons(cheapestRoom.bed_type, 1)}
                          </>
                        )}
                      </div>
                    </div>
                    
                    
                  </div>

                  {/* Room Details */}
                  <div className="space-y-1.5 mb-3">
                    {/* Room Size and Category */}
                    <p className="text-xs text-gray-600">
                      {getRoomCategoryName(cheapestRoom.room_category)}
                      {cheapestRoom.room_size && (
                        <> ({cheapestRoom.room_size}м x {cheapestRoom.room_size}м) • 2ш</>
                      )}
                    </p>

                    {/* Cancellation Policy */}
                    <p className="text-xs text-gray-600">
                      {t('hotel.freeCancellationUntil', { date: '10/31' }, '10/31-нээс өмнө цуцлах боломжтой. (Цуцлалтын хураамжгүй)')}
                    </p>

                    {/* Availability Warning */}
                    {((roomAvailability !== null ? roomAvailability : availableRoomsWithPrice) > 0) && (
                      <p className="text-xs font-medium text-orange-600">
                        {t('hotel.onlyRoomsLeft', { count: roomAvailability !== null ? roomAvailability : availableRoomsWithPrice }, `Сүүлийн ${roomAvailability !== null ? roomAvailability : availableRoomsWithPrice} өрөө үлдлээ.`)}
                      </p>
                    )}
                  </div>

                  {/* Facility Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {hotel.general_facilities.slice(0, 6).map((facility, index) => (
                      <span key={index} className="inline-flex items-center text-xs text-gray-700 bg-gray-100 rounded px-2 py-1 border border-gray-200">
                        {facility}
                      </span>
                    ))}
                  </div>
                  </div>

                  {/* Pricing Section - Figma Style */}
                  <div className="pt-3 border-l pl-4 border-gray-200 flex flex-col justify-between">
                    {/* Price Info - Top Section */}
                    <div>
                      {pricingInfo.hasDiscount ? (
                        <div>
                          <div className="flex justify-end gap-2">
                            {/* Original Price Per Night - Strikethrough */}
                            <div className="text-xl text-gray-500 line-through my-auto">
                              {formatPrice(pricingInfo.originalPricePerNight)} ₮
                            </div>
                            <div className="bg-red-500 w-auto text-xs text-white text-center content-center font-bold px-1 py-[1px] rounded">
                              -{Math.round(pricingInfo.discountPercent)}%
                            </div>
                          </div>
                          {/* Discounted Price Per Night - Bold */}
                          <div className="text-2xl font-bold text-gray-900 text-end">
                            {formatPrice(pricingInfo.pricePerNight)} ₮
                          </div>
                        </div>
                      ) : (
                        <div className="text-2xl font-bold text-gray-900 text-end">
                          {formatPrice(pricingInfo.pricePerNight)} ₮
                        </div>
                      )}

                      {/* Price per night label */}
                      <div className="text-xs text-gray-500 text-end mt-1">
                        {t('hotel.pricePerNightShort', '1 шөнийн үнэ')}
                      </div>

                      {/* Rooms x Nights */}
                      <div className="text-sm text-gray-500 text-end mt-3">
                        {rooms} {t('hotel.rooms', 'өрөө')} x {nights} {t('navigation.night', 'шөнө')}
                      </div>
                      {/* Total Price */}
                      <div className="text-sm text-gray-500 text-end">
                        {t('hotel.totalPrice', 'Нийт үнэ')}: {formatPrice(pricingInfo.discountedPrice)} ₮
                      </div>
                    </div>

                    {/* Green Button - Bottom Section */}
                    <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 mt-4 w-full">
                      {t('hotel.selectRoom', 'Өрөө сонгох')}
                    </button>
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
        <div className="relative w-full overflow-hidden flex-shrink-0" style={{ aspectRatio: '4/3' }}>
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
          
          {/* Discount Badge - Top Left (Trip.com Style) */}
          {pricingInfo.hasDiscount && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              {Math.round(pricingInfo.discountPercent)}% off
            </div>
          )}
          
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

          {/* Price - always at bottom with discount support */}
          <div className="mt-auto">
            {hotel.cheapest_room && (
              <div className="border-t border-gray-100 pt-1.5">
                <div className="flex items-end justify-between">
                  <div>
                    {pricingInfo.hasDiscount ? (
                      <>
                        {/* Discount Badge */}
                        <div className="inline-block bg-red-500 text-white text-xs font-semibold px-1.5 py-0.5 rounded mb-1">
                          {Math.round(pricingInfo.discountPercent)}% off
                        </div>
                        {/* Original Price - Strikethrough */}
                        <div className="text-xs text-gray-400 line-through">
                          ₮{formatPrice(pricingInfo.originalPrice)}
                        </div>
                        {/* Discounted Price */}
                        <div className={`${SEARCH_DESIGN_SYSTEM.TYPOGRAPHY.PRICE_SMALL} text-gray-900`}>
                          ₮{formatPrice(pricingInfo.discountedPrice)}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-xs text-gray-500">{t('hotel.cheapestRoom')}</div>
                        <div className={SEARCH_DESIGN_SYSTEM.TYPOGRAPHY.PRICE_SMALL}>₮{formatPrice(pricingInfo.discountedPrice)}</div>
                      </>
                    )}
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