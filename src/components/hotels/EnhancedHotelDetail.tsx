'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Star, MapPin, Wifi, ChevronLeft, ChevronRight, Building, Users,
  Car, Coffee, Utensils, Dumbbell, Waves, Wind, Phone,
  Wine, Briefcase, PawPrint, Cigarette, Clock,
  Palmtree, Bus, WashingMachine, Heater, Mountain,
  ArrowLeft, Bell as ConciergeBell, Zap, Hotel, DollarSign, Package,
  MoveVertical as ElevatorIcon, Sunrise, Flame, TreePine, Music, Baby, Heart, Layers3 as Layers, X,
  PlayCircle
} from 'lucide-react';
import SafeImage from '@/components/common/SafeImage';
import { Dialog, DialogContent, DialogClose, DialogTitle } from '@/components/ui/dialog';
import GoogleMapModal, { NearbyPlace } from '@/components/common/GoogleMapModal';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import { ApiService } from '@/services/api';
import { ConfirmAddress, Facility, SearchHotelResult, PropertyDetails, PropertyBasicInfo, AdditionalInfo, PropertyImage } from '@/types/api';
import { Train, Plane, Landmark, Utensils as RestaurantIcon, ShoppingBag, Building2 } from 'lucide-react';
import WishlistHeart from '@/components/wishlist/WishlistHeart';
import { useAuthenticatedUser } from '@/hooks/useCustomer';

interface EnhancedHotelDetailProps {
  hotel: SearchHotelResult;
  propertyDetails: PropertyDetails | null;
  basicInfo: PropertyBasicInfo | null;
  additionalInfo: AdditionalInfo | null;
  propertyImages?: PropertyImage[];
}

