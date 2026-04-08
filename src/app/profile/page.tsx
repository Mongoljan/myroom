"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { CustomerService } from '@/services/customerApi';

const COUNTRIES = [
  'Mongolia', 'China', 'Russia', 'Japan', 'South Korea', 'USA', 'Germany',
  'France', 'UK', 'Australia', 'Canada', 'India', 'Thailand', 'Singapore',
];

export default function ProfilePage() {
  const { user, token, refreshProfile } = useAuth();

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    last_name: '',
    first_name: '',
    date_of_birth: '',
    gender: '' as 'male' | 'female' | 'other' | '',
    nationality: 'Mongolia',
    invoice_individual: '',
    invoice_business: '',
    invoice_organization: '',
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        gender: user.gender || '',
        date_of_birth: user.date_of_birth || '',
      }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setError('');
    setSuccess('');
    setIsSaving(true);

    try {
      await CustomerService.updateProfile(token, {
        first_name: formData.first_name,
        last_name: formData.last_name,
        gender: formData.gender || undefined,
        date_of_birth: formData.date_of_birth || undefined,
      });
      await refreshProfile();
      setSuccess('Мэдээлэл амжилттай шинэчлэгдлээ.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Алдаа гарлаа.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const lastModified = user.created_at
    ? new Date(user.created_at).toLocaleDateString('mn-MN')
    : '';

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-8">
      {/* Header */}
      <div className="mb-6 pb-4 border-b border-gray-100">
        <h1 className="text-xl font-semibold text-gray-900">Таны профайл</h1>
        {lastModified && (
          <p className="text-sm text-gray-400 mt-0.5">Сүүлд өөрчилсөн: {lastModified}</p>
        )}
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

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Left column */}
          <div className="space-y-5">
            <div>
              <label className="block text-sm text-gray-600 mb-1.5">Таны овог</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Овог"
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1.5">Төрсөн огноо</label>
              <input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1.5">Иргэншил</label>
              <div className="relative">
                <select
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition appearance-none bg-white"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-5">
            <div>
              <label className="block text-sm text-gray-600 mb-1.5">Өөрийн нэр</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="Нэр"
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1.5">Хүйс</label>
              <div className="relative">
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition appearance-none bg-white"
                >
                  <option value="">Сонгох</option>
                  <option value="male">Эрэгтэй</option>
                  <option value="female">Эмэгтэй</option>
                  <option value="other">Бусад</option>
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1.5">И-баримт холбох</label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 w-44 shrink-0">Хувь хүн</span>
                  <input
                    type="text"
                    name="invoice_individual"
                    value={formData.invoice_individual}
                    onChange={handleChange}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 w-44 shrink-0">Хувь хүн /бизнес эрхлэгч/</span>
                  <input
                    type="text"
                    name="invoice_business"
                    value={formData.invoice_business}
                    onChange={handleChange}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 w-44 shrink-0">Байгуулага</span>
                  <input
                    type="text"
                    name="invoice_organization"
                    value={formData.invoice_organization}
                    onChange={handleChange}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Хадгалж байна...' : 'Мэдээлэл шинэчлэх'}
          </button>
        </div>
      </form>
    </div>
  );
}
