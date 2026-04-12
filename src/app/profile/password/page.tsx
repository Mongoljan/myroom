"use client";

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { CustomerService } from '@/services/customerApi';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';

export default function PasswordPage() {
  const { t } = useHydratedTranslation();
  const { token, logout } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [show, setShow] = useState({ old: false, new_: false, confirm: false });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const toggle = (field: keyof typeof show) =>
    setShow((prev) => ({ ...prev, [field]: !prev[field] }));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (formData.new_password !== formData.confirm_password) {
      setError(t('ProfilePassword.passwordMismatch', 'Шинэ нууц үгнүүд таарахгүй байна.'));
      return;
    }

    setError('');
    setSuccess('');
    setIsSaving(true);

    try {
      await CustomerService.changePassword(token, formData);
      setSuccess(t('ProfilePassword.changeSuccess', 'Нууц үг амжилттай солигдлоо. Дахин нэвтэрч орно уу.'));
      setFormData({ old_password: '', new_password: '', confirm_password: '' });
      setTimeout(async () => {
        await logout();
        router.push('/login');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('ProfilePassword.changeError', 'Алдаа гарлаа.'));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8">
      <div className="mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">{t('ProfilePassword.title', 'Нууц үг солих')}</h1>
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

      <form onSubmit={handleSubmit} className="max-w-md space-y-5">
        {/* Current password */}
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1.5">{t('ProfilePassword.currentPassword', 'Одоогийн нууц үг')}</label>
          <div className="relative">
            <input
              type={show.old ? 'text' : 'password'}
              name="old_password"
              value={formData.old_password}
              onChange={handleChange}
              required
              className="w-full px-3.5 py-2.5 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
            <button
              type="button"
              onClick={() => toggle('old')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              {show.old ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* New password */}
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1.5">{t('ProfilePassword.newPassword', 'Шинэ нууц үг')}</label>
          <div className="relative">
            <input
              type={show.new_ ? 'text' : 'password'}
              name="new_password"
              value={formData.new_password}
              onChange={handleChange}
              required
              className="w-full px-3.5 py-2.5 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
            <button
              type="button"
              onClick={() => toggle('new_')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              {show.new_ ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Confirm new password */}
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1.5">{t('ProfilePassword.confirmNewPassword', 'Шинэ нууц үг давтах')}</label>
          <div className="relative">
            <input
              type={show.confirm ? 'text' : 'password'}
              name="confirm_password"
              value={formData.confirm_password}
              onChange={handleChange}
              required
              className="w-full px-3.5 py-2.5 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
            <button
              type="button"
              onClick={() => toggle('confirm')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              {show.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition disabled:opacity-50"
        >
          {isSaving ? t('ProfilePassword.changing', 'Солиж байна...') : t('ProfilePassword.changeButton', 'Солих')}
        </button>
      </form>
    </div>
  );
}
