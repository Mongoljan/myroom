'use client';

import GuestCountInline from '@/components/common/GuestCountInline';

interface BookingSidebarGuestCapacityProps {
  adultCapacity: number;
  childCapacity: number;
  guestCapacityLabel: string;
}

export default function BookingSidebarGuestCapacity({
  adultCapacity,
  childCapacity,
  guestCapacityLabel,
}: BookingSidebarGuestCapacityProps) {
  return (
    <div className="flex items-center justify-between gap-3 pt-2 mt-1">
      <span className="text-sm text-gray-700 dark:text-gray-300 shrink-0">
        {guestCapacityLabel}
      </span>
      <GuestCountInline
        adults={adultCapacity}
        childCount={childCapacity}
        className="text-sm text-gray-900 dark:text-gray-300 flex-nowrap shrink-0"
        iconClassName="w-4 h-4 text-gray-900 dark:text-gray-400"
      />
    </div>
  );
}
