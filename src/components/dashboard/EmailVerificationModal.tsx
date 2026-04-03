'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import { CustomerService } from '@/services/customerApi';

interface EmailVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: () => void;
}

export default function EmailVerificationModal({ isOpen, onClose, onVerified }: EmailVerificationModalProps) {
  const { user, token } = useAuth();
  const { t } = useHydratedTranslation();

  const [step, setStep] = useState<'send' | 'verify' | 'success'>('send');
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [expiresIn, setExpiresIn] = useState(0);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const backdropRef = useRef<HTMLDivElement>(null);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep('send');
      setOtpCode(['', '', '', '', '', '']);
      setError('');
      setIsLoading(false);
      setExpiresIn(0);
    }
  }, [isOpen]);

  // Countdown timer
  useEffect(() => {
    if (expiresIn <= 0) return;
    const timer = setInterval(() => {
      setExpiresIn((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [expiresIn]);

  const handleSendOTP = async () => {
    if (!token) return;
    setError('');
    setIsLoading(true);

    try {
      const response = await CustomerService.sendEmailOTP(token);
      setExpiresIn(response.expires_in_seconds);
      setStep('verify');

      // Show OTP in dev mode
      if (response.otp_code) {
        alert(`OTP код (зөвхөн хөгжүүлэлтэд): ${response.otp_code}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error sending OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!token || !user?.email) return;
    const code = otpCode.join('');
    if (code.length !== 6) return;

    setError('');
    setIsLoading(true);

    try {
      await CustomerService.verifyEmail(token, {
        email: user.email,
        otp_code: code,
      });
      setStep('success');
      setTimeout(() => {
        onVerified();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otpCode];
    newOtp[index] = value.slice(-1);
    setOtpCode(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 0) return;
    const newOtp = [...otpCode];
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
    }
    setOtpCode(newOtp);
    const nextIndex = Math.min(pasted.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {t('dashboard.emailVerification')}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 pb-6">
          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Step: Send */}
          {step === 'send' && (
            <div className="text-center space-y-5">
              <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('dashboard.sendCodeTo')}</p>
                <p className="text-sm font-semibold text-gray-900 mt-1">{user?.email}</p>
              </div>
              <button
                onClick={handleSendOTP}
                disabled={isLoading}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg px-6 py-3 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? t('dashboard.sendingCode') : t('dashboard.sendCode')}
              </button>
            </div>
          )}

          {/* Step: Verify */}
          {step === 'verify' && (
            <div className="space-y-5">
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  {t('dashboard.enterCode')}
                </p>
                <p className="text-sm font-semibold text-gray-900 mt-1">{user?.email}</p>
                {expiresIn > 0 && (
                  <p className="text-xs text-gray-400 mt-2">
                    {t('dashboard.codeExpires', { minutes: Math.ceil(expiresIn / 60) })}
                  </p>
                )}
              </div>

              {/* OTP Inputs */}
              <div className="flex justify-center gap-2.5" onPaste={handleOtpPaste}>
                {otpCode.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { inputRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="w-12 h-14 text-center text-xl font-semibold bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900"
                    disabled={isLoading}
                  />
                ))}
              </div>

              <button
                onClick={handleVerify}
                disabled={isLoading || otpCode.join('').length !== 6}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg px-6 py-3 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? t('dashboard.verifying') : t('dashboard.verifyButton')}
              </button>

              <button
                onClick={() => {
                  setOtpCode(['', '', '', '', '', '']);
                  setError('');
                  handleSendOTP();
                }}
                disabled={isLoading}
                className="w-full text-sm text-gray-500 hover:text-gray-700 font-medium transition"
              >
                {t('dashboard.resendCode')}
              </button>
            </div>
          )}

          {/* Step: Success */}
          {step === 'success' && (
            <div className="text-center space-y-4 py-4">
              <div className="mx-auto w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-sm font-medium text-green-700">
                {t('dashboard.emailVerified')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
