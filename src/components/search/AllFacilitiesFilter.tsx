'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import CollapsibleFilterSection from './CollapsibleFilterSection';
import {
  Wifi, Car, Utensils, Users, Dumbbell, Waves, Building, Clock, Building2,
  Coffee, Bath, TreePine, Sun, Plane, ShoppingBag, Phone, Wind, Baby, PawPrint
} from 'lucide-react';

interface Facility {
  id: number;
  name_en: string;
  name_mn: string;
}

interface AllFacilitiesFilterProps {
  facilities: Facility[];
  selectedFacilities: number[];
  onFacilityToggle: (facilityId: number) => void;
  filterCounts?: Record<string, number>;
}

export default function AllFacilitiesFilter({
  facilities,
  selectedFacilities,
  onFacilityToggle,
  filterCounts = {}
}: AllFacilitiesFilterProps) {
  const [showAllCategories, setShowAllCategories] = useState(false);

  // Categorize facilities
  const categories = {
    'Popular': ['Free Wi-Fi', 'Parking', 'Restaurant', '24-hour front desk', 'Room service'],
    'Transportation': ['Airport shuttle', 'Airport Pick-up Service', 'Car rental', 'Taxi call'],
    'Dining': ['Restaurant', 'Bar', 'Cafe', 'Breakfast included', 'Room service'],
    'Wellness & Recreation': ['Swimming pool', 'Fitness center', 'Spa & welness center', 'Sauna', 'Hot tub / Jacuzzi'],
    'Business': ['Business center', 'Conference room', 'Currency exchange'],
    'Outdoor': ['Garden', 'Terrace', 'BBQ', 'Golf course', 'Water park'],
    'Accessibility': ['Elevator', 'Wheelchair accessible', 'Pet friendly', 'Family rooms'],
    'Services': ['Guest Laundry', 'Luggage storage', 'Wake-up call'],
    'Room Features': ['Air conditioning', 'Non-smoking rooms', 'Smoking area']
  };

  const getFacilityIcon = (facilityNameEn: string) => {
    const iconMap: Record<string, React.ReactElement> = {
      'Free Wi-Fi': <Wifi className="w-3.5 h-3.5" />,
      'Parking': <Car className="w-3.5 h-3.5" />,
      'Restaurant': <Utensils className="w-3.5 h-3.5" />,
      '24-hour front desk': <Clock className="w-3.5 h-3.5" />,
      'Room service': <Utensils className="w-3.5 h-3.5" />,
      'Airport shuttle': <Plane className="w-3.5 h-3.5" />,
      'Fitness center': <Dumbbell className="w-3.5 h-3.5" />,
      'Swimming pool': <Waves className="w-3.5 h-3.5" />,
      'Business center': <Building className="w-3.5 h-3.5" />,
      'Garden': <TreePine className="w-3.5 h-3.5" />,
      'Terrace': <Sun className="w-3.5 h-3.5" />,
      'Bar': <Coffee className="w-3.5 h-3.5" />,
      'Spa & welness center': <Bath className="w-3.5 h-3.5" />,
      'Elevator': <Building2 className="w-3.5 h-3.5" />,
      'Air conditioning': <Wind className="w-3.5 h-3.5" />,
      'Family rooms': <Baby className="w-3.5 h-3.5" />,
      'Pet friendly': <PawPrint className="w-3.5 h-3.5" />,
      'Luggage storage': <ShoppingBag className="w-3.5 h-3.5" />,
      'Wake-up call': <Phone className="w-3.5 h-3.5" />,
    };
    return iconMap[facilityNameEn] || <Users className="w-3.5 h-3.5" />;
  };

  // Display popular categories first, then others
  const displayCategories = showAllCategories
    ? Object.entries(categories)
    : Object.entries(categories).slice(0, 3);

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        All Facilities
        <span className="ml-2 text-sm font-normal text-gray-500">
          ({facilities.length} available)
        </span>
      </h3>

      {displayCategories.map(([categoryName, categoryFacilities]) => {
        const facilitiesInCategory = facilities.filter(f =>
          categoryFacilities.includes(f.name_en)
        );

        if (facilitiesInCategory.length === 0) return null;

        return (
          <CollapsibleFilterSection
            key={categoryName}
            title={categoryName}
            itemCount={facilitiesInCategory.length}
            initialShowCount={5}
            defaultExpanded={categoryName === 'Popular'}
          >
            {facilitiesInCategory.map((facility) => {
              const isSelected = selectedFacilities.includes(facility.id);
              const count = filterCounts[`facility_${facility.id}`];

              return (
                <label
                  key={facility.id}
                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-md transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onFacilityToggle(facility.id)}
                    className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500 cursor-pointer dark:bg-gray-700"
                  />
                  <div className="flex items-center gap-2 flex-1">
                    {getFacilityIcon(facility.name_en)}
                    <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">
                      {facility.name_mn}
                    </span>
                  </div>
                  {count !== undefined && count > 0 && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                      {count}
                    </span>
                  )}
                </label>
              );
            })}
          </CollapsibleFilterSection>
        );
      })}

      {/* Show All Categories button */}
      {Object.keys(categories).length > 3 && (
        <button
          onClick={() => setShowAllCategories(!showAllCategories)}
          className="w-full mt-3 py-2 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium flex items-center justify-center gap-1 border-t border-gray-100 dark:border-gray-700 pt-3"
        >
          {showAllCategories ? (
            <>Show fewer categories</>
          ) : (
            <>
              Show all {Object.keys(categories).length} categories
              <ChevronDown className="w-3 h-3" />
            </>
          )}
        </button>
      )}
    </div>
  );
}