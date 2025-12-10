'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { 
  Users, 
  Maximize, 
  Bath,
  Bed,
  CheckCircle,
  AlertCircle,
  Calendar,
  Clock
} from 'lucide-react';
import { Room, AvailabilityResponse, AllRoomData, CombinedData, RoomPrice } from '@/types/api';
import { ApiService, formatCurrency } from '@/services/api';
import { IconMappingService } from '@/services/iconMappingService';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';

interface RoomCardProps {
  room: Room;
  hotelId: number;
  checkIn: string;
  checkOut: string;
  onBook: (room: Room, available: number) => void;
}


export default function RoomCard({ room, hotelId, checkIn, checkOut, onBook }: RoomCardProps) {
  const { t } = useHydratedTranslation();
  const [availability, setAvailability] = useState<AvailabilityResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [roomData, setRoomData] = useState<AllRoomData | null>(null);
  const [combinedData, setCombinedData] = useState<CombinedData | null>(null);
  const [roomPrice, setRoomPrice] = useState<RoomPrice | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch room data for labels, combined data for facilities, and room prices
        const [roomDataResult, combinedDataResult, roomPricesResult] = await Promise.all([
          ApiService.getAllRoomData(),
          ApiService.getCombinedData(),
          ApiService.getRoomPrices(hotelId)
        ]);
        setRoomData(roomDataResult);
        setCombinedData(combinedDataResult);

        // Find price for this specific room
        const matchingPrice = roomPricesResult.find(
          price => price.room_type === room.room_type && price.room_category === room.room_category
        );
        setRoomPrice(matchingPrice || null);

        // Check availability if dates are provided
        if (checkIn && checkOut) {
          const availabilityResult = await ApiService.checkAvailability(
            hotelId,
            room.room_type,
            room.room_category,
            checkIn,
            checkOut
          );
          setAvailability(availabilityResult);
        }
      } catch (error) {
        // Silently handle availability check errors
        void error;
        setAvailability({ available_rooms: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [hotelId, room.room_type, room.room_category, checkIn, checkOut]);

  const isAvailable = availability && availability.available_rooms > 0;
  const roomImage = room.images?.[0]?.image;
  const basePrice = roomPrice?.base_price || 0; // Use API price or 0 as fallback

  // Helper functions to get names from IDs
  const getRoomTypeName = (typeId: number) => {
  return roomData?.room_types.find(type => type.id === typeId)?.name || `Room Type ${typeId}`;
  };

  const getBedTypeName = (bedTypeId: number) => {
  return roomData?.bed_types.find(type => type.id === bedTypeId)?.name || `Bed Type ${bedTypeId}`;
  };

  const getRoomCategoryName = (categoryId: number) => {
  return roomData?.room_rates.find(rate => rate.id === categoryId)?.name || `Category ${categoryId}`;
  };

  const getFacilityName = (facilityId: number) => {
    const facility = combinedData?.facilities.find(f => f.id === facilityId);
  return facility?.name_en || `Facility ${facilityId}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 group"
    >
      {/* Room Image */}
      <div className="relative h-64 overflow-hidden">
        {roomImage && !imageError ? (
          <Image
            src={`https://dev.kacc.mn${roomImage}`}
            alt={room.room_Description}
            fill
            className="object-cover "
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <Bed className="w-16 h-16 text-gray-900" />
          </div>
        )}
        
        {/* Availability Badge */}
        <div className="absolute top-4 right-4">
          {loading ? (
            <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
              <div className="flex items-center gap-2 text-sm text-gray-800">
                <Clock className="w-4 h-4 animate-spin" />
                {t('common.checking', 'Checking...')}
              </div>
            </div>
          ) : (
            <div className={`px-3 py-1 rounded-full backdrop-blur-sm ${
              isAvailable 
                ? 'bg-green-100/90 text-green-700' 
                : 'bg-red-100/90 text-red-700'
            }`}>
              <div className="flex items-center gap-1 text-sm font-medium">
                {isAvailable ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    {availability.available_rooms} {t('hotel.roomsAvailable', 'rooms available')}
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4" />
                    {t('common.notAvailable', 'Not available')}
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Room Number */}
        <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
          {t('roomCard.selected', 'Selected')} {room.room_number}
        </div>
      </div>

      {/* Room Details */}
      <div className="p-6 space-y-4">
        {/* Header */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-1">
            {room.room_Description}
          </h3>
          <div className="flex items-center gap-4 text-sm text-blue-600 mb-2 font-medium">
            <div className="flex items-center gap-1">
              {IconMappingService.getRoomCategoryIcon(room.room_category)}
              <span>{getRoomCategoryName(room.room_category)}</span>
            </div>
            <div className="flex items-center gap-1">
              {IconMappingService.getRoomTypeIcon(room.room_type)}
              <span>{getRoomTypeName(room.room_type)}</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-800 mb-2">
            <div className="flex items-center gap-1">
              <Maximize className="w-4 h-4" />
              {t('roomCard.squareMeters', { count: Number(room.room_size) || 0 })}
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {room.adultQty + room.childQty} {t('search.guests', 'Guests').toLowerCase()}
            </div>
            {room.is_Bathroom && (
              <div className="flex items-center gap-1">
                <Bath className="w-4 h-4" />
                {t('roomCard.privateBathroom', 'Private bathroom')}
              </div>
            )}
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-800">
            {IconMappingService.getBedTypeIcon(room.bed_type)}
            <span>{getBedTypeName(room.bed_type)}</span>
          </div>
        </div>

        {/* Facilities */}
        {room.room_Facilities.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">{t('roomCard.roomFacilities', 'Room Facilities')}</h4>
            <div className="flex flex-wrap gap-2">
              {room.room_Facilities.slice(0, 6).map((facilityId) => {
                const facilityName = getFacilityName(facilityId);
                return (
                  <div 
                    key={facilityId}
                    className="flex items-center gap-2 bg-gray-50 px-2 py-1 rounded-lg text-xs text-gray-900"
                  >
                    {IconMappingService.getRoomFacilityIcon(facilityId, facilityName)}
                    <span>{facilityName}</span>
                  </div>
                );
              })}
              {room.room_Facilities.length > 6 && (
                <div className="text-xs text-gray-900 bg-gray-50 px-2 py-1 rounded-lg">
                  +{room.room_Facilities.length - 6} {t('amenitiesLabels.moreCount', { count: room.room_Facilities.length - 6 })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Smoking Policy */}
        <div className="flex items-center gap-2 text-sm">
          <div className={`w-2 h-2 rounded-full ${
            room.smoking_allowed ? 'bg-orange-400' : 'bg-green-400'
          }`} />
          <span className="text-gray-800">
            {room.smoking_allowed ? t('roomCard.smokingAllowed', 'Smoking allowed') : t('roomCard.nonSmoking', 'Non-smoking')}
          </span>
        </div>

        {/* Pricing and Booking */}
        <div className="border-t pt-4 flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {basePrice > 0 ? formatCurrency(basePrice) : ''}
            </div>
            <div className="text-sm text-gray-800">{t('hotel.perNight', 'per night')}</div>
          </div>
          
          <button
            onClick={() => isAvailable && onBook(room, availability.available_rooms)}
            disabled={!isAvailable || loading}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              isAvailable && !loading
                ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5'
                : 'bg-gray-100 text-gray-900 cursor-not-allowed'
            }`}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 animate-spin" />
                {t('common.checking', 'Checking...')}
              </div>
            ) : isAvailable ? (
              t('hotel.bookNow', 'Book Now')
            ) : (
              t('common.notAvailable', 'Not Available')
            )}
          </button>
        </div>

        {/* Additional Info */}
        {checkIn && checkOut && (
          <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4" />
              <span className="font-medium">{t('roomCard.selectedDates', 'Selected Dates')}</span>
            </div>
            <div className="text-blue-700">
              {new Date(checkIn).toLocaleDateString()} - {new Date(checkOut).toLocaleDateString()}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}