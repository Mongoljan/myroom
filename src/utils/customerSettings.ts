/**
 * Customer settings utility functions
 */

import { CustomerService } from '@/services/customerApi';
import { 
  CustomerSettingsResponse, 
  CustomerSettingsUpdateRequest, 
  Currency, 
  Language 
} from '@/types/customer';

// Cache for settings data
let settingsCache: CustomerSettingsResponse | null = null;
let cacheExpiry: number | null = null;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

/**
 * Clear the settings cache
 */
export const clearSettingsCache = (): void => {
  settingsCache = null;
  cacheExpiry = null;
};

/**
 * Get default customer settings
 */
export const getDefaultSettings = (): CustomerSettingsResponse => {
  return {
    currency: 'MNT',
    language: 'mn',
    email_booking_confirmed: true,
    email_unsubscribe: false,
    notification_enabled: true,
    updated_at: new Date().toISOString()
  };
};

/**
 * Get user settings with caching
 */
export const getCustomerSettings = async (token: string): Promise<CustomerSettingsResponse> => {
  // Check cache first
  if (settingsCache && cacheExpiry && Date.now() < cacheExpiry) {
    return settingsCache;
  }

  try {
    const settings = await CustomerService.getSettings(token);
    settingsCache = settings;
    cacheExpiry = Date.now() + CACHE_DURATION;
    return settings;
  } catch (error) {
    console.error('Error fetching customer settings:', error);
    
    // Return cached data if available, otherwise return defaults
    return settingsCache || getDefaultSettings();
  }
};

/**
 * Update customer settings
 */
export const updateCustomerSettings = async (
  token: string, 
  updates: CustomerSettingsUpdateRequest
): Promise<{ success: boolean; message: string; settings?: CustomerSettingsResponse }> => {
  try {
    const response = await CustomerService.updateSettings(token, updates);
    
    // Update cache with new settings
    settingsCache = response.settings;
    cacheExpiry = Date.now() + CACHE_DURATION;
    
    // Also save to localStorage as backup
    saveSettingsToStorage(response.settings);
    
    return {
      success: true,
      message: response.message,
      settings: response.settings
    };
  } catch (error) {
    console.error('Error updating customer settings:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to update settings';
    return {
      success: false,
      message: errorMessage
    };
  }
};

/**
 * Currency formatting utilities
 */
export const CURRENCY_CONFIG = {
  MNT: { symbol: '₮', name: 'Төгрөг' },
  USD: { symbol: '$', name: 'Доллар' },
  EUR: { symbol: '€', name: 'Евро' },
  CNY: { symbol: '¥', name: 'Юань' }
} as const;

/**
 * Language configuration
 */
export const LANGUAGE_CONFIG = {
  mn: { name: 'Монгол', nativeName: 'Монгол' },
  en: { name: 'English', nativeName: 'English' },
  zh: { name: 'Chinese', nativeName: '中文' }
} as const;

/**
 * Format currency amount using user's preferred currency
 */
export const formatCurrency = (
  amount: number, 
  currency: Currency = 'MNT', 
  locale: string = 'mn-MN'
): string => {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    // Fallback formatting
    const config = CURRENCY_CONFIG[currency];
    return `${config.symbol}${amount.toLocaleString()}`;
  }
};

/**
 * Get currency symbol
 */
export const getCurrencySymbol = (currency: Currency): string => {
  return CURRENCY_CONFIG[currency]?.symbol || '₮';
};

/**
 * Get currency name
 */
export const getCurrencyName = (currency: Currency): string => {
  return CURRENCY_CONFIG[currency]?.name || 'Төгрөг';
};

/**
 * Get language name
 */
export const getLanguageName = (language: Language): string => {
  return LANGUAGE_CONFIG[language]?.name || 'Монгол';
};

/**
 * Convert currency between different types
 * Note: This is a placeholder - in production you'll want real exchange rates
 */
