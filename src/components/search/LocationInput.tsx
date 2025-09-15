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
}

export default function LocationInput({
  destination,
  locationInputRef,
  onLocationChange,
  onLocationClear,
  onLocationFocus
}: LocationInputProps) {
  const { t } = useHydratedTranslation();

  return (
    <div className="flex-1 p-4 w-full relative">
      <div className="flex items-center">
        <MapPin className="w-6 h-6 text-gray-700 mr-4" />
        <div className="flex-1">
          <input
            ref={locationInputRef}
            type="text"
            value={destination}
            onChange={(e) => onLocationChange(e.target.value)}
            onFocus={onLocationFocus}
            placeholder={t('search.destinationPlaceholder', 'Хот, дүүрэг оруулна уу')}
            className="w-full text-gray-900 placeholder-gray-400 border-none outline-none font-medium"
          />
        </div>
        {destination && (
          <button
            type="button"
            onClick={onLocationClear}
            className="text-gray-400 hover:text-gray-600 ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}