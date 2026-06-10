"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { CircleCheck, CircleX } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { CustomerService } from '@/services/customerApi';
import BackButton from '@/components/common/BackButton';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';

type Step = 'view' | 'enter_phone' | 'verify_otp';

const OTP_EXPIRY = 5 * 60;

export default function PhonePage() {
  const { t } = useHydratedTranslation();
  const { user, refreshProfile } = useAuth();

  const [step, setStep] = useState<Step>('view');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isChangingPhone, setIsChangingPhone] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startCountdown = useCallback((seconds: number) => {
    setCountdown(seconds);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const formatCountdown = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  const sendOtpToPhone = async (targetPhone: string) => {
    const cleaned = targetPhone.replace(/\D/g, '');
    if (cleaned.length < 8) {
      setError(t('profilePhone.invalidNumber'));
      return;
    }

    setError('');
    setSuccess('');
    setIsSending(true);
    try {
      const res = await CustomerService.sendOTP({ phone: cleaned });
      setPhone(cleaned);
      startCountdown(res.expires_in_seconds ?? OTP_EXPIRY);
      setStep('verify_otp');

      if (res.otp_code) {
        alert(t('AuthOTP.devOtpAlert', { code: res.otp_code }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t('profilePhone.error'));
    } finally {
      setIsSending(false);
    }
  };

  const handleSendOtp = async () => {
    if (!user?.phone) {
      setIsChangingPhone(true);
    }
    await sendOtpToPhone(phone);
  };

  const handleVerifyExistingPhone = async () => {
    if (!user?.phone) return;
    setIsChangingPhone(false);
    await sendOtpToPhone(user.phone);
  };

  const handleStartChangePhone = () => {
    setIsChangingPhone(true);
    setPhone('');
    setOtp('');
    setError('');
    setSuccess('');
    setStep('enter_phone');
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedPhone = phone.replace(/\D/g, '');
    if (otp.length < 6) return;

    setError('');
    setIsVerifying(true);
    try {
      const response = await CustomerService.verifyOTP({
        phone: cleanedPhone,
        otp_code: otp,
      });
      await refreshProfile(response.token);
      setSuccess(
        isChangingPhone
          ? t('profilePhone.changeSuccess')
          : t('profilePhone.verifySuccess')
      );
      setStep('view');
      setOtp('');
      setPhone('');
      setIsChangingPhone(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('profilePhone.invalidOtp'));
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0 || !phone) return;
    await sendOtpToPhone(phone);
  };

  if (!user) return null;

  const displayPhone = user.phone || phone;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8">
      <div className="mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
        <h1 className="text-h2 font-semibold text-gray-900 dark:text-white">{t('profilePhone.title')}</h1>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-600">
          {success}
        </div>
      )}

      {step === 'view' && user.phone && (
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {user.is_phone_verified ? t('profilePhone.verified') : t('profilePhone.notverified')}
          </p>
          <div className="flex items-center gap-3">
            <div className="relative max-w-xs w-full">
              <input
                type="text"
                value={user.phone}
                readOnly
                className="w-full px-3.5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 pr-10"
              />
              {user.is_phone_verified ? (
                <CircleCheck
                  size={18}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500"
                />
              ) : (
                <CircleX
                  size={18}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500"
                />
              )}
            </div>
            {!user.is_phone_verified ? (
              <button
                onClick={handleVerifyExistingPhone}
                disabled={isSending}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition disabled:opacity-50 whitespace-nowrap"
              >
                {isSending ? t('profilePhone.sending') : t('profilePhone.verifyPhone')}
              </button>
            ) : (
              <button
                onClick={handleStartChangePhone}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition whitespace-nowrap"
              >
                {t('profilePhone.changePhone')}
              </button>
            )}
          </div>
        </div>
      )}

      {step === 'view' && !user.phone && (
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t('profilePhone.enterNewPhone')}</p>
          <div className="flex items-center gap-3 max-w-md">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="____-____"
              className="flex-1 px-3.5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-gray-100 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition tracking-wider"
            />
            <button
              onClick={handleSendOtp}
              disabled={isSending}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition disabled:opacity-50 whitespace-nowrap"
            >
              {isSending ? t('profilePhone.sending') : t('profilePhone.getCode')}
            </button>
          </div>
        </div>
      )}

      {step === 'enter_phone' && (
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t('profilePhone.enterNewPhone')}</p>
          <div className="flex items-center gap-3 max-w-md">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="____-____"
              className="flex-1 px-3.5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-gray-100 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition tracking-wider"
            />
            <button
              onClick={handleSendOtp}
              disabled={isSending}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition disabled:opacity-50 whitespace-nowrap"
            >
              {isSending ? t('profilePhone.sending') : t('profilePhone.getCode')}
            </button>
          </div>
          <BackButton
            onClick={() => {
              setStep('view');
              setPhone('');
              setError('');
            }}
            className="mt-3"
          />
        </div>
      )}

      {step === 'verify_otp' && (
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {t('profilePhone.otpHint')}
          </p>
          <form onSubmit={handleVerify}>
            <div className="flex items-center gap-3 flex-wrap max-w-md">
              <input
                type="text"
                value={phone || displayPhone}
                readOnly
                className="w-36 px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700"
              />
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder={t('ProfileEmail.otpPlaceholder', 'OTP код')}
                maxLength={6}
                inputMode="numeric"
                className="flex-1 min-w-[120px] px-3.5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-gray-100 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition tracking-widest text-center"
              />
              <button
                type="submit"
                disabled={isVerifying || otp.length < 6}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition disabled:opacity-50 whitespace-nowrap"
              >
                {isVerifying ? t('profilePhone.verifying') : t('profilePhone.verify')}
              </button>
            </div>

            <div className="mt-3 flex items-center gap-3">
              {countdown > 0 && (
                <span className="text-sm font-medium text-blue-600">
                  {formatCountdown(countdown)}
                </span>
              )}
              <button
                type="button"
                onClick={handleResend}
                disabled={countdown > 0}
                className={`text-sm transition ${
                  countdown > 0
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {t('profilePhone.resend')}
              </button>
            </div>
          </form>
          <BackButton
            onClick={() => {
              setStep('view');
              setOtp('');
              setPhone('');
              setError('');
            }}
            className="mt-3"
          />
        </div>
      )}
    </div>
  );
}
