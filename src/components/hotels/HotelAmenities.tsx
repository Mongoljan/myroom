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
  Users,
  Bath,
  Droplet,
  Radio,
  Flame,
  UtensilsCrossed,
  Shirt,
  Building,
  Check
} from 'lucide-react';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';

interface HotelAmenitiesProps {
  amenities?: string[];
  facilities?: string[];
}

// Category mapping - categorize facilities by type
const categorizeAmenities = (items: string[]) => {
  const categories: Record<string, string[]> = {
    'Bathroom': [],
    'Media & Technology': [],
    'Safety & security': [],
    'Food & Drink': [],
    'Bedroom': [],
    'Reception services': [],
    'Cleaning services': [],
    'General': [],
    'Other': []
  };

  items.forEach(item => {
    const lowerItem = item.toLowerCase();

    // Bathroom
    if (lowerItem.includes('towel') || lowerItem.includes('bath') || lowerItem.includes('shower') ||
        lowerItem.includes('toilet') || lowerItem.includes('hairdryer') || lowerItem.includes('free toiletries')) {
      categories['Bathroom'].push(item);
    }
    // Media & Technology
    else if (lowerItem.includes('tv') || lowerItem.includes('television') || lowerItem.includes('satellite') ||
             lowerItem.includes('radio') || lowerItem.includes('telephone') || lowerItem.includes('phone')) {
      categories['Media & Technology'].push(item);
    }
    // Safety & security
    else if (lowerItem.includes('fire') || lowerItem.includes('security') || lowerItem.includes('cctv') ||
             lowerItem.includes('smoke') || lowerItem.includes('extinguisher')) {
      categories['Safety & security'].push(item);
    }
    // Food & Drink
    else if (lowerItem.includes('breakfast') || lowerItem.includes('restaurant') || lowerItem.includes('bar') ||
             lowerItem.includes('meal') || lowerItem.includes('coffee') || lowerItem.includes('tea')) {
      categories['Food & Drink'].push(item);
    }
    // Bedroom
    else if (lowerItem.includes('linen') || lowerItem.includes('wardrobe') || lowerItem.includes('closet')) {
      categories['Bedroom'].push(item);
    }
    // Reception services
    else if (lowerItem.includes('invoice') || lowerItem.includes('check-in') || lowerItem.includes('check-out') ||
             lowerItem.includes('luggage') || lowerItem.includes('front desk')) {
      categories['Reception services'].push(item);
    }
    // Cleaning services
    else if (lowerItem.includes('housekeeping') || lowerItem.includes('cleaning') || lowerItem.includes('laundry') ||
             lowerItem.includes('dry cleaning')) {
      categories['Cleaning services'].push(item);
    }
    // General
    else if (lowerItem.includes('non-smoking') || lowerItem.includes('hypoallergenic') || lowerItem.includes('wake') ||
             lowerItem.includes('heating') || lowerItem.includes('carpeted') || lowerItem.includes('lift') ||
             lowerItem.includes('elevator') || lowerItem.includes('fan') || lowerItem.includes('family') ||
             lowerItem.includes('disabled') || lowerItem.includes('ironing') || lowerItem.includes('room service')) {
      categories['General'].push(item);
    }
    else {
      categories['Other'].push(item);
    }
  });

  // Remove empty categories
  return Object.entries(categories).filter(([_, items]) => items.length > 0);
};

const categoryIcons: Record<string, React.ElementType> = {
  'Bathroom': Bath,
  'Media & Technology': Tv,
  'Safety & security': Shield,
  'Food & Drink': UtensilsCrossed,
  'Bedroom': Building,
  'Reception services': Users,
  'Cleaning services': Sparkles,
  'General': Check,
  'Other': Shield
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

  const categorizedAmenities = categorizeAmenities(items);

  return (
    <div className="bg-white">
      {/* Top highlighted amenities - inline with icons */}
      <div className="mb-10 pb-8 border-b border-gray-200">
        <h3 className="text-base font-semibold text-gray-900 mb-5">
          {t('amenities.popular', 'Онцлох нь:')}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-8 gap-y-4">
          {items.slice(0, 10).map((item, index) => (
            <div key={index} className="flex items-center gap-2.5 text-[15px] text-gray-700">
              <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Categorized facilities */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-10">
        {categorizedAmenities.map(([category, categoryItems]) => {
          const IconComponent = categoryIcons[category];
          return (
            <div key={category}>
              <div className="flex items-center gap-3 mb-5">
                <IconComponent className="w-5 h-5 text-gray-700 flex-shrink-0" />
                <h4 className="text-[16px] font-semibold text-gray-900">{category}</h4>
              </div>
              <ul className="space-y-3 pl-0">
                {categoryItems.map((item, index) => (
                  <li key={index} className="flex items-start gap-2.5 text-[15px] text-gray-700">
                    <Check className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}