"use client";

import { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { CustomerService } from '@/services/customerApi';

type Step = 'view' | 'send_otp' | 'verify_otp' | 'done';

export default function EmailPage() {
  const { user, token, refreshProfile } = useAuth();

  const [step, setStep] = useState<Step>('view');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  if (!user) return null;

  const handleSendOtp = async () => {
    if (!token) return;
    setError('');
    setIsSending(true);
    try {
      await CustomerService.sendEmailOTP(token);
      setStep('verify_otp');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Алдаа гарлаа.');
    } finally {
      setIsSending(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setError('');
    setIsVerifying(true);
    try {
      await CustomerService.verifyEmail(token, { email: user.email, otp_code: otp });
      await refreshProfile();
      setSuccess('Цахим шуудан амжилттай баталгаажлаа.');
      setStep('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'OTP буруу эсвэл хугацаа дууссан.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-8">
      <div className="mb-6 pb-4 border-b border-gray-100">
        <h1 className="text-xl font-semibold text-gray-900">Цахим шуудан</h1>
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

      {/* View / already verified state */}
      {(step === 'view' || step === 'done') && (
        <div>
          {user.is_verified ? (
            <p className="text-sm text-gray-500 mb-4">Таны цахим шуудан баталгаажсан байна.</p>
          ) : (
            <p className="text-sm text-gray-500 mb-4">Таны цахим шуудан баталгаажаагүй байна.</p>
          )}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <input
                type="email"
                value={user.email}
                readOnly
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 bg-gray-50 pr-10"
              />
              {user.is_verified && (
                <CheckCircle
                  size={18}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500"
                />
              )}
            </div>
            {!user.is_verified && step !== 'done' && (
              <button
                onClick={handleSendOtp}
                disabled={isSending}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition disabled:opacity-50"
              >
                {isSending ? 'Илгээж байна...' : 'Цахим шуудан солих'}
              </button>
            )}
            {user.is_verified && (
              <button
                onClick={handleSendOtp}
                disabled={isSending}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition disabled:opacity-50"
              >
                {isSending ? 'Илгээж байна...' : 'Цахим шуудан солих'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* OTP verification state */}
      {step === 'verify_otp' && (
        <div>
          <p className="text-sm text-gray-500 mb-4">
            {user.email} хаяг руу OTP код илгээлээ. Кодоо оруулна уу.
          </p>
          <form onSubmit={handleVerify} className="flex items-center gap-3 max-w-sm">
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="OTP код"
              maxLength={6}
              className="flex-1 px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition tracking-widest text-center"
            />
            <button
              type="submit"
              disabled={isVerifying || otp.length < 4}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition disabled:opacity-50"
            >
              {isVerifying ? 'Шалгаж байна...' : 'Баталгаажуулах'}
            </button>
          </form>
          <button
            onClick={() => setStep('view')}
            className="mt-3 text-sm text-gray-400 hover:text-gray-600 transition"
          >
            Буцах
          </button>
        </div>
      )}
    </div>
  );
}
