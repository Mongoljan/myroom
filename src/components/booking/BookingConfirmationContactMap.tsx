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
        <h3 className="text-[16px] font-semibold text-[#1a202c] dark:text-white mb-3">
          {t('bookingExtra.contactHotelTitle')}
        </h3>
        <div className="space-y-2.5 text-sm">
          
          {hotelPhone && (
            <div className="flex items-start gap-2">
              <Phone className="w-3.5 h-3.5 text-[#718096] shrink-0 mt-0.5" />
              <p className="text-[#2d3748] dark:text-gray-200 leading-snug w-full">
                <span className="text-[#718096] dark:text-gray-400 font-medium inline-block w-16">
                  {t('bookingExtra.hotelPhoneLabel', 'Утас')}:
                </span>
                <a 
                  href={`tel:${hotelPhone.replace(/\s/g, '')}`} 
                  className="hover:underline font-medium text-gray-900 dark:text-white ml-1"
                >
                  {hotelPhone}
                </a>
              </p>
            </div>
          )}
          
          {hotelEmail && (
            <div className="flex items-start gap-2 min-w-0">
              <Mail className="w-3.5 h-3.5 text-[#718096] shrink-0 mt-0.5" />
              <p className="text-[#2d3748] dark:text-gray-200 leading-snug min-w-0 w-full">
                <span className="text-[#718096] dark:text-gray-400 font-medium inline-block w-16">
                  {t('bookingExtra.hotelEmailLabel', 'И-мэйл')}:
                </span>
                <a 
                  href={`mailto:${hotelEmail}`} 
                  className="hover:underline font-medium break-all text-gray-900 dark:text-white ml-1"
                >
                  {hotelEmail}
                </a>
              </p>
            </div>
          )}

          {addressLine && (
            <div className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#718096] shrink-0 mt-0.5" />
              <p className="text-[#2d3748] dark:text-gray-200 leading-snug w-full">
                <span className="text-[#718096] dark:text-gray-400 font-medium inline-block w-16">
                  {t('bookingExtra.hotelAddressLabel', 'Хаяг')}:
                </span>
                <span className="ml-1">{addressLine}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    )}

      {embedSrc && (
        <div className="px-4 sm:px-5 py-4 sm:py-5">
          <h3 className="text-sm font-semibold text-[#1a202c] dark:text-white mb-3">{t('hotel.viewOnMap')}</h3>
          <iframe
            src={embedSrc}
            className="w-full h-44 border-0 bg-[#eef0f3] rounded-lg"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={t('bookingExtra.hotelLocationMap')}
          />
        </div>
      )}
    </div>
  );
}
