# Google Maps Quick Start Guide

## ✅ What's Already Done

1. **Environment variable configured** (`.env.local`)
   ```bash
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyCD-M_S9u_77q8yVKKoAFJMEAIkBrVDdEs
   ```

2. **Component created** (`src/components/common/GoogleMapDisplay.tsx`)
   - Ready to use Google Maps component
   - Supports read-only and editable modes
   - Handles URL coordinate extraction

3. **Utility functions created** (`src/utils/googleMaps.ts`)
   - Extract coordinates from URLs
   - Generate Google Maps URLs
   - Calculate distances
   - Format coordinates

4. **Documentation created** (`GOOGLE_MAPS_SETUP.md`)
   - Complete setup guide
   - Troubleshooting tips
   - Cost monitoring info

---

## 🔧 What You Need to Do

### Step 1: Install Required Package
```bash
npm install @react-google-maps/api
```

### Step 2: Verify API Key is Valid
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Check if the API key `AIzaSyCD-M_S9u_77q8yVKKoAFJMEAIkBrVDdEs` is active
3. Ensure **Maps JavaScript API** is enabled
4. Ensure **Billing** is enabled (required for Google Maps)

### Step 3: Restart Development Server
```bash
# Stop current server (Ctrl+C)
npm run dev
```

---

## 📝 How to Use the Component

### Example 1: Display Hotel Location (Read-Only)

In any component (e.g., `EnhancedHotelDetail.tsx`):

```tsx
import GoogleMapDisplay from '@/components/common/GoogleMapDisplay';

export default function HotelDetail({ hotel }) {
  return (
    <div>
      <h2>Hotel Location</h2>
      <GoogleMapDisplay
        googleMapUrl={hotel.google_map}
        zoom={15}
      />
    </div>
  );
}
```

### Example 2: Location Selector (Editable)

For hotel registration or admin panel:

```tsx
import GoogleMapDisplay from '@/components/common/GoogleMapDisplay';
import { generateGoogleMapsUrl } from '@/utils/googleMaps';
import { useState } from 'react';

export default function LocationSelector() {
  const [googleMapUrl, setGoogleMapUrl] = useState('');

  const handleLocationChange = (lat: number, lng: number) => {
    const url = generateGoogleMapsUrl(lat, lng);
    setGoogleMapUrl(url);
    console.log('Selected location:', url);
  };

  return (
    <div>
      <h2>Select Hotel Location</h2>
      <GoogleMapDisplay
        editable={true}
        onLocationChange={handleLocationChange}
        zoom={12}
      />
      <p>Selected URL: {googleMapUrl}</p>
    </div>
  );
}
```

---

## 🎯 Recommended Implementation Order

1. **Install package** (Step 1 above)
2. **Test the component** in a simple page
3. **Add to hotel detail page** (read-only mode)
4. **Add to hotel registration** (editable mode)
5. **Add to admin panel** (editable mode)

---

## 🔍 Quick Test

Create a test page: `src/app/test-map/page.tsx`

```tsx
'use client';

import GoogleMapDisplay from '@/components/common/GoogleMapDisplay';

export default function TestMapPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Google Maps Test</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Read-Only Map</h2>
        <GoogleMapDisplay
          googleMapUrl="https://www.google.com/maps?q=47.918873,106.917017"
        />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Editable Map</h2>
        <GoogleMapDisplay
          editable={true}
          onLocationChange={(lat, lng) => {
            console.log('Location changed:', lat, lng);
          }}
        />
      </div>
    </div>
  );
}
```

Then visit: `http://localhost:3000/test-map`

---

## ❗ Troubleshooting

### Map shows grey area
- **Cause:** Invalid API key or billing not enabled
- **Fix:** Check Google Cloud Console

### "This page can't load Google Maps correctly"
- **Cause:** API key expired or billing not enabled
- **Fix:** Regenerate API key and enable billing

### Component not found error
- **Cause:** Package not installed
- **Fix:** Run `npm install @react-google-maps/api`

### Environment variable undefined
- **Cause:** Dev server not restarted
- **Fix:** Stop and restart: `npm run dev`

---

## 📊 Files Created

```
myroom/
├── .env.local                                   # ✅ API key configured
├── GOOGLE_MAPS_SETUP.md                         # ✅ Complete documentation
├── GOOGLE_MAPS_QUICK_START.md                   # ✅ This file
├── src/
│   ├── components/
│   │   └── common/
│   │       └── GoogleMapDisplay.tsx             # ✅ Ready to use
│   └── utils/
│       └── googleMaps.ts                        # ✅ Helper functions
```

---

## 🎉 Summary

**You're almost ready!** Just run:

```bash
npm install @react-google-maps/api
```

Then restart your dev server and start using `<GoogleMapDisplay />` anywhere in your app!

For detailed information, see [GOOGLE_MAPS_SETUP.md](./GOOGLE_MAPS_SETUP.md)
