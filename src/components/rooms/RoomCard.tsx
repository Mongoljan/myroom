'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { 
  Users, 
  Maximize, 
  Wifi, 
  Coffee, 
  Car, 
  Bath,
  Mountain,
  Bed,
  CheckCircle,
  AlertCircle,
  Calendar,
  Clock
} from 'lucide-react';
import { Room, AvailabilityResponse, AllRoomData, CombinedData } from '@/types/api';
import { ApiService, formatCurrency } from '@/services/api';

interface RoomCardProps {
  room: Room;
  hotelId: number;
  checkIn: string;
  checkOut: string;
  onBook: (room: Room, available: number) => void;
}

const facilityIcons: { [key: number]: React.ReactNode } = {
  1: <Wifi className="w-4 h-4" />,
  2: <Coffee className="w-4 h-4" />,
  3: <Car className="w-4 h-4" />,
  4: <Bath className="w-4 h-4" />,
  5: <Mountain className="w-4 h-4" />,
};

export default function RoomCard({ room, hotelId, checkIn, checkOut, onBook }: RoomCardProps) {
  const [availability, setAvailability] = useState<AvailabilityResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [roomData, setRoomData] = useState<AllRoomData | null>(null);
  const [combinedData, setCombinedData] = useState<CombinedData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch room data for labels and combined data for facilities
        const [roomDataResult, combinedDataResult] = await Promise.all([
          ApiService.getAllRoomData(),
          ApiService.getCombinedData()
        ]);
        setRoomData(roomDataResult);
        setCombinedData(combinedDataResult);

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
        console.error('Failed to fetch data:', error);
        setAvailability({ available_rooms: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [hotelId, room.room_type, room.room_category, checkIn, checkOut]);

  const isAvailable = availability && availability.available_rooms > 0;
  const roomImage = room.images?.[0]?.image;
  const basePrice = 150000; // Base price - you might want to get this from API

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
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <Bed className="w-16 h-16 text-gray-400" />
          </div>
        )}
        
        {/* Availability Badge */}
        <div className="absolute top-4 right-4">
          {loading ? (
            <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4 animate-spin" />
                Checking...
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
                    {availability.available_rooms} available
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4" />
                    Not available
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Room Number */}
        <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
          Room {room.room_number}
        </div>
      </div>

      {/* Room Details */}
      <div className="p-6 space-y-4">
        {/* Header */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-1">
            {room.room_Description}
          </h3>
          <div className="text-sm text-blue-600 mb-2 font-medium">
            {getRoomCategoryName(room.room_category)} • {getRoomTypeName(room.room_type)}
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
            <div className="flex items-center gap-1">
              <Maximize className="w-4 h-4" />
              {room.room_size} m²
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {room.adultQty + room.childQty} guests
            </div>
            {room.is_Bathroom && (
              <div className="flex items-center gap-1">
                <Bath className="w-4 h-4" />
                Private bathroom
              </div>
            )}
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Bed className="w-4 h-4" />
            <span>{getBedTypeName(room.bed_type)}</span>
          </div>
        </div>

        {/* Facilities */}
        {room.room_Facilities.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Room Facilities</h4>
            <div className="flex flex-wrap gap-2">
              {room.room_Facilities.slice(0, 6).map((facilityId) => (
                <div 
                  key={facilityId}
                  className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg text-xs text-gray-700"
                >
                  {facilityIcons[facilityId] || <Wifi className="w-3 h-3" />}
                  {getFacilityName(facilityId)}
                </div>
              ))}
              {room.room_Facilities.length > 6 && (
                <div className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-lg">
                  +{room.room_Facilities.length - 6} more
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
          <span className="text-gray-600">
            {room.smoking_allowed ? 'Smoking allowed' : 'Non-smoking'}
          </span>
        </div>

        {/* Pricing and Booking */}
        <div className="border-t pt-4 flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(basePrice)}
            </div>
            <div className="text-sm text-gray-600">per night</div>
          </div>
          
          <button
            onClick={() => isAvailable && onBook(room, availability.available_rooms)}
            disabled={!isAvailable || loading}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              isAvailable && !loading
                ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 animate-spin" />
                Checking...
              </div>
            ) : isAvailable ? (
              'Book Now'
            ) : (
              'Not Available'
            )}
          </button>
        </div>

        {/* Additional Info */}
        {checkIn && checkOut && (
          <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4" />
              <span className="font-medium">Selected Dates</span>
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