'use client';

import { MapPin, Phone, Mail } from 'lucide-react';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';

interface BookingConfirmationContactMapProps {
  addressLine?: string;
  hotelPhone?: string;
  hotelEmail?: string;
  googleMapUrl?: string;
}

export default function BookingConfirmationContactMap({
  addressLine,
  hotelPhone,
  hotelEmail,
  googleMapUrl,
}: BookingConfirmationContactMapProps) {
  const { t } = useHydratedTranslation();
  const coordMatch = googleMapUrl?.match(/q=([-\d.]+),([-\d.]+)/);
  const embedSrc = coordMatch
    ? `https://maps.google.com/maps?q=${coordMatch[1]},${coordMatch[2]}&output=embed&zoom=15`
    : null;

  const hasContact = Boolean(addressLine || hotelPhone || hotelEmail);
  if (!hasContact && !embedSrc) return null;

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm print:hidden">
      {hasContact && (
        <div className="p-4 sm:p-5 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-[#1a202c] dark:text-white mb-3">{t('bookingExtra.contactHotelTitle')}</h3>
          <div className="space-y-2 text-sm">
            {addressLine && (
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#718096] shrink-0 mt-0.5" />
                <span className="text-[#4a5568] dark:text-gray-300">{addressLine}</span>
              </div>
            )}
            {hotelPhone && (
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#718096] shrink-0" />
                <a href={`tel:${hotelPhone}`} className="text-[#2d3748] dark:text-gray-200 hover:underline font-medium">
                  {hotelPhone}
                </a>
              </div>
            )}
            {hotelEmail && hotelEmail !== hotelPhone && (
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#718096] shrink-0" />
                <a
                  href={`mailto:${hotelEmail}`}
                  className="text-[#2d3748] dark:text-gray-200 hover:underline truncate font-medium"
                >
                  {hotelEmail}
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {embedSrc && (
        <div>
          <div className="px-4 sm:px-5 py-3 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-[#1a202c] dark:text-white">{t('hotel.viewOnMap')}</h3>
          </div>
          <iframe
            src={embedSrc}
            className="w-full h-44 border-0 bg-[#eef0f3]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={t('bookingExtra.hotelLocationMap')}
          />
        </div>
      )}
    </div>
  );
}
