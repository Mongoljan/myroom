'use client';

import { MdNoMeals } from 'react-icons/md';
import { PiForkKnifeFill } from 'react-icons/pi';
import BookingSidebarGuestCapacity from '@/components/booking/BookingSidebarGuestCapacity';

interface RoomLine {
  room_name: string;
  room_count: number;
  include_breakfast?: boolean;
}

interface BookingSidebarRoomsSectionProps {
  rooms: RoomLine[];
  selectedRoomsLabel: string;
  basePriceLabel: string;
  totalPrice: number;
  adultCapacity: number;
  childCapacity: number;
  guestCapacityLabel: string;
}

export default function BookingSidebarRoomsSection({
  rooms,
  selectedRoomsLabel,
  basePriceLabel,
  totalPrice,
  adultCapacity,
  childCapacity,
  guestCapacityLabel,
}: BookingSidebarRoomsSectionProps) {
  return (
    <>
      <div className="mb-3">
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">{selectedRoomsLabel}</div>
        {rooms.map((room, index) => (
          <div key={index} className="flex items-center justify-between gap-2 py-1">
            <span className="flex items-center gap-1 min-w-0 flex-1 overflow-hidden">
              <span className="text-sm font-semibold text-gray-900 dark:text-white truncate ml-2">
                {room.room_name}
              </span>
              {room.include_breakfast ? (
                <PiForkKnifeFill
                  className="w-4 h-4 shrink-0 text-green-600 dark:text-green-400"
                  aria-label="With breakfast"
                />
              ) : (
                <MdNoMeals
                  className="w-4 h-4 shrink-0 text-red-500 dark:text-red-400"
                  aria-label="No breakfast"
                />
              )}
            </span>
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-400 whitespace-nowrap shrink-0 ">
              x {room.room_count}
            </span>
          </div>
        ))}
      </div>
              <div className="border-t border-gray-200 dark:border-gray-700  mb space-y-4 mb-3"></div>
      <BookingSidebarGuestCapacity
          adultCapacity={adultCapacity}
          childCapacity={childCapacity}
          guestCapacityLabel={guestCapacityLabel}
        />

        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400 py-1">{basePriceLabel}</span>
          <span className="text-gray-900 dark:text-white py-1">{totalPrice.toLocaleString()} ₮</span>
        </div>
    </>
  );
}
