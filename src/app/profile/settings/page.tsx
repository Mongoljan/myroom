"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import { useCustomerSettings } from '@/hooks/useCustomer';
import { CheckCircle, RefreshCw, AlertCircle, X } from 'lucide-react';
import { CustomerSettingsUpdateRequest, Currency, Language } from '@/types/customer';
import { CustomerService } from '@/services/customerApi';
import { clearSettingsCache } from '@/utils/customerSettings';

// ─── Constants ────────────────────────────────────────────────────────────────

const LANGUAGE_CODES: Language[] = ['mn', 'en', 'zh'];
const CURRENCY_CODES: Currency[] = ['MNT', 'USD', 'EUR', 'CNY'];
const CURRENCY_SYMBOLS: Record<Currency, string> = {
  MNT: '₮',
  USD: '$',
  EUR: '€',
  CNY: '¥',
};

// ─── Delete Account Modal ──────────────────────────────────────────────────────

type ModalState = 'loading' | 'blocked' | 'confirm' | 'deleting' | 'success';

interface DeleteAccountModalProps {
  onClose: () => void;
}

function DeleteAccountModal({ onClose }: DeleteAccountModalProps) {
  const { token, logout } = useAuth();
  const { t } = useHydratedTranslation();
  const router = useRouter();

  const [modalState, setModalState] = useState<ModalState>('loading');
  const [password, setPassword] = useState('');
  const [deleteError, setDeleteError] = useState('');

  // Check for active bookings on open
  // Initial state is already 'loading' — no need to set it again here (would cause cascading renders)
  useEffect(() => {
    if (!token) return;
    Promise.all([
      CustomerService.getBookings(token, 'confirmed'),
      CustomerService.getBookings(token, 'pending'),
    ])
      .then(([confirmedRes, pendingRes]) => {
        const hasActive = confirmedRes.count > 0 || pendingRes.count > 0;
        setModalState(hasActive ? 'blocked' : 'confirm');
      })
      .catch(() => {
        // On network error fall through to confirm — backend will guard it
        setModalState('confirm');
      });
  }, [token]);

  // Lock background scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleDelete = async () => {
    if (!token || !password.trim()) return;
    setModalState('deleting');
    setDeleteError('');
    try {
      await CustomerService.deleteAccount(token);
      setModalState('success');
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : t('settings.deleteFailed', 'Failed to delete account')
      );
      setModalState('confirm');
    }
  };

  const handleSuccessClose = async () => {
    await logout();
    router.push('/');
  };

  // Backdrop click: success state must go through handleSuccessClose (logout + redirect)
  // not plain onClose, so the account is properly cleaned up.
  const handleBackdropClick = () => {
    if (modalState === 'deleting') return;
    if (modalState === 'success') {
      handleSuccessClose();
    } else {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
      onClick={handleBackdropClick}
    >
      <div
        className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg mx-auto overflow-hidden "
        onClick={(e) => e.stopPropagation()}
      >

        {/*LOADING*/}
        {modalState === 'loading' && (
          <div className="flex flex-col items-center justify-center py-14 px-8 gap-4">
            <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('settings.deleteModal.checkingBookings', 'Checking bookings...')}
            </p>
          </div>
        )}

        {/*BLOCKED*/}
        {modalState === 'blocked' && (
          <div className="flex flex-col items-center text-center px-8 py-10 gap-5">
            <div className="flex items-center justify-center w-16 h-16">
              <svg viewBox="0 0 64 64" className="w-16 h-16" fill="none">
                <polygon points="32,4 58,18 58,46 32,60 6,46 6,18" fill="#ef4444" />
                <text x="32" y="44" textAnchor="middle" fontSize="28" fontWeight="bold" fill="white">!</text>
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {t('settings.deleteModal.blockedTitle', 'Cannot delete account.')}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {t('settings.deleteModal.blockedDesc', 'You have active bookings. You can delete your account after they are completed or cancelled.')}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-xl py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              {t('settings.deleteModal.close', 'Close')}
            </button>
          </div>
        )}

        {/*CONFIRM (password entry)*/}
        {(modalState === 'confirm' || modalState === 'deleting') && (
          <div className="px-7 py-8">
            <button
              onClick={onClose}
              disabled={modalState === 'deleting'}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors disabled:opacity-40"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Red hexagon */}
            <div className="flex justify-center mb-5">
              <svg viewBox="0 0 64 64" className="w-14 h-14" fill="none">
                <polygon points="32,4 58,18 58,46 32,60 6,46 6,18" fill="#ef4444" />
                <text x="32" y="44" textAnchor="middle" fontSize="28" fontWeight="bold" fill="white">!</text>
              </svg>
            </div>

            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 text-center mb-2">
              {t('settings.deleteModal.confirmTitle', 'Delete Account')}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-8">
              {t('settings.deleteModal.confirmDesc', 'Please enter your password to confirm account deletion.')}
            </p>

            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              {t('settings.deleteModal.passwordLabel', 'Password')}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setDeleteError(''); }}
              placeholder={t('settings.deleteModal.passwordPlaceholder', 'Enter password')}
              disabled={modalState === 'deleting'}
              className="w-full px-3.5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-red-400 focus:border-transparent outline-none dark:bg-gray-800 dark:text-gray-100 disabled:opacity-50 transition"
            />

            {deleteError && (
              <p className="mt-2 text-xs text-red-500">{deleteError}</p>
            )}

            <div className="flex gap-15 mt-12">
              <button
                onClick={onClose}
                disabled={modalState === 'deleting'}
                className="flex-1 border border-gray-300 dark:border-gray-600 rounded-xl py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-40"
              >
                {t('settings.deleteModal.cancelButton', 'No, keep my account')}
              </button>
              <button
                onClick={handleDelete}
                disabled={modalState === 'deleting' || !password.trim()}
                className="flex-1 bg-gray-700 hover:bg-gray-900 dark:bg-gray-600 dark:hover:bg-gray-500 disabled:opacity-40 text-white rounded-xl py-2.5 text-sm font-semibold transition-colors flex items-center justify-center gap-2"
              >
                {modalState === 'deleting' ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    {t('settings.deleting', 'Deleting...')}
                  </>
                ) : (
                  t('settings.deleteModal.confirmButton', 'Confirm')
                )}
              </button>
            </div>
          </div>
        )}

        {/*SUCCESS */}
        {modalState === 'success' && (
          <div className="flex flex-col items-center text-center px-8 py-10 gap-5">
            <div className="flex items-center justify-center w-16 h-16 bg-green-500 rounded-full shadow-lg">
              <svg
                viewBox="0 0 24 24"
                className="w-9 h-9 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {t('settings.deleteModal.successTitle', 'Successfully deleted.')}
            </h2>
            <button
              onClick={handleSuccessClose}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-xl py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              {t('settings.deleteModal.successClose', 'Close')}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

// ─── Settings Page ─────────────────────────────────────────────────────────────

type AutoSaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export default function SettingsPage() {
  const { token } = useAuth();
  const { t, i18n } = useHydratedTranslation();

  // Clear cache on every mount so we always get fresh data from the server.
  // This is important so that language changes made via the header switcher
  // (which now also writes to the backend) are immediately visible here.
  useEffect(() => {
    clearSettingsCache();
  }, []);

  const { settings, loading, updateSettings: updateSettingsHook } = useCustomerSettings(token || undefined);

  const [localSettings, setLocalSettings] = useState(settings);
  const [autoSaveStatus, setAutoSaveStatus] = useState<AutoSaveStatus>('idle');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Debounce timer ref
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Tracks status-reset timers so they can be cancelled on unmount
  const statusTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Tracks the last state successfully confirmed by the server
  const committedRef = useRef(settings);
  // Detects the loading true→false transition so we only sync real server data once
  const prevLoadingRef = useRef(false);
  // Reset to false on every mount so re-navigation to this page always re-syncs from server
  const initializedRef = useRef(false);

  // Sync localSettings from server ONCE — only when the fetch finishes for the first time.
  // We detect this by watching for loading transitioning true → false.
  // This prevents overwriting mid-edit state on every save response.
  useEffect(() => {
    if (prevLoadingRef.current && !loading && !initializedRef.current) {
      initializedRef.current = true;
      setLocalSettings(settings);
      committedRef.current = settings;
    }
    prevLoadingRef.current = loading;
  }, [loading, settings]);

  // Apply language change in the UI as soon as real settings arrive
  useEffect(() => {
    if (settings.language && i18n.language !== settings.language) {
      i18n.changeLanguage(settings.language);
    }
  }, [settings.language, i18n]);

  // Auto-save: diff against committed state then PATCH
  const triggerAutoSave = useCallback(
    (next: typeof settings) => {
      if (!token) return;

      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);

      saveTimerRef.current = setTimeout(async () => {
        const committed = committedRef.current;
        const updates: CustomerSettingsUpdateRequest = {};

        if (next.currency !== committed.currency) updates.currency = next.currency;
        if (next.language !== committed.language) updates.language = next.language;
        if (next.email_booking_confirmed !== committed.email_booking_confirmed)
          updates.email_booking_confirmed = next.email_booking_confirmed;
        if (next.email_unsubscribe !== committed.email_unsubscribe)
          updates.email_unsubscribe = next.email_unsubscribe;
        if (next.notification_enabled !== committed.notification_enabled)
          updates.notification_enabled = next.notification_enabled;

        if (Object.keys(updates).length === 0) return;

        setAutoSaveStatus('saving');
        try {
          const result = await updateSettingsHook(updates);
          // result can be undefined if token was missing at call time
          if (result && result.success) {
            committedRef.current = next;
            setAutoSaveStatus('saved');
            if (statusTimerRef.current) clearTimeout(statusTimerRef.current);
            statusTimerRef.current = setTimeout(() => setAutoSaveStatus('idle'), 2500);
          } else {
            setAutoSaveStatus('error');
            if (statusTimerRef.current) clearTimeout(statusTimerRef.current);
            statusTimerRef.current = setTimeout(() => setAutoSaveStatus('idle'), 3500);
          }
        } catch {
          setAutoSaveStatus('error');
          if (statusTimerRef.current) clearTimeout(statusTimerRef.current);
          statusTimerRef.current = setTimeout(() => setAutoSaveStatus('idle'), 3500);
        }
      }, 300);
    },
    [token, updateSettingsHook]
  );

  const handleSettingChange = (
    key: keyof CustomerSettingsUpdateRequest,
    value: string | boolean
  ) => {
    const next = { ...localSettings, [key]: value };
    setLocalSettings(next);
    if (key === 'language' && typeof value === 'string') i18n.changeLanguage(value);
    triggerAutoSave(next);
  };

  // Cleanup both timers on unmount
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      if (statusTimerRef.current) clearTimeout(statusTimerRef.current);
    };
  }, []);

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
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">

        {/* Header */}
        <div className="px-6 py-5">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {t('settings.title')}
            </h1>

            {/* Auto-save status indicator */}
            <div className="h-6 flex items-center">
              {autoSaveStatus === 'saving' && (
                <span className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  {t('settings.autoSaving', 'Saving...')}
                </span>
              )}
              {autoSaveStatus === 'saved' && (
                <span className="flex items-center gap-1.5 text-xs text-green-500">
                  <CheckCircle className="w-3.5 h-3.5" />
                  {t('settings.autoSaved', 'Saved')}
                </span>
              )}
              {autoSaveStatus === 'error' && (
                <span className="flex items-center gap-1.5 text-xs text-red-500">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {t('settings.autoSaveError', 'Failed to save')}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Language & Currency */}
        <div className="px-6 py-5">
          <h2 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-4">
            {t('settings.languageCurrency')}
          </h2>
          <div className="space-y-4">
            <div className="h-px bg-gray-200 dark:bg-gray-700" />
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {t('settings.currency')}
              </label>
              <div className="relative ml-auto flex items-center text-sm text-gray-800 dark:text-gray-200">
                <span className="pr-5 font-normal">
                  {CURRENCY_SYMBOLS[localSettings.currency]} {localSettings.currency} - {t(`settings.currencies.${localSettings.currency}`)}
                </span>
                <select
                  value={localSettings.currency}
                  onChange={(e) => handleSettingChange('currency', e.target.value as Currency)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer text-sm"
                >
                  {CURRENCY_CODES.map((currency) => (
                    <option key={currency} value={currency}>
                      {CURRENCY_SYMBOLS[currency]} {currency} - {t(`settings.currencies.${currency}`)}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 text-sm">▾</span>
              </div>
            </div>
            <div className="h-px bg-gray-200 dark:bg-gray-700" />
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {t('settings.language')}
              </label>
              <div className="relative ml-auto flex items-center text-sm text-gray-800 dark:text-gray-200">
                <span className="pr-5 font-normal">
                  {t(`settings.languages.${localSettings.language}`)}
                </span>
                <select
                  value={localSettings.language}
                  onChange={(e) => handleSettingChange('language', e.target.value as Language)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer text-sm"
                >
                  {LANGUAGE_CODES.map((lang) => (
                    <option key={lang} value={lang}>
                      {t(`settings.languages.${lang}`)}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 text-sm">▾</span>
              </div>
            </div>
            <div className="h-px bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>

        {/* Email Settings */}
        <div className="px-6 py-5">
          <h2 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-4">
            {t('settings.emailSettings')}
          </h2>
          <div className="space-y-4">
            <div className="h-px bg-gray-200 dark:bg-gray-700" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {t('settings.bookingConfirmationEmails')}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {t('settings.bookingConfirmationEmailsDesc')}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer-none"> {/* Changed cursor */}
                <input
                  type="checkbox"
                  checked={localSettings.email_booking_confirmed}
                  onChange={(e) => handleSettingChange('email_booking_confirmed', e.target.checked)}
                  className="sr-only peer"
                  disabled
                />
                <div className="
                  w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600
                  peer-disabled:opacity-50 peer-disabled:cursor-not-allowed 
                "></div>
              </label>
            </div>
            <div className="h-px bg-gray-200 dark:bg-gray-700" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {t('settings.reviewEmails')}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {t('settings.reviewEmailsDesc')}
                </p>
              </div>
            </div>
            <div className="h-px bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>

        {/* Notifications */}
        <div className="px-6 py-5">
          <h2 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-4">
            {t('settings.notifications')}
          </h2>
          <div className="space-y-4">
            <div className="h-px bg-gray-200 dark:bg-gray-700" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {t('settings.notificationReceiveDesc')}
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
            <div className="h-px bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>

        {/* Delete Account */}
        <div className="px-6 py-5">
          <h2 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-4">
            {t('settings.deleteAccount')}
          </h2>
          <div className="h-px bg-gray-200 dark:bg-gray-700 mb-4" />
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('settings.deleteAccountWarning')}
            </p>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="ml-6 shrink-0 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
            >
              {t('settings.deleteAccount')}
            </button>
          </div>
        </div>

      </div>

      {showDeleteModal && (
        <DeleteAccountModal onClose={() => setShowDeleteModal(false)} />
      )}
    </>
  );
}
