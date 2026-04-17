# Hotel API Integration

This document describes the integration of wishlist and customer settings APIs from the Hotel_front (reception/admin) project into the myroom (client booking) project.

## Overview

The following APIs have been integrated from the Hotel_front project:

### Wishlist APIs
- `GET /api/customers/wishlist/` - Get user's saved hotels
- `POST /api/customers/wishlist/` - Save a hotel to wishlist
- `DELETE /api/customers/wishlist/{hotel_id}/` - Remove hotel from wishlist

### Customer Settings APIs
- `GET /api/customers/settings/` - Get user settings
- `PATCH /api/customers/settings/` - Update user settings

## Files Added/Modified

### Type Definitions
**File:** `src/types/customer.ts`

Added new TypeScript interfaces:
- `WishlistCreateRequest`
- `WishlistListResponse`
- `WishlistCreateResponse`
- `HotelDetail`
- `WishlistItem`
- `CustomerSettingsResponse`
- `CustomerSettingsUpdateRequest`
- `Currency` and `Language` types

### Service Layer
**File:** `src/services/customerApi.ts`

Extended `CustomerService` with new methods:
- `getWishlist(token: string)`
- `addToWishlist(token: string, data: WishlistCreateRequest)`
- `removeFromWishlist(token: string, hotelId: number)`
- `getSettings(token: string)`
- `updateSettings(token: string, data: CustomerSettingsUpdateRequest)`

### Utility Functions
**File:** `src/utils/wishlist.ts`

Wishlist management utilities:
- `getWishlist()` - Get wishlist with caching
- `addToWishlist()` - Add hotel to wishlist
- `removeFromWishlist()` - Remove hotel from wishlist
- `toggleWishlist()` - Toggle wishlist status
- `isHotelInWishlist()` - Check if hotel is in wishlist
- `getWishlistCount()` - Get wishlist count

**File:** `src/utils/customerSettings.ts`

Settings management utilities:
- `getCustomerSettings()` - Get settings with caching
- `updateCustomerSettings()` - Update settings
- `toggleBooleanSetting()` - Toggle boolean settings
- `formatCurrency()` - Format currency based on user preference
- `convertCurrency()` - Convert between currencies

### React Hooks
**File:** `src/hooks/useCustomer.ts`

Custom React hooks for easy integration:
- `useWishlist(token)` - Complete wishlist management
- `useCustomerSettings(token)` - Settings management
- `useIsInWishlist(hotelId, token)` - Check if hotel is in wishlist
- `useAuthenticatedUser()` - Authentication state management

### Demo Component
**File:** `src/components/demo/CustomerAPIDemo.tsx`

Example component showing how to use all the new APIs.

## Usage Examples

### Basic Wishlist Management

```typescript
import { CustomerService } from '@/services/customerApi';

// Get user's wishlist
const token = 'user_auth_token';
const wishlist = await CustomerService.getWishlist(token);

// Add hotel to wishlist
await CustomerService.addToWishlist(token, { hotel_id: 123 });

// Remove hotel from wishlist
await CustomerService.removeFromWishlist(token, 123);
```

### Using React Hooks

```typescript
import { useWishlist, useCustomerSettings } from '@/hooks/useCustomer';

function MyComponent() {
  const { wishlist, addHotel, removeHotel } = useWishlist(token);
  const { settings, updateSettings } = useCustomerSettings(token);

  const handleAddToWishlist = async (hotelId: number) => {
    const result = await addHotel(hotelId);
    if (result.success) {
      console.log('Added to wishlist:', result.message);
    }
  };

  const handleUpdateCurrency = async (currency: Currency) => {
    await updateSettings({ currency });
  };

  return (
    <div>
      <h3>Wishlist ({wishlist.length} hotels)</h3>
      {wishlist.map(item => (
        <div key={item.id}>
          {item.hotel.PropertyName}
          <button onClick={() => removeHotel(item.hotel.id)}>
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}
```

### Utility Functions

```typescript
import { 
  isHotelInWishlist, 
  formatCurrency, 
  getCustomerSettings 
} from '@/utils/wishlist';
import { formatCurrency } from '@/utils/customerSettings';

// Check if hotel is in wishlist
const inWishlist = await isHotelInWishlist(123, token);

// Format price according to user preferences
const settings = await getCustomerSettings(token);
const formattedPrice = formatCurrency(25000, settings.currency);
```

## API Authentication

All customer APIs require authentication using a token parameter:
- Token can be passed as query parameter: `?token=YOUR_TOKEN`
- APIs return 401 status for invalid/expired tokens
- Use `CustomerService.saveToken()` and `CustomerService.getToken()` for token management

## Error Handling

The service layer includes comprehensive error handling:
- Network errors are caught and re-thrown with meaningful messages
- API errors include specific error messages from the backend
- Validation errors are properly formatted
- 401 errors automatically clear saved tokens

## Caching Strategy

Both wishlist and settings data are cached to improve performance:
- **Wishlist**: 5 minute cache TTL
- **Settings**: 10 minute cache TTL
- Cache is automatically cleared when data is updated
- localStorage backup for offline functionality

## Currency Support

Supported currencies:
- `MNT` - Mongolian Tugrik (₮)
- `USD` - US Dollar ($)
- `EUR` - Euro (€)
- `CNY` - Chinese Yuan (¥)

## Language Support

Supported languages:
- `mn` - Mongolian
- `en` - English
- `zh` - Chinese

## Testing the Integration

1. Use the demo component at `src/components/demo/CustomerAPIDemo.tsx`
2. Ensure user is authenticated with a valid token
3. Test wishlist operations (add/remove/toggle)
4. Test settings updates (currency/language/notifications)

## Integration Notes

- APIs follow the same authentication pattern as existing customer APIs
- All new endpoints use the base URL: `https://dev.kacc.mn/api/customers`
- Error schemas match existing customer API patterns
- TypeScript interfaces ensure type safety across the application

## Future Enhancements

Potential improvements:
- Real-time sync for wishlist changes across devices
- Offline support for wishlist operations
- Push notifications for wishlist hotel price changes
- Advanced currency conversion with real exchange rates
- Bulk wishlist operations
- Wishlist sharing functionality