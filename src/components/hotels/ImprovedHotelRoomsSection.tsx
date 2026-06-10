'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Bed, Calendar } from 'lucide-react';
import { hotelRoomsService, EnrichedHotelRoom } from '@/services/hotelRoomsApi';
import { ApiService } from '@/services/api';
import { CancellationFee } from '@/types/api';
import { RoomPriceOptions, BookingItem } from './RoomCard';
import TripComStyleRoomCard from './TripComStyleRoomCard';
import BookingSummary from './BookingSummary';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import DateRangePicker from '@/components/common/DateRangePicker';
import CustomGuestSelector from '@/components/search/CustomGuestSelector';
import { HotelRoomsSectionSkeleton } from '@/components/skeletons';
import { getLocaleCode, getLocalizedFullRoomName } from '@/utils/roomNames';

interface ImprovedHotelRoomsSectionProps {
  hotelId: number;
  hotelName?: string;
  locationName?: string;
  checkIn?: string;
  checkOut?: string;
  initialPolicies?: import('@/types/api').PropertyPolicy[];
}

export default function ImprovedHotelRoomsSection({
  hotelId,
  hotelName = 'Hotel',
  locationName,
  checkIn,
  checkOut,
  initialPolicies,
}: ImprovedHotelRoomsSectionProps) {
  const { t, i18n } = useHydratedTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Provide fallback dates if not provided
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Date state (editable)
  const [selectedCheckIn, setSelectedCheckIn] = useState(checkIn || today.toISOString().split('T')[0]);
  const [selectedCheckOut, setSelectedCheckOut] = useState(checkOut || tomorrow.toISOString().split('T')[0]);

  // Committed dates — only updated when user clicks Хайх. useEffect watches these, not the picker state.
  const [committedCheckIn, setCommittedCheckIn] = useState(checkIn || today.toISOString().split('T')[0]);
  const [committedCheckOut, setCommittedCheckOut] = useState(checkOut || tomorrow.toISOString().split('T')[0]);

  const effectiveCheckIn = committedCheckIn;
  const effectiveCheckOut = committedCheckOut;

  // Guest state — no router.push on every keystroke (fixes lag bug)
  const [adultsCount, setAdultsCount] = useState(Math.max(1, parseInt(searchParams.get('adults') || '2', 10)));
  const [childrenCountLocal, setChildrenCountLocal] = useState(Math.max(0, parseInt(searchParams.get('children') || '0', 10)));
  const [roomsCountLocal, setRoomsCountLocal] = useState(Math.max(1, parseInt(searchParams.get('rooms') || '1', 10)));
  const [childrenAges, setChildrenAges] = useState<number[]>([]);
  const [showChildAgeError, setShowChildAgeError] = useState(false);

  // Max child age from hotel policy — initialize immediately from pre-fetched initialPolicies,
  // updated again after async room load in case initialPolicies didn't include child_policy
  const [maxChildAge, setMaxChildAge] = useState<number | undefined>(() =>
    initialPolicies
      ?.map(p => p.child_policy?.max_child_age)
      .find((age): age is number => age != null)
  );

  // Ref for anchoring the date picker modal to the date section container
  const dateContainerRef = useRef<HTMLDivElement>(null);

  // State
  const [rooms, setRooms] = useState<EnrichedHotelRoom[]>([]);
  const [roomPrices, setRoomPrices] = useState<Record<string, RoomPriceOptions>>({});
  const [bookingItems, setBookingItems] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellationFee, setCancellationFee] = useState<CancellationFee | null>(null);

  // Inject default params into URL on first mount when missing (e.g. clicking from suggestions/recently viewed)
  useEffect(() => {
    const hasCheckIn = searchParams.get('check_in');
    const hasCheckOut = searchParams.get('check_out');
    const hasName = searchParams.get('name');
    const hasStructuredLocation =
      searchParams.get('province_id') ||
      searchParams.get('soum_id') ||
      searchParams.get('name_id') ||
      searchParams.get('district') ||
      searchParams.get('location');
    const needsLocationName = !hasName && !hasStructuredLocation && locationName;
    const needsUpdate = !hasCheckIn || !hasCheckOut || needsLocationName;
    if (needsUpdate) {
      const params = new URLSearchParams(searchParams.toString());
      if (!hasCheckIn) params.set('check_in', selectedCheckIn);
      if (!hasCheckOut) params.set('check_out', selectedCheckOut);
      if (!searchParams.get('adults')) params.set('adults', adultsCount.toString());
      if (!searchParams.get('children')) params.set('children', childrenCountLocal.toString());
      if (!searchParams.get('rooms')) params.set('rooms', roomsCountLocal.toString());
      if (needsLocationName) params.set('name', locationName);
      router.replace(`?${params.toString()}`, { scroll: false });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync from URL when the top SearchHeader bar changes dates/guests
  useEffect(() => {
    const urlCheckIn = searchParams.get('check_in');
    const urlCheckOut = searchParams.get('check_out');
    const urlAdults = searchParams.get('adults');
    const urlChildren = searchParams.get('children');
    const urlRooms = searchParams.get('rooms');
    if (urlCheckIn) { setSelectedCheckIn(urlCheckIn); setCommittedCheckIn(urlCheckIn); }
    if (urlCheckOut) { setSelectedCheckOut(urlCheckOut); setCommittedCheckOut(urlCheckOut); }
    if (urlAdults) setAdultsCount(Math.max(1, parseInt(urlAdults, 10)));
    if (urlChildren) setChildrenCountLocal(Math.max(0, parseInt(urlChildren, 10)));
    if (urlRooms) setRoomsCountLocal(Math.max(1, parseInt(urlRooms, 10)));
  }, [searchParams]);

  // Update URL when dates change
  const updateURLWithDates = (newCheckIn: string, newCheckOut: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('check_in', newCheckIn);
    params.set('check_out', newCheckOut);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  // Handle date changes — only update local state, URL is pushed on Search click
  const handleCheckInChange = (date: string) => {
    setSelectedCheckIn(date);
    // If check-out is before or equal to new check-in, push it forward
    if (new Date(date) >= new Date(selectedCheckOut)) {
      const newCheckOut = new Date(date);
      newCheckOut.setDate(newCheckOut.getDate() + 1);
      setSelectedCheckOut(newCheckOut.toISOString().split('T')[0]);
    }
  };

  const handleCheckOutChange = (date: string) => {
    setSelectedCheckOut(date);
  };

  // Unified search — only pushes to URL and triggers room fetch when user explicitly clicks Search
  const handleSearch = () => {
    // Block search when any child age is not yet selected
    if (childrenCountLocal > 0 && childrenAges.some((a) => a === -1)) {
      setShowChildAgeError(true);
      return;
    }
    setShowChildAgeError(false);
    const params = new URLSearchParams(searchParams.toString());
    params.set('check_in', selectedCheckIn);
    params.set('check_out', selectedCheckOut);
    params.set('adults', adultsCount.toString());
    params.set('children', childrenCountLocal.toString());
    params.set('rooms', roomsCountLocal.toString());
    router.push(`?${params.toString()}`, { scroll: false });
    setCommittedCheckIn(selectedCheckIn);
    setCommittedCheckOut(selectedCheckOut);
    setBookingItems([]);
  };

  // Load rooms and prices
  useEffect(() => {
    const loadRoomsAndPrices = async () => {
      try {
        setLoading(true);

      // Load enriched room data; always fetch fresh policies to guarantee child_policy is present
        const [roomsData, policies] = await Promise.all([
          hotelRoomsService.getEnrichedHotelRooms(hotelId, effectiveCheckIn, effectiveCheckOut),
          ApiService.getPropertyPolicies(hotelId).catch(() => initialPolicies ?? []),
        ]);
        setRooms(roomsData);
        if (policies.length > 0 && policies[0].cancellation_fee) {
          setCancellationFee(policies[0].cancellation_fee);
        }
        const childAgeLimit = policies
          .map(p => p.child_policy?.max_child_age)
          .find(age => age != null);
        if (childAgeLimit != null) setMaxChildAge(childAgeLimit);

        // Build price data from room's pricing field (new API structure)
        const pricesData: Record<string, RoomPriceOptions> = {};

        roomsData.forEach(room => {
          const key = `${room.room_type}-${room.room_category}`;
          
          // New API returns `pricing`; legacy fallback to `price_breakdown`
          const selling = room.pricing?.per_night?.without_breakfast?.selling_price
            ?? room.price_breakdown?.final_customer_price
            ?? 0;
          const original = room.pricing?.per_night?.without_breakfast?.original_price
            ?? room.price_breakdown?.base_price
            ?? selling;
          const discountPercent = room.pricing?.per_night?.without_breakfast?.discount_percent ?? 0;
          const withBreakfastPrice = room.pricing?.per_night?.with_breakfast?.selling_price ?? 0;
          const breakfastAddOn = room.pricing?.breakfast_price ?? 0;

          if (selling > 0) {
            pricesData[key] = {
              basePrice: selling,
              basePriceRaw: original,
              halfDayPrice: room.half_day_price && room.half_day_price > 0 ? room.half_day_price : undefined,
              singlePersonPrice: room.single_person_price && room.single_person_price > 0 ? room.single_person_price : undefined,
              breakfastPrice: withBreakfastPrice > 0 ? withBreakfastPrice : (breakfastAddOn > 0 ? selling + breakfastAddOn : undefined),
          breakfastPriceRaw: room.pricing?.per_night?.with_breakfast?.original_price ?? undefined,
              discount: discountPercent > 0 ? {
                type: 'PERCENT' as const,
                value: Math.round(discountPercent)
              } : undefined,
              priceBreakdown: room.price_breakdown
            };
          }
        });

        setRoomPrices(pricesData);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    loadRoomsAndPrices();
  }, [hotelId, effectiveCheckIn, effectiveCheckOut]);

  // Booking management
  const updateRoomQuantity = (room: EnrichedHotelRoom, priceType: 'base' | 'halfDay' | 'singlePerson' | 'withBreakfast', quantity: number) => {
    if (quantity === 0) {
      // Remove item
      setBookingItems(prev =>
        prev.filter(item => !(item.room.id === room.id && item.priceType === priceType))
      );
    } else {
      // Add or update item
      const priceKey = `${room.room_type}-${room.room_category}`;
      const priceOptions = roomPrices[priceKey];
      if (!priceOptions) return;

      // Shared pool: rooms_possible (or fallback) minus what the other price type already holds
      const maxQty = room.rooms_possible > 0 ? room.rooms_possible : room.number_of_rooms_to_sell;

      let price = priceOptions.basePrice;
      if (priceType === 'halfDay' && priceOptions.halfDayPrice) {
        price = priceOptions.halfDayPrice;
      } else if (priceType === 'singlePerson' && priceOptions.singlePersonPrice) {
        price = priceOptions.singlePersonPrice;
      } else if (priceType === 'withBreakfast' && priceOptions.breakfastPrice) {
        price = priceOptions.breakfastPrice;
      }

      setBookingItems(prev => {
        // Calculate how many rooms the OTHER price types for this room are using
        const otherQty = prev
          .filter(item => item.room.id === room.id && item.priceType !== priceType)
          .reduce((sum, item) => sum + item.quantity, 0);
        const cappedQty = Math.min(quantity, maxQty - otherQty);
        if (cappedQty <= 0) return prev.filter(item => !(item.room.id === room.id && item.priceType === priceType));

        const newItem: BookingItem = {
          room,
          priceType,
          quantity: cappedQty,
          price,
          maxQuantity: maxQty,
        };

        const existingIndex = prev.findIndex(item =>
          item.room.id === room.id && item.priceType === priceType
        );

        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = newItem;
          return updated;
        } else {
          return [...prev, newItem];
        }
      });
    }
  };

  const handleQuantityChange = (roomId: number, priceType: 'base' | 'halfDay' | 'singlePerson' | 'withBreakfast', quantity: number) => {
    const room = rooms.find(r => r.id === roomId);
    if (room) {
      updateRoomQuantity(room, priceType, quantity);
    }
  };

  const handleRemoveRoom = (roomId: number, priceType: 'base' | 'halfDay' | 'singlePerson' | 'withBreakfast') => {
    const room = rooms.find(r => r.id === roomId);
    if (room) {
      updateRoomQuantity(room, priceType, 0);
    }
  };


  // Calculate totals
  const getTotalRooms = () => bookingItems.reduce((sum, item) => sum + item.quantity, 0);
  const getTotalPrice = () => bookingItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Get number of nights for display
  const getNumberOfNights = () => {
    const checkInDate = new Date(effectiveCheckIn);
    const checkOutDate = new Date(effectiveCheckOut);
    const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1;
  };

  // Calculate number of nights
  const calculateNights = () => {
    const checkInDate = new Date(effectiveCheckIn);
    const checkOutDate = new Date(effectiveCheckOut);
    const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1; // At least 1 night
  };

  // Handle booking
  const handleBookNow = () => {
    if (bookingItems.length === 0) return;

    const nights = calculateNights();

    // Prepare rooms data for booking page
    const locale = getLocaleCode(i18n.language);
    const roomsData = bookingItems.map(item => ({
      room_category_id: item.room.room_category,
      room_type_id: item.room.room_type,
      room_count: item.quantity,
      room_name: getLocalizedFullRoomName(item.room, locale),
      price_per_night: item.price,
      total_price: item.price * item.quantity * nights,
      max_adults: item.room.adultQty ?? 1,
      max_children: item.room.childQty ?? 0,
      include_breakfast: item.priceType === 'withBreakfast',
    }));

    // Calculate total price including nights
    const totalPriceWithNights = getTotalPrice() * nights;

    // Create URL params
    const params = new URLSearchParams({
      hotelId: hotelId.toString(),
      hotelName: hotelName,
      checkIn: effectiveCheckIn,
      checkOut: effectiveCheckOut,
      rooms: JSON.stringify(roomsData),
      totalPrice: totalPriceWithNights.toString(),
      totalRooms: getTotalRooms().toString(),
      nights: nights.toString(),
      adults: adultsCount.toString(),
      children: childrenCountLocal.toString(),
      searchedRooms: roomsCountLocal.toString()
    });

    router.push(`/booking?${params.toString()}`);
  };

  if (loading) {
    return <HotelRoomsSectionSkeleton />;
  }

  // Filter available rooms with pricing.
  // rooms_possible is always date-specific here (dates are always passed to getEnrichedHotelRooms).
  // rooms_possible === 0 means the room is fully booked for the selected dates — do NOT fall back to total inventory.
  const availableRooms = rooms.filter(room => {
    const hasInventory = room.rooms_possible > 0;
    
    // Use the new hasValidPricing flag from enriched room data
    // This checks if room.price_breakdown.final_customer_price > 0
    const hasValidPricing = room.hasValidPricing;

    // MUST have BOTH inventory AND valid pricing from price_breakdown
    return hasInventory && hasValidPricing;
  });

  if (availableRooms.length === 0) {
    return (
      <div>
        {/* Room Search Bar — always visible even when no rooms */}
        <div className="mb-6 bg-white dark:bg-gray-800 border border-primary rounded-xl shadow-sm overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center divide-y lg:divide-y-0 lg:divide-x divide-gray-200 dark:divide-gray-700">
            <div ref={dateContainerRef} className="lg:flex-1 p-2.5">
              <div className="flex items-center">
                <Calendar className="w-4.5 h-4.5 text-gray-700 dark:text-gray-300 mr-2.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">
                    {t('search.dateLabel', 'Орох - Гарах')}
                  </div>
                  <DateRangePicker
                    checkIn={selectedCheckIn}
                    checkOut={selectedCheckOut}
                    onDateChange={(ci, co) => {
                      setSelectedCheckIn(ci);
                      setSelectedCheckOut(co);
                      updateURLWithDates(ci, co);
                      setBookingItems([]);
                    }}
                    minimal={true}
                    anchorRef={dateContainerRef}
                  />
                </div>
              </div>
            </div>
            <div className="lg:flex-1 flex items-center divide-x divide-gray-200 dark:divide-gray-700">
              <CustomGuestSelector
                adults={adultsCount}
                childrenCount={childrenCountLocal}
                rooms={roomsCountLocal}
                onGuestChange={(a, c, r) => {
                  setAdultsCount(a);
                  setChildrenCountLocal(c);
                  setRoomsCountLocal(r);
                  if (c === 0) { setChildrenAges([]); setShowChildAgeError(false); }
                }}
                onChildrenAgesChange={(ages) => {
                  setChildrenAges(ages);
                  if (ages.every((a) => a !== -1)) setShowChildAgeError(false);
                }}
                maxChildAge={maxChildAge}
                compact={true}
                className="flex-1"
              />
              <div className="p-2.5 shrink-0 flex flex-col items-end gap-1">
                {showChildAgeError && (
                  <p className="text-xs text-red-500 font-medium text-right">
                    {t('search.childAgeRequired', 'Хүүхдийн насыг оруулна уу')}
                  </p>
                )}
                <button
                  type="button"
                  onClick={handleSearch}
                  className="px-5 py-2 bg-secondary hover:bg-secondary/90 text-white text-sm font-semibold rounded-lg transition-colors whitespace-nowrap"
                >
                  {t('search.title', 'Хайх')}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between min-h-100">
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="text-center">
              <Bed className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-2">{t('hotelRooms.noRoomsAvailable', 'No rooms available')}</p>
            </div>
          </div>
          <div className="w-80">
            <BookingSummary
              items={bookingItems}
              totalRooms={getTotalRooms()}
              totalPrice={getTotalPrice()}
              checkIn={effectiveCheckIn}
              checkOut={effectiveCheckOut}
              nights={getNumberOfNights()}
              onQuantityChange={handleQuantityChange}
              onRemoveRoom={handleRemoveRoom}
              onBookNow={handleBookNow}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Room Search Bar */}
      <div className="mb-6 bg-white dark:bg-gray-800 border border-primary rounded-xl shadow-sm overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center divide-y lg:divide-y-0 lg:divide-x divide-gray-200 dark:divide-gray-700">
          {/* Date Range — flex-1 for equal half */}
          <div ref={dateContainerRef} className="lg:flex-1 p-2.5">
            <div className="flex items-center">
              <Calendar className="w-4.5 h-4.5 text-gray-700 dark:text-gray-300 mr-2.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">
                  {t('search.dateLabel', 'Орох - Гарах')}
                </div>
                <DateRangePicker
                  checkIn={selectedCheckIn}
                  checkOut={selectedCheckOut}
                  onDateChange={(ci, co) => {
                    setSelectedCheckIn(ci);
                    setSelectedCheckOut(co);
                    updateURLWithDates(ci, co);
                    setBookingItems([]);
                  }}
                  minimal={true}
                  anchorRef={dateContainerRef}
                />
              </div>
            </div>
          </div>

          {/* Guests — flex-1 for equal half + search button */}
          <div className="lg:flex-1 flex items-center divide-x divide-gray-200 dark:divide-gray-700">
            <CustomGuestSelector
              adults={adultsCount}
              childrenCount={childrenCountLocal}
              rooms={roomsCountLocal}
              onGuestChange={(a, c, r) => {
                setAdultsCount(a);
                setChildrenCountLocal(c);
                setRoomsCountLocal(r);
                if (c === 0) { setChildrenAges([]); setShowChildAgeError(false); }
              }}
              onChildrenAgesChange={(ages) => {
                setChildrenAges(ages);
                if (ages.every((a) => a !== -1)) setShowChildAgeError(false);
              }}
              maxChildAge={maxChildAge}
              compact={true}
              className="flex-1"
            />
            <div className="p-2.5 shrink-0 flex flex-col items-end gap-1">
              {showChildAgeError && (
                <p className="text-xs text-red-500 font-medium text-right">
                  {t('search.childAgeRequired', 'Хүүхдийн насыг оруулна уу')}
                </p>
              )}
              <button
                type="button"
                onClick={handleSearch}
                className="px-5 py-2 bg-secondary hover:bg-secondary/90 text-white text-sm font-semibold rounded-lg transition-colors whitespace-nowrap"
              >
                {t('search.title', 'Хайх')}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Rooms List */}
        <div className="flex-1 min-w-0">
          <div className="space-y-4">
            {availableRooms.map((room) => (
              <TripComStyleRoomCard
                key={room.id}
                room={room}
                priceOptions={roomPrices[`${room.room_type}-${room.room_category}`]}
                bookingItems={bookingItems.filter(item => item.room.id === room.id)}
                onQuantityChange={(priceType, quantity) => updateRoomQuantity(room, priceType, quantity)}
                nights={getNumberOfNights()}
                cancellationFee={cancellationFee}
                checkIn={effectiveCheckIn}
                totalSelectedRooms={getTotalRooms()}
              />
            ))}
          </div>
        </div>

        {/* Booking Summary Sidebar */}
        <div className="w-full lg:w-80 lg:shrink-0">
          <BookingSummary
            items={bookingItems}
            totalRooms={getTotalRooms()}
            totalPrice={getTotalPrice()}
            checkIn={effectiveCheckIn}
            checkOut={effectiveCheckOut}
            nights={getNumberOfNights()}
            adults={adultsCount}
            childrenCount={childrenCountLocal}
            onQuantityChange={handleQuantityChange}
            onRemoveRoom={handleRemoveRoom}
            onBookNow={handleBookNow}
          />
        </div>
      </div>

    </div>
  );
}