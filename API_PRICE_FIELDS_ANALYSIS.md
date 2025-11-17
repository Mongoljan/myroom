# API Calls & Price Field Analysis
**Date**: November 17, 2025

## �� Summary

All three pages use **the same API call** (`ApiService.searchHotels`) but display different price fields from the response:

| Page | API Call | Price Field Displayed | Notes |
|------|----------|----------------------|-------|
| **Root Page** (RecommendedHotels) | `searchHotels()` | `cheapest_room.price_per_night` or `min_estimated_total` | Falls back to `min_estimated_total` |
| **Search Page** (BookingStyleHotelCard) | `searchHotels()` | `cheapest_room.price_per_night_adjusted` or `price_per_night` | Uses adjusted price with discount support |
| **Hotel Detail** (/hotel/[id]) | `getHotelDetails(hotelId)` | `cheapest_room.price_per_night` or `min_estimated_total` | Calls `searchHotels` with `name_id` param |

---

## 📍 1. ROOT PAGE - Recommended Hotels Section

### API Call
```typescript
// File: src/components/sections/RecommendedHotels.tsx (line 137)
const searchResult = await ApiService.searchHotels({
  check_in: new Date().toISOString().split('T')[0],
  check_out: new Date(Date.now() + 24*60*60*1000).toISOString().split('T')[0],
  adults: 2,
  children: 0,
  rooms: 1,
  acc_type: 'hotel'
});
```

### API Endpoint
```
GET https://dev.kacc.mn/api/search-hotels/
```

### Price Field Used
```typescript
// Line 31-33
const price = hotel.cheapest_room?.price_per_night || hotel.min_estimated_total || 0;
```

**Breakdown**:
1. **Primary**: `hotel.cheapest_room.price_per_night` - Per night price of cheapest room
2. **Fallback**: `hotel.min_estimated_total` - Minimum total estimated price
3. **Default**: `0` if both are null/undefined

### Rendering
```typescript
// Displayed in SectionHotelCard component
<SectionHotelCard 
  hotel={hotel}
  // ... other props
/>
```

---

## 📍 2. SEARCH PAGE - Hotel Search Results

### API Call
```typescript
// File: src/components/search/SearchResults.tsx (approximate line 140)
const response = await ApiService.searchHotels(params);
// Where params includes: location, check_in, check_out, adults, children, rooms, acc_type
```

### API Endpoint
```
GET https://dev.kacc.mn/api/search-hotels/?location=X&check_in=Y&check_out=Z&...
```

### Price Field Used (WITH DISCOUNT LOGIC)
```typescript
// File: src/components/search/BookingStyleHotelCard.tsx (line 137-138)
const rawPrice = cheapest.price_per_night_raw || cheapest.price_per_night;
const adjustedPrice = cheapest.price_per_night_adjusted || cheapest.price_per_night;
```

**Breakdown**:
1. **Raw Price**: `price_per_night_raw` (original before discount) or `price_per_night`
2. **Adjusted Price**: `price_per_night_adjusted` (after discount) or `price_per_night`
3. **Display Logic**:
   - If `rawPrice > adjustedPrice`: Show discount badge with percentage
   - Display: `adjustedPrice` (discounted price)
   - Strikethrough: `rawPrice` (original price)

### Discount Calculation
```typescript
// Line 142-148
if (rawPrice > 0 && adjustedPrice < rawPrice) {
  const actualDiscount = rawPrice - adjustedPrice;
  const calculatedPercent = (actualDiscount / rawPrice) * 100;
  discountPercent = calculatedPercent > 0 ? Math.max(1, Math.round(calculatedPercent)) : 0;
}
```

### Additional API Calls (Per Hotel Card)
```typescript
// Lines 186-212
// 1. Get room reference data
const roomDataResponse = await fetch('https://dev.kacc.mn/api/all-room-data/');

// 2. Get property details
const detailsArray = await ApiService.getPropertyDetails(hotel.hotel_id);

// 3. Get additional info
const addInfo = await ApiService.getAdditionalInfo(details.Additional_Information);

// 4. Get room prices
const prices = await ApiService.getRoomPrices(hotel.hotel_id);
```

---

## 📍 3. HOTEL DETAIL PAGE - /hotel/[id]

### API Call Flow
```typescript
// File: src/app/hotel/[id]/page.tsx (line 7-11)
const hotel = await ApiService.getHotelDetails(hotelId);
```

**Which internally calls**:
```typescript
// File: src/services/api.ts (line 264-283)
static async getHotelDetails(hotelId: number): Promise<SearchHotelResult | null> {
  try {
    const searchResult = await this.searchHotels({
      name_id: hotelId,  // <-- Searches by exact hotel ID
      check_in: new Date().toISOString().split('T')[0],
      check_out: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      adults: 2,
      children: 0,
      rooms: 1,
      acc_type: 'hotel'
    });
    
    if (searchResult.results && searchResult.results.length > 0) {
      return searchResult.results[0];
    }
    return null;
  } catch (error) {
    console.error('Error fetching hotel details:', error);
    return null;
  }
}
```

