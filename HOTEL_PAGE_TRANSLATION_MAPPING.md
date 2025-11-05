# Hotel Detail Page (/hotel/[id]) Translation Mapping

This document provides a comprehensive mapping of all translation keys used in the `/hotel/[id]` page and its nested components.

## Page Structure

```
/hotel/[id]/page.tsx
  └── HotelPageContent.tsx (Client Component)
      ├── EnhancedHotelDetail.tsx
      ├── HotelSubNav.tsx (Sticky Navigation)
      ├── ImprovedHotelRoomsSection.tsx
      │   ├── TripComStyleRoomCard.tsx
      │   └── BookingSummary.tsx
      ├── HotelHouseRules.tsx
      ├── HotelAmenities.tsx
      ├── HotelReviews.tsx
      ├── HotelFAQ.tsx
      └── SimilarHotels.tsx
```

## Translation Keys by Component

### 1. HotelPageContent (Main Container)

**Translation Keys:**
- `hotelDetails.selectRoom` - "Өрөө сонгох" / "Select Room"
- `hotelDetails.facilities` - "Тохижилт" / "Facilities"
- `hotelDetails.reviews` - "Үнэлгээ" / "Reviews"
- `hotelDetails.faq` - "Түгээмэл асуулт" / "FAQ"
- `hotelDetails.similarHotels` - "Төстэй зочид буудлууд" / "Similar Hotels"
- `loading` - "Ачааллаж байна..." / "Loading..."

**Location:** `src/components/hotels/HotelPageContent.tsx`

---

### 2. EnhancedHotelDetail (Hero Section)

**Translation Keys:** None currently used (displays API data directly)

**Location:** `src/components/hotels/EnhancedHotelDetail.tsx`

**Content Displayed:**
- Hotel name
- Star rating
- Address
- Images gallery
- Facilities with icons
- Description

---

### 3. HotelSubNav (Sticky Navigation)

**Translation Keys:**
- `hotel.overview` - "Ерөнхий" / "Overview"
- `hotel.rooms` - "Өрөөнүүд" / "Rooms"
- `hotel.houseRules` - "Дотоод журам" / "House Rules"
- `hotel.reviews` - "Шүүмж, үнэлгээ" / "Reviews"
- `hotel.facilities` - "Үйлчилгээ" / "Facilities"
- `hotel.faq` - "Түгээмэл асуулт" / "FAQ"
- `hotel.priceFrom` - "Эхлэх үнэ" / "Price from"
- `hotel.bookNow` - "Өрөө сонгох" / "Book Now"

**Location:** `src/components/hotels/HotelSubNav.tsx`

---

### 4. ImprovedHotelRoomsSection (Room Selection)

**Translation Keys:**
- `hotelRooms.availableRooms` - "Боломжтой өрөөнүүд" / "Available Rooms"
- `hotelRooms.checkInDate` - "Буух огноо" / "Check-in Date"
- `hotelRooms.checkOutDate` - "Гарах огноо" / "Check-out Date"
- `hotelRooms.pricesPerNight` - "Үнэ нь нэг шөнөөр тооцогдоно" / "Prices per night"
- `hotelRooms.noRoomsAvailable` - "Боломжтой өрөө байхгүй байна" / "No rooms available"
- `hotelRooms.tryDifferentDates` - "Өөр огноо турших эсвэл зочид буудалтай шууд холбогдоно уу" / "Try different dates"
- `navigation.night` - "шөнө" / "night"
- `navigation.nights` - "шөнө" / "nights"

**Location:** `src/components/hotels/ImprovedHotelRoomsSection.tsx`

---

### 5. TripComStyleRoomCard (Individual Room Card)

**Translation Keys:**
- `hotel.goldTierDeal` - "Хямдарсан" / "Gold Tier Deal"
- `hotel.pricePerNightShort` - "1 шөнийн үнэ" / "Price per night"
- `hotel.totalPrice` - "Нийт үнэ" / "Total price"
- `roomCard.onlyLeft` - "Сүүлийн {{count}} үлдлээ!" / "Only {{count}} left!"
- `roomCard.bed` - "ор" / "bed"
- `navigation.night` - "шөнө" / "night"

**Location:** `src/components/hotels/TripComStyleRoomCard.tsx`

**Display Features:**
- Room images
- Bed type icons
- Person capacity icons (adults/children)
- Facility checkmarks
- Discount badges
- Price per night
- Room selector dropdown

---

### 6. BookingSummary (Booking Cart)

**Translation Keys:**
- All hardcoded in English currently
- Needs translation implementation

**Untranslated Text:**
- "Stay Dates"
- "Check-in"
- "Check-out"
- "Total Price"
- "Book Now"
- "Selected Rooms"
- "No rooms selected"
- "Quantity"

