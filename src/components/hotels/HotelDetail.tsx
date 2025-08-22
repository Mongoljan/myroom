'use client';

import { Star, MapPin, Wifi, Car, Utensils } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Hotel {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviewCount: number;
  description: string;
}

interface HotelDetailProps {
  hotel: Hotel;
}

export default function HotelDetail({ hotel }: HotelDetailProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">{hotel.name}</h1>
        <div className="flex items-center gap-4 text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{hotel.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{hotel.rating}</span>
            <span>({hotel.reviewCount} {t('reviews')})</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <h2 className="text-xl font-semibold mb-3">{t('about_property')}</h2>
        <p className="text-muted-foreground leading-relaxed">{hotel.description}</p>
      </div>

      {/* Quick Features */}
      <div>
        <h3 className="text-lg font-semibold mb-3">{t('popular_amenities')}</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Wifi className="w-4 h-4 text-primary" />
            <span>{t('free_wifi')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Car className="w-4 h-4 text-primary" />
            <span>{t('parking')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Utensils className="w-4 h-4 text-primary" />
            <span>{t('restaurant')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}