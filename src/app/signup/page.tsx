"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/components/common/ToastContainer';
import PolicyModal from '@/components/common/PolicyModal';
import Link from 'next/link';

export default function SignupPage() {
  const { register } = useAuth();
  const router = useRouter();
  const { addToast } = useToast();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [policyModal, setPolicyModal] = useState<{ open: boolean; type: 'terms' | 'privacy' }>({ open: false, type: 'terms' });

  const hasMinLength = password.length >= 8;
  const hasComplexity = /[a-zA-Z]/.test(password) && /[0-9]/.test(password);
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (password !== confirmPassword) {
      setErrors({ confirm_password: 'Нууц үг таарахгүй байна' });
      return;
    }
    if (!termsAgreed) {
      addToast({ type: 'error', title: 'Үйлчилгээний нөхцөлийг зөвшөөрнө үү' });
      return;
    }

    setIsLoading(true);
    const isEmail = identifier.includes('@');
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (register as any)({
        email: isEmail ? identifier : '',
        phone: isEmail ? '' : identifier,
        password,
        confirm_password: confirmPassword,
        first_name: '',
        last_name: '',
      });
      router.push('/');
    } catch (err) {
      if (err instanceof Error) {
        try {
          const errorData = JSON.parse(err.message);
          if (typeof errorData === 'object') {
            const fieldErrors: Record<string, string> = {};
            Object.keys(errorData).forEach((key) => {
              const messages = errorData[key];
              if (Array.isArray(messages) && messages.length > 0) {
                let errorMessage = messages[0];
                if (errorMessage.includes('with this email already exists')) {
                  errorMessage = 'Энэ и-мэйл хаяг бүртгэлтэй байна';
                  addToast({ type: 'error', title: errorMessage });
                } else if (errorMessage.includes('with this phone already exists')) {
                  errorMessage = 'Энэ утасны дугаар бүртгэлтэй байна';
                  addToast({ type: 'error', title: errorMessage });
                }
                fieldErrors[key] = errorMessage;
              }
            });
            setErrors(fieldErrors);
            return;
          }
        } catch {
          setErrors({ general: err.message });
        }
      } else {
        setErrors({ general: 'Бүртгэл амжилтгүй боллоо' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-gray-50 dark:bg-gray-900 px-4 pt-16 pb-16">
      <div className="w-full max-w-lg">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md p-8 flex flex-col gap-6">
          {/* Title */}
          <div className="text-center">
            <h1 className="text-h1 font-bold text-gray-900 dark:text-white">Бүртгүүлэх</h1>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Email / Phone */}
            <div>
              <label className="block text-body-md font-medium text-gray-900 dark:text-gray-100 mb-1.5">
                И-мэйл хаяг / Утасны дугаар <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 text-body-md text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 transition"
                placeholder="И-мэйл хаяг эсвэл гар утасны дугаар"
                disabled={isLoading}
              />
              {errors.email && <p className="mt-1 text-caption text-red-500">{errors.email}</p>}
              {errors.phone && <p className="mt-1 text-caption text-red-500">{errors.phone}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-body-md font-medium text-gray-900 dark:text-gray-100 mb-1.5">Нууц үг</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 pr-11 text-body-md text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 transition"
                  placeholder="Нууц үгээ оруулна уу"
                  disabled={isLoading}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" tabIndex={-1}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-body-md font-medium text-gray-900 dark:text-gray-100 mb-1.5">Нууц үг давтах</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 pr-11 text-body-md text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 transition"
                  placeholder="Нууц үгээ давтан оруулна уу"
                  disabled={isLoading}
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" tabIndex={-1}>
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Password requirements */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <div className={`w-3.5 h-3.5 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors ${hasMinLength ? 'border-primary-600 bg-primary-600' : 'border-gray-300 dark:border-gray-600'}`}>
                  {hasMinLength && <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                </div>
                <span className="text-caption text-gray-500 dark:text-gray-400">8 болон түүнээс дээш тэмдэгт байх</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3.5 h-3.5 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors ${hasComplexity ? 'border-primary-600 bg-primary-600' : 'border-gray-300 dark:border-gray-600'}`}>
                  {hasComplexity && <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                </div>
                <span className="text-caption text-gray-500 dark:text-gray-400">Үсэг, тоо, тэмдэгт орсон байх</span>
              </div>
              {confirmPassword.length > 0 && (
                <div className="flex items-center gap-2">
                  <div className={`w-3.5 h-3.5 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors ${passwordsMatch ? 'border-primary-600 bg-primary-600' : 'border-red-400 bg-red-400'}`}>
                    {passwordsMatch
                      ? <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                      : <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                    }
                  </div>
                  <span className={`text-caption ${passwordsMatch ? 'text-gray-500 dark:text-gray-400' : 'text-red-500'}`}>
                    {passwordsMatch ? 'Нууц үг таарч байна' : 'Нууц үг таарахгүй байна'}
                  </span>
                </div>
              )}
            </div>

            {/* Terms checkbox */}
            <div className="flex items-start gap-2.5">
              <input
                type="checkbox"
                id="terms"
                checked={termsAgreed}
                onChange={(e) => setTermsAgreed(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-gray-300 accent-primary-600"
              />
              <label htmlFor="terms" className="text-caption text-gray-500 dark:text-gray-400 leading-relaxed text-justify">
                Та манай платформ дээр бүртгэлээ үүсгэсэн тохиолдолд таныг манай платформын{' '}
                <button
                  type="button"
                  onClick={() => setPolicyModal({ open: true, type: 'terms' })}
                  className="text-primary-600 dark:text-primary-400 hover:underline"
                >
                  Үйлчилгээний нөхцөл
                </button>{' '}
                болон{' '}
                <button
                  type="button"
                  onClick={() => setPolicyModal({ open: true, type: 'privacy' })}
                  className="text-primary-600 dark:text-primary-400 hover:underline"
                >
                  Нууцлалын бодлого
                </button>
                -ыг хүлээн зөвшөөрсөнд тооцно.
              </label>
            </div>

            {/* Policy modal — confirm mode for signup */}
            <PolicyModal
              isOpen={policyModal.open}
              type={policyModal.type}
              mode="confirm"
              onClose={() => setPolicyModal((p) => ({ ...p, open: false }))}
              onAgree={() => setTermsAgreed(true)}
            />

            {/* Buttons */}
            <div className="flex flex-col gap-3">
              <button
                type="submit"
                disabled={isLoading || !termsAgreed}
                className="w-full h-10 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-body-md font-medium transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Бүртгэж байна...' : 'Бүртгүүлэх'}
              </button>
              <Link
                href="/login"
                className="flex items-center justify-center w-full h-10 border border-primary-600 dark:border-primary-500 rounded-lg text-body-md font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/30 transition"
              >
                Нэвтрэх
              </Link>
            </div>

            {errors.general && <p className="text-caption text-red-500 text-center">{errors.general}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}
