# Filter API Specification

## Overview
This document outlines the recommended API structure for dynamic, backend-driven filters to replace the current hardcoded frontend filters.

## Current State vs Recommended State

### 1. Property Categories Filter
**Current (Frontend Hardcoded):**
```typescript
const PROPERTY_CATEGORIES = [
  { id: 'budget', label: 'Budget' },
  { id: 'midRange', label: 'Mid-range' },
  { id: 'luxury', label: 'Luxury' },
  { id: 'familyFriendly', label: 'Family-friendly' },
  { id: 'business', label: 'Business' }
];
```

**Recommended (Backend API):**
```json
GET /api/filters/property-categories?location={location}&dates={dates}

Response:
{
  "categories": [
    {
      "id": "budget",
      "name_en": "Budget",
      "name_mn": "Хямд",
      "price_range": { "min": 0, "max": 100000 },
      "count": 45,
      "percentage": 23.5
    },
    {
      "id": "luxury",
      "name_en": "Luxury",
      "name_mn": "Тансаг",
      "price_range": { "min": 300000, "max": null },
      "amenities_required": ["spa", "pool", "concierge"],
      "count": 12,
      "percentage": 6.2
    }
  ]
}
```

### 2. Popular Searches Filter
**Current (Frontend Hardcoded):**
```typescript
const POPULAR_SEARCHES = [
  { id: 'breakfast', label: 'Breakfast' },
  { id: 'romantic', label: 'Romantic' },
  { id: '5star', label: '5 Stars' }
];
```

**Recommended (Backend API):**
```json
GET /api/filters/popular?location={location}&limit=10

Response:
{
  "popular_filters": [
    {
      "id": "breakfast_included",
      "type": "facility",
      "name_en": "Breakfast Included",
      "name_mn": "Өглөөний цайтай",
      "search_count": 15234,
      "availability_count": 89,
      "trend": "up" // up, down, stable
    },
    {
      "id": "near_square",
      "type": "location",
      "name_en": "Near Sukhbaatar Square",
      "name_mn": "Сүхбаатарын талбайн ойролцоо",
      "search_count": 8921,
      "availability_count": 34
    }
  ]
}
```

### 3. Dynamic Price Ranges
**Current (Frontend Hardcoded):**
```typescript
// Fixed ranges
{ label: '< 50K', min: 0, max: 50000 },
{ label: '50K - 100K', min: 50000, max: 100000 }
```

**Recommended (Backend API):**
```json
GET /api/filters/price-ranges?location={location}&currency=MNT

Response:
{
  "currency": "MNT",
  "min_price": 35000,
  "max_price": 850000,
  "average_price": 145000,
  "suggested_ranges": [
    {
      "id": "budget",
      "min": 35000,
      "max": 100000,
      "label": "₮35K - ₮100K",
      "count": 67,
      "percentage": 35
    },
    {
      "id": "mid",
      "min": 100000,
      "max": 250000,
      "label": "₮100K - ₮250K",
      "count": 89,
      "percentage": 45
    }
  ],
  "price_distribution": {
    "buckets": [
      { "range": "0-50k", "count": 23 },
      { "range": "50k-100k", "count": 45 },
      { "range": "100k-200k", "count": 67 }
    ]
  }
}
```

### 4. Bed Types (From Room Inventory)
**Current (Frontend Hardcoded):**
```typescript
const BED_TYPES = [
  { id: 'single', label: 'Single Bed (90×200 cm)', size: '90×200 cm' },
  { id: 'double', label: 'Double Bed (140×200 cm)', size: '140×200 cm' }
];
```

**Recommended (Backend API):**
```json
GET /api/filters/bed-types?location={location}

Response:
{
  "bed_types": [
    {
      "id": 1,
      "code": "single",
      "name_en": "Single Bed",
      "name_mn": "Ганц ор",
      "dimensions": "90×200 cm",
      "max_occupancy": 1,
      "available_count": 234,
      "min_price": 45000
    },
    {
      "id": 3,
      "code": "queen",
      "name_en": "Queen Bed",
      "name_mn": "Хатан ор",
      "dimensions": "160×200 cm",
      "max_occupancy": 2,
      "available_count": 567,
      "min_price": 85000
    }
    // Only bed types that actually exist in inventory
  ]
}
```

### 5. Popular Locations (Real POIs)
**Current (Frontend Hardcoded):**
```typescript
const POPULAR_PLACES = [
  { id: 'center', label: 'City Center' },
  { id: 'airport', label: 'Near Airport' }
];
```

**Recommended (Backend API):**
```json
GET /api/filters/locations?city={city}&type=popular

Response:
{
  "locations": [
    {
      "id": 45,
      "type": "landmark",
      "name_en": "Sukhbaatar Square",
      "name_mn": "Сүхбаатарын талбай",
      "coordinates": { "lat": 47.9194, "lng": 106.9178 },
      "radius_options": [
        { "distance": 500, "unit": "m", "count": 12 },
        { "distance": 1, "unit": "km", "count": 34 },
        { "distance": 2, "unit": "km", "count": 67 }
      ]
    },
    {
      "id": 78,
      "type": "transport",
      "name_en": "Chinggis Khaan Airport",
      "name_mn": "Чингис хаан нисэх онгоцны буудал",
      "coordinates": { "lat": 47.8439, "lng": 106.7667 },
      "radius_options": [
        { "distance": 5, "unit": "km", "count": 8 },
        { "distance": 10, "unit": "km", "count": 23 }
      ]
    },
    {
      "id": 89,
      "type": "district",
      "name_en": "Zaisan Area",
      "name_mn": "Зайсан",
      "boundary": "polygon_coordinates_here",
      "hotel_count": 45
    }
  ]
}
```

