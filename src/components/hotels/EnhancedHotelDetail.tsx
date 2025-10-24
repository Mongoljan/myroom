'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Star, MapPin, Wifi, ChevronLeft, ChevronRight, Building, Users,
  Car, Coffee, Utensils, Dumbbell, Waves, Wind, Phone,
  Wine, Briefcase, PawPrint, Cigarette, Clock,
  Palmtree, Bus, WashingMachine, Heater, Mountain,
  ArrowLeft, Bell as ConciergeBell, Zap, Hotel, DollarSign, Package,
  MoveVertical as ElevatorIcon, Sunrise, Flame, TreePine, Music, Baby
} from 'lucide-react';
import SafeImage from '@/components/common/SafeImage';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import { ApiService } from '@/services/api';
import { PropertyBasicInfo, ConfirmAddress, PropertyImage, AdditionalInfo, PropertyDetails, Facility, SearchHotelResult } from '@/types/api';

interface EnhancedHotelDetailProps {
  hotel: SearchHotelResult;
}

export default function EnhancedHotelDetail({ hotel }: EnhancedHotelDetailProps) {
  const { t } = useHydratedTranslation();
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [basicInfo, setBasicInfo] = useState<PropertyBasicInfo | null>(null);
  const [address, setAddress] = useState<ConfirmAddress | null>(null);
  const [propertyImages, setPropertyImages] = useState<PropertyImage[]>([]);
  const [additionalInfo, setAdditionalInfo] = useState<AdditionalInfo | null>(null);
  const [propertyDetails, setPropertyDetails] = useState<PropertyDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [facilitiesMap, setFacilitiesMap] = useState<Map<number, Facility>>(new Map());

  useEffect(() => {
    const fetchHotelDetails = async () => {
      try {
        setLoading(true);

        // Fetch all hotel detail APIs and combined data for facility names
        const [
          basicInfoData,
          addressData,
          imagesData,
          propertyDetailsData,
          combinedData
        ] = await Promise.all([
          ApiService.getPropertyBasicInfo(hotel.hotel_id).catch(e => { console.warn('Basic info failed:', e); return []; }),
          ApiService.getConfirmAddress(hotel.hotel_id).catch(e => { console.warn('Address failed:', e); return []; }),
          ApiService.getPropertyImages(hotel.hotel_id).catch(e => { console.warn('Images failed:', e); return []; }),
          ApiService.getPropertyDetails(hotel.hotel_id).catch(e => { console.warn('Property details failed:', e); return []; }),
          ApiService.getCombinedData().catch(e => { console.warn('Combined data failed:', e); return { facilities: [], province: [], soum: [], property_types: [], ratings: [], accessibility_features: [], languages: [] }; })
        ]);

        // Set data from arrays (APIs return arrays with single items)
        setBasicInfo(basicInfoData[0] || null);
        setAddress(addressData[0] || null);
        setPropertyImages(imagesData);
        setPropertyDetails(propertyDetailsData[0] || null);

        // Create facilities map for quick lookup
        const facMap = new Map<number, Facility>();
        combinedData.facilities.forEach(fac => {
          facMap.set(fac.id, fac);
        });
        setFacilitiesMap(facMap);

        // Fetch additional info if available
        if (propertyDetailsData[0]?.Additional_Information) {
          try {
            const additionalData = await ApiService.getAdditionalInfo(propertyDetailsData[0].Additional_Information);
            setAdditionalInfo(additionalData);
          } catch (error) {
            console.warn('Additional info failed:', error);
          }
        }
      } catch (error) {
        console.error('Failed to fetch hotel details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotelDetails();
  }, [hotel.hotel_id]);

  const getStarRating = (value: string | number) => {
    if (typeof value === 'number') return value;
    const match = value.toString().match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  };

  // API-based facility icon mapping using exact facility IDs with proper meaningful icons
  const getFacilityIconById = (facilityId: number) => {
    const iconMap: { [key: number]: React.ReactNode } = {
      1: <Utensils className="w-4 h-4 text-orange-600" />, // Restaurant
      2: <ConciergeBell className="w-4 h-4 text-blue-600" />, // Room service
      4: <Clock className="w-4 h-4 text-indigo-600" />, // 24-hour front desk
      5: <Dumbbell className="w-4 h-4 text-red-600" />, // Fitness center
      6: <Cigarette className="w-4 h-4 text-gray-600 line-through" />, // Non-smoking rooms
      7: <Bus className="w-4 h-4 text-blue-600" />, // Airport shuttle
      8: <Users className="w-4 h-4 text-green-600" />, // Family rooms
      9: <Palmtree className="w-4 h-4 text-teal-600" />, // Spa & wellness center
      10: <Wifi className="w-4 h-4 text-blue-600" />, // Free Wi-Fi
      11: <Zap className="w-4 h-4 text-yellow-600" />, // Electric vehicle charging
      12: <WashingMachine className="w-4 h-4 text-cyan-600" />, // Guest Laundry
      13: <Briefcase className="w-4 h-4 text-gray-700" />, // Conference room
      14: <Heater className="w-4 h-4 text-red-600" />, // Sauna
      15: <Coffee className="w-4 h-4 text-amber-700" />, // Breakfast included
      16: <Building className="w-4 h-4 text-gray-700" />, // Business center
      17: <Wine className="w-4 h-4 text-purple-600" />, // Bar
      18: <Wind className="w-4 h-4 text-cyan-600" />, // Air conditioning
      19: <Car className="w-4 h-4 text-gray-700" />, // Parking
      20: <PawPrint className="w-4 h-4 text-amber-600" />, // Pet friendly
      21: <Hotel className="w-4 h-4 text-blue-600" />, // Wheelchair accessible
      22: <Waves className="w-4 h-4 text-blue-500" />, // Swimming pool
      23: <DollarSign className="w-4 h-4 text-green-600" />, // Currency exchange
      24: <Package className="w-4 h-4 text-gray-600" />, // Luggage storage
      25: <ElevatorIcon className="w-4 h-4 text-gray-700" />, // Elevator
      26: <Cigarette className="w-4 h-4 text-gray-500" />, // Smoking area
      27: <Car className="w-4 h-4 text-blue-600" />, // Car rental
      28: <Bus className="w-4 h-4 text-blue-600" />, // Airport Pick-up Service
      30: <Sunrise className="w-4 h-4 text-yellow-600" />, // Wake-up call
      31: <Flame className="w-4 h-4 text-red-600" />, // BBQ
      32: <Waves className="w-4 h-4 text-blue-400" />, // Water park
      33: <Mountain className="w-4 h-4 text-green-700" />, // Golf course
      34: <Baby className="w-4 h-4 text-gray-600 line-through" />, // Adults only
      35: <Phone className="w-4 h-4 text-green-600" />, // Taxi call
      36: <Car className="w-4 h-4 text-gray-700" />, // Car garage
      37: <Coffee className="w-4 h-4 text-brown-600" />, // Cafe
      38: <Waves className="w-4 h-4 text-cyan-600" />, // Hot tub / Jacuzzi
      39: <TreePine className="w-4 h-4 text-green-600" />, // Garden
      40: <Building className="w-4 h-4 text-gray-600" />, // Terrace
      41: <Music className="w-4 h-4 text-pink-600" />, // Karaoke
    };

    return iconMap[facilityId] || <Star className="w-4 h-4 text-gray-600" />;
  };

  // String-based facility icon mapping - COMPLETE MAPPING
  const getFacilityIcon = (facility: string) => {
    const facilityLower = facility.toLowerCase().trim();

    // Map strings to icons
    const stringIconMap: { [key: string]: React.ReactNode } = {
      'restaurant': <Utensils className="w-5 h-5 text-orange-600" />,
      'ресторан': <Utensils className="w-5 h-5 text-orange-600" />,
      'room service': <ConciergeBell className="w-5 h-5 text-blue-600" />,
      'өрөөний үйлчилгээ': <ConciergeBell className="w-5 h-5 text-blue-600" />,
      '24-hour front desk': <Clock className="w-5 h-5 text-indigo-600" />,
      '24 цагийн хүлээн авах': <Clock className="w-5 h-5 text-indigo-600" />,
      'fitness center': <Dumbbell className="w-5 h-5 text-red-600" />,
      'фитнес төв': <Dumbbell className="w-5 h-5 text-red-600" />,
      'non-smoking rooms': <Cigarette className="w-5 h-5 text-gray-600" />,
      'тамхи татдаггүй өрөө': <Cigarette className="w-5 h-5 text-gray-600" />,
      'airport shuttle': <Bus className="w-5 h-5 text-blue-600" />,
      'нисэх онгоцны буудлын автобус': <Bus className="w-5 h-5 text-blue-600" />,
      'family rooms': <Users className="w-5 h-5 text-green-600" />,
      'гэр бүлийн өрөө': <Users className="w-5 h-5 text-green-600" />,
      'spa & welness center': <Palmtree className="w-5 h-5 text-teal-600" />,
      'spa': <Palmtree className="w-5 h-5 text-teal-600" />,
      'спа': <Palmtree className="w-5 h-5 text-teal-600" />,
      'free wi-fi': <Wifi className="w-5 h-5 text-blue-600" />,
      'үнэгүй wi-fi': <Wifi className="w-5 h-5 text-blue-600" />,
      'wifi': <Wifi className="w-5 h-5 text-blue-600" />,
      'electric vehicle charging station': <Zap className="w-5 h-5 text-yellow-600" />,
      'цахилгаан машин цэнэглэх станц': <Zap className="w-5 h-5 text-yellow-600" />,
      'guest laundry': <WashingMachine className="w-5 h-5 text-cyan-600" />,
      'зочны угаалгын газар': <WashingMachine className="w-5 h-5 text-cyan-600" />,
      'conference room': <Briefcase className="w-5 h-5 text-gray-700" />,
      'хурлын өрөө': <Briefcase className="w-5 h-5 text-gray-700" />,
      'sauna': <Heater className="w-5 h-5 text-red-600" />,
      'саун': <Heater className="w-5 h-5 text-red-600" />,
      'breakfast included': <Coffee className="w-5 h-5 text-amber-700" />,
      'өглөөний цай багтсан': <Coffee className="w-5 h-5 text-amber-700" />,
      'business center': <Building className="w-5 h-5 text-gray-700" />,
      'бизнес төв': <Building className="w-5 h-5 text-gray-700" />,
      'bar': <Wine className="w-5 h-5 text-purple-600" />,
      'бар': <Wine className="w-5 h-5 text-purple-600" />,
      'air conditioning': <Wind className="w-5 h-5 text-cyan-600" />,
      'агааржуулагч': <Wind className="w-5 h-5 text-cyan-600" />,
      'parking': <Car className="w-5 h-5 text-gray-700" />,
      'зогсоол': <Car className="w-5 h-5 text-gray-700" />,
      'pet friendly': <PawPrint className="w-5 h-5 text-amber-600" />,
      'тэжээвэр амьтан боломжтой': <PawPrint className="w-5 h-5 text-amber-600" />,
      'wheelchair accessible': <Hotel className="w-5 h-5 text-blue-600" />,
      'тэргэнцэртэй хүн ашиглах боломжтой': <Hotel className="w-5 h-5 text-blue-600" />,
      'swimming pool': <Waves className="w-5 h-5 text-blue-500" />,
      'усан сан': <Waves className="w-5 h-5 text-blue-500" />,
      'currency exchange': <DollarSign className="w-5 h-5 text-green-600" />,
      'валют солилцоо': <DollarSign className="w-5 h-5 text-green-600" />,
      'luggage storage': <Package className="w-5 h-5 text-gray-600" />,
      'ачаа тээш хадгалах': <Package className="w-5 h-5 text-gray-600" />,
      'elevator': <ElevatorIcon className="w-5 h-5 text-gray-700" />,
      'цахилгаан шат': <ElevatorIcon className="w-5 h-5 text-gray-700" />,
      'smoking area': <Cigarette className="w-5 h-5 text-gray-500" />,
      'тамхи татах цэг': <Cigarette className="w-5 h-5 text-gray-500" />,
      'car rental': <Car className="w-5 h-5 text-blue-600" />,
      'машин түрээслэх үйлчилгээ': <Car className="w-5 h-5 text-blue-600" />,
      'airport pick-up service': <Bus className="w-5 h-5 text-blue-600" />,
      'онгоцны буудлаас тосох үйлчилгээ': <Bus className="w-5 h-5 text-blue-600" />,
      'wake-up call': <Sunrise className="w-5 h-5 text-yellow-600" />,
      'сэрээх үйлчилгээ': <Sunrise className="w-5 h-5 text-yellow-600" />,
      'bbq': <Flame className="w-5 h-5 text-red-600" />,
      'water park': <Waves className="w-5 h-5 text-blue-400" />,
      'усан парк': <Waves className="w-5 h-5 text-blue-400" />,
      'golf course': <Mountain className="w-5 h-5 text-green-700" />,
      'голфын талбай': <Mountain className="w-5 h-5 text-green-700" />,
      'adults only': <Baby className="w-5 h-5 text-gray-600" />,
      'зөвхөн насанд хүрэгчдэд': <Baby className="w-5 h-5 text-gray-600" />,
      'taxi call': <Phone className="w-5 h-5 text-green-600" />,
      'такси дуудах үйлчилгээ': <Phone className="w-5 h-5 text-green-600" />,
      'car garage': <Car className="w-5 h-5 text-gray-700" />,
      'машины гараж': <Car className="w-5 h-5 text-gray-700" />,
      'cafe': <Coffee className="w-5 h-5 text-amber-600" />,
      'кафе': <Coffee className="w-5 h-5 text-amber-600" />,
      'hot tub / jacuzzi': <Waves className="w-5 h-5 text-cyan-600" />,
      'hot tub': <Waves className="w-5 h-5 text-cyan-600" />,
      'jacuzzi': <Waves className="w-5 h-5 text-cyan-600" />,
      'халуун ванн / жакуз': <Waves className="w-5 h-5 text-cyan-600" />,
      'garden': <TreePine className="w-5 h-5 text-green-600" />,
      'цэцэрлэгт хүрээлэн': <TreePine className="w-5 h-5 text-green-600" />,
      'terrace': <Building className="w-5 h-5 text-gray-600" />,
      'террас': <Building className="w-5 h-5 text-gray-600" />,
      'karoake': <Music className="w-5 h-5 text-pink-600" />,
      'karaoke': <Music className="w-5 h-5 text-pink-600" />,
      'караоке': <Music className="w-5 h-5 text-pink-600" />,
    };

    // Try to find exact match first
    if (stringIconMap[facilityLower]) {
      return stringIconMap[facilityLower];
    }

    // Try partial matches
    for (const [key, icon] of Object.entries(stringIconMap)) {
      if (facilityLower.includes(key) || key.includes(facilityLower)) {
        return icon;
      }
    }

    // Default icon
    return <Building className="w-5 h-5 text-gray-600" />;
  };

  // Combine original gallery with API images
  const allImages = [
    ...hotel.images.gallery,
    ...propertyImages.map(img => ({ url: img.image, description: img.description }))
  ].filter((img, index, self) => 
    // Remove duplicates by URL
    self.findIndex(i => i.url === img.url) === index
  );

  const nextImage = () => {
    if (allImages.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === allImages.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (allImages.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? allImages.length - 1 : prev - 1
      );
    }
  };

  // Use API data for hotel name if available
  const hotelName = basicInfo?.property_name_en || basicInfo?.property_name_mn || hotel.property_name;
  const starRating = basicInfo?.star_rating || getStarRating(hotel.rating_stars.value);

  // Handle back navigation
  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  // Scroll to rooms section
  const scrollToRooms = () => {
    const roomsSection = document.getElementById('rooms');
    if (roomsSection) {
      roomsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Get cheapest price with discount info
  const getCheapestPrice = () => {
    // Try cheapest_room first
    if (hotel.cheapest_room && hotel.cheapest_room.price_per_night) {
      const { price_per_night, price_per_night_raw, pricesetting } = hotel.cheapest_room;

      // Check if there's a discount
      const hasDiscount = price_per_night_raw && price_per_night_raw > price_per_night;

      if (hasDiscount && pricesetting && pricesetting.adjustment_type === 'SUB') {
        const discountPercent = pricesetting.value_type === 'PERCENT'
          ? pricesetting.value
          : ((price_per_night_raw - price_per_night) / price_per_night_raw) * 100;

        return {
          current: price_per_night,
          original: price_per_night_raw,
          discount: Math.round(discountPercent)
        };
      }

      return {
        current: price_per_night,
        original: null,
        discount: null
      };
    }

    // Fallback to min_estimated_total
    if (hotel.min_estimated_total && hotel.min_estimated_total > 0) {
      return {
        current: hotel.min_estimated_total,
        original: null,
        discount: null
      };
    }

    return null;
  };

  const priceInfo = getCheapestPrice();

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>{t('common.back', 'Буцах')}</span>
      </button>

      {/* Hotel Header Section */}
      <div className="space-y-4">
        {/* Star Rating */}
        <div className="flex items-center gap-2">
          {[...Array(starRating)].map((_, i) => (
            <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
          ))}
        </div>

        {/* Hotel Name with Price and Book Button */}
        <div className="flex items-start justify-between gap-6">
          {/* Left: Hotel Name */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{hotelName}</h1>
          </div>

          {/* Right: Price and Book Button on same line */}
          <div className="flex items-center gap-4 flex-shrink-0">
            {/* Price Info */}
            {priceInfo && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">{t('hotelDetails.startingPrice', 'Эхлэх үнэ')}:</span>
                {priceInfo.discount && priceInfo.original && (
                  <>
                    <span className="text-base text-gray-500 line-through">
                      ₮{priceInfo.original.toLocaleString()}
                    </span>
                    <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-semibold rounded">
                      -{priceInfo.discount}%
                    </span>
                  </>
                )}
                <span className="text-xl font-bold text-blue-600">
                  ₮{priceInfo.current.toLocaleString()}
                </span>
                <span className="text-sm text-gray-600">/{t('hotelDetails.night', 'шөнө')}</span>
              </div>
            )}

            {/* Book Button */}
            <button
              onClick={scrollToRooms}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-sm whitespace-nowrap"
            >
              {t('hotelDetails.book', 'Захиалах')}
            </button>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-start gap-2">
          <MapPin className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
          <div className="text-gray-700">
            <p>{hotel.location.province_city}{hotel.location.soum && `, ${hotel.location.soum}`}</p>
            {address?.district && <p className="text-sm text-gray-600">{address.district}</p>}
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="relative rounded-xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
          {/* Main Image - Takes 2 columns */}
          <div className="lg:col-span-2 relative h-80 lg:h-96 bg-gray-100">
            <SafeImage
              src={allImages[currentImageIndex]?.url || (typeof hotel.images.cover === 'string' ? hotel.images.cover : hotel.images.cover.url) || ''}
              alt={hotelName}
              fill
              className="object-cover"
            />
            
            {allImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2.5 shadow-lg transition-all hover:scale-110"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-700" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2.5 shadow-lg transition-all hover:scale-110"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5 text-gray-700" />
                </button>

                {/* Image counter */}
                <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1.5 rounded-lg text-sm font-medium">
                  {currentImageIndex + 1} / {allImages.length}
                </div>
              </>
            )}
          </div>

          {/* Thumbnail Grid - 1 column on desktop */}
          <div className="hidden lg:grid grid-rows-2 gap-2">
            {allImages.slice(1, 3).map((image, index) => (
              <div
                key={index}
                className="relative h-full cursor-pointer bg-gray-100 overflow-hidden group"
                onClick={() => setCurrentImageIndex(index + 1)}
              >
                <SafeImage
                  src={image.url || ''}
                  alt={`${hotelName} - ${index + 1}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {index === 1 && allImages.length > 3 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">+{allImages.length - 3} {t('hotelDetails.morePhotos', 'зураг')}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('hotelDetails.aboutProperty', 'Зочид буудлын тухай')}</h2>

        <p className="text-gray-700 leading-relaxed">
          {additionalInfo?.About || t('hotelDetails.defaultDescription', { hotelName, city: hotel.location.province_city || '' })}
        </p>

        {basicInfo && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              {/* Total Rooms */}
              <div className="flex items-start gap-2">
                <Building className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <div className="text-gray-500">{t('hotelDetails.totalRooms', 'Нийт өрөө')}</div>
                  <div className="font-medium text-gray-900">{basicInfo.total_hotel_rooms} {t('hotelDetails.rooms', 'өрөө')}</div>
                </div>
              </div>

              {basicInfo.part_of_group && (
                <div className="flex items-start gap-2">
                  <Building className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-gray-500">{t('hotelDetails.hotelGroup', 'Сүлжээ')}</div>
                    <div className="font-medium text-gray-900">{basicInfo.group_name || t('hotelDetails.yes', 'Тийм')}</div>
                  </div>
                </div>
              )}

              {new Date(basicInfo.start_date).getFullYear() && (
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-gray-500">{t('hotelDetails.operatingSince', 'Үйл ажиллагаа эхэлсэн')}</div>
                    <div className="font-medium text-gray-900">{new Date(basicInfo.start_date).getFullYear()}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Facilities Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('popular_amenities', 'Үндсэн тохижилт')}</h3>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {hotel.general_facilities.map((facility, index) => {
            // Check if facility is a number (ID) or string (name)
            const isId = typeof facility === 'number' || !isNaN(Number(facility));
            const facilityId = isId ? Number(facility) : null;

            // Debug
            if (index === 0) {
              console.log('First facility:', facility, 'Type:', typeof facility, 'isId:', isId, 'facilityId:', facilityId);
              console.log('facilitiesMap has facility:', facilitiesMap.has(facilityId || 0));
            }

            // Get facility name from map or use the string value
            let facilityName = facility;
            if (facilityId && facilitiesMap.has(facilityId)) {
              const facilityData = facilitiesMap.get(facilityId);
              facilityName = facilityData?.name_en || facilityData?.name_mn || facility;
            }

            return (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-shrink-0">
                  {facilityId ? getFacilityIconById(facilityId) : getFacilityIcon(String(facility))}
                </div>
                <span className="text-gray-700 text-sm font-medium">{facilityName}</span>
              </div>
            );
          })}
        </div>
      </div>
      
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">{t('hotelDetails.loadingExtra', 'Мэдээлэл ачааллаж байна...')}</span>
        </div>
      )}
    </div>
  );
}