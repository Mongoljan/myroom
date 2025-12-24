'use client';

import { MapPin, Building2, Layers } from 'lucide-react';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';

interface HotelLocationInfoProps {
  location?: string;
  provinceCity?: string;
  soumDistrict?: string;
  totalFloors?: number;
}

export default function HotelLocationInfo({ 
  location, 
  provinceCity, 
  soumDistrict, 
  totalFloors 
}: HotelLocationInfoProps) {
  const { t } = useHydratedTranslation();

  // Don't render if no data is available
  if (!location && !provinceCity && !soumDistrict && !totalFloors) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Location String from propertyBaseInfo */}
      {location && (
        <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
          <div className="flex-shrink-0 mt-1">
            <MapPin className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500 mb-1">
              {t('hotelDetails.location', 'Байршил')}
            </div>
            <div className="text-gray-900 font-medium">{location}</div>
          </div>
        </div>
      )}

      {/* Province/City from confirm-address */}
      {provinceCity && (
        <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
          <div className="flex-shrink-0 mt-1">
            <Building2 className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500 mb-1">
              {t('hotelDetails.provinceCity', 'Хот/Аймаг')}
            </div>
            <div className="text-gray-900 font-medium">{provinceCity}</div>
          </div>
        </div>
      )}

      {/* Soum/District from confirm-address */}
      {soumDistrict && (
        <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
          <div className="flex-shrink-0 mt-1">
            <MapPin className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500 mb-1">
              {t('hotelDetails.soumDistrict', 'Дүүрэг/Сум')}
            </div>
            <div className="text-gray-900 font-medium">{soumDistrict}</div>
          </div>
        </div>
      )}

      {/* Total Floors from confirm-address */}
      {totalFloors && (
        <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
          <div className="flex-shrink-0 mt-1">
            <Layers className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500 mb-1">
              {t('hotelDetails.totalFloors', 'Давхрын тоо')}
            </div>
            <div className="text-gray-900 font-medium">
              {totalFloors} {t('hotelDetails.floors', 'давхар')}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
