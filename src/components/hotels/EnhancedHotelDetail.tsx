'use client';

import { useState, useEffect } from 'react';
import { 
  Star, MapPin, Wifi, ChevronLeft, ChevronRight, Building, Users, Calendar,
  Car, Coffee, Utensils, Dumbbell, Waves, Wind, Phone,
  Wine, Briefcase, PawPrint, Cigarette, Clock, 
  ShoppingBag, Palmtree, Bus, WashingMachine, Heater, Bell, Mountain
} from 'lucide-react';
import SafeImage from '@/components/common/SafeImage';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import { ApiService } from '@/services/api';
import { PropertyBasicInfo, ConfirmAddress, PropertyImage, AdditionalInfo, PropertyDetails } from '@/types/api';

interface Hotel {
  hotel_id: number;
  property_name: string;
  location: {
    province_city: string | null;
    soum: string | null;
    district: string | null;
  };
  images: {
    cover: string | {
      url: string;
      description: string;
    };
    gallery: Array<{
      url: string;
      description: string;
    }>;
  };
  rating_stars: {
    id: number;
    label: string;
    value: string;
  };
  google_map: string;
  general_facilities: string[];
  description?: string;
}

interface EnhancedHotelDetailProps {
  hotel: Hotel;
}

export default function EnhancedHotelDetail({ hotel }: EnhancedHotelDetailProps) {
  const { t } = useHydratedTranslation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [basicInfo, setBasicInfo] = useState<PropertyBasicInfo | null>(null);
  const [address, setAddress] = useState<ConfirmAddress | null>(null);
  const [propertyImages, setPropertyImages] = useState<PropertyImage[]>([]);
  const [additionalInfo, setAdditionalInfo] = useState<AdditionalInfo | null>(null);
  const [propertyDetails, setPropertyDetails] = useState<PropertyDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotelDetails = async () => {
      try {
        setLoading(true);
        
        // Fetch all hotel detail APIs
        const [
          basicInfoData,
          addressData,
          imagesData,
          propertyDetailsData
        ] = await Promise.all([
          ApiService.getPropertyBasicInfo(hotel.hotel_id).catch(e => { console.warn('Basic info failed:', e); return []; }),
          ApiService.getConfirmAddress(hotel.hotel_id).catch(e => { console.warn('Address failed:', e); return []; }),
          ApiService.getPropertyImages(hotel.hotel_id).catch(e => { console.warn('Images failed:', e); return []; }),
          ApiService.getPropertyDetails(hotel.hotel_id).catch(e => { console.warn('Property details failed:', e); return []; })
        ]);

        // Set data from arrays (APIs return arrays with single items)
        setBasicInfo(basicInfoData[0] || null);
        setAddress(addressData[0] || null);
        setPropertyImages(imagesData);
        setPropertyDetails(propertyDetailsData[0] || null);

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

  // API-based facility icon mapping using exact facility IDs
  const getFacilityIconById = (facilityId: number) => {
    const iconMap: { [key: number]: React.ReactNode } = {
      1: <Utensils className="w-3 h-3 text-green-600" />, // Restaurant
      2: <Bell className="w-3 h-3 text-green-600" />, // Room service
      4: <Clock className="w-3 h-3 text-green-600" />, // 24-hour front desk
      5: <Dumbbell className="w-3 h-3 text-green-600" />, // Fitness center
      6: <Cigarette className="w-3 h-3 text-green-600" />, // Non-smoking rooms
      7: <Bus className="w-3 h-3 text-green-600" />, // Airport shuttle
      8: <Users className="w-3 h-3 text-green-600" />, // Family rooms
      9: <Palmtree className="w-3 h-3 text-green-600" />, // Spa & wellness center
      10: <Wifi className="w-3 h-3 text-green-600" />, // Free Wi-Fi
      11: <Car className="w-3 h-3 text-green-600" />, // Electric vehicle charging
      12: <WashingMachine className="w-3 h-3 text-green-600" />, // Guest Laundry
      13: <Briefcase className="w-3 h-3 text-green-600" />, // Conference room
      14: <Heater className="w-3 h-3 text-green-600" />, // Sauna
      15: <Coffee className="w-3 h-3 text-green-600" />, // Breakfast included
      16: <Briefcase className="w-3 h-3 text-green-600" />, // Business center
      17: <Wine className="w-3 h-3 text-green-600" />, // Bar
      18: <Wind className="w-3 h-3 text-green-600" />, // Air conditioning
      19: <Car className="w-3 h-3 text-green-600" />, // Parking
      20: <PawPrint className="w-3 h-3 text-green-600" />, // Pet friendly
      21: <Users className="w-3 h-3 text-green-600" />, // Wheelchair accessible
      22: <Waves className="w-3 h-3 text-green-600" />, // Swimming pool
      23: <ShoppingBag className="w-3 h-3 text-green-600" />, // Currency exchange
      24: <ShoppingBag className="w-3 h-3 text-green-600" />, // Luggage storage
      25: <Building className="w-3 h-3 text-green-600" />, // Elevator
      26: <Cigarette className="w-3 h-3 text-green-600" />, // Smoking area
      27: <Car className="w-3 h-3 text-green-600" />, // Car rental
      28: <Bus className="w-3 h-3 text-green-600" />, // Airport Pick-up Service
      30: <Phone className="w-3 h-3 text-green-600" />, // Wake-up call
      31: <Utensils className="w-3 h-3 text-green-600" />, // BBQ
      32: <Waves className="w-3 h-3 text-green-600" />, // Water park
      33: <Mountain className="w-3 h-3 text-green-600" />, // Golf course
      34: <Users className="w-3 h-3 text-green-600" />, // Adults only
      35: <Phone className="w-3 h-3 text-green-600" />, // Taxi call
      36: <Car className="w-3 h-3 text-green-600" />, // Car garage
      37: <Coffee className="w-3 h-3 text-green-600" />, // Cafe
      38: <Waves className="w-3 h-3 text-green-600" />, // Hot tub / Jacuzzi
      39: <Palmtree className="w-3 h-3 text-green-600" />, // Garden
      40: <Building className="w-3 h-3 text-green-600" />, // Terrace
      41: <Star className="w-3 h-3 text-green-600" />, // Karaoke
    };
    
    return iconMap[facilityId] || <Star className="w-3 h-3 text-green-600" />;
  };

  // Fallback function for string-based facility names (backward compatibility)
  const getFacilityIcon = (facility: string) => {
    const facilityLower = facility.toLowerCase();
    
    // WiFi and Internet
    if (facilityLower.includes('wifi') || facilityLower.includes('internet') || facilityLower.includes('вайфай')) {
      return <Wifi className="w-3 h-3 text-green-600" />;
    }

    // Restaurant and Food
    if (facilityLower.includes('restaurant') || facilityLower.includes('ресторан') || facilityLower.includes('dining')) {
      return <Utensils className="w-3 h-3 text-green-600" />;
    }

    // Default icon for unmatched facilities
    return <Star className="w-3 h-3 text-green-600" />;
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

  return (
    <div className="space-y-4">
      {/* Enhanced Hotel Info Card */}
      {/* {basicInfo && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <Building className="w-8 h-8 text-blue-600" />
              <div>
                <div className="text-sm text-blue-600 font-medium">Total Rooms</div>
                <div className="text-xl font-bold text-blue-900">{basicInfo.total_hotel_rooms}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-green-600" />
              <div>
                <div className="text-sm text-green-600 font-medium">Available Rooms</div>
                <div className="text-xl font-bold text-green-900">{basicInfo.available_rooms}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-purple-600" />
              <div>
                <div className="text-sm text-purple-600 font-medium">Operating Since</div>
                <div className="text-lg font-bold text-purple-900">{new Date(basicInfo.start_date).getFullYear()}</div>
              </div>
            </div>
          </div>
        </div>
      )} */}

      {/* Image Gallery */}
      <div className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
          {/* Main Image */}
          <div className="lg:col-span-2 relative h-64 lg:h-80 rounded-lg overflow-hidden">
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
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Image indicators */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                  {allImages.slice(0, 10).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Thumbnail Grid */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-3">
            {allImages.slice(1, 5).map((image, index) => (
              <div
                key={index}
                className="relative h-32 lg:h-36 cursor-pointer rounded-lg overflow-hidden"
                onClick={() => setCurrentImageIndex(index + 1)}
              >
                <SafeImage
                  src={image.url || ''}
                  alt={`${hotelName} - ${index + 1}`}
                  fill
                  className="object-cover hover:opacity-80 transition-opacity"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Header */}
      <div>
        <div className="flex items-center mb-1">
          {[...Array(starRating)].map((_, i) => (
            <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
          ))}
          <span className="ml-2 text-xs text-gray-800">
            {basicInfo ? `${starRating} Star Hotel` : hotel.rating_stars.label}
          </span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-1">{hotelName}</h1>
        <div className="flex items-center gap-3 text-gray-800">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span className="text-gray-800 text-sm">
              {hotel.location.province_city}, {hotel.location.soum}
              {address?.district && `, ${address.district}`}
              {address?.zipCode && ` (${address.zipCode})`}
            </span>
          </div>
        </div>
        {address && (
          <div className="mt-1 text-xs text-gray-600">
            {address.total_floor_number} floors • ID: {address.id}
          </div>
        )}
      </div>

      {/* Enhanced Description */}
      <div>
        <h2 className="text-lg text-black font-semibold mb-2">{t('about_property', 'Зочид буудлын тухай')}</h2>

        {additionalInfo?.About ? (
          <div className="space-y-3">
            <p className="text-gray-900 leading-relaxed text-sm">
              {additionalInfo.About}
            </p>
            {additionalInfo.YoutubeUrl && (
              <div>
                <h3 className="text-base font-semibold mb-2 text-gray-900">Video Tour</h3>
                <div className="aspect-video">
                  <iframe
                    src={additionalInfo.YoutubeUrl.replace('youtu.be/', 'www.youtube.com/embed/').replace('?si=', '?')}
                    title="Hotel Video Tour"
                    className="w-full h-full rounded-lg"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-900 leading-relaxed text-sm">
            {hotel.description || t('default_description', `${hotelName} зочид буудалд тав тухтай орчинд амрах боломжтай. ${hotel.location.province_city} хотын төвд байрлах энэхүү зочид буудал орчин үеийн тохижилт, өндөр чанарын үйлчилгээгээр таны амралтыг дурсамжтай болгоно.`)}
          </p>
        )}

        {basicInfo && (
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-gray-50 rounded-lg">
            <div>
              <span className="font-medium text-gray-900 text-xs">Hotel Group: </span>
              <span className="text-gray-700 text-xs">
                {basicInfo.part_of_group ? (basicInfo.group_name || 'Yes') : 'Independent'}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-900 text-xs">Room Sales: </span>
              <span className="text-gray-700 text-xs">
                {basicInfo.sales_room_limitation ? 'Limited availability' : 'Open booking'}
              </span>
            </div>
            {propertyDetails && (
              <div className="col-span-2">
                <span className="font-medium text-gray-900 text-xs">Property ID: </span>
                <span className="text-gray-700 text-xs">{propertyDetails.property}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Minimal Facilities Section - Booking.com style */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('popular_amenities', 'Үндсэн тохижилт')}</h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2">
          {hotel.general_facilities.map((facility, index) => {
            // Check if facility is a number (ID) or string (name)
            const isId = typeof facility === 'number' || !isNaN(Number(facility));
            const facilityId = isId ? Number(facility) : null;

            return (
              <div key={index} className="flex items-center space-x-2">
                <div className="flex-shrink-0">
                  {facilityId ? getFacilityIconById(facilityId) : getFacilityIcon(facility)}
                </div>
                <span className="text-gray-900 text-xs">{facility}</span>
              </div>
            );
          })}
        </div>
      </div>
      
      {loading && (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600 text-sm">Loading additional details...</span>
        </div>
      )}
    </div>
  );
}