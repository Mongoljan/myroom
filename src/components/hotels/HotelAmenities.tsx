'use client';

import { 
  Wifi, 
  Car, 
  Utensils, 
  Waves, 
  Dumbbell, 
  Sparkles, 
  Coffee, 
  Shield,
  Wind,
  Tv,
  Phone,
  Users
} from 'lucide-react';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';

interface HotelAmenitiesProps {
  amenities?: string[];
  facilities?: string[];
}

const amenityIcons: Record<string, React.ReactNode> = {
  'Free WiFi': <Wifi className="w-5 h-5" />,
  'Free Wi-Fi': <Wifi className="w-5 h-5" />,
  'Swimming Pool': <Waves className="w-5 h-5" />,
  'Fitness Center': <Dumbbell className="w-5 h-5" />,
  'Spa': <Sparkles className="w-5 h-5" />,
  'Restaurant': <Utensils className="w-5 h-5" />,
  'Room Service': <Coffee className="w-5 h-5" />,
  'Room service': <Coffee className="w-5 h-5" />,
  'Concierge': <Users className="w-5 h-5" />,
  'Parking': <Car className="w-5 h-5" />,
  'Air Conditioning': <Wind className="w-5 h-5" />,
  'Air conditioning': <Wind className="w-5 h-5" />,
  'TV': <Tv className="w-5 h-5" />,
  'Phone': <Phone className="w-5 h-5" />,
  'Security': <Shield className="w-5 h-5" />,
  'Pool': <Waves className="w-5 h-5" />,
  'Fitness': <Dumbbell className="w-5 h-5" />,
  'Bar': <Coffee className="w-5 h-5" />,
  'Breakfast': <Coffee className="w-5 h-5" />,
  'WiFi': <Wifi className="w-5 h-5" />,
  '24-hour front desk': <Shield className="w-5 h-5" />,
  'Non-smoking rooms': <Wind className="w-5 h-5" />,
  'Airport shuttle': <Car className="w-5 h-5" />,
  'Family rooms': <Users className="w-5 h-5" />,
  'Spa & welness center': <Sparkles className="w-5 h-5" />,
};

export default function HotelAmenities({ amenities, facilities }: HotelAmenitiesProps) {
  const { t } = useHydratedTranslation();
  
  // Use facilities if provided, otherwise use amenities, fallback to empty array
  const items = facilities || amenities || [];
  
  // If no amenities/facilities, don't render anything
  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">{t('hotel.noAmenities', 'Мэдээлэл байхгүй байна')}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
          <div className="text-slate-900 flex-shrink-0">
            {amenityIcons[item] || <Shield className="w-5 h-5" />}
          </div>
          <span className="text-sm font-medium text-gray-700">{item}</span>
        </div>
      ))}
    </div>
  );
}