## Combined Filters Endpoint

For efficiency, provide a single endpoint that returns all filter options:

```json
GET /api/filters/all?location={location}&check_in={date}&check_out={date}&guests={n}

Response:
{
  "generated_at": "2024-01-20T10:30:00Z",
  "location_context": "Ulaanbaatar, Mongolia",
  "total_properties": 234,

  "filters": {
    "price": {
      "currency": "MNT",
      "min": 35000,
      "max": 850000,
      "ranges": [...]
    },

    "property_types": [
      { "id": 1, "name": "Hotel", "count": 156 },
      { "id": 2, "name": "Apartment", "count": 45 },
      { "id": 3, "name": "Guesthouse", "count": 33 }
    ],

    "facilities": [
      { "id": 1, "name": "Free WiFi", "category": "connectivity", "count": 189 },
      { "id": 2, "name": "Parking", "category": "transport", "count": 145 }
    ],

    "bed_types": [...],

    "locations": [...],

    "popular": {
      "searches": [...],
      "combinations": [
        {
          "name": "Business Traveler Package",
          "filters": ["wifi", "24h_desk", "business_center"],
          "count": 67
        }
      ]
    },

    "ratings": {
      "guest_ratings": [
        { "min": 9, "label": "Wonderful", "count": 45 },
        { "min": 8, "label": "Very Good", "count": 67 }
      ],
      "star_ratings": [
        { "stars": 5, "count": 12 },
        { "stars": 4, "count": 34 }
      ]
    },

    "meal_plans": [
      { "id": "bb", "name": "Bed & Breakfast", "count": 123 },
      { "id": "ro", "name": "Room Only", "count": 89 }
    ],

    "policies": [
      { "id": "free_cancel", "name": "Free Cancellation", "count": 156 },
      { "id": "pay_at_property", "name": "Pay at Property", "count": 78 }
    ]
  },

  "metadata": {
    "user_preferences": {
      "frequently_used": ["wifi", "parking", "breakfast"],
      "last_search": "2024-01-19T15:30:00Z"
    },
    "seasonal_highlights": [
      "Winter heating available",
      "Near ski resorts"
    ]
  }
}
```

## Benefits of Backend-Driven Filters

1. **Accuracy**: Only show filters for things that actually exist
2. **Performance**: Pre-calculated counts and optimized queries
3. **Personalization**: Can customize based on user history
4. **A/B Testing**: Easy to test different filter options
5. **Analytics**: Track which filters are actually used
6. **Localization**: Serve in user's language from backend
7. **Dynamic Updates**: No frontend deployment needed for changes
8. **SEO**: Can generate filter pages for search engines

## Migration Strategy

### Phase 1: Add Backend Endpoints (Current)
- Keep frontend filters as fallback
- Start collecting analytics on filter usage

### Phase 2: Hybrid Approach
- Fetch from backend when available
- Fall back to frontend for missing data

### Phase 3: Full Migration
- Remove all hardcoded filters
- Frontend only handles UI state

## Implementation Priority

1. **High Priority** (Most Impact):
   - Price ranges (dynamic based on actual inventory)
   - Popular/trending filters (based on real user data)
   - Location-based filters (real POIs and distances)

2. **Medium Priority**:
   - Bed types (from inventory)
   - Property categories (data-driven classification)
   - Meal plans and policies

3. **Low Priority** (Can remain static):
   - UI preferences (grid/list view)
   - Sort options
   - Display settings

## Example Frontend Implementation

```typescript
// New approach - everything from backend
const { data: filterOptions } = useSWR(
  `/api/filters/all?location=${location}&dates=${dates}`,
  fetcher,
  {
    fallbackData: DEFAULT_FILTERS, // Fallback to static if API fails
    revalidateOnFocus: false,
    dedupingInterval: 300000, // Cache for 5 minutes
  }
);

// Use backend data with fallback
const priceRanges = filterOptions?.filters?.price?.ranges || FALLBACK_PRICE_RANGES;
const bedTypes = filterOptions?.filters?.bed_types || FALLBACK_BED_TYPES;
```

## Notes for Backend Team

1. **Caching**: Filter data should be cached aggressively (5-10 minutes)
2. **Pagination**: Large filter lists should support pagination
3. **Search**: Filters themselves should be searchable (e.g., searching for specific amenities)
4. **Counts**: Always include counts for each filter option
5. **Ordering**: Return filters in order of relevance/popularity
6. **Localization**: Support `Accept-Language` header for translations
7. **Compression**: Use gzip for large filter responses

## Conclusion

Moving to backend-driven filters is the industry standard and will provide:
- Better user experience with accurate, relevant filters
- Improved performance with pre-calculated data
- Flexibility to evolve without frontend changes
- Data-driven insights into user behavior

The current hardcoded approach should be considered technical debt to be addressed in the roadmap.