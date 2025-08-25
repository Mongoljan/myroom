'use client';

import { useState } from 'react';
import { Star, MapPin, Wifi, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';

interface Hotel {
  hotel_id: number;
  property_name: string;
  location: {
    province_city: string;
    soum: string;
    district: string;
  };
  images: {
    cover: {
      url: string;
      description: string;
    };
    gallery: Array<{
      img: {
        url: string;
        description: string;
      };
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

interface HotelDetailProps {
  hotel: Hotel;
}

export default function HotelDetail({ hotel }: HotelDetailProps) {
  const { t } = useHydratedTranslation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const getStarRating = (value: string) => {
    const match = value.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  };

  const nextImage = () => {
    if (hotel.images.gallery.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === hotel.images.gallery.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (hotel.images.gallery.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? hotel.images.gallery.length - 1 : prev - 1
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Image Gallery */}
      <div className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Main Image */}
          <div className="lg:col-span-2 relative h-80 lg:h-96 rounded-xl overflow-hidden">
            <Image
              src={hotel.images.gallery[currentImageIndex]?.img.url || hotel.images.cover.url}
              alt={hotel.property_name}
              fill
              className="object-cover"
            />
            
            {hotel.images.gallery.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-3 shadow-md transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-3 shadow-md transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                
                {/* Image indicators */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {hotel.images.gallery.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-3 h-3 rounded-full ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Thumbnail Grid */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-4">
            {hotel.images.gallery.slice(1, 5).map((image, index) => (
              <div 
                key={index}
                className="relative h-36 lg:h-44 cursor-pointer rounded-xl overflow-hidden"
                onClick={() => setCurrentImageIndex(index + 1)}
              >
                <Image
                  src={image.img.url}
                  alt={`${hotel.property_name} - ${index + 1}`}
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
        <div className="flex items-center mb-2">
          {[...Array(getStarRating(hotel.rating_stars.value))].map((_, i) => (
            <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
          ))}
          <span className="ml-2 text-sm text-gray-600">{hotel.rating_stars.label}</span>
        </div>
        
  <h1 className="text-3xl font-bold text-gray-900 mb-2">{hotel.property_name}</h1>
        <div className="flex items-center gap-4 text-gray-600">
      <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
        <span className="text-gray-700">{hotel.location.province_city}, {hotel.location.soum}, {hotel.location.district}</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <h2 className="text-xl font-semibold mb-3">{t('about_property', 'About Property')}</h2>
        <p className="text-gray-600 leading-relaxed">
          {hotel.description || `Experience comfort and luxury at ${hotel.property_name}. Located in the heart of ${hotel.location.province_city}, this property offers modern amenities and exceptional service to make your stay memorable.`}
        </p>
      </div>

      {/* Popular Facilities */}
      <div>
        <h3 className="text-lg font-semibold mb-3">{t('popular_amenities', 'Popular Amenities')}</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {hotel.general_facilities.slice(0, 6).map((facility, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Wifi className="w-5 h-5 text-blue-600" />
              <span className="text-gray-700">{facility}</span>
            </div>
          ))}
        </div>
        {hotel.general_facilities.length > 6 && (
          <p className="mt-2 text-sm text-gray-600">
            And {hotel.general_facilities.length - 6} more amenities...
          </p>
        )}
      </div>
    </div>
  );
}