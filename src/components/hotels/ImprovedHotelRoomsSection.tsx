'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Bed, 
  ChevronDown, 
  Wifi, 
  Car, 
  UtensilsCrossed,
  CheckCircle,
  X,
  Clock,
  Eye
} from 'lucide-react';
import { hotelRoomsService, EnrichedHotelRoom } from '@/services/hotelRoomsApi';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import SafeImage from '@/components/common/SafeImage';
import { IconMappingService } from '@/services/iconMappingService';

interface BookingItem {
  room: EnrichedHotelRoom;
  quantity: number;
  originalPrice: number;
  discountedPrice: number;
  discount: number;
}

interface ImprovedHotelRoomsSectionProps {
  hotelId: number;
  hotelName: string;
  checkIn?: string;
  checkOut?: string;
}

export default function ImprovedHotelRoomsSection({ 
  hotelId, 
  hotelName,
  checkIn, 
  checkOut 
}: ImprovedHotelRoomsSectionProps) {
  const { t } = useHydratedTranslation();
  const [rooms, setRooms] = useState<EnrichedHotelRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingItems, setBookingItems] = useState<BookingItem[]>([]);
  const [selectedRoomForFeatures, setSelectedRoomForFeatures] = useState<EnrichedHotelRoom | null>(null);

  // Room quantity management
  const updateRoomQuantity = (room: EnrichedHotelRoom, quantity: number) => {
    setBookingItems(prev => {
      const existingIndex = prev.findIndex(item => item.room.id === room.id);
      // Use room size or category to determine base pricing dynamically
      const originalPrice = 200000; // Base fallback price
      const discount = 0; // No hardcoded discount
      const discountedPrice = originalPrice;
      
      if (quantity === 0) {
        return prev.filter(item => item.room.id !== room.id);
      }
      
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex].quantity = quantity;
        return updated;
      } else {
        return [...prev, {
          room,
          quantity,
          originalPrice,
          discountedPrice,
          discount
        }];
      }
    });
  };

  const getRoomQuantity = (room: EnrichedHotelRoom) => {
    const item = bookingItems.find(item => item.room.id === room.id);
    return item?.quantity || 0;
  };

  const getTotalRooms = () => {
    return bookingItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return bookingItems.reduce((sum, item) => sum + (item.discountedPrice * item.quantity), 0);
  };

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      setError(null);
      try {
        const enrichedRooms = await hotelRoomsService.getEnrichedHotelRooms(hotelId);
        setRooms(enrichedRooms);
      } catch (error) {
        console.error('Error fetching rooms:', error);
        setError('Failed to load room information. Please try again later.');
        setRooms([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [hotelId]);

  if (loading) {
    return (
      <div className="flex gap-8">
        <div className="flex-1">
          <div className="space-y-6">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
                <div className="flex gap-6">
                  <div className="w-80 h-48 bg-gray-300 rounded-lg"></div>
                  <div className="flex-1 space-y-4">
                    <div className="h-6 bg-gray-300 rounded w-1/3"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-80">
          <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
            <div className="h-6 bg-gray-300 rounded mb-4"></div>
            <div className="space-y-4">
              <div className="h-16 bg-gray-300 rounded"></div>
              <div className="h-16 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <div className="flex gap-8">
        <div className="flex-1">
          <div className="text-center py-12">
            <Bed className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">Одоогоор боломжтой өрөө байхгүй байна.</p>
          </div>
        </div>
        <div className="w-80">
          <BookingSummary
            items={bookingItems}
            totalRooms={getTotalRooms()}
            totalPrice={getTotalPrice()}
            checkIn={checkIn}
            checkOut={checkOut}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex gap-8">
        {/* Main Content */}
        <div className="flex-1">
          <div className="space-y-6">
            {rooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                quantity={getRoomQuantity(room)}
                onQuantityChange={(quantity) => updateRoomQuantity(room, quantity)}
                maxQuantity={room.number_of_rooms_to_sell}
                onShowAllFeatures={() => setSelectedRoomForFeatures(room)}
              />
            ))}
          </div>
        </div>

        {/* Booking Summary Sidebar */}
        <div className="w-80 sticky top-4 h-fit">
          <BookingSummary
            items={bookingItems}
            totalRooms={getTotalRooms()}
            totalPrice={getTotalPrice()}
            checkIn={checkIn}
            checkOut={checkOut}
          />
        </div>
      </div>

      {/* Room Features Modal */}
      <RoomFeaturesModal
        room={selectedRoomForFeatures}
        isOpen={!!selectedRoomForFeatures}
        onClose={() => setSelectedRoomForFeatures(null)}
      />
    </>
  );
}

