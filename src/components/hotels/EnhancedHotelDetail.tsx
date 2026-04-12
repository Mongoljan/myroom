'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Star, MapPin, Wifi, ChevronLeft, ChevronRight, Building, Users,
  Car, Coffee, Utensils, Dumbbell, Waves, Wind, Phone,
  Wine, Briefcase, PawPrint, Cigarette, Clock,
  Palmtree, Bus, WashingMachine, Heater, Mountain,
  ArrowLeft, Bell as ConciergeBell, Zap, Hotel, DollarSign, Package,
  MoveVertical as ElevatorIcon, Sunrise, Flame, TreePine, Music, Baby, Heart, Layers3 as Layers, X
} from 'lucide-react';
import SafeImage from '@/components/common/SafeImage';
import { Dialog, DialogContent, DialogClose, DialogTitle } from '@/components/ui/dialog';
import GoogleMapModal, { NearbyPlace } from '@/components/common/GoogleMapModal';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import { ApiService } from '@/services/api';
import { PropertyBasicInfo, ConfirmAddress, PropertyImage, AdditionalInfo, PropertyDetails, Facility, SearchHotelResult } from '@/types/api';
import { Train, Plane, Landmark, Utensils as RestaurantIcon, ShoppingBag, Building2 } from 'lucide-react';

interface EnhancedHotelDetailProps {
  hotel: SearchHotelResult;
}