export default function EnhancedHotelDetail({ hotel, propertyDetails, basicInfo, additionalInfo, propertyImages = [] }: EnhancedHotelDetailProps) {
  const { t } = useHydratedTranslation();
  const { isAuthenticated } = useAuthenticatedUser();
  const router = useRouter();
  // State variables for component functionality
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [address, setAddress] = useState<ConfirmAddress | null>(null);
  const [loading, setLoading] = useState(true);
  const [facilitiesMap, setFacilitiesMap] = useState<Map<number, Facility>>(new Map());
  const [provinceMap, setProvinceMap] = useState<Map<number, string>>(new Map());
  const [soumMap, setSoumMap] = useState<Map<number, string>>(new Map());
  const [showMapModal, setShowMapModal] = useState(false);

  useEffect(() => {
    const fetchHotelDetails = async () => {
      try {
        setLoading(true);

        // Only fetch combinedData for facility/province maps
        const [
          combinedData = { facilities: [], additionalFacilities: [], activities: [], province: [], soum: [], property_types: [], ratings: [], accessibility_features: [], languages: [] }
        ] = await Promise.all([
          ApiService.getCombinedData().catch(e => {
            console.warn('Combined data failed:', e);
            return { facilities: [], additionalFacilities: [], activities: [], province: [], soum: [], property_types: [], ratings: [], accessibility_features: [], languages: [] };
          })
        ]);

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

  // Build image list: prefer dedicated property-images endpoint (is_profile first),
  // then fall back to property_details.property_photos, then search API images.
  const allImages = (() => {
    const source = propertyImages?.length ? propertyImages : propertyDetails?.property_photos ?? [];
    if (source.length) {
      const sorted = [
        ...source.filter(p => p.is_profile),
        ...source.filter(p => !p.is_profile),
      ];
      return sorted
        .filter(p => p.image)
        .map(p => ({ url: p.image, description: p.description }));
    }
    // Fallback: search API images
    return [
      { url: typeof hotel.images.cover === 'string' ? hotel.images.cover : hotel.images.cover?.url || '', description: 'Cover' },
      ...hotel.images.gallery,
    ].filter((img, index, self) =>
      img.url && self.findIndex(i => i.url === img.url) === index
    );
  })();

  // Helper: convert any YouTube URL variant to an embed URL
  const getYouTubeEmbedUrl = (url: string): string | null => {
    try {
      const parsed = new URL(url);
      // Already an embed URL
      if (parsed.pathname.startsWith('/embed/')) {
        return `https://www.youtube.com/embed/${parsed.pathname.split('/embed/')[1].split('?')[0]}`;
      }
      // Standard watch URL: ?v=ID
      const v = parsed.searchParams.get('v');
      if (v) return `https://www.youtube.com/embed/${v}`;
      // youtu.be shortlink
      if (parsed.hostname === 'youtu.be') {
        return `https://www.youtube.com/embed${parsed.pathname}`;
      }
    } catch {
      // ignore
    }
    return null;
  };

  const youtubeEmbedUrl = additionalInfo?.YoutubeUrl
    ? getYouTubeEmbedUrl(additionalInfo.YoutubeUrl)
    : null;

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

  const openGalleryAt = (index: number) => {
    setCurrentImageIndex(index);
    setIsGalleryOpen(true);
  };

  // Use hotel object data directly
  const hotelName = hotel.property_name;
  // Use basicInfo.star_rating (hotel category stars) if available, otherwise fall back to search API value
  // Normalize: if value > 5 it was stored as a rating ID (offset by 2), convert to actual star count
  const rawStarRating = basicInfo?.star_rating ?? getStarRating(hotel.rating_stars?.value || 0);
  const starRating = rawStarRating > 5 ? rawStarRating - 2 : rawStarRating;

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

  // Handle back navigation with improved logic for profile/saved page
  const handleBack = () => {
    // Check URL params to see if user came from specific page
    const urlParams = new URLSearchParams(window.location.search);
    const fromParam = urlParams.get('from');
    
    if (fromParam === 'profile-saved') {
      // Navigate back to saved hotels page
      router.push('/profile/saved');
    } else if (window.history.length > 1) {
      // Use browser back if there's history
      router.back();
    } else {
      // Fallback to home page
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
    <div className="space-y-4">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>{t('common.back', 'Буцах')}</span>
      </button>

      {/* Hotel Header Section */}
      <div className="space-y-3">
        {/* Hotel Name with Star Rating, Location, and View on Map */}
        <div className="flex items-start justify-between gap-4">
          {/* Left: Hotel Name with Star Rating and Location */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{hotelName}</h1>
              {/* Star Rating next to name */}
              <div className="flex items-center gap-1">
                {[...Array(starRating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              {/* Wishlist Heart for authenticated users */}
   
            </div>

            {/* City, Province and View on Map on same line */}
            <div className="flex items-center gap-3">
              <span className="text-gray-700 dark:text-gray-300 text-sm">
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
          <div className="flex items-center gap-3 flex-shrink-0">
     
                          {priceInfo && isAuthenticated && (
                <WishlistHeart
                  hotelId={hotel.hotel_id}
                  size={24}
                  tooltipPosition="right"
                />
              )}
      
            {/* Price Info */}
            {priceInfo && (
              <div className="flex flex-col items-end gap-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{t('hotelDetails.startingPrice', 'Эхлэх үнэ')}:</span>
                  {priceInfo.discount && priceInfo.original && (
                    <>
                      <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                        ₮{priceInfo.original.toLocaleString()}
                      </span>
                      <span className="px-1.5 py-0.5 bg-red-500 text-white text-xs font-semibold rounded">
                        -{priceInfo.discount}%
                      </span>
                    </>
                  )}
                  <span className="text-lg font-bold text-slate-900 dark:text-white">
                    ₮{priceInfo.current.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">/{t('hotelDetails.night', 'шөнө')}</span>
                </div>
                {hotel.cheapest_room && hotel.cheapest_room.nights > 1 && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {t('hotelDetails.totalForStay', 'Нийт')} {hotel.cheapest_room.nights} {t('hotelDetails.nights', 'шөнө')}: <span className="font-semibold text-gray-700 dark:text-gray-300">₮{hotel.cheapest_room.estimated_total_for_requested_rooms.toLocaleString()}</span>
                  </span>
                )}
              </div>
            )}

            {/* Book Button */}
            <button
              onClick={scrollToRooms}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg transition-colors shadow-sm whitespace-nowrap text-sm"
            >
              {t('hotelDetails.book', 'Захиалах')}
            </button>
          </div>
        </div>
      </div>

      {/* Image Gallery and Info Sidebar - Compact Layout */}
      <div className="flex gap-3">
        {/* Left: Images Section */}
        <div className="flex-1">
          <div className="flex gap-1 h-[420px]">
            {/* Main Large Image - Left side */}
            <div className="w-[55%] relative">
              <div className="relative bg-gray-100 dark:bg-gray-700 overflow-hidden rounded-l-xl h-full">
                <button
                  type="button"
                  className="relative w-full h-full"
                  onClick={() => openGalleryAt(currentImageIndex)}
                >
                  <SafeImage
                    src={allImages[currentImageIndex]?.url || (typeof hotel.images.cover === 'string' ? hotel.images.cover : hotel.images.cover?.url) || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop&auto=format'}
                    alt={hotelName || 'Hotel'}
                    fill
                    className="object-cover"
                  />
                </button>

                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800 rounded-full p-1.5 shadow-lg transition-all"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800 rounded-full p-1.5 shadow-lg transition-all"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-4 h-4 text-gray-700 dark:text-gray-300" />
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
            <div className="flex gap-1 mt-1">
              {allImages.filter(img => img.url).slice(0, 7).map((image, index) => (
                <div
                  key={index}
                  className={`relative h-12 flex-1 cursor-pointer bg-gray-100 dark:bg-gray-700 overflow-hidden rounded-md group ${currentImageIndex === index ? 'ring-2 ring-blue-600' : ''}`}
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
                  <span>{currentImageIndex + 1} / {allImages.length}</span>
                  <DialogClose asChild>
                    <button className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors" aria-label="Close">
                      <X className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                    </button>
                  </DialogClose>
                </div>
              </div>

              <div className="relative flex-1 bg-white dark:bg-gray-900">
                {allImages[currentImageIndex]?.url && (
                  <SafeImage
                    src={allImages[currentImageIndex].url}
                    alt={hotelName || 'Hotel'}
                    fill
                    className="object-contain"
                  />
                )}

                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white hover:bg-slate-50 dark:bg-gray-800 dark:hover:bg-gray-700 text-slate-800 dark:text-slate-200 rounded-full p-3 shadow-lg"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
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
                        onClick={() => setCurrentImageIndex(index)}
                        className={`relative w-20 h-14 rounded-md overflow-hidden border ${
                          index === currentImageIndex ? 'border-slate-900' : 'border-slate-200'
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

        {/* Right: Info Sidebar - Separate Distinct Boxes */}
        <div className="w-[280px] flex-shrink-0 flex flex-col gap-3 h-[420px]">
          {/* Box 1: Star Rating — only show search-API rating when no authoritative basicInfo.star_rating is available */}
          {!basicInfo?.star_rating && hotel.rating_stars?.value && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-3 flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="bg-blue-600 text-white px-2.5 py-1.5 rounded-lg">
                  <span className="text-lg font-bold">
                    {parseFloat(hotel.rating_stars.value).toFixed(1)}
                  </span>
                </div>
                {hotel.rating_stars.label && (
                  <div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {hotel.rating_stars.label}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Box 2: Surroundings */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-3 flex-1 min-h-0 overflow-hidden">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                {t('hotelDetails.surroundings', 'Surroundings')}
              </h3>
            </div>
            
            <div className="space-y-1.5">
              {/* Compact location info */}
              <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                <Plane className="w-3 h-3" />
                <span>Airport: Buyant-Ukhaa International Air... (9.2 miles)</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                <Train className="w-3 h-3" />
                <span>Train: Ulaanbaatar(2.0 miles)</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                <Landmark className="w-3 h-3" />
                <span>Landmarks: Choijin Lama Temple Museum(750 ft)</span>
              </div>
            </div>

            {/* View on map link */}
            {hotel.google_map && (
              <button
                onClick={() => setShowMapModal(true)}
                className="mt-2 text-blue-600 hover:text-blue-700 text-xs font-medium"
              >
                {t('hotelDetails.viewOnMap', 'View on map')}
              </button>
            )}
          </div>

          {/* Box 3: Property Highlights */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-3 flex-1 min-h-0 overflow-hidden">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">{t('hotelDetails.propertyHighlights', 'Буудлын онцлогууд')}</h4>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                <MapPin className="w-3 h-3 text-gray-400" />
                <span>{t('hotelDetails.inCityCenter', 'In')} {hotel.location.province_city || 'City'} {t('hotelDetails.center', 'Centre')}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                <Car className="w-3 h-3 text-gray-400" />
                <span>Airport transfer</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                <Clock className="w-3 h-3 text-gray-400" />
                <span>Front desk [24-hour]</span>
              </div>
            </div>
          </div>

          {/* Box 4: YouTube Video - fills remaining sidebar space */}
          {youtubeEmbedUrl && (
            <div className="bg-black rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden flex-1 min-h-0">
              <div className="relative w-full h-full">
                <iframe
                  src={youtubeEmbedUrl}
                  title={`${hotelName} video`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Description Section - only shown when About text is available */}
      {additionalInfo?.About && (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mt-3">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{t('hotelDetails.aboutProperty', 'Тухай')}</h2>
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
          {additionalInfo.About}
        </p>
      </div>
      )}
      
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