### API Endpoint
```
GET https://dev.kacc.mn/api/search-hotels/?name_id=123&check_in=Y&check_out=Z&...
```

### Price Field Used
```typescript
// File: src/components/hotels/HotelPageContent.tsx (line 61)
price={hotel.cheapest_room?.price_per_night || hotel.min_estimated_total || 0}
```

**Breakdown**:
1. **Primary**: `hotel.cheapest_room.price_per_night` - Per night price
2. **Fallback**: `hotel.min_estimated_total` - Minimum estimated total
3. **Default**: `0`

### Display Location
Used in the sticky HotelSubNav component that shows price while scrolling.

---

## 🔍 API Response Structure

### SearchResponse Type
```typescript
interface SearchResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: SearchHotelResult[];
}
```

### SearchHotelResult.cheapest_room Structure
```typescript
interface SearchHotelResult {
  hotel_id: number;
  property_name: string;
  cheapest_room?: {
    price_per_night: number;           // Standard price
    price_per_night_raw?: number;      // Original price (before discount)
    price_per_night_adjusted?: number; // Discounted price
    pricesetting?: {
      adjustment_type: 'SUB' | 'ADD';
      value_type: 'PERCENT' | 'FIXED';
      value: number;
    };
  };
  min_estimated_total?: number;        // Fallback minimum price
  // ... other fields
}
```

---

## 📊 Price Field Priority Matrix

| Scenario | Root Page | Search Page | Hotel Detail |
|----------|-----------|-------------|--------------|
| **Normal (no discount)** | `price_per_night` | `price_per_night` | `price_per_night` |
| **With discount** | `price_per_night` | `price_per_night_adjusted` | `price_per_night` |
| **Missing cheapest_room** | `min_estimated_total` | N/A (0 shown) | `min_estimated_total` |
| **All missing** | `0` | `0` | `0` |

---

## 🎨 Display Differences

### Root Page (RecommendedHotels)
- **Shows**: Single price per night
- **Format**: `₮150,000`
- **No discount display**: Shows base price only
- **Component**: `SectionHotelCard`

### Search Page (BookingStyleHotelCard)
- **Shows**: Discounted price prominently
- **Format**: `₮120,000` with ~~₮150,000~~ strikethrough
- **Discount badge**: `-20%` if discount exists
- **Total calculation**: `adjustedPrice × nights × rooms`
- **Component**: `BookingStyleHotelCard`

### Hotel Detail Page
- **Shows**: Price per night in sticky nav
- **Format**: `₮150,000/night`
- **Location**: HotelSubNav (sticky header)
- **Additional**: Full room pricing in ImprovedHotelRoomsSection

---

## 🚨 Potential Issues

### 1. Inconsistent Discount Handling
- **Root Page**: Does NOT show discounts (uses base `price_per_night`)
- **Search Page**: DOES show discounts (uses `price_per_night_adjusted`)
- **Impact**: Users see different prices on homepage vs search results

### 2. Fallback Confusion
- `min_estimated_total` might be total for entire stay, not per night
- If used as per-night price, could show incorrect calculations

### 3. API Response Variability
- Not all hotels have `cheapest_room` populated
- `price_per_night_raw` and `price_per_night_adjusted` might be missing
- Requires defensive coding with fallbacks

---

## ✅ Recommendations

### 1. Standardize Price Display
```typescript
// Create unified price getter utility
export const getHotelPrice = (hotel: SearchHotelResult, includeDiscounts = true) => {
  const cheapest = hotel.cheapest_room;
  if (!cheapest) return hotel.min_estimated_total || 0;
  
  if (includeDiscounts) {
    return cheapest.price_per_night_adjusted || cheapest.price_per_night || 0;
  }
  return cheapest.price_per_night || 0;
};
```

### 2. Show Discounts Consistently
Apply discount logic on ALL pages (root, search, detail):
```typescript
// Show discount badge if price_per_night_adjusted < price_per_night_raw
const hasDiscount = (rawPrice > adjustedPrice && adjustedPrice > 0);
```

### 3. Clarify min_estimated_total Usage
Document whether this is:
- Per night price?
- Total for entire stay?
- Minimum across all room types?

### 4. Add Price Type Enum
```typescript
enum PriceDisplayType {
  PER_NIGHT = 'per_night',
  TOTAL_STAY = 'total_stay',
  FROM_PRICE = 'from_price'
}
```

---

## 📈 Summary Statistics

| Metric | Value |
|--------|-------|
| **Unique API Endpoints Used** | 1 (`search-hotels`) |
| **Price Fields Accessed** | 4 (price_per_night, price_per_night_raw, price_per_night_adjusted, min_estimated_total) |
| **Pages with Discount Logic** | 1 (Search Page only) |
| **Fallback Layers** | 2-3 per page |

---

*Generated: November 17, 2025*
*By: GitHub Copilot Agent*
