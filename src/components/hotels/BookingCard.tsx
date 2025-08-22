'use client';

import { useState } from 'react';
import { Calendar, Users, CreditCard } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Hotel {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
}

interface BookingCardProps {
  hotel: Hotel;
}

export default function BookingCard({ hotel }: BookingCardProps) {
  const { t } = useTranslation();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);

  const handleBooking = () => {
    // Handle booking logic
    console.log('Booking hotel:', hotel.id);
  };

  const nights = checkIn && checkOut ? 
    Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)) : 1;
  
  const totalPrice = hotel.price * nights;
  const savings = hotel.originalPrice ? (hotel.originalPrice - hotel.price) * nights : 0;

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-lg">
      <div className="mb-6">
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl font-bold text-foreground">${hotel.price}</span>
          <span className="text-muted-foreground">/ {t('night')}</span>
        </div>
        {hotel.originalPrice && (
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground line-through">${hotel.originalPrice}</span>
            <span className="text-green-600 text-sm font-medium">
              {t('save')} ${hotel.originalPrice - hotel.price}
            </span>
          </div>
        )}
      </div>

      <div className="space-y-4 mb-6">
        {/* Check-in/Check-out */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium mb-1">{t('check_in')}</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-border rounded-md bg-background"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('check_out')}</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-border rounded-md bg-background"
              />
            </div>
          </div>
        </div>

        {/* Guests */}
        <div>
          <label className="block text-sm font-medium mb-1">{t('guests')}</label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <select
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full pl-10 pr-3 py-2 border border-border rounded-md bg-background"
            >
              {[1, 2, 3, 4, 5, 6].map(num => (
                <option key={num} value={num}>
                  {num} {num === 1 ? t('guest') : t('guests')}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Price Breakdown */}
      {checkIn && checkOut && (
        <div className="border-t border-border pt-4 mb-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span>${hotel.price} × {nights} {nights === 1 ? t('night') : t('nights')}</span>
            <span>${totalPrice}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>{t('taxes_fees')}</span>
            <span>$25</span>
          </div>
          {savings > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>{t('savings')}</span>
              <span>-${savings}</span>
            </div>
          )}
          <div className="flex justify-between font-semibold text-lg border-t pt-2">
            <span>{t('total')}</span>
            <span>${totalPrice + 25 - savings}</span>
          </div>
        </div>
      )}

      <button
        onClick={handleBooking}
        className="w-full bg-primary text-primary-foreground py-3 rounded-md font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
      >
        <CreditCard className="w-4 h-4" />
        {t('book_now')}
      </button>

      <p className="text-xs text-muted-foreground text-center mt-3">
        {t('free_cancellation')} • {t('no_prepayment')}
      </p>
    </div>
  );
}