export const convertCurrency = (
  amount: number, 
  fromCurrency: Currency, 
  toCurrency: Currency
): number => {
  if (fromCurrency === toCurrency) return amount;
  
  // Mock exchange rates - replace with real API
  const exchangeRates: Record<Currency, Record<Currency, number>> = {
    MNT: { USD: 0.00036, EUR: 0.00033, CNY: 0.0025, MNT: 1 },
    USD: { MNT: 2800, EUR: 0.92, CNY: 7.2, USD: 1 },
    EUR: { MNT: 3050, USD: 1.09, CNY: 7.85, EUR: 1 },
    CNY: { MNT: 390, USD: 0.14, EUR: 0.127, CNY: 1 }
  };
  
  return Math.round(amount * (exchangeRates[fromCurrency]?.[toCurrency] || 1) * 100) / 100;
};

/**
 * Update specific setting
 */
export const updateSingleSetting = async <K extends keyof CustomerSettingsUpdateRequest>(
  token: string,
  key: K,
  value: CustomerSettingsUpdateRequest[K]
): Promise<{ success: boolean; message: string }> => {
  const updates = { [key]: value } as CustomerSettingsUpdateRequest;
  const result = await updateCustomerSettings(token, updates);
  
  return {
    success: result.success,
    message: result.message
  };
};

/**
 * Toggle a boolean setting
 */
export const toggleBooleanSetting = async (
  token: string,
  key: 'email_booking_confirmed' | 'email_unsubscribe' | 'notification_enabled'
): Promise<{ success: boolean; message: string; newValue?: boolean }> => {
  try {
    const currentSettings = await getCustomerSettings(token);
    const newValue = !currentSettings[key];
    
    const result = await updateSingleSetting(token, key, newValue);
    
    return {
      success: result.success,
      message: result.message,
      newValue: result.success ? newValue : undefined
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to toggle setting'
    };
  }
};

/**
 * Local storage keys for settings functionality
 */
export const SETTINGS_STORAGE_KEYS = {
  CACHE: 'customer_settings_cache',
  CACHE_EXPIRY: 'customer_settings_cache_expiry',
  BACKUP: 'customer_settings_backup'
} as const;

/**
 * Save settings to localStorage as backup
 */
export const saveSettingsToStorage = (settings: CustomerSettingsResponse): void => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEYS.CACHE, JSON.stringify(settings));
      localStorage.setItem(SETTINGS_STORAGE_KEYS.CACHE_EXPIRY, Date.now().toString());
    } catch (error) {
      console.warn('Failed to save settings to localStorage:', error);
    }
  }
};

/**
 * Load settings from localStorage
 */
export const loadSettingsFromStorage = (): CustomerSettingsResponse | null => {
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(SETTINGS_STORAGE_KEYS.CACHE);
      const expiry = localStorage.getItem(SETTINGS_STORAGE_KEYS.CACHE_EXPIRY);
      
      if (cached && expiry && Date.now() - parseInt(expiry) < CACHE_DURATION) {
        return JSON.parse(cached);
      }
    } catch (error) {
      console.warn('Failed to load settings from localStorage:', error);
    }
  }
  return null;
};

/**
 * Get user's preferred locale based on settings
 */
export const getUserLocale = (settings: CustomerSettingsResponse): string => {
  const localeMap: Record<Language, string> = {
    mn: 'mn-MN',
    en: 'en-US',
    zh: 'zh-CN'
  };
  
  return localeMap[settings.language] || 'mn-MN';
};

/**
 * Check if settings are valid
 */
export const validateSettings = (settings: CustomerSettingsUpdateRequest): string[] => {
  const errors: string[] = [];
  
  if (settings.currency && !Object.keys(CURRENCY_CONFIG).includes(settings.currency)) {
    errors.push('Invalid currency selection');
  }
  
  if (settings.language && !Object.keys(LANGUAGE_CONFIG).includes(settings.language)) {
    errors.push('Invalid language selection');
  }
  
  return errors;
};