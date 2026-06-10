"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { CustomerService } from '@/services/customerApi';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import DatePicker from '@/components/DatePicker';
import NationalitySelect from '@/components/profile/NationalitySelect';
import EbarimtCyrillicLetterSelect from '@/components/booking/EbarimtCyrillicLetterSelect';
import { lookupEbarimt } from '@/utils/ebarimtLookup';
import { getProfileExtras, saveProfileExtras } from '@/utils/profileExtrasStorage';

export default function ProfilePage() {
  const { t } = useHydratedTranslation();
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
    invoice_business_prefix1: '',
    invoice_business_prefix2: '',
    invoice_business_number: '',
    invoice_organization: '',
  });

  const [businessName, setBusinessName] = useState('');
  const [businessLoading, setBusinessLoading] = useState(false);
  const [businessError, setBusinessError] = useState<string | null>(null);

  const [orgName, setOrgName] = useState('');
  const [orgLoading, setOrgLoading] = useState(false);
  const [orgError, setOrgError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    setFormData((prev) => ({
      ...prev,
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      gender: user.gender || '',
      date_of_birth: user.date_of_birth || '',
    }));

    const extras = getProfileExtras(user.id);
    if (extras) {
      setFormData((prev) => ({
        ...prev,
        nationality: extras.nationality || 'Mongolia',
        invoice_individual: extras.invoice_individual || '',
        invoice_business_prefix1: extras.invoice_business_prefix1 || '',
        invoice_business_prefix2: extras.invoice_business_prefix2 || '',
        invoice_business_number: extras.invoice_business_number || '',
        invoice_organization: extras.invoice_organization || '',
      }));
      setBusinessName(extras.invoice_business_name || '');
      setOrgName(extras.invoice_organization_name || '');
    }
  }, [user]);

  useEffect(() => {
    const {
      invoice_business_prefix1,
      invoice_business_prefix2,
      invoice_business_number,
    } = formData;

    const fullRegno =
      invoice_business_prefix1 + invoice_business_prefix2 + invoice_business_number;

    if (
      invoice_business_prefix1.length !== 1 ||
      invoice_business_prefix2.length !== 1 ||
      invoice_business_number.length !== 8
    ) {
      return;
    }

    let active = true;
    setBusinessLoading(true);
    setBusinessError(null);
    setBusinessName('');

    lookupEbarimt(fullRegno)
      .then((result) => {
        if (!active) return;
        if (result.found && result.name) {
          setBusinessName(result.name);
        } else {
          setBusinessError(t('bookingFlow.ebarimtNotFound'));
        }
      })
      .catch(() => {
        if (active) setBusinessError(t('bookingFlow.ebarimtConnectionError'));
      })
      .finally(() => {
        if (active) setBusinessLoading(false);
      });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    formData.invoice_business_prefix1,
    formData.invoice_business_prefix2,
    formData.invoice_business_number,
  ]);

  useEffect(() => {
    const { invoice_organization } = formData;

    if (invoice_organization.length !== 7) {
      return;
    }

    let active = true;
    setOrgLoading(true);
    setOrgError(null);
    setOrgName('');

    lookupEbarimt(invoice_organization)
      .then((result) => {
        if (!active) return;
        if (result.found && result.name) {
          setOrgName(result.name);
        } else {
          setOrgError(t('bookingFlow.ebarimtNotFound'));
        }
      })
      .catch(() => {
        if (active) setOrgError(t('bookingFlow.ebarimtConnectionError'));
      })
      .finally(() => {
        if (active) setOrgLoading(false);
      });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.invoice_organization]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, date_of_birth: value }));
  }, []);

  const handleNationalityChange = useCallback((nationality: string) => {
    setFormData(prev => ({ ...prev, nationality }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !user) return;

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

      saveProfileExtras(user.id, {
        nationality: formData.nationality,
        invoice_individual: formData.invoice_individual,
        invoice_business_prefix1: formData.invoice_business_prefix1,
        invoice_business_prefix2: formData.invoice_business_prefix2,
        invoice_business_number: formData.invoice_business_number,
        invoice_business_name: businessName,
        invoice_organization: formData.invoice_organization,
        invoice_organization_name: orgName,
      });

      await refreshProfile();
      setSuccess(t('Profile.updateSuccess', 'Мэдээлэл амжилттай шинэчлэгдлээ.'));
    } catch (err) {
      setError(err instanceof Error ? err.message : t('Profile.updateError', 'Алдаа гарлаа.'));
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

  const inputClass =
    'w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8">
      <div className="mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
        <h1 className="text-h2 font-semibold text-gray-900 dark:text-white">{t('Profile.title', 'Таны профайл')}</h1>
        {lastModified && (
          <p className="text-sm text-gray-400 mt-0.5">{t('Profile.lastModified', 'Сүүлд өөрчилсөн')}: {lastModified}</p>
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
          <div className="space-y-5">
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1.5">{t('Profile.lastName', 'Таны овог')}</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder={t('Profile.lastNamePlaceholder', 'Овог')}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1.5">{t('Profile.dateOfBirth', 'Төрсөн огноо')}</label>
              <DatePicker
                value={formData.date_of_birth}
                onChange={handleDateChange}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1.5">{t('Profile.nationality', 'Иргэншил')}</label>
              <NationalitySelect
                value={formData.nationality}
                onChange={handleNationalityChange}
              />
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1.5">{t('Profile.firstName', 'Өөрийн нэр')}</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder={t('Profile.firstNamePlaceholder', 'Нэр')}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1.5">{t('Profile.gender', 'Хүйс')}</label>
              <div className="relative">
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={`${inputClass} appearance-none`}
                >
                  <option value="">{t('Profile.genderSelect', 'Сонгох')}</option>
                  <option value="male">{t('Profile.male', 'Эрэгтэй')}</option>
                  <option value="female">{t('Profile.female', 'Эмэгтэй')}</option>
                  <option value="other">{t('Profile.other', 'Бусад')}</option>
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1.5">{t('Profile.invoiceLink', 'И-баримт холбох')}</label>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1.5">{t('Profile.individual', 'Хувь хүн')}</p>
                  <input
                    type="text"
                    name="invoice_individual"
                    value={formData.invoice_individual}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, '').slice(0, 8);
                      setFormData((prev) => ({ ...prev, invoice_individual: digits }));
                    }}
                    placeholder="00000000"
                    maxLength={8}
                    inputMode="numeric"
                    className={inputClass}
                  />
                </div>

                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1.5">{t('Profile.business', 'Хувь хүн /бизнес эрхлэгч/')}</p>
                  <div className="flex gap-2 min-w-0">
                    <EbarimtCyrillicLetterSelect
                      value={formData.invoice_business_prefix1}
                      onChange={(letter) => {
                        setFormData((prev) => ({ ...prev, invoice_business_prefix1: letter }));
                        setBusinessName('');
                        setBusinessError(null);
                      }}
                      placeholder={t('bookingFlow.ebarimtTaxPrefix1')}
                    />
                    <EbarimtCyrillicLetterSelect
                      value={formData.invoice_business_prefix2}
                      onChange={(letter) => {
                        setFormData((prev) => ({ ...prev, invoice_business_prefix2: letter }));
                        setBusinessName('');
                        setBusinessError(null);
                      }}
                      placeholder={t('bookingFlow.ebarimtTaxPrefix2')}
                    />
                    <input
                      type="text"
                      value={formData.invoice_business_number}
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, '').slice(0, 8);
                        setFormData((prev) => ({ ...prev, invoice_business_number: digits }));
                        setBusinessName('');
                        setBusinessError(null);
                      }}
                      placeholder="00000000"
                      maxLength={8}
                      inputMode="numeric"
                      className={`${inputClass} min-w-0`}
                    />
                  </div>
                  {businessLoading && (
                    <p className="text-xs text-gray-500 mt-1">{t('bookingFlow.searching')}</p>
                  )}
                  {businessError && (
                    <p className="text-xs text-red-500 mt-1">{businessError}</p>
                  )}
                  {businessName && (
                    <div className="mt-1 p-2 bg-emerald-50 border border-emerald-200 rounded-md text-sm text-emerald-800 break-words">
                      {businessName}
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1.5">{t('Profile.organization', 'Байгуулага')}</p>
                  <input
                    type="text"
                    value={formData.invoice_organization}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, '').slice(0, 7);
                      setFormData((prev) => ({ ...prev, invoice_organization: digits }));
                      setOrgName('');
                      setOrgError(null);
                    }}
                    placeholder="0000000"
                    maxLength={7}
                    inputMode="numeric"
                    className={inputClass}
                  />
                  {orgLoading && (
                    <p className="text-xs text-gray-500 mt-1">{t('bookingFlow.searching')}</p>
                  )}
                  {orgError && (
                    <p className="text-xs text-red-500 mt-1">{orgError}</p>
                  )}
                  {orgName && (
                    <div className="mt-1 p-2 bg-emerald-50 border border-emerald-200 rounded-md text-sm text-emerald-800 break-words">
                      {orgName}
                    </div>
                  )}
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
            {isSaving ? t('Profile.updating', 'Хадгалж байна...') : t('Profile.updateButton', 'Мэдээлэл шинэчлэх')}
          </button>
        </div>
      </form>
    </div>
  );
}
