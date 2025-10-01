'use client';

import { motion } from 'framer-motion';
import { Wifi, Car, Utensils, Users, Dumbbell, Waves, Bath, Coffee, Shield, Star, Clock, MapPin } from 'lucide-react';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';

interface HotelAmenitiesGridProps {
  amenities: string[];
  viewMode: 'list' | 'grid';
  className?: string;
}

// Icon mapping for amenities
const amenityIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'Wi-Fi': Wifi,
  'Wifi': Wifi,
  'WiFi': Wifi,
  'Зогсоол': Car,
  'Parking': Car,
  'Ресторан': Utensils,
  'Restaurant': Utensils,
  'Хоолны газар': Utensils,
  'Фитнесс': Dumbbell,
  'Fitness': Dumbbell,
  'Gym': Dumbbell,
  'Усан сан': Waves,
  'Pool': Waves,
  'Swimming Pool': Waves,
  'Spa': Bath,
  'Кофе': Coffee,
  'Coffee': Coffee,
  'Хамгаалалт': Shield,
  'Security': Shield,
  '24/7': Clock,
  'Reception': Users,
  'Concierge': Star,
};

export default function HotelAmenitiesGrid({
  amenities,
  viewMode,
  className = ""
}: HotelAmenitiesGridProps) {
  const { t } = useHydratedTranslation();
  const getAmenityIcon = (amenity: string) => {
    const IconComponent = amenityIcons[amenity] || MapPin;
    return IconComponent;
  };

  const displayAmenities = viewMode === 'list' ? amenities.slice(0, 6) : amenities.slice(0, 4);
  const remainingCount = amenities.length - displayAmenities.length;

  if (amenities.length === 0) {
    return null;
  }

  return (
    <div className={`${className}`}>
      {/* Title */}
      <div className="text-sm font-medium text-slate-700 mb-3">
        {t('hotel.amenities')}
      </div>

      {/* Amenities Grid */}
      <div className={`
        grid gap-2
        ${viewMode === 'list'
          ? 'grid-cols-2 sm:grid-cols-3'
          : 'grid-cols-2'
        }
      `}>
        {displayAmenities.map((amenity, index) => {
          const IconComponent = getAmenityIcon(amenity);

          return (
            <motion.div
              key={amenity}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <IconComponent className="w-3 h-3 text-blue-600 flex-shrink-0" />
              <span className="text-xs text-slate-700 truncate">
                {amenity}
              </span>
            </motion.div>
          );
        })}

        {/* Show more button if there are remaining amenities */}
        {remainingCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: displayAmenities.length * 0.1 }}
            className="flex items-center justify-center p-2 bg-blue-50 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors cursor-pointer"
          >
            <span className="text-xs text-blue-700 font-medium">
              {t('amenitiesLabels.moreCount', { count: remainingCount })}
            </span>
          </motion.div>
        )}
      </div>

      {/* Additional info for list view */}
      {viewMode === 'list' && amenities.length > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-100">
          <div className="text-xs text-slate-600">
            <div className="flex items-center gap-1 mb-1">
              <Star className="w-3 h-3 text-yellow-500" />
              <span>{t('amenitiesLabels.premiumService')}</span>
            </div>
            <div className="flex items-center gap-1">
              <Shield className="w-3 h-3 text-green-500" />
              <span>{t('amenitiesLabels.safeSecure')}</span>
            </div>
          </div>
        </div>
      )}

      {/* Popular amenities highlight for grid view */}
      {viewMode === 'grid' && (
        <div className="mt-2 text-xs text-slate-500">
          {amenities.includes('Wi-Fi') && amenities.includes('Зогсоол') ? (
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-500" />
              <span>{t('amenitiesLabels.popularChoice')}</span>
            </div>
          ) : (
            <div>{t('amenitiesLabels.variedAmenities')}</div>
          )}
        </div>
      )}
    </div>
  );
}