export default function EnhancedHotelDetail({ hotel }: EnhancedHotelDetailProps) {
  const { t } = useHydratedTranslation();
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [basicInfo, setBasicInfo] = useState<PropertyBasicInfo | null>(null);
  const [address, setAddress] = useState<ConfirmAddress | null>(null);
  const [propertyImages, setPropertyImages] = useState<PropertyImage[]>([]);
  const [additionalInfo, setAdditionalInfo] = useState<AdditionalInfo | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [propertyDetails, setPropertyDetails] = useState<PropertyDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [facilitiesMap, setFacilitiesMap] = useState<Map<number, Facility>>(new Map());
  const [provinceMap, setProvinceMap] = useState<Map<number, string>>(new Map());
  const [soumMap, setSoumMap] = useState<Map<number, string>>(new Map());
  const [showMapModal, setShowMapModal] = useState(false);

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
          combinedData = { facilities: [], province: [], soum: [], property_types: [], ratings: [], accessibility_features: [], languages: [] }
        ] = await Promise.all([
          ApiService.getPropertyBasicInfo(hotel.hotel_id).catch(e => { console.warn('Basic info failed:', e); return []; }),
          ApiService.getConfirmAddress(hotel.hotel_id).catch(e => { console.warn('Address failed:', e); return []; }),
          ApiService.getPropertyImages(hotel.hotel_id).catch(e => { console.warn('Images failed:', e); return []; }),
          ApiService.getPropertyDetails(hotel.hotel_id).catch(e => { console.warn('Property details failed:', e); return []; }),
          ApiService.getCombinedData().catch(e => {
            console.warn('Combined data failed:', e);
            return { facilities: [], province: [], soum: [], property_types: [], ratings: [], accessibility_features: [], languages: [] };
          })
        ]);

        // Set data from arrays (APIs return arrays with single items)
        setBasicInfo(basicInfoData[0] || null);
        setAddress(addressData[0] || null);
        setPropertyImages(imagesData);
        setPropertyDetails(propertyDetailsData[0] || null);

        // Create facilities map for quick lookup
        const facMap = new Map<number, Facility>();
        (combinedData.facilities || []).forEach(fac => {
          facMap.set(fac.id, fac);
        });
        setFacilitiesMap(facMap);

        // Create province and soum maps for quick lookup
        const provMap = new Map<number, string>();
        (combinedData.province || []).forEach(prov => {
          provMap.set(prov.id, prov.name);
        });
        setProvinceMap(provMap);

        const soumMapTemp = new Map<number, string>();
        (combinedData.soum || []).forEach(soumItem => {
          soumMapTemp.set(soumItem.id, soumItem.name);
        });
        setSoumMap(soumMapTemp);

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
      2: <ConciergeBell className="w-4 h-4 text-primary" />, // Room service
      4: <Clock className="w-4 h-4 text-primary" />, // 24-hour front desk
      5: <Dumbbell className="w-4 h-4 text-red-600" />, // Fitness center
      6: <Cigarette className="w-4 h-4 text-gray-600 dark:text-gray-400 line-through" />, // Non-smoking rooms
      7: <Bus className="w-4 h-4 text-primary" />, // Airport shuttle
      8: <Users className="w-4 h-4 text-green-600" />, // Family rooms
      9: <Palmtree className="w-4 h-4 text-teal-600" />, // Spa & wellness center
      10: <Wifi className="w-4 h-4 text-primary" />, // Free Wi-Fi
      11: <Zap className="w-4 h-4 text-yellow-600" />, // Electric vehicle charging
      12: <WashingMachine className="w-4 h-4 text-cyan-600" />, // Guest Laundry
      13: <Briefcase className="w-4 h-4 text-gray-700 dark:text-gray-300" />, // Conference room
      14: <Heater className="w-4 h-4 text-red-600" />, // Sauna
      15: <Coffee className="w-4 h-4 text-amber-700" />, // Breakfast included
      16: <Building className="w-4 h-4 text-gray-700 dark:text-gray-300" />, // Business center
      17: <Wine className="w-4 h-4 text-purple-600" />, // Bar
      18: <Wind className="w-4 h-4 text-cyan-600" />, // Air conditioning
      19: <Car className="w-4 h-4 text-gray-700 dark:text-gray-300" />, // Parking
      20: <PawPrint className="w-4 h-4 text-amber-600" />, // Pet friendly
      21: <Hotel className="w-4 h-4 text-primary" />, // Wheelchair accessible
      22: <Waves className="w-4 h-4 text-primary" />, // Swimming pool
      23: <DollarSign className="w-4 h-4 text-green-600" />, // Currency exchange
      24: <Package className="w-4 h-4 text-gray-600 dark:text-gray-400" />, // Luggage storage
      25: <ElevatorIcon className="w-4 h-4 text-gray-700 dark:text-gray-300" />, // Elevator
      26: <Cigarette className="w-4 h-4 text-gray-500 dark:text-gray-400" />, // Smoking area
      27: <Car className="w-4 h-4 text-primary" />, // Car rental
      28: <Bus className="w-4 h-4 text-primary" />, // Airport Pick-up Service
      30: <Sunrise className="w-4 h-4 text-yellow-600" />, // Wake-up call
      31: <Flame className="w-4 h-4 text-red-600" />, // BBQ
      32: <Waves className="w-4 h-4 text-primary" />, // Water park
      33: <Mountain className="w-4 h-4 text-green-700" />, // Golf course
      34: <Baby className="w-4 h-4 text-gray-600 dark:text-gray-400 line-through" />, // Adults only
      35: <Phone className="w-4 h-4 text-green-600" />, // Taxi call
      36: <Car className="w-4 h-4 text-gray-700 dark:text-gray-300" />, // Car garage
      37: <Coffee className="w-4 h-4 text-brown-600" />, // Cafe
      38: <Waves className="w-4 h-4 text-cyan-600" />, // Hot tub / Jacuzzi
      39: <TreePine className="w-4 h-4 text-green-600" />, // Garden
      40: <Building className="w-4 h-4 text-gray-600 dark:text-gray-400" />, // Terrace
      41: <Music className="w-4 h-4 text-pink-600" />, // Karaoke
    };

    return iconMap[facilityId] || <Star className="w-4 h-4 text-gray-600 dark:text-gray-400" />;
  };

  // String-based facility icon mapping - COMPLETE MAPPING
  const getFacilityIcon = (facility: string) => {
    const facilityLower = facility.toLowerCase().trim();

    // Map strings to icons
    const stringIconMap: { [key: string]: React.ReactNode } = {
      'restaurant': <Utensils className="w-5 h-5 text-orange-600" />,
      'ресторан': <Utensils className="w-5 h-5 text-orange-600" />,
      'room service': <ConciergeBell className="w-5 h-5 text-primary" />,
      'өрөөний үйлчилгээ': <ConciergeBell className="w-5 h-5 text-primary" />,
      '24-hour front desk': <Clock className="w-5 h-5 text-primary" />,
      '24 цагийн хүлээн авах': <Clock className="w-5 h-5 text-primary" />,
      'fitness center': <Dumbbell className="w-5 h-5 text-red-600" />,
      'фитнес төв': <Dumbbell className="w-5 h-5 text-red-600" />,
      'non-smoking rooms': <Cigarette className="w-5 h-5 text-gray-600 dark:text-gray-400" />,
      'тамхи татдаггүй өрөө': <Cigarette className="w-5 h-5 text-gray-600 dark:text-gray-400" />,
      'airport shuttle': <Bus className="w-5 h-5 text-slate-900" />,
      'нисэх онгоцны буудлын автобус': <Bus className="w-5 h-5 text-slate-900" />,
      'family rooms': <Users className="w-5 h-5 text-green-600" />,
      'гэр бүлийн өрөө': <Users className="w-5 h-5 text-green-600" />,
      'spa & welness center': <Palmtree className="w-5 h-5 text-teal-600" />,
      'spa': <Palmtree className="w-5 h-5 text-teal-600" />,
      'спа': <Palmtree className="w-5 h-5 text-teal-600" />,
      'free wi-fi': <Wifi className="w-5 h-5 text-slate-900" />,
      'үнэгүй wi-fi': <Wifi className="w-5 h-5 text-slate-900" />,
      'wifi': <Wifi className="w-5 h-5 text-slate-900" />,
      'electric vehicle charging station': <Zap className="w-5 h-5 text-yellow-600" />,
      'цахилгаан машин цэнэглэх станц': <Zap className="w-5 h-5 text-yellow-600" />,
      'guest laundry': <WashingMachine className="w-5 h-5 text-cyan-600" />,
      'зочны угаалгын газар': <WashingMachine className="w-5 h-5 text-cyan-600" />,
      'conference room': <Briefcase className="w-5 h-5 text-gray-700 dark:text-gray-300" />,
      'хурлын өрөө': <Briefcase className="w-5 h-5 text-gray-700 dark:text-gray-300" />,
      'sauna': <Heater className="w-5 h-5 text-red-600" />,
      'саун': <Heater className="w-5 h-5 text-red-600" />,
      'breakfast included': <Coffee className="w-5 h-5 text-amber-700" />,
      'өглөөний цай багтсан': <Coffee className="w-5 h-5 text-amber-700" />,
      'business center': <Building className="w-5 h-5 text-gray-700 dark:text-gray-300" />,
      'бизнес төв': <Building className="w-5 h-5 text-gray-700 dark:text-gray-300" />,
      'bar': <Wine className="w-5 h-5 text-purple-600" />,
      'бар': <Wine className="w-5 h-5 text-purple-600" />,
      'air conditioning': <Wind className="w-5 h-5 text-cyan-600" />,
      'агааржуулагч': <Wind className="w-5 h-5 text-cyan-600" />,
      'parking': <Car className="w-5 h-5 text-gray-700 dark:text-gray-300" />,
      'зогсоол': <Car className="w-5 h-5 text-gray-700 dark:text-gray-300" />,
      'pet friendly': <PawPrint className="w-5 h-5 text-amber-600" />,
      'тэжээвэр амьтан боломжтой': <PawPrint className="w-5 h-5 text-amber-600" />,
      'wheelchair accessible': <Hotel className="w-5 h-5 text-slate-900" />,
      'тэргэнцэртэй хүн ашиглах боломжтой': <Hotel className="w-5 h-5 text-slate-900" />,
      'swimming pool': <Waves className="w-5 h-5 text-slate-500" />,
      'усан сан': <Waves className="w-5 h-5 text-slate-500" />,
      'currency exchange': <DollarSign className="w-5 h-5 text-green-600" />,
      'валют солилцоо': <DollarSign className="w-5 h-5 text-green-600" />,
      'luggage storage': <Package className="w-5 h-5 text-gray-600 dark:text-gray-400" />,
      'ачаа тээш хадгалах': <Package className="w-5 h-5 text-gray-600 dark:text-gray-400" />,
      'elevator': <ElevatorIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />,
      'цахилгаан шат': <ElevatorIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />,
      'smoking area': <Cigarette className="w-5 h-5 text-gray-500 dark:text-gray-400" />,
      'тамхи татах цэг': <Cigarette className="w-5 h-5 text-gray-500 dark:text-gray-400" />,
      'car rental': <Car className="w-5 h-5 text-slate-900" />,
      'машин түрээслэх үйлчилгээ': <Car className="w-5 h-5 text-slate-900" />,
      'airport pick-up service': <Bus className="w-5 h-5 text-slate-900" />,
      'онгоцны буудлаас тосох үйлчилгээ': <Bus className="w-5 h-5 text-slate-900" />,
      'wake-up call': <Sunrise className="w-5 h-5 text-yellow-600" />,
      'сэрээх үйлчилгээ': <Sunrise className="w-5 h-5 text-yellow-600" />,
      'bbq': <Flame className="w-5 h-5 text-red-600" />,
      'water park': <Waves className="w-5 h-5 text-slate-400" />,
      'усан парк': <Waves className="w-5 h-5 text-slate-400" />,
      'golf course': <Mountain className="w-5 h-5 text-green-700" />,
      'голфын талбай': <Mountain className="w-5 h-5 text-green-700" />,
      'adults only': <Baby className="w-5 h-5 text-gray-600 dark:text-gray-400" />,
      'зөвхөн насанд хүрэгчдэд': <Baby className="w-5 h-5 text-gray-600 dark:text-gray-400" />,
      'taxi call': <Phone className="w-5 h-5 text-green-600" />,
      'такси дуудах үйлчилгээ': <Phone className="w-5 h-5 text-green-600" />,
      'car garage': <Car className="w-5 h-5 text-gray-700 dark:text-gray-300" />,
      'машины гараж': <Car className="w-5 h-5 text-gray-700 dark:text-gray-300" />,
      'cafe': <Coffee className="w-5 h-5 text-amber-600" />,
      'кафе': <Coffee className="w-5 h-5 text-amber-600" />,
      'hot tub / jacuzzi': <Waves className="w-5 h-5 text-cyan-600" />,
      'hot tub': <Waves className="w-5 h-5 text-cyan-600" />,
      'jacuzzi': <Waves className="w-5 h-5 text-cyan-600" />,
      'халуун ванн / жакуз': <Waves className="w-5 h-5 text-cyan-600" />,
      'garden': <TreePine className="w-5 h-5 text-green-600" />,
      'цэцэрлэгт хүрээлэн': <TreePine className="w-5 h-5 text-green-600" />,
      'terrace': <Building className="w-5 h-5 text-gray-600 dark:text-gray-400" />,
      'террас': <Building className="w-5 h-5 text-gray-600 dark:text-gray-400" />,
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
    return <Building className="w-5 h-5 text-gray-600 dark:text-gray-400" />;
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
      setModalImageIndex((prev) => prev === allImages.length - 1 ? 0 : prev + 1);
    }
  };

  const prevImage = () => {
    if (allImages.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? allImages.length - 1 : prev - 1
      );
      setModalImageIndex((prev) => prev === 0 ? allImages.length - 1 : prev - 1);
    }
  };

  const openGalleryAt = (index: number) => {
    setCurrentImageIndex(index);
    setModalImageIndex(index);
    setIsGalleryOpen(true);
  };

  // Use API data for hotel name if available
  const hotelName = basicInfo?.property_name_en || basicInfo?.property_name_mn || hotel.property_name;
  const starRating = basicInfo?.star_rating || getStarRating(hotel.rating_stars.value);

  // Generate nearby places based on location
  const getNearbyPlaces = (): NearbyPlace[] => {
    const city = hotel.location.province_city || '';

    // Mock nearby places data - replace with actual API data when available
    const places: NearbyPlace[] = [];

    // Add transport options
    if (city.toLowerCase().includes('ulaanbaatar') || city.toLowerCase().includes('улаанбаатар')) {
      places.push(
        { name: 'Chinggis Khaan International Airport', distance: 'About 17 km from hotel by car', category: 'transport' },
        { name: 'Ulaanbaatar Train Station', distance: 'About 5 km from hotel by car', category: 'transport' }
      );
    }

    // Add landmarks
    places.push(
      { name: 'Sukhbaatar Square', distance: 'About 3 km from hotel by car', category: 'landmarks' },
      { name: 'Zaisan Memorial', distance: 'About 6 km from hotel by car', category: 'landmarks' },
      { name: 'Gandan Monastery', distance: 'About 4 km from hotel by car', category: 'landmarks' }
    );

    // Add dining options
    places.push(
      { name: 'Restaurants nearby', distance: 'Within walking distance', category: 'dining' },
      { name: 'Local cafes', distance: 'Within 500m', category: 'dining' }
    );

    // Add shopping
    places.push(
      { name: 'State Department Store', distance: 'About 3.5 km from hotel by car', category: 'shopping' },
      { name: 'Narantuul Market', distance: 'About 7 km from hotel by car', category: 'shopping' }
    );

    return places;
  };

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
        className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>{t('common.back', 'Буцах')}</span>
      </button>

      {/* Hotel Header Section */}
      <div className="space-y-4">
        {/* Hotel Name with Star Rating, Location, and View on Map */}
        <div className="flex items-start justify-between gap-6">
          {/* Left: Hotel Name with Star Rating and Location */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{hotelName}</h1>
              {/* Star Rating next to name */}
              <div className="flex items-center gap-1">
                {[...Array(starRating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
            </div>

            {/* City, Province and View on Map on same line */}
            <div className="flex items-center gap-3">
              <span className="text-gray-700 dark:text-gray-300">
                {hotel.location.province_city}{hotel.location.soum && `, ${hotel.location.soum}`}
              </span>
              {hotel.google_map && (
                <>
                  <span className="text-gray-300 dark:text-gray-600">•</span>
                  <button
                    onClick={() => setShowMapModal(true)}
                    className="flex items-center gap-1 text-slate-900 hover:text-slate-800 text-sm font-medium"
                  >
                    <MapPin className="w-4 h-4" />
                    {t('hotelDetails.viewOnMap', 'Газрын зураг дээр харах')}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Right: Price and Book Button on same line */}
          <div className="flex items-center gap-4 flex-shrink-0">
            {/* Heart icon for saving */}
            {priceInfo && (
              <button
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                aria-label="Save hotel"
              >
                <Heart className="w-6 h-6 text-gray-400 hover:text-red-500 transition-colors" />
              </button>
            )}

            {/* Price Info */}
            {priceInfo && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">{t('hotelDetails.startingPrice', 'Эхлэх үнэ')}:</span>
                {priceInfo.discount && priceInfo.original && (
                  <>
                    <span className="text-base text-gray-500 dark:text-gray-400 line-through">
                      ₮{priceInfo.original.toLocaleString()}
                    </span>
                    <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-semibold rounded">
                      -{priceInfo.discount}%
                    </span>
                  </>
                )}
                <span className="text-xl font-bold text-slate-900">
                  ₮{priceInfo.current.toLocaleString()}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">/{t('hotelDetails.night', 'шөнө')}</span>
              </div>
            )}

            {/* Book Button */}
            <button
              onClick={scrollToRooms}
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg transition-colors shadow-sm whitespace-nowrap"
            >
              {t('hotelDetails.book', 'Захиалах')}
            </button>
          </div>
        </div>
      </div>

      {/* Image Gallery and Info Sidebar - Figma Design Layout */}
      <div className="flex gap-4">
        {/* Left: Images Section */}
        <div className="flex-1">
          <div className="flex gap-1 h-[400px]">
            {/* Main Large Image - Left side */}
            <div className="w-[55%] relative">
              <div className="relative bg-gray-100 dark:bg-gray-700 overflow-hidden rounded-l-xl h-full">
                <button
                  type="button"
                  className="relative w-full h-full"
                  onClick={() => openGalleryAt(currentImageIndex)}
                >
                  <SafeImage
                    src={allImages[currentImageIndex]?.url || (typeof hotel.images.cover === 'string' ? hotel.images.cover : hotel.images.cover?.url) || '/placeholder-hotel.jpg'}
                    alt={hotelName || 'Hotel'}
                    fill
                    className="object-cover"
                  />
                </button>

                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800 rounded-full p-2 shadow-lg transition-all"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800 rounded-full p-2 shadow-lg transition-all"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Right side images - 2x2 Grid */}
            <div className="w-[45%] grid grid-cols-2 grid-rows-2 gap-1">
              {allImages.filter(img => img.url).slice(1, 5).map((image, index) => (
                <div
                  key={index}
                  className={`relative cursor-pointer bg-gray-100 dark:bg-gray-700 overflow-hidden group ${
                    index === 1 ? 'rounded-tr-xl' : 
                    index === 3 ? 'rounded-br-xl' : ''
                  }`}
                  onClick={() => openGalleryAt(index + 1)}
                >
                  <SafeImage
                    src={image.url}
                    alt={`${hotelName || 'Hotel'} - ${index + 2}`}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  {/* Show +X photos overlay on last image if more images available */}
                  {index === 3 && allImages.filter(img => img.url).length > 5 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">+{allImages.filter(img => img.url).length - 5} {t('hotelDetails.photos', 'зураг')}</span>
                    </div>
                  )}
                </div>
              ))}
              {/* Fill empty slots if less than 4 side images */}
              {allImages.filter(img => img.url).length < 5 && 
                [...Array(Math.max(0, 4 - (allImages.filter(img => img.url).length - 1)))].map((_, index) => (
                  <div 
                    key={`empty-${index}`} 
                    className={`relative bg-gray-100 dark:bg-gray-700 ${
                      (allImages.filter(img => img.url).length - 1 + index) === 1 ? 'rounded-tr-xl' : 
                      (allImages.filter(img => img.url).length - 1 + index) === 3 ? 'rounded-br-xl' : ''
                    }`}
                  />
                ))
              }
            </div>
          </div>

          {/* Thumbnail Row */}
          {allImages.filter(img => img.url).length > 5 && (
            <div className="flex gap-1 mt-2">
              {allImages.filter(img => img.url).slice(0, 7).map((image, index) => (
                <div
                  key={index}
                  className={`relative h-16 flex-1 cursor-pointer bg-gray-100 dark:bg-gray-700 overflow-hidden rounded-lg group ${currentImageIndex === index ? 'ring-2 ring-blue-600' : ''}`}
                  onClick={() => openGalleryAt(index)}
                >
                  <SafeImage
                    src={image.url}
                    alt={`${hotelName || 'Hotel'} - ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
          <DialogContent className="max-w-6xl w-[95vw] p-0 border border-slate-200 dark:border-slate-700 bg-white dark:bg-gray-900 text-slate-900 dark:text-white shadow-2xl rounded-2xl overflow-hidden">
            <DialogTitle className="sr-only">{hotelName} photos</DialogTitle>
            <div className="flex flex-col h-[85vh]">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-gray-900/95">
                <div className="text-sm font-semibold truncate text-slate-900 dark:text-white">{hotelName}</div>
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <span>{modalImageIndex + 1} / {allImages.length}</span>
                  <DialogClose asChild>
                    <button className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors" aria-label="Close">
                      <X className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                    </button>
                  </DialogClose>
                </div>
              </div>

              <div className="relative flex-1 bg-white dark:bg-gray-900">
                {allImages[modalImageIndex]?.url && (
                  <SafeImage
                    src={allImages[modalImageIndex].url}
                    alt={hotelName || 'Hotel'}
                    fill
                    className="object-contain"
                  />
                )}

                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={() => setModalImageIndex(modalImageIndex === 0 ? allImages.length - 1 : modalImageIndex - 1)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white hover:bg-slate-50 dark:bg-gray-800 dark:hover:bg-gray-700 text-slate-800 dark:text-slate-200 rounded-full p-3 shadow-lg"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setModalImageIndex((modalImageIndex + 1) % allImages.length)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white hover:bg-slate-50 dark:bg-gray-800 dark:hover:bg-gray-700 text-slate-800 dark:text-slate-200 rounded-full p-3 shadow-lg"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {allImages.length > 1 && (
                <div className="p-4 bg-white dark:bg-gray-900 border-t border-slate-200 dark:border-slate-700 overflow-x-auto">
                  <div className="flex gap-2 min-w-full">
                    {allImages.map((img, index) => (
                      <button
                        key={img.url + index}
                        onClick={() => setModalImageIndex(index)}
                        className={`relative w-20 h-14 rounded-md overflow-hidden border ${
                          index === modalImageIndex ? 'border-slate-900' : 'border-slate-200'
                        }`}
                      >
                        <SafeImage
                          src={img.url}
                          alt={hotelName || 'Hotel'}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Right: Info Sidebar */}
        <div className="w-[300px] flex-shrink-0">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            {/* Rating Section */}
            <div className="p-4 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 text-white px-3 py-2 rounded-lg">
                  <span className="text-xl font-bold">4.7</span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">{t('hotelDetails.exceptional', 'Exceptional')}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">3014 {t('hotelDetails.reviews', 'reviews')}</div>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                <span className="text-green-600">✓</span>
                <span>{t('hotelDetails.highlyRated', 'Highly rated by guests')} — 86% {t('hotelDetails.wouldRecommend', 'would recommend')}</span>
              </div>
            </div>

            {/* Tags Section */}
            <div className="p-4 border-b border-gray-100 dark:border-gray-700">
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full border border-gray-200 dark:border-gray-600">
                  <Coffee className="w-3.5 h-3.5" />
                  {t('hotelDetails.breakfast', 'Breakfast')} 25
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full border border-gray-200 dark:border-gray-600">
                  <Wifi className="w-3.5 h-3.5" />
                  WiFi 14
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full border border-gray-200 dark:border-gray-600">
                  <Utensils className="w-3.5 h-3.5" />
                  {t('hotelDetails.foodDining', 'Food & Dining')} 67
                </span>
              </div>
            </div>

            {/* Location / Surroundings Section */}
            <div className="p-4 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  {t('hotelDetails.locationInfo', 'Байршлын мэдээлэл')}
                </h3>
              </div>
              
              <div className="space-y-2.5">
                {/* Province/City */}
                {address?.province_city && provinceMap.get(address.province_city) && (
                  <div className="flex items-start gap-2">
                    <Building className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <div className="text-xs text-gray-500 dark:text-gray-400">{t('hotelDetails.provinceCity', 'Хот/Аймаг')}</div>
                      <div className="text-sm text-gray-900 dark:text-white">{provinceMap.get(address.province_city)}</div>
                    </div>
                  </div>
                )}

                {/* Soum/District */}
                {(address?.soum ? soumMap.get(address.soum) : address?.district) && (
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <div className="text-xs text-gray-500 dark:text-gray-400">{t('hotelDetails.soumDistrict', 'Дүүрэг/Сум')}</div>
                      <div className="text-sm text-gray-900 dark:text-white">
                        {address?.soum ? soumMap.get(address.soum) : address?.district}
                      </div>
                    </div>
                  </div>
                )}

                {/* Total Floors */}
                {address?.total_floor_number && (
                  <div className="flex items-start gap-2">
                    <Layers className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <div className="text-xs text-gray-500 dark:text-gray-400">{t('hotelDetails.totalFloors', 'Давхрын тоо')}</div>
                      <div className="text-sm text-gray-900 dark:text-white">
                        {address.total_floor_number} {t('hotelDetails.floors', 'давхар')}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* View on map link */}
              {hotel.google_map && (
                <button
                  onClick={() => setShowMapModal(true)}
                  className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium inline-block"
                >
                  {t('hotelDetails.viewOnMap', 'View on map')}
                </button>
              )}
            </div>

            {/* Property Highlights */}
            <div className="p-4">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">{t('hotelDetails.propertyHighlights', 'Property highlights')}</h4>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span>{t('hotelDetails.inCityCenter', 'In')} {hotel.location.province_city || 'City'} {t('hotelDetails.center', 'Centre')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5 mt-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{t('hotelDetails.aboutProperty', 'Зочид буудлын тухай')}</h2>

        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          {additionalInfo?.About || t('hotelDetails.defaultDescription', { hotelName, city: hotel.location.province_city || '' })}
        </p>

        {basicInfo && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              {/* Total Rooms */}
              <div className="flex items-start gap-2">
                <Building className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <div className="text-gray-500 dark:text-gray-400">{t('hotelDetails.totalRooms', 'Нийт өрөө')}</div>
                  <div className="font-medium text-gray-900 dark:text-white">{basicInfo.total_hotel_rooms} {t('hotelDetails.rooms', 'өрөө')}</div>
                </div>
              </div>

              {basicInfo.part_of_group && (
                <div className="flex items-start gap-2">
                  <Building className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-gray-500 dark:text-gray-400">{t('hotelDetails.hotelGroup', 'Сүлжээ')}</div>
                    <div className="font-medium text-gray-900 dark:text-white">{basicInfo.group_name || t('hotelDetails.yes', 'Тийм')}</div>
                  </div>
                </div>
              )}

              {new Date(basicInfo.start_date).getFullYear() && (
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-gray-500 dark:text-gray-400">{t('hotelDetails.operatingSince', 'Үйл ажиллагаа эхэлсэн')}</div>
                    <div className="font-medium text-gray-900 dark:text-white">{new Date(basicInfo.start_date).getFullYear()}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Facilities Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('popular_amenities', 'Үндсэн тохижилт')}</h3>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {hotel.general_facilities.map((facility, index) => {
            // Check if facility is a number (ID) or string (name)
            const isId = typeof facility === 'number' || !isNaN(Number(facility));
            const facilityId = isId ? Number(facility) : null;

            // Get facility name from map or use the string value
            let facilityName = facility;
            if (facilityId && facilitiesMap.has(facilityId)) {
              const facilityData = facilitiesMap.get(facilityId);
              facilityName = facilityData?.name_en || facilityData?.name_mn || facility;
            }

            return (
              <div key={index} className="flex items-center gap-2.5 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="flex-shrink-0">
                  {facilityId ? getFacilityIconById(facilityId) : getFacilityIcon(String(facility))}
                </div>
                <span className="text-gray-700 dark:text-gray-300 text-sm">{facilityName}</span>
              </div>
            );
          })}
        </div>
      </div>
      
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-400">{t('hotelDetails.loadingExtra', 'Мэдээлэл ачааллаж байна...')}</span>
        </div>
      )}

      {/* Google Map Modal */}
      <GoogleMapModal
        isOpen={showMapModal}
        onClose={() => setShowMapModal(false)}
        googleMapUrl={hotel.google_map}
        hotelName={hotelName}
        hotelAddress={address ? address.district : undefined}
        nearbyPlaces={getNearbyPlaces()}
      />
    </div>
  );
}