// Room Card Component matching Figma design
interface RoomCardProps {
  room: EnrichedHotelRoom;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  maxQuantity: number;
  onShowAllFeatures: () => void;
}

function RoomCard({ room, quantity, onQuantityChange, maxQuantity, onShowAllFeatures }: RoomCardProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Calculate pricing dynamically based on room data
  const originalPrice = 200000; // Use consistent fallback pricing
  const discount = 0; // No hardcoded discount
  const discountedPrice = originalPrice;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      <div className="flex">
        {/* Room Images and Amenities Column */}
        <div className="w-80">
          {/* Room Images */}
          <div className="relative mb-4">
            <div className="grid grid-cols-2 gap-1 h-48">
              {room.images && room.images.length > 0 ? (
                <>
                  <div className="col-span-2 relative">
                    <SafeImage 
                      src={room.images[0].image}
                      alt={room.room_Description}
                      fill
                      className="object-cover"
                    />
                  </div>
                  {room.images.length > 1 && (
                    <div className="relative">
                      <SafeImage 
                        src={room.images[1].image}
                        alt={room.room_Description}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  {room.images.length > 2 && (
                    <div className="relative">
                      <SafeImage 
                        src={room.images[2].image}
                        alt={room.room_Description}
                        fill
                        className="object-cover"
                      />
                      {room.images.length > 3 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="text-white font-medium">+{room.images.length - 3}</span>
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="col-span-2 bg-gray-200 flex items-center justify-center">
                  <Bed className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>
            
            {/* Availability indicator */}
            {maxQuantity > 0 && (
              <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded">
                {maxQuantity} өрөө үлдсэн байна
              </div>
            )}
          </div>

          {/* Room Amenities under images */}
          <div className="space-y-2 text-sm text-gray-600 px-2">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 flex items-center justify-center">🚭</span>
              <span>Non-smoking rooms</span>
            </div>
            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4" />
              <span>Free WiFi</span>
            </div>
            <div className="flex items-center gap-2">
              <Car className="w-4 h-4" />
              <span>Parking</span>
            </div>
            <div className="flex items-center gap-2">
              <UtensilsCrossed className="w-4 h-4" />
              <span>Kitchen</span>
            </div>
            
            {/* See All Features Button */}
            <button
              onClick={onShowAllFeatures}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm mt-3"
            >
              <Eye className="w-4 h-4" />
              Дэлгэрэнгүй
            </button>
          </div>
        </div>

        {/* Room Details */}
        <div className="flex-1 p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-600">x{room.adultQty + room.childQty}</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                {room.roomCategoryName}
              </h3>
              <div className="flex items-center gap-2 mb-4">
                <Bed className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-600">
                  1 {room.bedTypeName} ({room.room_size}м²)
                </span>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                disabled={maxQuantity === 0}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                <span>{quantity} (US$ 3,120)</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[200px]">
                  {[0, 1, 2, 3].map((num) => (
                    <button
                      key={num}
                      onClick={() => {
                        onQuantityChange(num);
                        setIsDropdownOpen(false);
                      }}
                      disabled={num > maxQuantity}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {num} өрөө {num > 0 && `(US$ ${(3120 * num).toLocaleString()})`}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Room Features - Booking related info only */}
          <div className="space-y-2 mb-6">
            {/* Green checkmarks for available features */}
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">Өглөөний цай багтсан</span>
            </div>
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">Цуцлах боломжтой</span>
            </div>
            
            {/* Blue features */}
            <div className="flex items-center gap-2 text-blue-600">
              <Clock className="w-4 h-4" />
              <span className="text-sm">Instant confirmation</span>
            </div>
            <div className="flex items-center gap-2 text-black">
              <span className="w-4 h-4 bg-black rounded-sm flex items-center justify-center">
                <span className="text-white text-xs">₮</span>
              </span>
              <span className="text-sm">100% урьдчилгаа төлөлт</span>
            </div>
          </div>
        </div>

        {/* Pricing Column */}
        <div className="w-64 p-6 bg-gray-50 flex flex-col justify-between">
          <div>
            {discount > 0 && (
              <div className="bg-red-500 text-white px-2 py-1 rounded text-sm font-medium mb-2 inline-block">
                {discount}% Off
              </div>
            )}
            <div className="text-right mb-4">
              <div className="text-2xl font-bold">
                ₮{discountedPrice.toLocaleString()} MNT
              </div>
              <div className="text-sm text-gray-600">
                Нийт үнэ: ₮{(discountedPrice * (quantity || 1)).toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">
                {quantity || 1} өрөө шөнө бүр
              </div>
            </div>
          </div>
          
          <button
            disabled={maxQuantity === 0}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Захиалах ↗
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// Booking Summary Component
interface BookingSummaryProps {
  items: BookingItem[];
  totalRooms: number;
  totalPrice: number;
  checkIn?: string;
  checkOut?: string;
}

function BookingSummary({ items, totalRooms, totalPrice, checkIn, checkOut }: BookingSummaryProps) {
  const { t } = useHydratedTranslation();

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-600">Эхлэх үнэ:</span>
        <span className="text-xl font-bold">{totalPrice > 0 ? `₮${totalPrice.toLocaleString()}` : '₮200,000'}</span>
      </div>
      
      <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors mb-6">
        Өрөө сонгох ↗
      </button>

      <div className="border-t pt-6">
        <h3 className="font-semibold text-gray-900 mb-4">Сонгосон өрөөнүүд:</h3>
        
        {items.length === 0 ? (
          <p className="text-gray-500 text-sm">Өрөө сонгоогүй байна</p>
        ) : (
          <div className="space-y-3 mb-6">
            {items.map((item) => (
              <div key={item.room.id} className="text-sm">
                <div className="flex justify-between">
                  <span>{item.room.roomCategoryName}</span>
                  <span>x {item.quantity}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="border-t pt-4">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Нийт өрөө:</span>
            <span className="font-bold">{totalRooms}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Room Features Modal Component
interface RoomFeaturesModalProps {
  room: EnrichedHotelRoom | null;
  isOpen: boolean;
  onClose: () => void;
}

function RoomFeaturesModal({ room, isOpen, onClose }: RoomFeaturesModalProps) {
  if (!room) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {room.roomCategoryName} - Бүх тохижилт
            </h2>
            <p className="text-gray-600 text-sm">{room.room_Description}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-150px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Room Facilities */}
            {room.facilitiesDetails.length > 0 && (
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Өрөөний тохижилт
                </h4>
                <div className="space-y-3">
                  {room.facilitiesDetails.map((facility, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-900">
                      {IconMappingService.getRoomFacilityIcon(facility.id, facility.name_mn)}
                      <span className="ml-3">
                        {hotelRoomsService.getRoomFacilityName(facility, 'mn')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bathroom Items */}
            {room.bathroomItemsDetails.length > 0 && (
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Ариун цэврийн өрөө
                </h4>
                <div className="space-y-3">
                  {room.bathroomItemsDetails.map((item, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-900">
                      {IconMappingService.getBathroomItemIcon(item.id, item.name_mn)}
                      <span className="ml-3">
                        {hotelRoomsService.getBathroomItemName(item, 'mn')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Food and Drink */}
            {room.foodAndDrinkDetails.length > 0 && (
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  Хоол ундны үйлчилгээ
                </h4>
                <div className="space-y-3">
                  {room.foodAndDrinkDetails.map((item, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-900">
                      {IconMappingService.getFoodAndDrinkIcon(item.id, item.name_mn)}
                      <span className="ml-3">
                        {hotelRoomsService.getFoodAndDrinkName(item, 'mn')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Outdoor and View */}
            {room.outdoorAndViewDetails.length > 0 && (
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  Үзэмж ба гадна талбай
                </h4>
                <div className="space-y-3">
                  {room.outdoorAndViewDetails.map((item, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-900">
                      {IconMappingService.getOutdoorAndViewIcon(item.id, item.name_mn)}
                      <span className="ml-3">
                        {hotelRoomsService.getOutdoorAndViewName(item, 'mn')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Free Toiletries */}
            {room.freeToiletriesDetails.length > 0 && (
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  Үнэгүй ариун цэврийн хэрэгсэл
                </h4>
                <div className="space-y-3">
                  {room.freeToiletriesDetails.map((item, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-900">
                      {IconMappingService.getFreeToiletriesIcon(item.id, item.name_mn)}
                      <span className="ml-3">
                        {hotelRoomsService.getFreeToiletriesName(item, 'mn')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}