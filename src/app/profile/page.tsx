"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { CustomerService } from '@/services/customerApi';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';

export default function ProfilePage() {
  const { t } = useHydratedTranslation();
  const { user, token, isAuthenticated, logout, refreshProfile } = useAuth();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    gender: '' as 'male' | 'female' | 'other' | '',
    date_of_birth: '',
  });

  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        gender: user.gender || '',
        date_of_birth: user.date_of_birth || '',
      });
    }
  }, [isAuthenticated, user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setError('');
    setSuccess('');
    setIsSaving(true);

    try {
      // Filter out empty gender value
      const updateData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        gender: formData.gender || undefined,
        date_of_birth: formData.date_of_birth,
      };
      await CustomerService.updateProfile(token, updateData);
      await refreshProfile();
      setSuccess(t('Profile.profileUpdated', 'Profile updated successfully'));
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('Profile.updateError', 'An error occurred'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setError('');
    setSuccess('');

    if (passwordData.new_password !== passwordData.confirm_password) {
      setError(t('Profile.passwordMismatch', 'Passwords do not match'));
      return;
    }

    setIsSaving(true);

    try {
      await CustomerService.changePassword(token, passwordData);
      setSuccess(t('Profile.passwordChanged', 'Password changed successfully. Please log in again.'));
      setPasswordData({ old_password: '', new_password: '', confirm_password: '' });
      setShowPasswordForm(false);
      // Logout after password change
      setTimeout(() => {
        logout();
        router.push('/login');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('Profile.updateError', 'An error occurred'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">{t('common.loading', 'Loading...')}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {t('Profile.title', 'My Profile')}
        </h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-600">{success}</p>
          </div>
        )}

        {/* Personal Information Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {t('Profile.personalInfo', 'Personal Information')}
            </h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                {t('Profile.edit', 'Edit')}
              </button>
            )}
          </div>

          <form onSubmit={handleSaveProfile}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('Profile.firstName', 'First Name')}
                </label>
                <input
                  id="first_name"
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('Profile.lastName', 'Last Name')}
                </label>
                <input
                  id="last_name"
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('Profile.email', 'Email')}
                </label>
                <input
                  id="email"
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">{t('Profile.emailNote', 'Email cannot be changed')}</p>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('Profile.phone', 'Phone')}
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={user.phone}
                  disabled
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">{t('Profile.phoneNote', 'Phone cannot be changed')}</p>
              </div>

              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('Profile.gender', 'Gender')}
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">{t('Profile.selectGender', 'Select')}</option>
                  <option value="male">{t('Profile.male', 'Male')}</option>
                  <option value="female">{t('Profile.female', 'Female')}</option>
                  <option value="other">{t('Profile.other', 'Other')}</option>
                </select>
              </div>

              <div>
                <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('Profile.dateOfBirth', 'Date of Birth')}
                </label>
                <input
                  id="date_of_birth"
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {isEditing && (
              <div className="flex gap-4 mt-6">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg px-6 py-3 transition-all duration-200 shadow-lg shadow-slate-900/30 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? t('Profile.saving', 'Saving...') : t('Profile.save', 'Save Changes')}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  disabled={isSaving}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg px-6 py-3 transition-colors duration-200"
                >
                  {t('Profile.cancel', 'Cancel')}
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Security Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            {t('Profile.security', 'Security')}
          </h2>

          {!showPasswordForm ? (
            <button
              onClick={() => setShowPasswordForm(true)}
              className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              {t('Profile.changePassword', 'Change Password')}
            </button>
          ) : (
            <form onSubmit={handleChangePassword} className="max-w-md space-y-6">
              <div>
                <label htmlFor="old_password" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('Profile.oldPassword', 'Old Password')}
                </label>
                <input
                  id="old_password"
                  type="password"
                  name="old_password"
                  value={passwordData.old_password}
                  onChange={handlePasswordChange}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900"
                />
              </div>

              <div>
                <label htmlFor="new_password" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('Profile.newPassword', 'New Password')}
                </label>
                <input
                  id="new_password"
                  type="password"
                  name="new_password"
                  value={passwordData.new_password}
                  onChange={handlePasswordChange}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900"
                />
              </div>

              <div>
                <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('Profile.confirmPassword', 'Confirm Password')}
                </label>
                <input
                  id="confirm_password"
                  type="password"
                  name="confirm_password"
                  value={passwordData.confirm_password}
                  onChange={handlePasswordChange}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg px-6 py-3 transition-all duration-200 shadow-lg shadow-slate-900/30 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? t('Profile.changing', 'Changing...') : t('Profile.changePasswordButton', 'Change Password')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordForm(false);
                    setPasswordData({ old_password: '', new_password: '', confirm_password: '' });
                  }}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg px-6 py-3 transition-colors duration-200"
                >
                  {t('Profile.cancel', 'Cancel')}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Danger Zone Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-red-200 p-8">
          <h2 className="text-xl font-bold text-red-600 mb-4">
            {t('Profile.dangerZone', 'Danger Zone')}
          </h2>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg px-6 py-3 transition-all duration-200 shadow-lg shadow-red-600/30 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
          >
            {t('Profile.logout', 'Sign Out')}
          </button>
        </div>
      </div>
    </div>
  );
}
