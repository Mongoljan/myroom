# Google Maps API Configuration Guide

## Overview
This document provides complete instructions for setting up and configuring Google Maps API for the MyRoom hotel booking platform.

---

## Current Implementation Status

### ✅ What's Working
- Google Maps URLs are stored in the database (`google_map` field)
- Links to open Google Maps in new tab (external)
- Basic location data (latitude/longitude from URLs)

### ⚠️ Not Yet Implemented
- Interactive embedded Google Maps component
- Map selection during hotel registration
- Admin panel map display
- `@react-google-maps/api` library integration

---

## Environment Variable Setup

### Variable Name
```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
```

**⚠️ Important:** The `NEXT_PUBLIC_` prefix is **required** for Next.js to expose this variable to the browser.

### Configuration File: `.env.local`
Location: `/Users/mongoljansabyrjan/myroom/.env.local`

```bash
# Google Maps API Key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyCD-M_S9u_77q8yVKKoAFJMEAIkBrVDdEs
```

---

## How to Get a Google Maps API Key

### Step 1: Google Cloud Console Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing project
3. Project name suggestion: "MyRoom Hotel Booking"

### Step 2: Enable Required APIs
Navigate to **APIs & Services** > **Library** and enable:
- ✅ **Maps JavaScript API** (Required)
- ✅ **Maps Embed API** (Optional - for iframe embeds)
- ✅ **Geocoding API** (Optional - for address to coordinates conversion)
- ✅ **Places API** (Optional - for address autocomplete)

### Step 3: Create API Key
1. Go to **APIs & Services** > **Credentials**
2. Click **"+ CREATE CREDENTIALS"** > **"API Key"**
3. Copy the generated API key
4. Click **"Edit API Key"** to configure restrictions

### Step 4: Restrict API Key (Recommended for Security)

#### Application Restrictions
Select: **HTTP referrers (web sites)**

Add these referrers:
```
http://localhost:3000/*
http://localhost:3001/*
https://yourdomain.com/*
https://www.yourdomain.com/*
```

#### API Restrictions
Select: **Restrict key**

Check these APIs:
- Maps JavaScript API
- Maps Embed API (if using)
- Geocoding API (if using)
- Places API (if using)

### Step 5: Enable Billing (Required)
⚠️ Google Maps requires a billing account even for free tier usage.

**Free Tier Limits:**
- $200 free credit per month
- Approximately 28,000 map loads per month for free
- Dynamic Maps: $7 per 1,000 loads (after free credit)

**To enable billing:**
1. Go to **Billing** > **Link a billing account**
2. Add payment method (credit card)
3. Set up budget alerts (recommended: $50/month alert)

---

## Installation & Implementation

### Step 1: Install Required Package
```bash
npm install @react-google-maps/api
```

### Step 2: Update `.env.local`
```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_ACTUAL_API_KEY_HERE
```

### Step 3: Restart Development Server
```bash
# Stop the current dev server (Ctrl+C)
npm run dev
```

⚠️ **Critical:** Next.js only reads `.env.local` on startup. You **must** restart the dev server after any changes to environment variables.

---

## Code Implementation Examples

### Example 1: Basic Interactive Map Component

Create: `src/components/common/GoogleMapDisplay.tsx`

```tsx
'use client';

import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { useState } from 'react';

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

const mapContainerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '8px',
};

interface GoogleMapDisplayProps {
  googleMapUrl?: string;
  defaultLat?: number;
  defaultLng?: number;
  zoom?: number;
  editable?: boolean;
  onLocationChange?: (lat: number, lng: number) => void;
}

export default function GoogleMapDisplay({
  googleMapUrl,
  defaultLat = 47.918873,
  defaultLng = 106.917017,
  zoom = 15,
  editable = false,
  onLocationChange,
}: GoogleMapDisplayProps) {
  // Extract coordinates from URL if provided
  const extractCoordinates = (url: string) => {
    const match = url.match(/q=([-\d.]+),([-\d.]+)/);
    if (match) {
      const [, lat, lng] = match;
      return { lat: parseFloat(lat), lng: parseFloat(lng) };
    }
    return null;
  };

  const coords = googleMapUrl ? extractCoordinates(googleMapUrl) : null;
  const [position, setPosition] = useState({
    lat: coords?.lat || defaultLat,
    lng: coords?.lng || defaultLng,
  });

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (!editable || !e.latLng) return;

    const lat = e.latLng.lat();
    const lng = e.latLng.lng();

    setPosition({ lat, lng });
    onLocationChange?.(lat, lng);
  };

  if (loadError) {
    return (
      <div className="w-full h-[400px] bg-red-50 border border-red-200 rounded-lg flex items-center justify-center">
        <p className="text-red-600">Error loading Google Maps: {loadError.message}</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={position}
      zoom={zoom}
      onClick={handleMapClick}
      options={{
        streetViewControl: false,
        mapTypeControl: true,
        fullscreenControl: true,
        zoomControl: true,
      }}
    >
      <Marker position={position} />
    </GoogleMap>
  );
}
```

### Example 2: Using in Hotel Detail Page

Update: `src/components/hotels/EnhancedHotelDetail.tsx`

```tsx
import GoogleMapDisplay from '@/components/common/GoogleMapDisplay';

// Inside your component JSX, replace the map link with:
<div className="mt-4">
  <h4 className="text-sm font-semibold text-gray-900 mb-2">
    {t('hotelDetails.location', 'Location')}
  </h4>
  <GoogleMapDisplay googleMapUrl={hotel.google_map} />
</div>
```

