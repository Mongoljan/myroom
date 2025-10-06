# Development Log - MyRoom Project

> Living document tracking key changes and context for future development sessions

## Current Session (Oct 6, 2025)

### Hotel Room Page - Show Only Base Price & Full Translation
**Files Modified:**
- `src/components/hotels/RoomCard.tsx`
- `src/components/hotels/ImprovedHotelRoomsSection.tsx`
- `src/lib/i18n.ts`

**Changes:**
1. **Hide Half-Day & Single-Person Prices on Hotel Page**
   - Added `showOnlyBasePrice` prop to RoomCard
   - When `true`, only "Full Day Price" is displayed
   - Half-day and single-person options are hidden
   - ImprovedHotelRoomsSection passes `showOnlyBasePrice={true}`

2. **Complete Translation Implementation**
   - Added `hotelRooms` translation namespace:
     - `availableRooms`, `checkInDate`, `checkOutDate`
     - `pricesPerNight`, `noRoomsAvailable`, `tryDifferentDates`
   - Translated all hardcoded texts in hotel rooms section
   - Added "more" translation for facility overflow ("+3 more" → "+3 бусад")
   - Full English & Mongolian support

**Key Implementation:**
```tsx
// RoomCard - conditional price display
{!showOnlyBasePrice && priceOptions?.halfDayPrice && (
  // Half-day price section only shown when flag is false
)}

// ImprovedHotelRoomsSection usage
<RoomCard showOnlyBasePrice={true} ... />
```

### Room Card Pricing Display Enhancement
**Changes:**
- Added "Full Day Price", "Half Day Price", "Single Guest Price" labels
- Shows calculated total: `₮X × N rooms × M nights = ₮Total`
- Per-night pricing display with breakdown

### Manage Booking Button Fix
**Issue:** "Захиалга хайх" button had white text on white background
**Fix:** Changed to `bg-blue-600` with explicit `text-white` class

---

## Previous Sessions

### Auto-Fill Booking Codes (Oct 6, 2025)
- Booking codes now auto-pass via URL: `/booking/manage?code=X&pin=Y`
- Auto-search on page load when codes present
- Blue notification shows when auto-filled
- Added 20+ translations for booking management

### Date Editing on Hotel Page (Oct 6, 2025)
- Added collapsible date picker to hotel detail page
- Real-time price recalculation on date change
- URL parameters update without page reload
- Selected rooms clear when dates change

### Booking System Fixes (Oct 6, 2025)
- Fixed missing `hotel_id` parameter
- Added nights calculation: `price × quantity × nights`
- Made dates editable on booking page
- Dynamic price recalculation

---

## Key Architecture Notes

### Translation Pattern
```typescript
const { t } = useHydratedTranslation();
t('roomCard.fullDayPrice', 'Fallback text')
```

### Price Calculation Flow
1. Room has `base_price` per night from API
2. User selects quantity in RoomCard
3. Calculation: `base_price × quantity × nights`
4. Total passed to BookingSummary
5. Final booking: `getTotalPrice() × nights`

### Date Handling
- Check-in/Check-out stored in state
- URL params: `check_in` and `check_out` (underscore)
- Date format: `YYYY-MM-DD` (ISO)
- Nights calculated: `Math.ceil(diffDays)` minimum 1

---

## Common Patterns

### API Data Flow
```
ImprovedHotelRoomsSection
  → ApiService.getRoomPrices(hotelId)
  → Map by room_type-room_category
  → Pass to RoomCard as priceOptions
```

### State Management
- Local state for UI (dates, selections)
- URL params for shareable state
- No global state (yet)

---

## Future Considerations

### Potential Issues to Watch
1. **Timezone handling** - Currently using local dates
2. **Price caching** - Fetches on every hotel page load
3. **Race conditions** - Multiple date changes quickly
4. **Mobile responsiveness** - Date picker on small screens

### Suggested Improvements
- Add price change notifications
- Cache room prices by hotel
- Add date range validation (min/max stay)
- Implement room availability check on date change

---

## Translation Keys Reference

### Room Card (`roomCard.*`)
- `fullDayPrice`, `halfDayPrice`, `singleGuestPrice` - Price type labels
- `night`, `nights`, `room`, `rooms`, `total` - Calculation labels
- `facilities`, `bathroom`, `foodAndDrink` - Feature labels

### Booking Management (`booking.manage.*`)
- `title`, `subtitle` - Page headers
- `bookingCode`, `pinCode` - Form labels
- `autoFilled` - Auto-fill notification
- `errorFetch` - Error message

---

*Last Updated: Oct 6, 2025*
