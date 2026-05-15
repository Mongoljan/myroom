'use client';

import { Star, MapPin, User, X, CalendarX } from 'lucide-react';
import { BedTypeIcon } from '@/utils/bedTypeIcons';
import { FaChild } from 'react-icons/fa';
import { SearchHotelResult } from '@/types/api';
import { SEARCH_DESIGN_SYSTEM } from '@/styles/search-design-system';
import { memo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import GoogleMapModal from '@/components/common/GoogleMapModal';
import HotelImageGallery from './HotelImageGallery';
import { getFacilityName, getFacilityKey } from '@/utils/facilities';

interface HotelCardProps {
  hotel: SearchHotelResult;
  searchParams?: URLSearchParams;
  viewMode?: 'grid' | 'list';
}

function BookingStyleHotelCard({ hotel, searchParams, viewMode = 'list' }: HotelCardProps) {
  const { t } = useHydratedTranslation();
  const [showAllFacilities, setShowAllFacilities] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);

  
  // Get search parameters
  const rooms = parseInt(searchParams?.get('rooms') || '1');
  const checkIn = searchParams?.get('check_in') || '';
  const checkOut = searchParams?.get('check_out') || '';
  
  // Calculate nights
  const nights = checkIn && checkOut ? 
    Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))) : 1;
  
  const formatPrice = (price: number) => new Intl.NumberFormat('mn-MN').format(price);
  const getStarRating = (rating: string) => {
    const match = rating?.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  };

  // Helper to render person icons based on capacity - Trip.com style
  const stars = getStarRating(hotel.rating_stars.value);
  
  // Calculate pricing with discount support
  const getPricingInfo = () => {
    const cheapest = hotel.cheapest_room;
    if (!cheapest) return {
      hasDiscount: false,
      originalPrice: 0,
      discountedPrice: 0,
      discountPercent: 0,
      pricePerNight: 0,
      originalPricePerNight: 0
    };

    const pricesetting = cheapest.pricesetting;
    const hasDiscount = pricesetting && pricesetting.adjustment_type === 'SUB';

    // Use the raw and adjusted prices from API if available
    const rawPrice = cheapest.price_per_night_raw || cheapest.price_per_night || 0;
    const adjustedPrice = cheapest.price_per_night_final || cheapest.price_per_night || 0;

    let discountPercent = 0;

    // Calculate discount percentage regardless of whether pricesetting exists
    // This handles cases where API provides raw/adjusted prices but pricesetting might be missing
    if (rawPrice > 0 && adjustedPrice < rawPrice) {
      const actualDiscount = rawPrice - adjustedPrice;
      const calculatedPercent = (actualDiscount / rawPrice) * 100;
      // Use Math.ceil to ensure even small discounts show at least 1%
      discountPercent = calculatedPercent > 0 ? Math.max(1, Math.round(calculatedPercent)) : 0;
    }

    // If pricesetting exists and is PERCENT type, use the API value for accuracy
    if (hasDiscount && pricesetting && pricesetting.value_type === 'PERCENT' && pricesetting.value !== null) {
      discountPercent = Math.max(1, Math.round(pricesetting.value));
    }

    // Determine if there's an actual discount (either from pricesetting or price difference)
    const hasActualDiscount = hasDiscount || (rawPrice > adjustedPrice && discountPercent > 0);

    return {
      hasDiscount: hasActualDiscount,
      originalPrice: rawPrice * nights * rooms,
      discountedPrice: adjustedPrice * nights * rooms,
      discountPercent,
      pricePerNight: adjustedPrice || 0,
      originalPricePerNight: rawPrice || 0
    };
  };

  const pricingInfo = getPricingInfo();

  const buildHotelUrl = () => {
    let url = `/hotel/${hotel.hotel_id}`;
    if (searchParams) url += `?${searchParams.toString()}`;
    return url;
  };

  const buildNextAvailableUrl = (nextDate: { check_in: string; check_out: string }) => {
    const params = new URLSearchParams(searchParams?.toString() || '');
    params.set('check_in', nextDate.check_in);
    params.set('check_out', nextDate.check_out);
    return `/search?${params.toString()}`;
  };

  // Room info is sourced directly from the search API response (hotel.cheapest_room).
  // No per-card API calls needed — eliminates 5 round trips to VPS per card.


  if (viewMode === 'list') {
    return (
      <>
        <div
          className={`${SEARCH_DESIGN_SYSTEM.COLORS.BG_WHITE} ${SEARCH_DESIGN_SYSTEM.RADIUS.LARGE} border ${SEARCH_DESIGN_SYSTEM.COLORS.BORDER_DEFAULT}  ${SEARCH_DESIGN_SYSTEM.SHADOWS.HOVER} ${SEARCH_DESIGN_SYSTEM.TRANSITIONS.DEFAULT} overflow-hidden group cursor-pointer`}
          onClick={(e) => {
            e.preventDefault();
            window.open(buildHotelUrl(), '_blank');
          }}
        >
          <div className="flex flex-col md:flex-row">
            {/* Hotel Image with gallery modal */}
            <div className="relative w-64 self-stretch flex-shrink-0 overflow-hidden min-h-[220px]">
              <HotelImageGallery
                images={hotel.images}
                hotelName={hotel.property_name}
                hotelId={hotel.hotel_id}
                hotelUrl={buildHotelUrl()}
                viewMode="list"
                className="w-full h-full"
              />

              {/* Discount Badge - Top Left (Trip.com Style) */}
              {pricingInfo.hasDiscount && (
                <div className="absolute top-2.5 left-2.5 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                  {Math.round(pricingInfo.discountPercent)}% off
                </div>
              )}
            </div>

            {/* Hotel Details - Compact */}
            <div className="flex-1 pt-3 px-4 pb-4 min-w-0 flex flex-col">
              <div className="flex justify-between items-start mb-1">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-h3 font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-primary transition-colors">
                      {hotel.property_name}
                    </h3>
                    {stars > 0 && (
                      <div className="flex">
                        {[...Array(stars)].map((_, i) => (
                          <Star key={i} className="w-2.5 h-2.5 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1 text-[14px] text-gray-600 dark:text-gray-400 mb-1">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span className="truncate">
                      {[hotel.location.province_city, hotel.location.soum, hotel.location.district]
                        .filter(Boolean)
                        .join(', ')}
                    </span>
                      {hotel.google_map && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowMapModal(true);
                      }}
                      className="text-[14px] text-primary hover:underline whitespace-nowrap"
                    >
                      {t('hotel.viewOnMap', 'Газрын зураг дээр харах')}
                    </button>
                  )}
                  </div>
                </div>
              </div>

              {/* Room Info + Pricing — single bordered box with vertical divider */}
              {hotel.cheapest_room && (
                <div className="mt-auto pt-2">
                  <div className="rounded-lg bg-gray-100 dark:border-gray-700 flex overflow-hidden">

                    {/* Left: Room info — data sourced from search API, no extra fetch needed */}
                    <div className="flex-1 min-w-0 p-3">

                      {/* Room type · Room category */}
                      <div className="flex items-center gap-1.5 flex-wrap mb-1">
                        <h4 className="text-[14px] font-semibold text-gray-900 dark:text-white">
                          {hotel.cheapest_room.room_type_label}
                        </h4>
                        {hotel.cheapest_room.room_category_label && hotel.cheapest_room.room_category_label !== 'Room' && (
                          <span className="text-[14px] text-gray-600 dark:text-gray-400">{hotel.cheapest_room.room_category_label}</span>
                        )}
                      </div>

                      {/* Capacity counts + bed icons */}
                      <div className="flex items-center gap-2 mb-1.5">
                        {/* Adult count */}
                        {(hotel.cheapest_room.capacity_per_room_adults || 2) > 0 && (
                          <span className="flex items-center gap-0.5 text-[13px] text-gray-600 dark:text-gray-400">
                            <User className="w-3.5 h-3.5" strokeWidth={2} />
                            <span>×{hotel.cheapest_room.capacity_per_room_adults || 2}</span>
                          </span>
                        )}
                        {/* Child count */}
                        {(hotel.cheapest_room.capacity_per_room_children || 0) > 0 && (
                          <span className="flex items-center gap-0.5 text-[13px] text-gray-500 dark:text-gray-400">
                            <FaChild className="w-3 h-3" />
                            <span>×{hotel.cheapest_room.capacity_per_room_children}</span>
                          </span>
                        )}
                        {/* Bed icons from search API */}
                        {hotel.bed_types && hotel.bed_types.length > 0 && (
                          <>
                            <span className="text-gray-300 dark:text-gray-600">|</span>
                            {hotel.bed_types.map(bt => (
                              <BedTypeIcon key={bt.id} name={bt.name} className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            ))}
                          </>
                        )}
                      </div>

                      {/* Cancellation Policy */}
                      <p className="text-[13px] text-green-600 dark:text-green-500 mb-1">
                        {t('hotel.freeCancellationUntil', { date: '10/31' }, '10/31-нээс өмнө цуцлах боломжтой.')}
                      </p>

                      {/* Availability Warning — from search API rooms_possible */}
                      {hotel.rooms_possible > 0 && hotel.rooms_possible <= 5 && (
                        <p className="text-[13px] font-medium text-red-500 dark:text-red-400">
                          {t('hotel.onlyRoomsLeft', { count: hotel.rooms_possible }, `Сүүлийн ${hotel.rooms_possible} өрөө үлдлээ.`)}
                        </p>
                      )}

                      {/* Facility Tags */}
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {hotel.general_facilities.slice(0, 4).map((facility, index) => {
                          const name = getFacilityName(facility);
                          const isBreakfast = /цай|breakfast/i.test(name);
                          return (
                            <span
                              key={getFacilityKey(facility, index)}
                              className={`inline-flex items-center text-[13px] rounded px-2 py-0.5 border ${
                                isBreakfast
                                  ? 'text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800'
                                  : 'text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                              }`}
                            >
                              {name}
                            </span>
                          );
                        })}
                        {hotel.general_facilities.length > 4 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowAllFacilities(true);
                            }}
                            className="inline-flex items-center text-xs text-primary bg-slate-50 dark:bg-gray-700 hover:bg-slate-100 dark:hover:bg-gray-600 hover:underline rounded px-2 py-0.5 border border-gray-200 dark:border-gray-600 transition-all shrink-0"
                          >
                            +{hotel.general_facilities.length - 4}
                          </button>
                        )}
                      </div>

                      {/* Facilities Modal */}
                      {showAllFacilities && typeof window !== 'undefined' && createPortal(
                        <div
                          className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4"
                          onClick={(e) => { e.stopPropagation(); setShowAllFacilities(false); }}
                        >
                          <div
                            className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                              <h3 className="text-h3 font-semibold text-gray-900 dark:text-white">
                                {t('hotel.allFacilities', 'Бүх тохижилт')}
                              </h3>
                              <button
                                onClick={(e) => { e.stopPropagation(); setShowAllFacilities(false); }}
                                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>
                            <div className="p-4 overflow-y-auto max-h-[calc(80vh-80px)]">
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {hotel.general_facilities.map((facility, index) => (
                                  <div
                                    key={getFacilityKey(facility, index)}
                                    className="flex items-center text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 rounded px-3 py-2 border border-gray-200 dark:border-gray-600"
                                  >
                                    {getFacilityName(facility)}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>,
                        document.body
                      )}
                    </div>

                    {/* Vertical divider */}
                    <div className="w-px bg-gray-200 dark:bg-gray-700 self-stretch my-3" />

                    {/* Right: Pricing + CTA */}
                    <div className="p-3 flex flex-col items-end justify-between shrink-0 min-w-[140px]">
                      <div className="text-right">
                        {pricingInfo.hasDiscount ? (
                          <>
                            <div className="flex items-center justify-end gap-1.5 mb-0.5">
                              <span className="text-sm text-gray-400 dark:text-gray-500 line-through">
                                {formatPrice(pricingInfo.originalPricePerNight)} ₮
                              </span>
                              <span className="bg-red-500 text-xs text-white font-bold px-1 py-px rounded">
                                -{Math.round(pricingInfo.discountPercent)}%
                              </span>
                            </div>
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                              {formatPrice(pricingInfo.pricePerNight)} ₮
                            </div>
                          </>
                        ) : (
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            {formatPrice(pricingInfo.pricePerNight)} ₮
                          </div>
                        )}
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {rooms} {t('hotel.rooms', 'өрөө')} × {nights} {t('navigation.night', 'шөнө')}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {t('hotel.totalPrice', 'Нийт')}: {formatPrice(pricingInfo.discountedPrice)} ₮
                        </div>
                      </div>
                      <button className="mt-3 bg-primary hover:bg-primary/90 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 w-full">
                        {t('hotel.selectRoom', 'Өрөө сонгох')}
                      </button>
                    </div>

                  </div>
                </div>
              )}

              {/* Not available banner */}
              {hotel.is_available === false && !hotel.cheapest_room && (
                <div className="mt-auto pt-2">
                  <div className="rounded-lg border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/30 p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <CalendarX className="w-4 h-4 text-orange-500 shrink-0" />
                      <span className="text-[14px] font-medium text-orange-700 dark:text-orange-400">
                        {t('hotel.notAvailableForDates', 'Сонгосон огноонд боломжгүй байна')}
                      </span>
                    </div>
                    {hotel.next_available_date && (
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="text-[14px] text-gray-600 dark:text-gray-400">
                          {t('hotel.nextAvailable', 'Дараагийн боломжит огноо')}:{' '}
                          <span className="font-medium text-gray-800 dark:text-gray-200">
                            {hotel.next_available_date.check_in} → {hotel.next_available_date.check_out}
                          </span>
                          {hotel.next_available_date.days_away === 1 ? (
                            <span className="ml-1 text-[13px] text-gray-500 dark:text-gray-400">
                              ({t('hotel.tomorrow', 'маргааш')})
                            </span>
                          ) : hotel.next_available_date.days_away > 1 ? (
                            <span className="ml-1 text-[13px] text-gray-500 dark:text-gray-400">
                              ({hotel.next_available_date.days_away} {t('hotel.daysLater', 'өдрийн дараа')})
                            </span>
                          ) : null}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            window.location.href = buildNextAvailableUrl(hotel.next_available_date!);
                          }}
                          className="text-[14px] font-medium text-primary hover:underline whitespace-nowrap shrink-0"
                        >
                          {t('hotel.searchThisDate', 'Энэ огноонд хайх')}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Pricing Information - Compact */}
           
            </div>
          </div>
        </div>

        {/* Google Map Modal */}
        <GoogleMapModal
          isOpen={showMapModal}
          onClose={() => setShowMapModal(false)}
          googleMapUrl={hotel.google_map}
          hotelName={hotel.property_name}
          hotelAddress={[hotel.location.province_city, hotel.location.soum, hotel.location.district]
            .filter(Boolean)
            .join(', ')}
        />
      </>
    );
  }

  // Grid View - Compact
  return (
    <>
      <div
        className={`${SEARCH_DESIGN_SYSTEM.COLORS.BG_WHITE} ${SEARCH_DESIGN_SYSTEM.RADIUS.LARGE} ${SEARCH_DESIGN_SYSTEM.COLORS.BORDER_DEFAULT} border ${SEARCH_DESIGN_SYSTEM.SHADOWS.HOVER} ${SEARCH_DESIGN_SYSTEM.TRANSITIONS.DEFAULT} overflow-hidden group h-[420px] flex flex-col cursor-pointer`}
        onClick={(e) => {
          e.preventDefault();
          window.open(buildHotelUrl(), '_blank');
        }}
      >
        {/* Hotel Image with gallery modal */}
        <div className="relative w-full overflow-hidden flex-shrink-0" style={{ aspectRatio: '4/3' }}>
          <HotelImageGallery
            images={hotel.images}
            hotelName={hotel.property_name}
            viewMode="grid"
            className="w-full h-full"
          />
          
          {/* Discount Badge - Top Left (Trip.com Style) */}
          {pricingInfo.hasDiscount && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              {Math.round(pricingInfo.discountPercent)}% off
            </div>
          )}
        </div>

        {/* Hotel Info - Compact */}
        <div className="p-2.5 flex flex-col flex-1">
          <div className="mb-1">
            <h3 className={`${SEARCH_DESIGN_SYSTEM.TYPOGRAPHY.DESCRIPTION} font-semibold line-clamp-1 group-hover:${SEARCH_DESIGN_SYSTEM.COLORS.TEXT_BLUE} ${SEARCH_DESIGN_SYSTEM.TRANSITIONS.DEFAULT}`}>
              {hotel.property_name}
            </h3>
            {stars > 0 && (
              <div className="flex mt-0.5">
                {[...Array(stars)].map((_, i) => (
                  <Star key={i} className="w-2.5 h-2.5 text-yellow-400 fill-current" />
                ))}
              </div>
            )}
          </div>
          
          <div className="flex items-center text-[14px] text-gray-600 dark:text-gray-400 mb-1.5">
            <MapPin className="w-3 h-3 mr-1" />
            <span className="text-[14px] line-clamp-1">
              {[hotel.location.province_city, hotel.location.soum, hotel.location.district]
                .filter(Boolean)
                .join(', ')}
            </span>
          </div>

          {/* Key amenities */}
          {hotel.general_facilities && hotel.general_facilities.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {hotel.general_facilities.slice(0, 2).map((facility, index) => (
                <span key={getFacilityKey(facility, index)} className={`${SEARCH_DESIGN_SYSTEM.TYPOGRAPHY.DESCRIPTION_SMALL} ${SEARCH_DESIGN_SYSTEM.COLORS.BG_GRAY_LIGHT} ${SEARCH_DESIGN_SYSTEM.RADIUS.SMALL} px-1 py-0.5`}>
                  {getFacilityName(facility)}
                </span>
              ))}
            </div>
          )}

          {/* Price - always at bottom with discount support */}
          <div className="mt-auto">
            {hotel.is_available === false && !hotel.cheapest_room ? (
              <div className="border-t border-orange-100 dark:border-orange-900 pt-1.5">
                <div className="flex items-center gap-1.5 mb-1">
                  <CalendarX className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                  <span className="text-[13px] font-medium text-orange-700 dark:text-orange-400 line-clamp-1">
                    {t('hotel.notAvailableForDates', 'Сонгосон огноонд боломжгүй')}
                  </span>
                </div>
                {hotel.next_available_date && (
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[12px] text-gray-500 dark:text-gray-400">
                      {hotel.next_available_date.check_in}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = buildNextAvailableUrl(hotel.next_available_date!);
                      }}
                      className="text-[12px] font-medium text-primary hover:underline shrink-0"
                    >
                      {t('hotel.searchThisDate', 'Энэ огноонд хайх')}
                    </button>
                  </div>
                )}
              </div>
            ) : hotel.cheapest_room ? (
                <div className="border-t border-gray-100 dark:border-gray-700 pt-1.5">
                <div className="flex items-end justify-between">
                  <div>
                    {pricingInfo.hasDiscount ? (
                      <>
                        {/* Discount Badge */}
                        <div className="inline-block bg-red-500 text-white text-xs font-semibold px-1.5 py-0.5 rounded mb-1">
                          {Math.round(pricingInfo.discountPercent)}% off
                        </div>
                        {/* Original Price - Strikethrough */}
                        <div className="text-xs text-gray-400 dark:text-gray-500 line-through">
                          ₮{formatPrice(pricingInfo.originalPrice)}
                        </div>
                        {/* Discounted Price */}
                        <div className={`${SEARCH_DESIGN_SYSTEM.TYPOGRAPHY.PRICE_SMALL} text-gray-900 dark:text-white`}>
                          ₮{formatPrice(pricingInfo.discountedPrice)}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{t('hotel.cheapestRoom')}</div>
                        <div className={SEARCH_DESIGN_SYSTEM.TYPOGRAPHY.PRICE_SMALL}>₮{formatPrice(pricingInfo.discountedPrice)}</div>
                      </>
                    )}
                  </div>
                  <button className={`bg-primary hover:bg-primary/90 text-white px-2.5 py-1 ${SEARCH_DESIGN_SYSTEM.RADIUS.DEFAULT} ${SEARCH_DESIGN_SYSTEM.TYPOGRAPHY.BUTTON_TEXT_SMALL} ${SEARCH_DESIGN_SYSTEM.TRANSITIONS.DEFAULT}`}>
                    {t('hotel.viewDetails')}
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Google Map Modal */}
      <GoogleMapModal
        isOpen={showMapModal}
        onClose={() => setShowMapModal(false)}
        googleMapUrl={hotel.google_map}
        hotelName={hotel.property_name}
        hotelAddress={[hotel.location.province_city, hotel.location.soum, hotel.location.district]
          .filter(Boolean)
          .join(', ')}
      />
    </>
  );
}

export default memo(BookingStyleHotelCard);
