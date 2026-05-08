"use client";

import { useState } from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/components/common/ToastContainer';

export default function LoginPage() {
  const { t } = useHydratedTranslation();
  const { login } = useAuth();
  const router = useRouter();
  const { addToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      router.push('/');
    } catch (err) {
      // Parse backend error for login failures
      if (err instanceof Error) {
        try {
          const errorData = JSON.parse(err.message);
          if (errorData.non_field_errors && Array.isArray(errorData.non_field_errors)) {
            // Show error message as toast
            addToast({
              type: 'error',
              title: errorData.non_field_errors[0] || t('AuthLogin.loginFailed', 'Login failed')
            });
            return;
          }
        } catch {
          // Not JSON, show as is
        }
        addToast({
          type: 'error',
          title: err.message || t('AuthLogin.loginFailed', 'Login failed')
        });
      } else {
        addToast({
          type: 'error',
          title: t('AuthLogin.loginFailed', 'Login failed')
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-10 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md p-8 flex flex-col gap-6">
          {/* Header */}
          <div>
            <h1 className="text-h1 font-bold text-gray-900 dark:text-white mb-1">Нэвтрэх</h1>
            <p className="text-caption text-gray-500 dark:text-gray-400">
              Шинэ хэрэглэгч болох{' '}
              <Link href="/signup" className="text-[#3D52D5] hover:underline font-medium">Бүртгүүлэх</Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Email / Phone */}
            <div>
              <label className="block text-body-md font-medium text-gray-900 dark:text-gray-100 mb-1.5">
                И-мэйл хаяг / Утасны дугаар <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="text"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 text-body-md text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-[#3D52D5] focus:border-transparent bg-white dark:bg-gray-700 transition"
                placeholder="И-мэйл хаяг эсвэл гар утасны дугаар"
                disabled={isLoading}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-body-md font-medium text-gray-900 dark:text-gray-100 mb-1.5">Нууц үг</label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 pr-11 text-body-md text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-[#3D52D5] focus:border-transparent bg-white dark:bg-gray-700 transition"
                  placeholder="Нууц үгээ оруулна уу"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Forgot password */}
            <div className="flex justify-end -mt-1">
              <Link href="/login/forgot" className="text-caption text-gray-500 dark:text-gray-400 hover:text-[#3D52D5] dark:hover:text-[#6b7fde] transition-colors">
                Нууц үг мартсан?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 bg-[#3D52D5] hover:bg-[#3347c4] text-white font-medium rounded-lg text-body-md transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Нэвтэрч байна...' : 'Нэвтрэх'}
            </button>

            {/* Эсвэл */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600" />
              <span className="text-caption text-gray-400 dark:text-gray-500">Эсвэл</span>
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600" />
            </div>

            {/* Social */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 rounded-lg py-2.5 text-caption text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 rounded-lg py-2.5 text-caption text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Gmail
              </button>
            </div>

            {/* Disclaimer */}
            <p className="text-caption text-gray-500 dark:text-gray-400 text-justify leading-relaxed">
              Та манай платформ дээр бүртгэлээ үүсгэсэн тохиолдолд таныг манай платформын{' '}
              <Link href="/terms" className="text-[#3D52D5] hover:underline">Үйлчилгээний нөхцөл</Link>{' '}
              болон{' '}
              <Link href="/privacy" className="text-[#3D52D5] hover:underline">Нууцлалын бодлого</Link>
              -ыг хүлээн зөвшөөрсөнд тооцно.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
