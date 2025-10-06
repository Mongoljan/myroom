export const calculateNights = (checkIn: Date, checkOut: Date): number => {
  const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const formatDateForAPI = (date: Date): string => {
  return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
};

export const calculateRoomTotal = (
  pricePerNight: number,
  nights: number,
  roomCount: number
): number => {
  return pricePerNight * nights * roomCount;
};

export const calculateBookingTotal = (
  rooms: Array<{ price_per_night: number; room_count: number }>,
  nights: number
): number => {
  return rooms.reduce((total, room) => {
    return total + calculateRoomTotal(room.price_per_night, nights, room.room_count);
  }, 0);
};
