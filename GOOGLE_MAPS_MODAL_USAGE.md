# Google Maps Modal Implementation Guide

## ✅ What's Implemented

I've created an embedded Google Maps modal that shows when users click "View on map" instead of opening a new tab.

### Components Created

1. **GoogleMapModal** (`src/components/common/GoogleMapModal.tsx`)
   - Large modal (95% viewport width, 90% viewport height)
   - Displays interactive embedded Google Map
   - Header with hotel name and close button
   - Footer with "Open in Google Maps" external link

2. **Dialog UI** (`src/components/ui/dialog.tsx`)
   - Radix UI Dialog component wrapper
   - Reusable for other modals

3. **GoogleMapDisplay** (`src/components/common/GoogleMapDisplay.tsx`)
   - Updated to support custom height
   - Can be used standalone or in modal

### Updated Files

1. **EnhancedHotelDetail.tsx**
   - Added `showMapModal` state
   - Changed "View on map" links from `<a>` to `<button>`
   - Opens modal instead of external link
   - Modal displays at bottom of component

---

## 📦 Required Package Installation

**IMPORTANT:** You must install this package first:

```bash
npm install @react-google-maps/api
```

Then restart your dev server:

```bash
npm run dev
```

---

## 🎯 How It Works

### Before (Old Behavior)
- Click "View on map" → Opens Google Maps in new tab

### After (New Behavior)
- Click "View on map" → Opens large embedded modal
- Interactive map inside your app
- Can still open external Google Maps via footer link

---

## 🖼️ Modal Features

### Size
- Width: 95% of viewport (`max-w-7xl`)
- Height: 90% of viewport
- Responsive and looks great on all screen sizes

### Layout
```
┌─────────────────────────────────────┐
│ [Hotel Name]                    [X] │  ← Header
├─────────────────────────────────────┤
│                                     │
│      [Interactive Google Map]       │  ← Map Content (fills space)
│                                     │
│                                     │
├─────────────────────────────────────┤
│ [Open in Google Maps ↗]            │  ← Footer
└─────────────────────────────────────┘
```

### Interactions
- **Click outside**: Closes modal
- **Press ESC**: Closes modal
- **Click [X]**: Closes modal
- **Click map**: Interactive (zoom, pan, etc.)
- **Click footer link**: Opens Google Maps in new tab

---

## 📝 Usage in Other Components

### Example: Hotel Card with Map Modal

```tsx
'use client';

import { useState } from 'react';
import GoogleMapModal from '@/components/common/GoogleMapModal';

export default function HotelCard({ hotel }) {
  const [showMap, setShowMap] = useState(false);

  return (
    <div>
      <h3>{hotel.name}</h3>
      <button onClick={() => setShowMap(true)}>
        View Location
      </button>

      <GoogleMapModal
        isOpen={showMap}
        onClose={() => setShowMap(false)}
        googleMapUrl={hotel.google_map}
        hotelName={hotel.name}
      />
    </div>
  );
}
```

### Example: Custom Coordinates

```tsx
<GoogleMapModal
  isOpen={isOpen}
  onClose={onClose}
  defaultLat={47.918873}
  defaultLng={106.917017}
  zoom={12}
  hotelName="Custom Location"
/>
```

---

## 🎨 Customization

### Props for GoogleMapModal

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | boolean | - | Controls modal visibility (required) |
| `onClose` | () => void | - | Callback when modal closes (required) |
| `googleMapUrl` | string | - | Google Maps URL with coordinates |
| `hotelName` | string | 'Hotel Location' | Title shown in header |
| `defaultLat` | number | 47.918873 | Fallback latitude |
| `defaultLng` | number | 106.917017 | Fallback longitude |
| `zoom` | number | 15 | Map zoom level (1-20) |

### Props for GoogleMapDisplay

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `googleMapUrl` | string | - | Google Maps URL with coordinates |
| `defaultLat` | number | 47.918873 | Default latitude |
| `defaultLng` | number | 106.917017 | Default longitude |
| `zoom` | number | 15 | Map zoom level |
| `editable` | boolean | false | Allow clicking to change location |
| `onLocationChange` | (lat, lng) => void | - | Callback when location changes |
| `height` | string | '400px' | Custom height (CSS value) |
| `containerClassName` | string | '' | Additional CSS classes |

---

## 🔧 Where to Add More Modals

You can add the map modal to any component that shows `google_map`:

### 1. Search Results Cards
File: `src/components/search/BookingStyleHotelCard.tsx`

```tsx
// Add state
const [showMap, setShowMap] = useState(false);

// Change link to button
<button onClick={() => setShowMap(true)}>View on map</button>

// Add modal at end
<GoogleMapModal
  isOpen={showMap}
  onClose={() => setShowMap(false)}
  googleMapUrl={hotel.google_map}
  hotelName={hotel.property_name}
/>
```

### 2. Similar Hotels Section
File: `src/components/hotels/SimilarHotels.tsx`

Same pattern as above.

---

## 🎯 Next Steps

1. **Install package**: `npm install @react-google-maps/api`
2. **Restart server**: `npm run dev`
3. **Test**: Go to any hotel detail page and click "View on map"
4. **Verify API key**: Make sure your Google Maps API key is valid
5. **Add to other components**: Use the pattern above for search results, etc.

---

## 💡 Benefits

### User Experience
- ✅ No page navigation (stays in app)
- ✅ Large, clear map view
- ✅ Interactive controls (zoom, pan, street view)
- ✅ Can still open Google Maps if needed
- ✅ Fast loading (component cached)

### Development
- ✅ Reusable modal component
- ✅ Clean, simple API
- ✅ TypeScript support
- ✅ Responsive design
- ✅ Accessible (keyboard navigation)

---

## 🐛 Troubleshooting

### Modal doesn't open
- Check if `isOpen` state is being set to `true`
- Check browser console for errors

### Map shows grey area
- API key invalid or expired
- Maps JavaScript API not enabled
- Billing not enabled on Google Cloud

### Modal too small/large
- Adjust `max-w-7xl` in GoogleMapModal.tsx
- Adjust `h-[90vh]` for different height

---

## 📚 Related Files

- `src/components/common/GoogleMapModal.tsx` - Main modal component
- `src/components/common/GoogleMapDisplay.tsx` - Map display component
- `src/components/ui/dialog.tsx` - Dialog wrapper (Radix UI)
- `src/components/hotels/EnhancedHotelDetail.tsx` - Example usage
- `GOOGLE_MAPS_SETUP.md` - API configuration guide
- `GOOGLE_MAPS_QUICK_START.md` - Quick reference

---

**Last Updated:** December 31, 2025
**Status:** ✅ Ready to use (after installing package)