**Location:** `src/components/hotels/BookingSummary.tsx`

---

### 7. HotelHouseRules (House Rules Section)

**Translation Keys:**
- `houseRules.title` - "Дотоод журам" / "House Rules"
- `houseRules.checkInOut` - "Орох цаг / Гарах цаг" / "Check-in / Check-out"
- `houseRules.checkIn` - "Орох цаг:" / "Check-in:"
- `houseRules.checkOut` - "Гарах цаг:" / "Check-out:"
- `houseRules.cancellation` - "Цуцлах бодлого" / "Cancellation Policy"
- `houseRules.beforeCancelTime` - "Цуцлах хугацааны өмнө:" / "Before cancellation time:"
- `houseRules.afterCancelTime` - "Цуцлах хугацааны дараа:" / "After cancellation time:"
- `houseRules.cancelTime` - "Цуцлах хугацаа:" / "Cancellation time:"
- `houseRules.cancellationDesc` - "Цуцлах болон урьдчилгаа төлбөрийн бодлого нь захиалгын төрлөөс хамаарч өөр байна" / "Cancellation and prepayment policies vary"
- `houseRules.children` - "Хүүхэд" / "Children"
- `houseRules.childrenAllowed` - "Хүүхэдтэй зочдыг хүлээн авдаг" / "Children are welcome"
- `houseRules.childrenNotAllowed` - "Хүүхэдтэй зочдыг хүлээн авдаггүй" / "Children are not allowed"
- `houseRules.pets` - "Тэжээвэр амьтан" / "Pets"
- `houseRules.petsAllowed` - "Тэжээвэр амьтантай зочдыг хүлээн авдаг" / "Pets are allowed"
- `houseRules.petsNotAllowed` - "Тэжээвэр амьтан авчрахыг зөвшөөрдөггүй" / "Pets are not allowed"
- `houseRules.breakfast` - "Өглөөний цай" / "Breakfast"
- `houseRules.breakfastPolicy` - "Өглөөний цайны бодлого" / "Breakfast policy"
- `houseRules.parking` - "Зогсоол" / "Parking"
- `houseRules.parkingSituation` - "Зогсоолын нөхцөл" / "Parking situation"
- `houseRules.noData` - "Одоогоор мэдээлэл байхгүй байна" / "No information available"
- `loading` - "Ачааллаж байна..." / "Loading..."

**Location:** `src/components/hotels/HotelHouseRules.tsx`

---

### 8. HotelAmenities (Facilities Grid)

**Translation Keys:**
- `hotel.noAmenities` - "Мэдээлэл байхгүй байна" / "No information available"

**Location:** `src/components/hotels/HotelAmenities.tsx`

**Note:** Facility names come from API and are displayed as-is (both MN and EN available)

---

### 9. HotelReviews (Reviews Section)

**Translation Keys:**
- `hotel.reviews` - "Үнэлгээ" / "Reviews"
- `hotel.excellent` - "Маш сайн" / "Excellent"
- `hotel.veryGood` - "Сайн" / "Very Good"
- `hotel.good` - "Дунд зэрэг" / "Good"
- `hotel.fair` - "Хангалттай" / "Fair"
- `hotel.poor` - "Муу" / "Poor"

**Untranslated (Hardcoded in English):**
- "Rating breakdown will be available when review data is integrated"
- "No reviews yet"
- "Be the first to share your experience!"
- "Helpful"
- "Show Less"
- "Show All X Reviews"

**Location:** `src/components/hotels/HotelReviews.tsx`

---

### 10. HotelFAQ (FAQ Accordion)

**Translation Keys:**
- `faq.title` - "Түгээмэл асуулт, хариулт" / "Frequently Asked Questions"
- `faq.breakfast` - "{hotelName}-д ямар цайны хоол өгдөг вэ?" / "What kind of breakfast is available at {hotelName}?"
- `faq.breakfastAnswer` - Answer text
- `faq.breakfastAnswerNoRestaurant` - Alternative answer
- `faq.pool` - "{hotelName}-д усан сан байдаг уу?" / "Does {hotelName} have a swimming pool?"
- `faq.poolAnswer` - Answer text
- `faq.wifi` - "{hotelName}-д WiFi байдаг уу?" / "Does {hotelName} have WiFi?"
- `faq.wifiAnswer` - Answer text
- `faq.parking` - "{hotelName}-д зогсоол байдаг уу?" / "Does {hotelName} have parking?"
- `faq.parkingAnswer` - Answer text
- `faq.rooms` - "{hotelName}-д ямар өрөө захиалж болох вэ?" / "What rooms can I book?"
- `faq.roomsAnswer` - Answer text
- `faq.checkin` - "{hotelName}-д хэзээ ирж, хэзээ явах вэ?" / "Check-in/out times?"
- `faq.checkinAnswer` - Answer text
- `faq.cost` - "{hotelName}-д хэдээр амрах вэ?" / "How much does it cost?"
- `faq.costAnswer` - Answer text
- `faq.restaurant` - "{hotelName}-д ресторан байдаг уу?" / "Does it have a restaurant?"
- `faq.restaurantAnswer` - Answer text
- `faq.activities` - "{hotelName}-д юу хийх боломжтой вэ?" / "What activities are available?"
- `faq.activitiesAnswer` - Answer text
- `faq.distance` - "{hotelName} хотын төвөөс хэр хол байдаг вэ?" / "How far from city center?"
- `faq.distanceAnswer` - Answer text
- `faq.hottub` - "{hotelName}-д халуун ванн байдаг уу?" / "Does it have a hot tub?"
- `faq.hottubAnswer` - Answer text
- `faq.families` - "{hotelName} гэр бүлтнүүдэд алдартай юу?" / "Is it popular with families?"
- `faq.familiesAnswer` - Answer text

