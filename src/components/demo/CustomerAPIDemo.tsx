/**
 * Example component demonstrating how to use the integrated wishlist and settings APIs
 */

'use client';

import React, { useState } from 'react';
import { useWishlist, useCustomerSettings, useAuthenticatedUser } from '@/hooks/useCustomer';
import { Currency, Language } from '@/types/customer';

export default function CustomerAPIDemo() {
  const { token, isAuthenticated } = useAuthenticatedUser();
  const { wishlist, loading: wishlistLoading, addHotel, removeHotel, toggleHotel } = useWishlist(token || undefined);
  const { settings, loading: settingsLoading, updateSettings, toggleSetting } = useCustomerSettings(token || undefined);
  
  const [testHotelId, setTestHotelId] = useState('');
  const [message, setMessage] = useState('');

  if (!isAuthenticated) {
    return (
      <div className="p-6 bg-gray-100 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Customer API Demo</h2>
        <p className="text-gray-600">Please log in to test the wishlist and settings APIs.</p>
      </div>
    );
  }

  const handleAddToWishlist = async () => {
    const hotelId = parseInt(testHotelId);
    if (!hotelId) return;

    const result = await addHotel(hotelId);
    setMessage(result.message);
  };

  const handleToggleWishlist = async () => {
    const hotelId = parseInt(testHotelId);
    if (!hotelId) return;

    const result = await toggleHotel(hotelId);
    setMessage(result.message);
  };

  const handleCurrencyChange = async (currency: Currency) => {
    const result = await updateSettings({ currency });
    setMessage(result.message);
  };

  const handleLanguageChange = async (language: Language) => {
    const result = await updateSettings({ language });
    setMessage(result.message);
  };

  const handleToggleNotifications = async () => {
    const result = await toggleSetting('notification_enabled');
    setMessage(result.message);
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Customer API Integration Demo</h2>
      
      {message && (
        <div className="p-4 bg-blue-100 border border-blue-300 rounded-lg">
          <p>{message}</p>
        </div>
      )}

      {/* Wishlist Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Wishlist Management</h3>
        
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Hotel ID"
              value={testHotelId}
              onChange={(e) => setTestHotelId(e.target.value)}
              className="px-3 py-2 border rounded-md"
            />
            <button
              onClick={handleAddToWishlist}
              disabled={wishlistLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              Add to Wishlist
            </button>
            <button
              onClick={handleToggleWishlist}
              disabled={wishlistLoading}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50"
            >
              Toggle Wishlist
            </button>
          </div>

          <div>
            <h4 className="font-medium mb-2">Saved Hotels ({wishlist.length})</h4>
            {wishlistLoading ? (
              <p>Loading...</p>
            ) : (
              <div className="space-y-2">
                {wishlist.map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <div>
                      <h5 className="font-medium">{item.hotel.PropertyName}</h5>
                      <p className="text-sm text-gray-600">
                        {item.hotel.location ? `${item.hotel.location.province_city || ''}, ${item.hotel.location.soum || ''}`.replace(/, ?$/, '') : 'Location not available'}
                      </p>
                    </div>
                    <button
                      onClick={() => removeHotel(item.hotel.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                {wishlist.length === 0 && (
                  <p className="text-gray-500">No hotels in wishlist</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Settings Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Customer Settings</h3>
        
        {settingsLoading ? (
          <p>Loading settings...</p>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Currency</label>
              <div className="flex gap-2">
                {(['MNT', 'USD', 'EUR', 'CNY'] as Currency[]).map((currency) => (
                  <button
                    key={currency}
                    onClick={() => handleCurrencyChange(currency)}
                    className={`px-3 py-2 rounded border ${
                      settings.currency === currency
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {currency}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Language</label>
              <div className="flex gap-2">
                {([
                  { code: 'mn', name: 'Монгол' },
                  { code: 'en', name: 'English' },
                  { code: 'zh', name: '中文' }
                ] as Array<{code: Language, name: string}>).map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`px-3 py-2 rounded border ${
                      settings.language === lang.code
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Notification Settings</h4>
              
              <div className="flex items-center justify-between">
                <span>Email booking confirmations</span>
                <button
                  onClick={() => toggleSetting('email_booking_confirmed')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.email_booking_confirmed ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.email_booking_confirmed ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span>Marketing emails</span>
                <button
                  onClick={() => toggleSetting('email_unsubscribe')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    !settings.email_unsubscribe ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      !settings.email_unsubscribe ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span>Push notifications</span>
                <button
                  onClick={handleToggleNotifications}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.notification_enabled ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.notification_enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-medium mb-2">Current Settings</h4>
              <pre className="text-sm bg-gray-100 p-2 rounded overflow-auto">
                {JSON.stringify(settings, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}