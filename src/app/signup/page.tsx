"use client";

import { useState } from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/components/common/ToastContainer';

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

  const hasMinLength = password.length >= 8;
  const hasComplexity = /[a-zA-Z]/.test(password) && /[0-9]/.test(password);

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="w-full max-w-125">
        <div className="bg-white dark:bg-gray-800 border border-[#D9D9D9] dark:border-gray-700 rounded-3xl pt-6 pl-6 pr-6 pb-12 flex flex-col gap-10">
          {/* Title */}
          <h1 className="text-[24px] font-normal text-gray-900 dark:text-white">Бүртгүүлэх</h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Email / Phone */}
            <div>
              <label className="block text-[14px] text-gray-900 dark:text-gray-100 mb-1.5">
                И-мэйл хаяг / Утасны дугаар <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full border border-[#D9D9D9] dark:border-gray-600 rounded-lg px-4 py-3 text-[16px] text-[#181D27] dark:text-gray-100 placeholder:text-[#717680] outline-none focus:border-2 focus:border-[#181D27] dark:focus:border-gray-300 bg-white dark:bg-gray-700 transition"
                placeholder="И-мэйл хаяг эсвэл гар утасны дугаар"
                disabled={isLoading}
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
              {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-[14px] text-gray-900 dark:text-gray-100 mb-1.5">Нууц үг</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-[#D9D9D9] dark:border-gray-600 rounded-lg px-4 py-3 pr-12 text-[16px] text-[#181D27] dark:text-gray-100 placeholder:text-[#717680] outline-none focus:border-2 focus:border-[#181D27] dark:focus:border-gray-300 bg-white dark:bg-gray-700 transition"
                  placeholder="Нууц үгээ оруулна уу."
                  disabled={isLoading}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#181D27] dark:text-gray-300" tabIndex={-1}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-[14px] text-gray-900 dark:text-gray-100 mb-1.5">Нууц үг давтах</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-[#D9D9D9] dark:border-gray-600 rounded-lg px-4 py-3 pr-12 text-[16px] text-[#181D27] dark:text-gray-100 placeholder:text-[#717680] outline-none focus:border-2 focus:border-[#181D27] dark:focus:border-gray-300 bg-white dark:bg-gray-700 transition"
                  placeholder="Нууц үгээ оруулна уу."
                  disabled={isLoading}
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#181D27] dark:text-gray-300" tabIndex={-1}>
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirm_password && <p className="mt-1 text-xs text-red-500">{errors.confirm_password}</p>}
            </div>

            {/* Password requirements */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <div className={`w-3.5 h-3.5 rounded-full border-2 shrink-0 flex items-center justify-center ${hasMinLength ? 'border-[#3D52D5] bg-[#3D52D5]' : 'border-[#D5D7DA]'}`}>
                  {hasMinLength && <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                </div>
                <span className="text-[12px] text-gray-600 dark:text-gray-400">8 болон түүнээс дээш тэмдэгт байх</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3.5 h-3.5 rounded-full border-2 shrink-0 flex items-center justify-center ${hasComplexity ? 'border-[#3D52D5] bg-[#3D52D5]' : 'border-[#D5D7DA]'}`}>
                  {hasComplexity && <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                </div>
                <span className="text-[12px] text-gray-600 dark:text-gray-400">Үсэг, тоо, тэмдэгт орсон байх</span>
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                checked={termsAgreed}
                onChange={(e) => setTermsAgreed(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-[#D5D7DA] accent-[#3D52D5]"
              />
              <label htmlFor="terms" className="text-[12px] text-gray-500 dark:text-gray-400 leading-relaxed text-justify">
                Та манай платформ дээр бүртгэлээ үүсгэсэн тохиолдолд таныг манай платформын{' '}
                <Link href="/terms" className="text-[#3D52D5] underline">Үйлчилгээний нөхцөл</Link>{' '}
                болон{' '}
                <Link href="/privacy" className="text-[#3D52D5] underline">Нууцлалын бодлого</Link>
                -ыг хүлээн зөвшөөрсөнд тооцно.
              </label>
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/login"
                className="flex items-center justify-center border border-[#D9D9D9] dark:border-gray-600 rounded-2xl py-3 text-[14px] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                Нэвтрэх
              </Link>
              <button
                type="submit"
                disabled={isLoading || !termsAgreed}
                className="bg-[#3D52D5] hover:bg-[#3347c4] text-white rounded-2xl py-3 text-[14px] font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Бүртгэж байна...' : 'Бүртгүүлэх'}
              </button>
            </div>

            {errors.general && <p className="text-xs text-red-500 text-center">{errors.general}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}
