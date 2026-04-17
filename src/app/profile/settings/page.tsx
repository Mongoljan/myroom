"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useRouter } from 'next/navigation';
import { CustomerService } from '@/services/customerApi';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import { useCustomerSettings } from '@/hooks/useCustomer';
import { Moon, Sun, Save, RefreshCw, CheckCircle } from 'lucide-react';
import { CustomerSettingsUpdateRequest, Currency, Language } from '@/types/customer';

const LANGUAGES: { value: Language; label: string }[] = [
  { value: 'mn', label: 'Mongolia' },
  { value: 'en', label: 'English' },
  { value: 'zh', label: '中文' },
];

const CURRENCIES: { value: Currency; label: string; symbol: string }[] = [
  { value: 'MNT', label: 'Mongolian Tugrik', symbol: '₮' },
  { value: 'USD', label: 'US Dollar', symbol: '$' },
  { value: 'EUR', label: 'Euro', symbol: '€' },
  { value: 'CNY', label: 'Chinese Yuan', symbol: '¥' },
];

export default function SettingsPage() {
  const { token, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t } = useHydratedTranslation();
  const router = useRouter();

  // Settings state from hook
  const { settings, loading, updateSettings: updateSettingsHook } = useCustomerSettings(token || undefined);

  // Local state for editing
  const [localSettings, setLocalSettings] = useState(settings);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string>('');

  // Delete account
  const [deleteStep, setDeleteStep] = useState<'idle' | 'confirm' | 'done'>('idle');
  const [deletePassword, setDeletePassword] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  // Update local settings when hook settings change
  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  // Check for changes
  useEffect(() => {
    const hasChanged = 
      localSettings.currency !== settings.currency ||
      localSettings.language !== settings.language ||
      localSettings.email_booking_confirmed !== settings.email_booking_confirmed ||
      localSettings.email_unsubscribe !== settings.email_unsubscribe ||
      localSettings.notification_enabled !== settings.notification_enabled;

    setHasChanges(hasChanged);
  }, [localSettings, settings]);

  const handleSettingChange = (key: keyof CustomerSettingsUpdateRequest, value: string | boolean) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
    setSaveSuccess(false);
    setSaveError('');
  };

  const handleSave = async () => {
    if (!hasChanges || !token) return;

    setSaving(true);
    setSaveError('');
    try {
      const updates: CustomerSettingsUpdateRequest = {};
      
      if (localSettings.currency !== settings.currency) updates.currency = localSettings.currency;
      if (localSettings.language !== settings.language) updates.language = localSettings.language;
      if (localSettings.email_booking_confirmed !== settings.email_booking_confirmed) updates.email_booking_confirmed = localSettings.email_booking_confirmed;
      if (localSettings.email_unsubscribe !== settings.email_unsubscribe) updates.email_unsubscribe = localSettings.email_unsubscribe;
      if (localSettings.notification_enabled !== settings.notification_enabled) updates.notification_enabled = localSettings.notification_enabled;

      const result = await updateSettingsHook(updates);
      if (result.success) {
        setSaveSuccess(true);
        setHasChanges(false);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setSaveError(result.message);
      }
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!token) return;
    setIsDeleting(true);
    setDeleteError('');
    try {
      await CustomerService.deleteAccount(token);
      await logout();
      router.push('/');
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Failed to delete account');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
      <div className="px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {t('settings.title', 'Settings')}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {t('settings.description', 'Manage your account preferences and settings')}
            </p>
          </div>
          
          {/* Save Button */}
          {hasChanges && (
            <div className="flex items-center gap-3">
              {saveSuccess && (
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">{t('settings.saved', 'Saved!')}</span>
                </div>
              )}
              <button
                onClick={handleSave}
                disabled={saving || !hasChanges}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors font-medium"
              >
                {saving ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    {t('settings.saving', 'Saving...')}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {t('settings.saveChanges', 'Save Changes')}
                  </>
                )}
              </button>
            </div>
          )}
        </div>
        
        {/* Save Error */}
        {saveError && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{saveError}</p>
          </div>
        )}
      </div>

      {/* Language / Currency */}
      <div className="px-6 py-5">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
          {t('settings.languageCurrency', 'Language & Currency')}
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {t('settings.currency', 'Currency')}
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {t('settings.currencyDescription', 'Choose your preferred currency for prices')}
              </p>
            </div>
            <div className="relative">
              <select
                value={localSettings.currency}
                onChange={(e) => handleSettingChange('currency', e.target.value as Currency)}
                className="text-sm text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 pr-10 appearance-none bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition min-w-[140px]"
              >
                {CURRENCIES.map((currency) => (
                  <option key={currency.value} value={currency.value}>
                    {currency.symbol} {currency.value} - {currency.label}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">▾</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {t('settings.language', 'Language')}
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {t('settings.languageDescription', 'Choose your preferred language')}
              </p>
            </div>
            <div className="relative">
              <select
                value={localSettings.language}
                onChange={(e) => handleSettingChange('language', e.target.value as Language)}
                className="text-sm text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 pr-10 appearance-none bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition min-w-[120px]"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">▾</span>
            </div>
          </div>
        </div>
      </div>

      {/* Theme */}
      <div className="px-6 py-5">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
          {t('settings.theme', 'Appearance')}
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {t('settings.darkMode', 'Dark Mode')}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {t('settings.darkModeDesc', 'Switch between light and dark themes')}
            </p>
          </div>
          <button
            onClick={toggleTheme}
            className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 border border-gray-300 dark:border-gray-600"
            aria-label={t('common.toggleTheme', 'Toggle theme')}
          >
            {theme === 'light' ? (
              <Moon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            ) : (
              <Sun className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            )}
          </button>
        </div>
      </div>

      {/* Email Notifications */}
      <div className="px-6 py-5">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
          {t('settings.emailNotifications', 'Email Notifications')}
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                {t('settings.bookingConfirmationEmails', 'Booking Confirmation Emails')}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {t('settings.bookingConfirmationEmailsDesc', 'Receive email confirmations for your bookings')}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={localSettings.email_booking_confirmed}
                onChange={(e) => handleSettingChange('email_booking_confirmed', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                {t('settings.marketingEmails', 'Marketing Emails')}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {t('settings.marketingEmailsDesc', 'Receive promotional offers and updates')}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={!localSettings.email_unsubscribe}
                onChange={(e) => handleSettingChange('email_unsubscribe', !e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Push Notifications */}
      <div className="px-6 py-5">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
          {t('settings.pushNotifications', 'Push Notifications')}
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {t('settings.notifications', 'Notifications')}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              {t('settings.notificationsDesc', 'Enable push notifications for important updates')}
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={localSettings.notification_enabled}
              onChange={(e) => handleSettingChange('notification_enabled', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      {/* Account Management */}
      <div className="px-6 py-5">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
          {t('settings.accountManagement', 'Account Management')}
        </h2>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <h3 className="text-sm font-medium text-red-800 dark:text-red-300 mb-2">
            {t('settings.dangerZone', 'Danger Zone')}
          </h3>
          
          {deleteStep === 'idle' && (
            <div className="space-y-3">
              <p className="text-sm text-red-600 dark:text-red-400">
                {t('settings.deleteAccountWarning', 'Once you delete your account, there is no going back. Please be certain.')}
              </p>
              <button
                onClick={() => setDeleteStep('confirm')}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                {t('settings.deleteAccount', 'Delete Account')}
              </button>
            </div>
          )}

          {deleteStep === 'confirm' && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-red-600 dark:text-red-400 mb-2">
                  {t('settings.confirmDelete', 'Are you absolutely sure? Type your password to confirm:')}
                </p>
                <input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  placeholder={t('settings.passwordPlaceholder', 'Enter your password')}
                  className="w-full px-3 py-2 border border-red-300 dark:border-red-600 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none dark:bg-gray-700 dark:text-gray-200"
                />
              </div>
              
              {deleteError && (
                <p className="text-sm text-red-600 dark:text-red-400">{deleteError}</p>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setDeleteStep('idle');
                    setDeletePassword('');
                    setDeleteError('');
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  {t('common.cancel', 'Cancel')}
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting || !deletePassword}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg transition-colors disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      {t('settings.deleting', 'Deleting...')}
                    </>
                  ) : (
                    t('settings.deleteAccountConfirm', 'Delete My Account')
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}