### Example 3: URL Extraction Utility

Create: `src/utils/googleMaps.ts`

```typescript
export interface Coordinates {
  lat: number;
  lng: number;
}

/**
 * Extracts latitude and longitude from Google Maps URL
 * Supports formats:
 * - https://www.google.com/maps?q=47.918873,106.917017
 * - https://maps.google.com/?q=47.918873,106.917017
 */
export function extractCoordinatesFromUrl(url: string): Coordinates | null {
  const match = url.match(/q=([-\d.]+),([-\d.]+)/);
  if (match) {
    const [, lat, lng] = match;
    return {
      lat: parseFloat(lat),
      lng: parseFloat(lng)
    };
  }
  return null;
}

/**
 * Generates Google Maps URL from coordinates
 */
export function generateGoogleMapsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps?q=${lat},${lng}`;
}
```

---

## Database Schema

The `google_map` field is stored as a URL string in the following format:

```
https://www.google.com/maps?q=47.918873,106.917017
```

**Format:**
- `q` parameter contains: `latitude,longitude`
- Example: Ulaanbaatar coordinates: `47.918873,106.917017`

---

## Where Google Maps is Used

### Current Usage (URL Links)
1. ✅ `src/components/hotels/EnhancedHotelDetail.tsx` - "View on map" link
2. ✅ `src/components/search/BookingStyleHotelCard.tsx` - Hotel card map link
3. ✅ `src/types/api.ts` - Type definitions for `google_map` field

### Recommended Future Implementation
1. 🔄 Hotel registration form - Interactive map for location selection
2. 🔄 Hotel detail page - Embedded interactive map
3. 🔄 Admin panel - Hotel location management
4. 🔄 Search results - Mini map preview (optional)

---

## Troubleshooting

### Issue: Map not loading
**Possible causes:**
- ❌ API key is invalid or expired
- ❌ Maps JavaScript API not enabled
- ❌ Billing not enabled on Google Cloud account
- ❌ API key restrictions blocking localhost
- ❌ Dev server not restarted after `.env.local` change

**Solution:**
1. Verify API key in Google Cloud Console
2. Check API is enabled
3. Add billing account
4. Check API key restrictions allow your domain
5. Restart dev server: `npm run dev`

### Issue: "This page can't load Google Maps correctly"
**Cause:** API key is invalid or billing is not enabled

**Solution:**
1. Enable billing in Google Cloud Console
2. Regenerate API key if expired

### Issue: Map loads but shows grey area
**Cause:** Invalid coordinates or zoom level

**Solution:**
```typescript
// Use valid default coordinates (Ulaanbaatar)
const defaultCenter = { lat: 47.918873, lng: 106.917017 };
const defaultZoom = 15;
```

### Issue: Environment variable is undefined
**Cause:**
- Missing `NEXT_PUBLIC_` prefix
- Dev server not restarted
- `.env.local` not in project root

**Solution:**
1. Ensure variable starts with `NEXT_PUBLIC_`
2. Restart dev server completely
3. Verify `.env.local` is in `/Users/mongoljansabyrjan/myroom/`

---

## Cost Monitoring

### Set Up Budget Alerts
1. Go to **Billing** > **Budgets & alerts**
2. Create budget alert for $50/month
3. Set email notifications at 50%, 90%, 100%

### Monitor Usage
1. Go to **APIs & Services** > **Dashboard**
2. Check **Maps JavaScript API** usage
3. View detailed metrics in **Metrics** tab

### Expected Monthly Costs (Estimate)
- **Small site** (< 1,000 visitors/month): **$0** (within free tier)
- **Medium site** (10,000 visitors/month): **~$10-20**
- **Large site** (100,000 visitors/month): **~$100-200**

---

## Security Best Practices

### ✅ DO:
- ✅ Restrict API key to specific domains
- ✅ Restrict API key to specific APIs
- ✅ Add `.env.local` to `.gitignore` (already done)
- ✅ Use separate API keys for development and production
- ✅ Monitor API usage regularly
- ✅ Set up budget alerts

### ❌ DON'T:
- ❌ Commit API keys to git repository
- ❌ Share API keys publicly
- ❌ Use same API key for multiple projects
- ❌ Leave API key unrestricted

---

## Quick Start Checklist

- [ ] Create Google Cloud project
- [ ] Enable Maps JavaScript API
- [ ] Create API key
- [ ] Add billing account
- [ ] Restrict API key to domains
- [ ] Add API key to `.env.local`
- [ ] Install `@react-google-maps/api` package
- [ ] Restart dev server
- [ ] Test map component
- [ ] Set up cost monitoring

---

## Support & Resources

### Official Documentation
- [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript)
- [@react-google-maps/api Docs](https://react-google-maps-api-docs.netlify.app/)
- [Google Maps Pricing](https://mapsplatform.google.com/pricing/)

### Useful Links
- [Google Cloud Console](https://console.cloud.google.com/)
- [API Key Best Practices](https://developers.google.com/maps/api-security-best-practices)

---

## Notes

- Current API key: `AIzaSyCD-M_S9u_77q8yVKKoAFJMEAIkBrVDdEs`
- Project root: `/Users/mongoljansabyrjan/myroom/`
- Config file: `.env.local`
- Backend API: `https://dev.kacc.mn`

---

**Last Updated:** December 31, 2025
**Author:** Development Team
**Project:** MyRoom Hotel Booking Platform
