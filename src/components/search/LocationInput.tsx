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
    <div className={`flex-1 ${compact ? 'p-1.5' : 'p-5'} w-full relative`}>
      <div className={`flex items-center ${compact ? '' : 'gap-4'}`}>
        <MapPin className={`${compact ? 'w-4 h-4 mr-2 text-gray-700' : 'w-6 h-6 text-slate-900'} dark:text-gray-300 shrink-0`} />
        <div className="flex-1 min-w-0">
          <div className={`text-xs font-medium text-gray-500 dark:text-gray-400 ${compact ? 'mb-0.5' : 'mb-1'}`}>
            {t('search.locationLabel', 'Газар')}
          </div>
          <input
            ref={locationInputRef}
            type="text"
            value={destination}
            onChange={(e) => onLocationChange(e.target.value)}
            onFocus={onLocationFocus}
            placeholder={t('search.destinationPlaceholder', 'Хот, дүүрэг оруулна уу')}
            className={`w-full ${compact ? 'text-sm' : 'text-base font-medium'} text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 border-none outline-none bg-transparent`}
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