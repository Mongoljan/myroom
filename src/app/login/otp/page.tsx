"use client";

import { useState } from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import { CustomerService } from '@/services/customerApi';
import BackButton from '@/components/common/BackButton';

export default function OTPLoginPage() {
  const { t } = useHydratedTranslation();
  const router = useRouter();

  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [expiresIn, setExpiresIn] = useState(0);
  const [isNewCustomer, setIsNewCustomer] = useState(false);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await CustomerService.sendOTP({
        phone,
        first_name: firstName || undefined,
        last_name: lastName || undefined,
      });

      setExpiresIn(response.expires_in_seconds);
      setIsNewCustomer(response.is_new_customer || false);
      setStep('otp');

      // Show OTP in dev mode
      if (response.otp_code) {
        alert(t('AuthOTP.devOtpAlert', { code: response.otp_code }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t('AuthOTP.otpSendError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await CustomerService.verifyOTP({ phone, otp_code: otpCode });
      CustomerService.saveToken(response.token);
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : t('AuthOTP.otpVerifyError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div>
          <h2 className="text-h1 font-bold text-gray-900 dark:text-white text-center mb-2">
            {step === 'phone'
              ? t('AuthOTP.phoneLogin')
              : t('AuthOTP.verifyCode')}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            {step === 'phone'
              ? t('AuthOTP.phoneSubtitle')
              : t('AuthOTP.codeExpires', { minutes: Math.floor(expiresIn / 60) })}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {step === 'phone' ? (
            <form className="space-y-6" onSubmit={handleSendOTP}>
              {/* Phone Number */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('AuthOTP.phoneLabel')} *
                </label>
                <input
                  id="phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder={t('AuthOTP.phonePlaceholder')}
                  disabled={isLoading}
                />
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('AuthOTP.firstNameLabel')}
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('AuthOTP.lastNameLabel')}
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t('AuthOTP.nameHint')}
              </p>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg px-6 py-3 transition-all duration-200 shadow-lg shadow-slate-900/30 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? t('AuthOTP.sendingOTP') : t('AuthOTP.getCode')}
              </button>

              {/* Back to Email Login */}
              <div className="text-center">
                <Link href="/login" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                  {t('AuthOTP.backToEmail')}
                </Link>
              </div>
            </form>
          ) : (
            <form className="space-y-6" onSubmit={handleVerifyOTP}>
              {/* New Customer Notice */}
              {isNewCustomer && (
                <div className="p-4 bg-primary-50 border border-primary-200 rounded-lg">
                  <p className="text-sm text-primary-700">
                    {t('AuthOTP.newAccountCreated')}
                  </p>
                </div>
              )}

              {/* OTP Input */}
              <div>
                <label htmlFor="otpCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('AuthOTP.codeLabel', { phone })}
                </label>
                <input
                  id="otpCode"
                  type="text"
                  required
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 text-center text-2xl tracking-widest"
                  placeholder="000000"
                  maxLength={6}
                  disabled={isLoading}
                />
              </div>

              {/* Verify Button */}
              <button
                type="submit"
                disabled={isLoading || otpCode.length !== 6}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg px-6 py-3 transition-all duration-200 shadow-lg shadow-slate-900/30 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? t('AuthOTP.verifying') : t('AuthOTP.verify')}
              </button>

              <BackButton
                onClick={() => {
                  setStep('phone');
                  setOtpCode('');
                  setError('');
                }}
                labelKey="AuthOTP.back"
                disabled={isLoading}
              />
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
