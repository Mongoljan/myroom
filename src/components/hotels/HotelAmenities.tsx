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
import { useTranslation } from 'react-i18next';

interface HotelAmenitiesProps {
  amenities: string[];
}

const amenityIcons: Record<string, React.ReactNode> = {
  'Free WiFi': <Wifi className="w-5 h-5" />,
  'Swimming Pool': <Waves className="w-5 h-5" />,
  'Fitness Center': <Dumbbell className="w-5 h-5" />,
  'Spa': <Sparkles className="w-5 h-5" />,
  'Restaurant': <Utensils className="w-5 h-5" />,
  'Room Service': <Coffee className="w-5 h-5" />,
  'Concierge': <Users className="w-5 h-5" />,
  'Parking': <Car className="w-5 h-5" />,
  'Air Conditioning': <Wind className="w-5 h-5" />,
  'TV': <Tv className="w-5 h-5" />,
  'Phone': <Phone className="w-5 h-5" />,
  'Security': <Shield className="w-5 h-5" />,
};

export default function HotelAmenities({ amenities }: HotelAmenitiesProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">{t('hotel.amenities')}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {amenities.map((amenity, index) => (
          <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <div className="text-primary">
              {amenityIcons[amenity] || <Shield className="w-5 h-5" />}
            </div>
            <span className="text-sm font-medium">{amenity}</span>
          </div>
        ))}
      </div>
    </div>
  );
}