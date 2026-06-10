import type { AllData } from '@/types/api';

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

export function getLocalizedFullRoomName(
  room: LocalizedRoomNameSource,
  locale: 'en' | 'mn'
): string {
  const parts = [
    getLocalizedRoomCategoryName(room, locale),
    getLocalizedRoomTypeName(room, locale),
  ].filter((part) => part && part !== 'Unknown');
  return parts.join(' ');
}

export function resolveRoomDisplayNameFromAllData(
  ids: RoomNameIds,
  allData: AllData,
  locale: 'en' | 'mn'
): string {
  const category = allData.room_category.find((c) => c.id === ids.room_category_id);
  const type = allData.room_types.find((t) => t.id === ids.room_type_id);

  const categoryName =
    locale === 'en'
      ? category?.name_en || ''
      : category?.name_mn || category?.name_en || '';

  const typeName =
    locale === 'en'
      ? type?.name || ''
      : type?.name_mn || type?.name || '';

  return [categoryName, typeName].filter(Boolean).join(' ');
}
