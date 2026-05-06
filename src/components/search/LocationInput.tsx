'use client';

import { MapPin, X } from 'lucide-react';
import { RefObject } from 'react';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';

interface LocationInputProps {
  destination: string;
  locationInputRef: RefObject<HTMLInputElement | null>;
  onLocationChange: (value: string) => void;
  onLocationClear: () => void;
  onLocationFocus: () => void;
  compact?: boolean;
}

export default function LocationInput({
  destination,
  locationInputRef,
  onLocationChange,
  onLocationClear,
  onLocationFocus,
  compact = false
}: LocationInputProps) {
  const { t } = useHydratedTranslation();

  return (
    <div className={`flex-1 ${compact ? 'p-1.5' : 'p-2.5'} w-full relative`}>
      <div className="flex items-center">
        <MapPin className={`${compact ? 'w-4 h-4' : 'w-4.5 h-4.5'} text-gray-700 dark:text-gray-300 ${compact ? 'mr-2' : 'mr-2.5'} shrink-0`} />
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">
            {t('search.locationLabel', 'Газар')}
          </div>
          <input
            ref={locationInputRef}
            type="text"
            value={destination}
            onChange={(e) => onLocationChange(e.target.value)}
            onFocus={onLocationFocus}
            placeholder={t('search.destinationPlaceholder', 'Хот, дүүрэг оруулна уу')}
            className="w-full text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 border-none outline-none font-medium bg-transparent"
          />
        </div>
        {destination && (
          <button
            type="button"
            onClick={onLocationClear}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}