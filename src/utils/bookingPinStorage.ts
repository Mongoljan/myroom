const PIN_PREFIX = 'myroom_booking_pin_';

export function saveBookingPin(bookingCode: string, pinCode: string): void {
  if (typeof window === 'undefined' || !bookingCode || !pinCode) return;
  try {
    localStorage.setItem(`${PIN_PREFIX}${bookingCode}`, pinCode);
  } catch {
    // ignore quota / private mode
  }
}

export function getBookingPin(bookingCode: string): string | null {
  if (typeof window === 'undefined' || !bookingCode) return null;
  try {
    return localStorage.getItem(`${PIN_PREFIX}${bookingCode}`);
  } catch {
    return null;
  }
}
