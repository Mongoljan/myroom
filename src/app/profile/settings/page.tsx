"use client";

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useRouter } from 'next/navigation';
import { CustomerService } from '@/services/customerApi';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import { Moon, Sun } from 'lucide-react';

const LANGUAGES = ['Mongolia', 'English', '中文', '日本語', '한국어', 'Русский'];

export default function SettingsPage() {
  const { user, token, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t } = useHydratedTranslation();
  const router = useRouter();

  const [language, setLanguage] = useState('Mongolia');

  // Email settings
  const [bookingConfirmEmail, setBookingConfirmEmail] = useState(true);
  const [reviewEmail, setReviewEmail] = useState(false);

  // Notifications
  const [notifications, setNotifications] = useState(true);

  // Delete account
  const [deleteStep, setDeleteStep] = useState<'idle' | 'confirm' | 'done'>('idle');
  const [deletePassword, setDeletePassword] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const handleDelete = async () => {
    if (!token) return;
    setIsDeleting(true);
    setDeleteError('');
    try {
      await CustomerService.deleteAccount(token);
      await logout();
      router.push('/');
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Алдаа гарлаа.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
      <div className="px-6 py-5">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{t('settings.title', 'Тохиргоо')}</h1>
      </div>

      {/* Language / Currency */}
      <div className="px-6 py-5">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">{t('settings.languageCurrency', 'Хэл / Валют')}</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">{t('settings.currency', 'Валют')}</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">MNT / ₮</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">{t('settings.language', 'Хэл')}</span>
            <div className="relative">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="text-sm text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 pr-7 appearance-none bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition"
              >
                {LANGUAGES.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">▾</span>
            </div>
          </div>
        </div>
      </div>

      {/* Theme */}
      <div className="px-6 py-5">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">{t('settings.theme', 'Харагдах байдал')}</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-800 dark:text-gray-200">{t('settings.darkMode', 'Харанхуй горим')}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              {t('settings.darkModeDesc', 'Нүдэнд илүү тав тухтай харанхуй загвар')}
            </p>
          </div>
          <button
            onClick={() => {
              console.log('Settings theme toggle clicked');
              toggleTheme();
            }}
            className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 border border-gray-300 dark:border-gray-600"
            aria-label={t('common.toggleTheme', 'Toggle theme')}
          >
            {theme === 'light' ? (
              <Moon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            ) : (
              <Sun className="w-6 h-6 text-yellow-500" />
            )}
          </button>
        </div>
      </div>

      {/* Email settings */}
      <div className="px-6 py-5">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">И-мэйл тохиргоо</h2>
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-gray-800 dark:text-gray-200">Захиалга баталгаажсан и-мэйл</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Захиалга баталгаажсаны дараах и-мэйлийг идэвхгүй болгох боломжгүй.</p>
            </div>
            <Toggle checked={bookingConfirmEmail} onChange={setBookingConfirmEmail} />
          </div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-gray-800 dark:text-gray-200">Үнэлгээний и-мэйл</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Таны захиалга биелэж дууссаны дараа тухайн буудалд үнэлгээ өгч, сэтгэгдэл үлдээх и-мэйл явуулах</p>
            </div>
            <Toggle checked={reviewEmail} onChange={setReviewEmail} />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="px-6 py-5">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Мэдэгдэл</h2>
        <div className="flex items-start justify-between gap-4">
          <p className="text-sm text-gray-800 dark:text-gray-200">
            Сайттай холбоотой бүхий л шинэ мэдээ, мэдэгдлийг мэдэгдлээр хүлээн авах
          </p>
          <Toggle checked={notifications} onChange={setNotifications} />
        </div>
      </div>

      {/* Delete account */}
      <div className="px-6 py-5">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Бүртгэл устгах</h2>

        {deleteStep === 'idle' && (
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Та бүртгэлээ устгаснаар тантай холбоотой бүх мэдээлэл манай сайтаас устана.
              Хэрэв та манай сайт дээр ямар нэг захиалга хийсэн эсвэл хүлээгдэж буй
              төлбөртэй байгаа бол захиалга бүрэн биелсний дараа хаягаа устгах боломжтойг анхаарна уу.
            </p>
            <div className="flex items-center gap-3 max-w-md">
              <input
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="Нууц үг оруулах"
                className="flex-1 px-3.5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
              <button
                onClick={() => setDeleteStep('confirm')}
                disabled={!deletePassword}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition disabled:opacity-50"
              >
                Устгах
              </button>
            </div>
          </div>
        )}

        {deleteStep === 'confirm' && (
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Манай сайт дээрх бүртгэлээ устгаснаар таны бүх мэдээлэл устагдана.
            </p>
            {deleteError && (
              <p className="text-sm text-red-500 mb-3">{deleteError}</p>
            )}
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-sm text-red-500 hover:text-red-600 underline transition disabled:opacity-50"
            >
              {isDeleting ? 'Устгаж байна...' : 'Бүртгэл устгах'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex w-11 h-6 rounded-full transition-colors shrink-0 ${
        checked ? 'bg-green-500' : 'bg-gray-300'
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white dark:bg-gray-200 shadow transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}
