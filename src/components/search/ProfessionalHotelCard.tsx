'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Wifi, Car, Utensils, Users, ChevronLeft, ChevronRight, Heart, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { SearchHotelResult } from '@/types/api';
import { Badge } from '@/components/ui/badge';

interface ProfessionalHotelCardProps {
  hotel: SearchHotelResult;
  viewMode: 'list' | 'grid';
}

export default function ProfessionalHotelCard({ hotel, viewMode }: ProfessionalHotelCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageError, setImageError] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('mn-MN', {
      style: 'currency',
      currency: 'MNT',
      minimumFractionDigits: 0,
    }).format(price).replace('MNT', '₮');
  };

  const nextImage = () => {
    if (hotel.images.gallery.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % hotel.images.gallery.length);
    }
  };

  const prevImage = () => {
    if (hotel.images.gallery.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? hotel.images.gallery.length - 1 : prev - 1
      );
    }
  };

  const getCurrentImageSrc = () => {
    if (hotel.images.gallery[currentImageIndex]?.url) {
      return hotel.images.gallery[currentImageIndex].url;
    }
    return typeof hotel.images.cover === 'string' 
      ? hotel.images.cover 
      : hotel.images.cover.url;
  };

  const getLocationText = () => {
    return [hotel.location.province_city, hotel.location.soum, hotel.location.district]
      .filter(Boolean)
      .join(', ');
  };

  const getRatingStars = () => {
    const rating = parseInt(hotel.rating_stars.value);
    return Array.from({ length: 5 }, (_, i) => i < rating);
  };

  // Prioritize and standardize facilities display
  const getPriorityFacilities = (facilities: string[]): (string | null)[] => {
    const priorityOrder = [
      'wifi', 'restaurant', 'parking', 'pool', 'spa', 'fitness', 'gym', 
      '24', 'front', 'service', 'bar', 'lounge', 'business', 'conference'
    ];
    
    const prioritized: string[] = [];
    const remaining: string[] = [];
    
    // First pass: collect facilities by priority
    priorityOrder.forEach(keyword => {
      const match = facilities.find(f => f.toLowerCase().includes(keyword));
      if (match && !prioritized.includes(match)) {
        prioritized.push(match);
      }
    });
    
    // Add remaining facilities
    facilities.forEach(facility => {
      if (!prioritized.includes(facility) && remaining.length < (5 - prioritized.length)) {
        remaining.push(facility);
      }
    });
    
    const result: (string | null)[] = [...prioritized, ...remaining].slice(0, 5);
    
    // Fill remaining slots with null for consistent layout
    while (result.length < 5) {
      result.push(null);
    }
    
    return result;
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.3 }}
        className="group bg-white border border-slate-200/60 rounded-2xl overflow-hidden hover:shadow-xl hover:border-slate-300/60 transition-all duration-300 w-full"
      >
        {/* OBVIOUS LIST VIEW INDICATOR */}
        <div className="bg-green-500 text-white px-4 py-1 text-xs font-bold">
          LIST VIEW MODE
        </div>
        <div className="flex flex-col md:flex-row">
          {/* Image Section */}
          <div className="relative md:w-80 h-64 md:h-56 overflow-hidden bg-slate-100">
            {!imageError ? (
              <Image
                src={getCurrentImageSrc()}
                alt={hotel.property_name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                unoptimized
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-slate-300 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <span className="text-slate-600 font-semibold text-2xl">
                      {hotel.property_name.charAt(0)}
                    </span>
                  </div>
                  <span className="text-slate-500 text-sm font-medium">{hotel.property_name}</span>
                </div>
              </div>
            )}

            {/* Image Navigation */}
            {hotel.images.gallery.length > 1 && !imageError && (
              <div className="absolute inset-0 flex items-center justify-between p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => { e.preventDefault(); prevImage(); }}
                  className="bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 text-slate-700" />
                </button>
                <button
                  onClick={(e) => { e.preventDefault(); nextImage(); }}
                  className="bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-colors"
                >
                  <ChevronRight className="w-4 h-4 text-slate-700" />
                </button>
              </div>
            )}

            {/* Wishlist Button */}
            <button
              onClick={(e) => { e.preventDefault(); setIsWishlisted(!isWishlisted); }}
              className="absolute top-3 right-3 bg-white/90 hover:bg-white rounded-full p-2.5 shadow-lg transition-all group/heart"
            >
              <Heart className={`w-4 h-4 transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-slate-600 group-hover/heart:text-red-500'}`} />
            </button>

            {/* Image Indicators */}
            {hotel.images.gallery.length > 1 && (
              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2">
                <div className="flex gap-1">
                  {hotel.images.gallery.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="flex-1 p-6">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <Link href={`/hotel/${hotel.hotel_id}`}>
                    <h3 className="text-xl font-semibold text-slate-900 hover:text-slate-700 transition-colors mb-1 line-clamp-1">
                      {hotel.property_name}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-3 mb-2">
                    {/* Stars */}
                    <div className="flex items-center gap-1">
                      {getRatingStars().map((filled, i) => (
                        <Star key={i} className={`w-4 h-4 ${filled ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'}`} />
                      ))}
                      <span className="text-sm text-slate-600 ml-1">{hotel.rating_stars.label}</span>
                    </div>
                  </div>
                  <div className="flex items-center text-slate-600 mb-3">
                    <MapPin className="w-4 h-4 mr-1.5 text-slate-400" />
                    <span className="text-sm">{getLocationText()}</span>
                  </div>
                </div>
                
                {/* Price */}
                <div className="text-right">
                  <div className="text-xs text-slate-500 mb-1">эхлэх үнэ</div>
                  <div className="text-2xl font-bold text-slate-900">
                    {hotel.cheapest_room ? formatPrice(hotel.cheapest_room.price_per_night) : 'N/A'}-с
                  </div>
                  <div className="text-sm text-slate-500">per night</div>
                </div>
              </div>

              {/* Room Info */}
              {hotel.cheapest_room && (
                <div className="bg-slate-50/80 rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">{hotel.cheapest_room.room_type_label}</span>
                    <Badge variant="secondary" className="bg-slate-200/80 text-slate-700">
                      {hotel.cheapest_room.room_category_label}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center text-slate-600">
                      <Users className="w-4 h-4 mr-1.5" />
                      <span>Sleeps {hotel.cheapest_room.capacity_per_room_total}</span>
                    </div>
                    <span className="text-sm text-slate-500">
                      {hotel.cheapest_room.available_in_this_type} available
                    </span>
                  </div>
                </div>
              )}

              {/* Facilities */}
              <div className="flex flex-wrap gap-2 mb-4">
                {hotel.general_facilities.slice(0, 4).map((facility, index) => {
                  const getIcon = (facility: string) => {
                    if (facility.toLowerCase().includes('wifi')) return <Wifi className="w-3 h-3" />;
                    if (facility.toLowerCase().includes('parking')) return <Car className="w-3 h-3" />;
                    if (facility.toLowerCase().includes('restaurant')) return <Utensils className="w-3 h-3" />;
                    return null;
                  };

                  return (
                    <Badge key={index} variant="outline" className="border-slate-200 text-slate-600">
                      <span className="flex items-center gap-1">
                        {getIcon(facility)}
                        {facility}
                      </span>
                    </Badge>
                  );
                })}
                {hotel.general_facilities.length > 4 && (
                  <Badge variant="outline" className="border-slate-200 text-slate-600">
                    +{hotel.general_facilities.length - 4} more
                  </Badge>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-4 text-sm text-slate-600">
                  <span>{hotel.nights} nights</span>
                  <span>{hotel.rooms_possible} rooms available</span>
                </div>
                <Link 
                  href={`/hotel/${hotel.hotel_id}`}
                  className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl transition-colors font-medium group"
                >
                  View Details
                  <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid view - Aceternity-style
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ 
        y: -8, 
        scale: 1.02,
        rotateX: 2,
        rotateY: 2
      }}
      transition={{ 
        duration: 0.4, 
        ease: [0.25, 0.25, 0, 1],
        type: "spring",
        stiffness: 300,
        damping: 30
      }}
      className="group relative bg-gradient-to-br from-white via-white to-slate-50/30 border border-slate-200/60 rounded-2xl overflow-hidden hover:shadow-2xl hover:border-slate-300/60 transition-all duration-500 backdrop-blur-sm"
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px"
      }}
    >
      {/* OBVIOUS GRID VIEW INDICATOR */}
      <div className="bg-blue-500 text-white px-4 py-1 text-xs font-bold">
        GRID VIEW MODE
      </div>
      {/* Aceternity-style background glow */}
      <motion.div
        className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"
        animate={{
          background: [
            "linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(168, 85, 247, 0.1), rgba(236, 72, 153, 0.1))",
            "linear-gradient(45deg, rgba(236, 72, 153, 0.1), rgba(59, 130, 246, 0.1), rgba(168, 85, 247, 0.1))",
            "linear-gradient(45deg, rgba(168, 85, 247, 0.1), rgba(236, 72, 153, 0.1), rgba(59, 130, 246, 0.1))",
          ],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      {/* Animated border gradient */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 1,
            ease: "easeInOut"
          }}
        />
      </div>
      {/* Image Section */}
      <div className="relative h-56 overflow-hidden bg-slate-100">
        {!imageError ? (
          <Image
            src={getCurrentImageSrc()}
            alt={hotel.property_name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            unoptimized
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-300 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <span className="text-slate-600 font-semibold text-2xl">
                  {hotel.property_name.charAt(0)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Image Navigation */}
        {hotel.images.gallery.length > 1 && !imageError && (
          <div className="absolute inset-0 flex items-center justify-between p-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => { e.preventDefault(); prevImage(); }}
              className="bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-slate-700" />
            </button>
            <button
              onClick={(e) => { e.preventDefault(); nextImage(); }}
              className="bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-slate-700" />
            </button>
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => { e.preventDefault(); setIsWishlisted(!isWishlisted); }}
          className="absolute top-3 right-3 bg-white/90 hover:bg-white rounded-full p-2.5 shadow-lg transition-all group/heart"
        >
          <Heart className={`w-4 h-4 transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-slate-600 group-hover/heart:text-red-500'}`} />
        </button>

        {/* Enhanced Price Badge with Aceternity-style effects */}
        <motion.div 
          className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md rounded-lg px-3 py-1.5 shadow-lg border border-white/50"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3, ease: "backOut" }}
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
          }}
        >
          <div className="text-center">
            <div className="text-xs text-slate-500">эхлэх үнэ</div>
            <motion.div 
              className="text-lg font-bold text-slate-900"
              animate={{ 
                textShadow: ["0 0 0px rgba(59, 130, 246, 0)", "0 0 8px rgba(59, 130, 246, 0.3)", "0 0 0px rgba(59, 130, 246, 0)"]
              }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              {hotel.cheapest_room ? formatPrice(hotel.cheapest_room.price_per_night) : 'N/A'}-с
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Content Section - Grid View Compact */}
      <div className="p-4">
        <Link href={`/hotel/${hotel.hotel_id}`}>
          <h3 className="text-base font-semibold text-slate-900 hover:text-slate-700 transition-colors mb-2 line-clamp-1">
            {hotel.property_name}
          </h3>
        </Link>

        {/* Stars & Location Combined */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1">
            {getRatingStars().map((filled, i) => (
              <Star key={i} className={`w-3 h-3 ${filled ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'}`} />
            ))}
            <span className="text-xs text-slate-500 ml-1">{hotel.rating_stars.value.split(' ')[0]}</span>
          </div>
          <div className="flex items-center text-slate-500">
            <MapPin className="w-3 h-3 mr-1" />
            <span className="text-xs truncate max-w-20">{hotel.location.province_city}</span>
          </div>
        </div>

        {/* Facilities - Standardized Display (always show 5 slots) */}
        <div className="flex items-center gap-2 mb-3">
          {getPriorityFacilities(hotel.general_facilities).map((facility, index) => {
            if (!facility) {
              // Empty slot for consistent layout
              return (
                <div key={index} className="flex items-center justify-center w-7 h-7 bg-slate-50/50 rounded-lg border border-slate-100">
                  <div className="w-2 h-2 rounded-full bg-slate-200" />
                </div>
              );
            }

            const getIcon = (facility: string) => {
              const facilityLower = facility.toLowerCase();
              if (facilityLower.includes('wifi')) return <Wifi className="w-3.5 h-3.5 text-blue-500" />;
              if (facilityLower.includes('parking')) return <Car className="w-3.5 h-3.5 text-green-500" />;
              if (facilityLower.includes('restaurant') || facilityLower.includes('dining')) return <Utensils className="w-3.5 h-3.5 text-orange-500" />;
              if (facilityLower.includes('pool')) return <div className="w-3.5 h-3.5 rounded bg-cyan-500" />;
              if (facilityLower.includes('spa') || facilityLower.includes('wellness')) return <Heart className="w-3.5 h-3.5 text-pink-500" />;
              if (facilityLower.includes('gym') || facilityLower.includes('fitness')) return <div className="w-3.5 h-3.5 bg-red-500 rounded" />;
              if (facilityLower.includes('24') || facilityLower.includes('front')) return <div className="w-3.5 h-3.5 bg-purple-500 rounded-full" />;
              return <div className="w-2.5 h-2.5 rounded-full bg-slate-400" />;
            };

            return (
              <motion.div 
                key={index} 
                className="flex items-center justify-center w-7 h-7 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors group cursor-pointer" 
                title={facility}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3, ease: "backOut" }}
                whileHover={{ 
                  scale: 1.15, 
                  rotate: 5,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  whileHover={{ 
                    scale: 1.2,
                    filter: "brightness(1.2)"
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {getIcon(facility)}
                </motion.div>
              </motion.div>
            );
          })}
          {hotel.general_facilities.length > 5 && (
            <div className="flex items-center justify-center w-7 h-7 bg-gradient-to-r from-slate-100 to-slate-200 rounded-lg text-xs text-slate-500 font-medium border">
              +{hotel.general_facilities.length - 5}
            </div>
          )}
        </div>

        {/* Room Info & Price Combined */}
        <div className="flex items-center justify-between mb-3">
          {hotel.cheapest_room && (
            <div className="flex items-center text-slate-600">
              <Users className="w-3 h-3 mr-1" />
              <span className="text-xs">{hotel.cheapest_room.capacity_per_room_total}p</span>
              <span className="text-xs text-slate-400 mx-1">•</span>
              <span className="text-xs truncate max-w-16">{hotel.cheapest_room.room_category_label}</span>
            </div>
          )}
          <div className="text-right">
            <div className="text-xs text-slate-500 mb-1">эхлэх үнэ</div>
            <div className="text-lg font-bold text-slate-900">
              {hotel.cheapest_room ? formatPrice(hotel.cheapest_room.price_per_night) : 'N/A'}-с
            </div>
            <div className="text-xs text-slate-500">per night</div>
          </div>
        </div>

        {/* Enhanced Footer with Aceternity-style button */}
        <Link 
          href={`/hotel/${hotel.hotel_id}`}
        >
          <motion.div
            className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white px-3 py-2 rounded-lg font-medium text-sm group relative overflow-hidden"
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 8px 25px -8px rgba(15, 23, 42, 0.5)"
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            {/* Button shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            />
            
            <motion.span
              initial={{ opacity: 0.8 }}
              whileHover={{ opacity: 1 }}
            >
              View Details
            </motion.span>
            
            <motion.div
              whileHover={{ x: 2 }}
              transition={{ duration: 0.2 }}
            >
              <ExternalLink className="w-3 h-3" />
            </motion.div>
          </motion.div>
        </Link>
      </div>
      
      {/* Floating particles effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
            style={{
              left: `${20 + i * 30}%`,
              top: `${30 + i * 20}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.7, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.7,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}