'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Bed, Coffee, Bath, Wifi } from 'lucide-react';
import { hotelRoomsService, EnrichedHotelRoom } from '@/services/hotelRoomsApi';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import Image from 'next/image';
import SafeImage from '@/components/common/SafeImage';

interface ImprovedHotelRoomsSectionProps {
  hotelId: number;
  checkIn?: string;
  checkOut?: string;
}

export default function ImprovedHotelRoomsSection({ 
  hotelId, 
  checkIn, 
  checkOut 
}: ImprovedHotelRoomsSectionProps) {
  const { t } = useHydratedTranslation();
  const [rooms, setRooms] = useState<EnrichedHotelRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        // Fallback to mock data for demonstration
        setRooms(createMockRooms(hotelId));
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [hotelId]);

  // Create mock rooms for demonstration when API fails
  const createMockRooms = (hotelId: number): EnrichedHotelRoom[] => {
    return [
      {
        id: 1,
        hotel: hotelId,
        room_number: 101,
        room_type: 6,
        room_category: 3,
        room_size: "25.50",
        bed_type: 13,
        is_Bathroom: true,
        room_Facilities: [1, 3, 4],
        bathroom_Items: [2, 4, 5],
        free_Toiletries: [3, 4],
        food_And_Drink: [3, 6],
        adultQty: 2,
        childQty: 1,
        outdoor_And_View: [3, 7],
        number_of_rooms: 3,
        number_of_rooms_to_sell: 2,
        room_Description: "Тав тухтай стандарт өрөө",
        smoking_allowed: false,
        images: [],
        total_count: 5,
        roomTypeName: "Single",
        bedTypeName: "2 хүний ор",
        roomCategoryName: "Стандарт өрөө / Standard Room",
        facilitiesDetails: [
          { id: 1, name_en: "Air conditioning", name_mn: "Агааржуулагч" },
          { id: 3, name_en: "Washing machine", name_mn: "Угаалгын машин" },
          { id: 4, name_en: "Flat-screen TV", name_mn: "Хавтгай дэлгэцтэй TV" }
        ],
        bathroomItemsDetails: [
          { id: 2, name_en: "Shower", name_mn: "Шүршүүр" },
          { id: 4, name_en: "Hairdryer", name_mn: "Үсний сэнс" }
        ],
        freeToiletriesDetails: [
          { id: 3, name_en: "Dental kit", name_mn: "Шүдний сойз" }
        ],
        foodAndDrinkDetails: [
          { id: 3, name_en: "Electric kettle", name_mn: "Ус буцалгагч" }
        ],
        outdoorAndViewDetails: [
          { id: 3, name_en: "Balcony", name_mn: "Тагт" }
        ]
      },
      {
        id: 2,
        hotel: hotelId,
        room_number: 201,
        room_type: 7,
        room_category: 6,
        room_size: "35.00",
        bed_type: 14,
        is_Bathroom: true,
        room_Facilities: [1, 2, 4, 48],
        bathroom_Items: [2, 4, 5, 8],
        free_Toiletries: [3, 4, 5],
        food_And_Drink: [3, 5, 6],
        adultQty: 2,
        childQty: 2,
        outdoor_And_View: [3, 7, 10],
        number_of_rooms: 2,
        number_of_rooms_to_sell: 1,
        room_Description: "Том хэмжээтэй делюкс өрөө уул харагдацтай",
        smoking_allowed: false,
        images: [],
        total_count: 3,
        roomTypeName: "Double",
        bedTypeName: "Том ор / King size",
        roomCategoryName: "Хагас люкс өрөө / Deluxe Room",
        facilitiesDetails: [
          { id: 1, name_en: "Air conditioning", name_mn: "Агааржуулагч" },
          { id: 2, name_en: "Clothes rack", name_mn: "Хувцасны өлгүүр" },
          { id: 4, name_en: "Flat-screen TV", name_mn: "Хавтгай дэлгэцтэй TV" },
          { id: 48, name_en: "Wifi", name_mn: "Утасгүй интернэт" }
        ],
        bathroomItemsDetails: [
          { id: 2, name_en: "Shower", name_mn: "Шүршүүр" },
          { id: 4, name_en: "Hairdryer", name_mn: "Үсний сэнс" },
          { id: 5, name_en: "Bath", name_mn: "Ванн" },
          { id: 8, name_en: "Bathrobe", name_mn: "Халаад" }
        ],
        freeToiletriesDetails: [
          { id: 3, name_en: "Dental kit", name_mn: "Шүдний сойз" },
          { id: 4, name_en: "Soap", name_mn: "Саван" },
          { id: 5, name_en: "Shampoo", name_mn: "Шампунь" }
        ],
        foodAndDrinkDetails: [
          { id: 3, name_en: "Electric kettle", name_mn: "Ус буцалгагч" },
          { id: 5, name_en: "Microwave", name_mn: "Печь / Богино долгионы зуух" },
          { id: 6, name_en: "Bottle of water", name_mn: "Үнэгүй цэвэр ус" }
        ],
        outdoorAndViewDetails: [
          { id: 3, name_en: "Balcony", name_mn: "Тагт" },
          { id: 7, name_en: "Mountain view", name_mn: "Уул руу харсан" },
          { id: 10, name_en: "City view", name_mn: "Хотын үзэмж" }
        ]
      }
    ];
  };

  if (loading) {
    return (
      <section className="py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {t('hotel.rooms', 'Өрөөнүүд')}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-300"></div>
              <div className="p-6">
                <div className="h-6 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-2/3 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-300 rounded"></div>
                  <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (rooms.length === 0) {
    return (
      <section className="py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {t('hotel.rooms', 'Өрөөнүүд')}
          </h2>
        </div>
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            <Bed className="w-16 h-16 mx-auto opacity-50" />
          </div>
          <p className="text-gray-600">{t('hotel.noRoomsAvailable', 'Одоогоор боломжтой өрөө байхгүй байна.')}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t('hotel.rooms', 'Өрөөнүүд')}
        </h2>
        <p className="text-gray-600">
          {t('hotel.roomsAvailable', `${rooms.length} өрөө боломжтой`)}
        </p>
        {error && (
          <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              {t('hotel.apiError', 'Өрөөний мэдээлэл татахад алдаа гарлаа. Үзүүлэгдэж буй мэдээлэл жишээ өгөгдөл юм.')}
            </p>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {rooms.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
    </section>
  );
}

interface RoomCardProps {
  room: EnrichedHotelRoom;
}

function RoomCard({ room }: RoomCardProps) {
  const { t } = useHydratedTranslation();
  
  const getIconForFacility = (facilityName: string) => {
    const name = facilityName.toLowerCase();
    if (name.includes('wifi') || name.includes('интернэт')) return Wifi;
    if (name.includes('coffee') || name.includes('кофе') || name.includes('ус буц')) return Coffee;
    if (name.includes('bath') || name.includes('ванн')) return Bath;
    return null;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300"
    >
      <div className="flex flex-col lg:flex-row">
        {/* Room Images */}
        <div className="lg:w-1/3">
          {room.images && room.images.length > 0 ? (
            <div className="relative h-48 lg:h-full">
              <SafeImage 
                src={room.images[0].image}
                alt={room.room_Description}
                fill
                className="object-cover"
                placeholder="blur"
                blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+"
              />
              {room.images.length > 1 && (
                <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                  +{room.images.length - 1} {t('common.photos', 'зураг')}
                </div>
              )}
            </div>
          ) : (
            <div className="h-48 lg:h-full bg-gray-200 flex items-center justify-center">
              <Bed className="w-12 h-12 text-gray-400" />
            </div>
          )}
        </div>

        {/* Room Details */}
        <div className="lg:w-2/3 p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                {room.roomCategoryName}
              </h3>
              <div className="flex items-center text-gray-600 text-sm space-x-4">
                <span className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {room.adultQty} насанд хүрсэн
                </span>
                <span className="flex items-center">
                  <Bed className="w-4 h-4 mr-1" />
                  {room.bedTypeName}
                </span>
                <span>{room.room_size}м²</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">{t('room.pricePerNight', 'Шөнийн үнэ')}</div>
              <div className="text-2xl font-bold text-blue-600">150,000₮</div>
            </div>
          </div>

          <p className="text-gray-600 mb-4 line-clamp-2">{room.room_Description}</p>

          {/* Room Features */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
            {room.facilitiesDetails.slice(0, 6).map((facility, index) => {
              const IconComponent = getIconForFacility(facility.name_mn);
              return (
                <div key={index} className="flex items-center text-sm text-gray-600">
                  {IconComponent ? (
                    <IconComponent className="w-4 h-4 mr-2 text-blue-600" />
                  ) : (
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                  )}
                  <span className="truncate">
                    {hotelRoomsService.getRoomFacilityName(facility, 'mn')}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Room Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              {room.number_of_rooms_to_sell > 0 ? (
                <span className="text-green-600">
                  {t('room.available', `${room.number_of_rooms_to_sell} өрөө боломжтой`)}
                </span>
              ) : (
                <span className="text-red-600">{t('room.soldOut', 'Дууссан')}</span>
              )}
            </div>
            <button 
              disabled={room.number_of_rooms_to_sell === 0}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {t('room.selectRoom', 'Өрөө сонгох')}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}