"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { CustomerService } from '@/services/customerApi';

type Step = 'view' | 'enter_phone' | 'verify_otp' | 'verified';

const OTP_EXPIRY = 5 * 60; // 5 minutes in seconds

export default function PhonePage() {
  const { user } = useAuth();

  const [step, setStep] = useState<Step>('view');
  const [phone, setPhone] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
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

  const handleSendOtp = async () => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length < 8) {
      setError('Утасны дугаар буруу байна.');
      return;
    }
    setError('');
    setIsSending(true);
    try {
      const res = await CustomerService.sendOTP({ phone: cleaned });
      startCountdown(res.expires_in_seconds ?? OTP_EXPIRY);
      setStep('verify_otp');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Алдаа гарлаа.');
    } finally {
      setIsSending(false);
    }
  };

  const handleOtpChange = (idx: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otpDigits];
    next[idx] = val.slice(-1);
    setOtpDigits(next);
    if (val && idx < 3) inputRefs.current[idx + 1]?.focus();
  };

  const handleOtpKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otpDigits.join('');
    if (code.length < 4) return;
    setError('');
    setIsVerifying(true);
    try {
      // verifyOTP logs in with phone — for phone change this is a workaround
      await CustomerService.verifyOTP({ phone: phone.replace(/\D/g, ''), otp_code: code });
      setStep('verified');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'OTP буруу байна.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    await handleSendOtp();
  };

  if (!user) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-8">
      <div className="mb-6 pb-4 border-b border-gray-100">
        <h1 className="text-xl font-semibold text-gray-900">Утасны дугаар</h1>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      {/* ── View: current verified phone ── */}
      {step === 'view' && user.phone && (
        <div>
          <p className="text-sm text-gray-500 mb-4">Таны утасны дугаар баталгаажсан байна.</p>
          <div className="flex items-center gap-3">
            <div className="relative max-w-xs w-full">
              <input
                type="text"
                value={user.phone}
                readOnly
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 bg-gray-50 pr-10"
              />
              <CheckCircle
                size={18}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500"
              />
            </div>
            <button
              onClick={() => { setStep('enter_phone'); setPhone(''); setError(''); }}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition"
            >
              Дугаар солих
            </button>
          </div>
        </div>
      )}

      {/* ── View: no phone yet ── */}
      {step === 'view' && !user.phone && (
        <div>
          <p className="text-sm text-gray-500 mb-4">Та солих утасны дугаараа оруулна уу.</p>
          <div className="flex items-center gap-3 max-w-md">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="____-____"
              className="flex-1 px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition tracking-wider"
            />
            <button
              onClick={handleSendOtp}
              disabled={isSending}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition disabled:opacity-50 whitespace-nowrap"
            >
              {isSending ? 'Илгээж байна...' : 'Баталгаажуулах код авах'}
            </button>
          </div>
        </div>
      )}

      {/* ── Enter new phone ── */}
      {step === 'enter_phone' && (
        <div>
          <p className="text-sm text-gray-500 mb-4">Та солих утасны дугаараа оруулна уу.</p>
          <div className="flex items-center gap-3 max-w-md">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="____-____"
              className="flex-1 px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition tracking-wider"
            />
            <button
              onClick={handleSendOtp}
              disabled={isSending}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition disabled:opacity-50 whitespace-nowrap"
            >
              {isSending ? 'Илгээж байна...' : 'Баталгаажуулах код авах'}
            </button>
          </div>
          <button
            onClick={() => setStep('view')}
            className="mt-3 text-sm text-gray-400 hover:text-gray-600 transition"
          >
            Буцах
          </button>
        </div>
      )}

      {/* ── OTP verification ── */}
      {step === 'verify_otp' && (
        <div>
          <p className="text-sm text-gray-500 mb-4">
            Таны дугаар луу илгээсэн кодыг оруулж, баталгаажуулна уу.
          </p>
          <form onSubmit={handleVerify}>
            <div className="flex items-center gap-3 flex-wrap">
              {/* Displayed phone */}
              <input
                type="text"
                value={phone}
                readOnly
                className="w-36 px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-600 bg-gray-50"
              />

              {/* 4 OTP boxes */}
              <div className="flex gap-2">
                {otpDigits.map((d, i) => (
                  <input
                    key={i}
                    ref={(el) => { inputRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={d}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="w-11 h-11 text-center border border-gray-300 rounded-lg text-base font-medium text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={isVerifying || otpDigits.join('').length < 4}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition disabled:opacity-50"
              >
                {isVerifying ? 'Шалгаж байна...' : 'Баталгаажуулах'}
              </button>
            </div>

            {/* Countdown + resend */}
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
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Дахин илгээх
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Verified ── */}
      {step === 'verified' && (
        <div>
          <p className="text-sm text-gray-500 mb-4">Таны утасны дугаар баталгаажсан байна.</p>
          <div className="flex items-center gap-3">
            <div className="relative max-w-xs w-full">
              <input
                type="text"
                value={phone.replace(/\D/g, '')}
                readOnly
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 bg-gray-50 pr-10"
              />
              <CheckCircle
                size={18}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500"
              />
            </div>
            <button
              onClick={() => { setStep('enter_phone'); setPhone(''); setOtpDigits(['', '', '', '']); setError(''); }}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition"
            >
              Дугаар солих
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
