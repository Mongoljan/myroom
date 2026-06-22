import type { AllData } from '@/types/api';
import type { EnrichedHotelRoom } from '@/services/hotelRoomsApi';

export type LocalizedRoomNameSource = {
  roomCategoryNameEn?: string;
  roomCategoryNameMn?: string;
  roomCategoryName?: string;
  roomTypeNameEn?: string;
  roomTypeNameMn?: string;
  roomTypeName?: string;
};

export type RoomNameIds = {
  room_category_id: number;
  room_type_id: number;
};

export function getLocaleCode(language?: string): 'en' | 'mn' {
  return language?.startsWith('en') ? 'en' : 'mn';
}

export function getLocalizedRoomCategoryName(
  room: LocalizedRoomNameSource,
  locale: 'en' | 'mn'
): string {
  if (locale === 'en') {
    return room.roomCategoryNameEn || room.roomCategoryName || '';
  }
  return room.roomCategoryNameMn || room.roomCategoryName || '';
}

export function getLocalizedRoomTypeName(
  room: LocalizedRoomNameSource,
  locale: 'en' | 'mn'
): string {
  if (locale === 'en') {
    return room.roomTypeNameEn || room.roomTypeName || '';
  }
  return room.roomTypeNameMn || room.roomTypeName || '';
}

function joinRoomNameParts(
  categoryName: string,
  typeName: string,
  locale: 'en' | 'mn'
): string {
  const category = categoryName && categoryName !== 'Unknown' ? categoryName : '';
  const type = typeName && typeName !== 'Unknown' ? typeName : '';
  // MN: type first (e.g. "1 нарийн ортой Стандарт өрөө"), EN: category first
  const parts = locale === 'mn' ? [type, category] : [category, type];
  return parts.filter(Boolean).join(' ');
}

export function getLocalizedFullRoomName(
  room: LocalizedRoomNameSource,
  locale: 'en' | 'mn'
): string {
  return joinRoomNameParts(
    getLocalizedRoomCategoryName(room, locale),
    getLocalizedRoomTypeName(room, locale),
    locale
  );
}

export function resolveRoomNameFromEnrichedHotelRoom(
  hotelRoom: EnrichedHotelRoom,
  allRoomData: AllData | null,
  locale: 'en' | 'mn' = 'en'
): string {
  const direct = getLocalizedFullRoomName(hotelRoom, locale);
  if (direct) return direct;

  if (!allRoomData) return '';

  const fromIds = resolveRoomDisplayNameFromAllData(
    { room_category_id: hotelRoom.room_category, room_type_id: hotelRoom.room_type },
    allRoomData,
    locale
  );
  if (fromIds) return fromIds;

  if (locale === 'en') {
    return resolveRoomDisplayNameFromAllData(
      { room_category_id: hotelRoom.room_category, room_type_id: hotelRoom.room_type },
      allRoomData,
      'mn'
    );
  }

  return '';
}

export function resolveRoomDisplayNameFromAllData(
  ids: RoomNameIds,
  allData: AllData,
  locale: 'en' | 'mn'
): string {
  const category =
    allData.room_category.find((c) => c.id === ids.room_category_id) ??
    mapRoomRateToCategory(allData, ids.room_category_id);
  const type = allData.room_types.find((t) => t.id === ids.room_type_id);

  const categoryName =
    locale === 'en'
      ? category?.name_en || ''
      : category?.name_mn || category?.name_en || '';

  const typeName =
    locale === 'en'
      ? type?.name || ''
      : type?.name_mn || type?.name || '';

  return joinRoomNameParts(categoryName, typeName, locale);
}

/** Supports `/api/all-room-data/` where categories live under `room_rates`. */
export function mergeAllDataWithRoomRates(
  allData: AllData | null,
  roomRates?: Array<{ id: number; name?: string; name_en?: string; name_mn?: string }> | null
): AllData | null {
  if (!allData && (!roomRates || roomRates.length === 0)) return null;

  const base: AllData = allData ?? {
    room_types: [],
    bed_types: [],
    room_facilities: [],
    bathroom_items: [],
    free_toiletries: [],
    food_and_drink: [],
    outdoor_and_view: [],
    room_category: [],
  };

  if (base.room_category.length > 0 || !roomRates?.length) return base;

  return {
    ...base,
    room_types: base.room_types.length ? base.room_types : [],
    room_category: roomRates.map((rate) => ({
      id: rate.id,
      name_en: rate.name_en ?? rate.name ?? '',
      name_mn: rate.name_mn ?? rate.name ?? rate.name_en ?? '',
    })),
  };
}

function mapRoomRateToCategory(
  allData: AllData,
  categoryId: number
): { id: number; name_en: string; name_mn: string } | undefined {
  const rates = (allData as AllData & { room_rates?: Array<{ id: number; name?: string; name_en?: string; name_mn?: string }> })
    .room_rates;
  if (!rates?.length) return undefined;

  const rate = rates.find((r) => r.id === categoryId);
  if (!rate) return undefined;

  return {
    id: rate.id,
    name_en: rate.name_en ?? rate.name ?? '',
    name_mn: rate.name_mn ?? rate.name ?? rate.name_en ?? '',
  };
}