**Location:** `src/components/hotels/HotelFAQ.tsx`

**Note:** FAQ items are generated dynamically based on hotel facilities

---

### 11. SimilarHotels (Recommendations)

**Translation Keys:**
- `similarHotels.title` - "Ижил төстэй буудлууд" / "Similar hotels"
- `similarHotels.discount` - "Хямдрал" / "Discount"
- `similarHotels.noRating` - "Үнэлгээгүй" / "No rating"
- `similarHotels.priceUnknown` - "Үнэ тодорхойгүй" / "Price unknown"
- `similarHotels.from` - "-с эхлэн" / "from"

**Location:** `src/components/hotels/SimilarHotels.tsx`

---

## Translation File Location

All translations are stored in: `/src/lib/i18n.ts`

## Usage Pattern

All components use the `useHydratedTranslation` hook:

```typescript
const { t } = useHydratedTranslation();
```

Then use translations like:
```typescript
{t('hotel.overview', 'Ерөнхий')}
```

The second parameter is the fallback text shown if the translation key doesn't exist.

---

## Complete Translation Checklist

### ✅ Fully Translated
- [x] HotelPageContent
- [x] HotelSubNav
- [x] ImprovedHotelRoomsSection
- [x] TripComStyleRoomCard
- [x] HotelHouseRules
- [x] HotelAmenities
- [x] HotelFAQ
- [x] SimilarHotels

### ⚠️ Partially Translated
- [ ] HotelReviews (Static text needs translation)
- [ ] BookingSummary (Needs full translation implementation)

### 📝 Notes on Implementation

1. **Dynamic Content**: Hotel names, facility names, and descriptions come from the API in both Mongolian and English
2. **Icons**: Facility icons are mapped by facility ID and don't require translation
3. **Dates**: Date formatting is handled by JavaScript's `toLocaleDateString()`
4. **Numbers**: Prices use `toLocaleString()` for proper formatting
5. **Interpolation**: Some translations use placeholders like `{hotelName}` for dynamic content

---

## Adding New Translations

To add a new translation key:

1. Open `/src/lib/i18n.ts`
2. Add the key under the appropriate section in both `en` and `mn` objects
3. Use the key in your component: `t('section.key', 'Fallback text')`

Example:
```typescript
// In i18n.ts
hotel: {
  newKey: "New translation"
}

// In component
{t('hotel.newKey', 'Default text')}
```

---

## Translation Categories Structure

```
en/mn
  ├── common (buttons, actions, states)
  ├── calendar (date related)
  ├── breadcrumb (navigation breadcrumbs)
  ├── hero (homepage hero section)
  ├── footer (footer links and text)
  ├── navigation (main navigation)
  ├── hotel (hotel-specific translations)
  ├── search (search page)
  ├── tabs (tab navigation)
  ├── booking (booking process)
  ├── filters (filter options)
  ├── faq (FAQ questions and answers)
  ├── houseRules (hotel policies)
  ├── hotelDetails (hotel detail page)
  ├── roomCard (room card display)
  ├── hotelRooms (room section)
  ├── amenitiesLabels (amenity badges)
  ├── similarHotels (recommendations)
  └── bookingExtra (booking confirmation)
```

---

## Multi-Level Nesting Example

The hotel detail page demonstrates 4 levels of component nesting:

```
Level 1: page.tsx (Server Component)
  └── Level 2: HotelPageContent (Client Component)
      └── Level 3: ImprovedHotelRoomsSection (Feature Component)
          └── Level 4: TripComStyleRoomCard (UI Component)
              └── Uses: hotel.*, roomCard.*, navigation.* translations
```

Each level uses translations from different namespaces, showing how translations are organized by feature and scope.

