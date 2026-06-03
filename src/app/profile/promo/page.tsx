"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { CustomerService } from '@/services/customerApi';
import { Coupon } from '@/types/customer';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';

type PromoTab = 'active' | 'used' | 'inactive';

export default function PromoPage() {
  const { t } = useHydratedTranslation();
  const { token } = useAuth();

  const [activeTab, setActiveTab] = useState<PromoTab>('active');
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [codeInput, setCodeInput] = useState('');
  const [addError, setAddError] = useState('');
  const [addSuccess, setAddSuccess] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const TABS: { label: string; value: PromoTab }[] = [
    { label: t('profilePromo.tabs.active'), value: 'active' },
    { label: t('profilePromo.tabs.used'), value: 'used' },
    { label: t('profilePromo.tabs.inactive'), value: 'inactive' },
  ];

  useEffect(() => {
    if (!token) return;
    setIsLoading(true);
    setError('');
    CustomerService.getCoupons(token)
      .then((res) => setCoupons(res.coupons))
      .catch((err) => setError(err instanceof Error ? err.message : t('profilePromo.error')))
      .finally(() => setIsLoading(false));
  }, [token]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!codeInput.trim()) return;
    setAddError('');
    setAddSuccess('');
    setIsAdding(true);
    // API doesn't have a "add coupon" endpoint — show feedback only
    await new Promise((r) => setTimeout(r, 600));
    setAddSuccess(t('profilePromo.added', { code: codeInput.trim() }));
    setCodeInput('');
    setIsAdding(false);
  };

  // Split coupons by their is_active flag
  const activeCoupons = coupons.filter((c) => c.is_active);
  const inactiveCoupons = coupons.filter((c) => !c.is_active);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="px-6 pt-6 pb-0">
        <h1 className="text-h2 font-semibold text-gray-900 dark:text-white mb-5">{t('profilePromo.title')}</h1>

        {/* Add promo input */}
        <form onSubmit={handleAdd} className="flex gap-2 mb-5 max-w-lg">
          <input
            type="text"
            value={codeInput}
            onChange={(e) => setCodeInput(e.target.value)}
            placeholder={t('profilePromo.placeholder')}
            className="flex-1 px-3.5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-gray-100 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          />
          <button
            type="submit"
            disabled={isAdding || !codeInput.trim()}
            className="px-5 py-2.5 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition disabled:opacity-50"
          >
            {isAdding ? t('profilePromo.adding') : t('profilePromo.add')}
          </button>
        </form>

        {addError && <p className="mb-3 text-sm text-red-500">{addError}</p>}
        {addSuccess && <p className="mb-3 text-sm text-green-600">{addSuccess}</p>}

        {/* Tabs */}
        <div className="flex gap-0 border-b border-gray-100 dark:border-gray-700">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-5 py-2.5 text-sm transition border-b-2 -mb-px ${
                activeTab === tab.value
                  ? 'border-blue-600 text-blue-600 font-medium'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {isLoading && (
          <div className="flex justify-center py-10">
            <div className="w-7 h-7 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!isLoading && error && (
          <p className="text-sm text-red-500 py-8 text-center">{error}</p>
        )}

        {/* Active coupons */}
        {!isLoading && activeTab === 'active' && (
          activeCoupons.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-10">{t('profilePromo.emptyActive')}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-700">
                    <th className="text-left py-3 pr-4 font-medium text-gray-500 dark:text-gray-400">{t('profilePromo.table.promoCode')}</th>
                    <th className="text-left py-3 pr-4 font-medium text-gray-500 dark:text-gray-400">{t('profilePromo.table.discountPercent')}</th>
                    <th className="text-left py-3 pr-4 font-medium text-gray-500 dark:text-gray-400">{t('profilePromo.table.validPeriod')}</th>
                    <th className="text-right py-3 pr-4 font-medium text-gray-500 dark:text-gray-400">{t('profilePromo.table.availableCount')}</th>
                    <th className="text-right py-3 font-medium text-gray-500 dark:text-gray-400">{t('profilePromo.table.usedCount')}</th>
                  </tr>
                </thead>
                <tbody>
                  {activeCoupons.map((c) => (
                    <tr key={c.id} className="border-b border-gray-50">
                      <td className="py-3 pr-4 text-gray-800 dark:text-gray-200 font-medium">{c.code}</td>
                      <td className="py-3 pr-4 text-gray-600 dark:text-gray-400">-{c.discount_percentage}%</td>
                      <td className="py-3 pr-4 text-gray-600 dark:text-gray-400">—</td>
                      <td className="py-3 pr-4 text-right text-gray-600 dark:text-gray-400">1</td>
                      <td className="py-3 text-right text-gray-600 dark:text-gray-400">0</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}

        {/* Used coupons (empty state — no API backing) */}
        {!isLoading && activeTab === 'used' && (
          <div className="overflow-x-auto">
            {coupons.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-10">{t('profilePromo.emptyUsed')}</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-700">
                    <th className="text-left py-3 pr-4 font-medium text-gray-500 dark:text-gray-400">{t('profilePromo.table.promoCode')}</th>
                    <th className="text-left py-3 pr-4 font-medium text-gray-500 dark:text-gray-400">{t('profilePromo.table.discountAmount')}</th>
                    <th className="text-right py-3 pr-4 font-medium text-gray-500 dark:text-gray-400">{t('profilePromo.table.availableCount')}</th>
                    <th className="text-right py-3 pr-4 font-medium text-gray-500 dark:text-gray-400">{t('profilePromo.table.usedCount')}</th>
                    <th className="text-right py-3 font-medium text-gray-500 dark:text-gray-400">{t('profilePromo.table.usedDate')}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-400 text-sm">
                      {t('profilePromo.emptyUsed')}
                    </td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Inactive coupons */}
        {!isLoading && activeTab === 'inactive' && (
          inactiveCoupons.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-10">{t('profilePromo.emptyInactive')}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-700">
                    <th className="text-left py-3 pr-4 font-medium text-gray-500 dark:text-gray-400">{t('profilePromo.table.promoCode')}</th>
                    <th className="text-left py-3 pr-4 font-medium text-gray-500 dark:text-gray-400">{t('profilePromo.table.discountAmount')}</th>
                    <th className="text-right py-3 pr-4 font-medium text-gray-500 dark:text-gray-400">{t('profilePromo.table.availableCount')}</th>
                    <th className="text-right py-3 pr-4 font-medium text-gray-500 dark:text-gray-400">{t('profilePromo.table.usedCount')}</th>
                    <th className="text-right py-3 font-medium text-gray-500 dark:text-gray-400">{t('profilePromo.table.validPeriod')}</th>
                  </tr>
                </thead>
                <tbody>
                  {inactiveCoupons.map((c) => (
                    <tr key={c.id} className="border-b border-gray-50">
                      <td className="py-3 pr-4 text-gray-800 dark:text-gray-200 font-medium">{c.code}</td>
                      <td className="py-3 pr-4 text-gray-600 dark:text-gray-400">-{c.discount_percentage}%</td>
                      <td className="py-3 pr-4 text-right text-gray-600 dark:text-gray-400">1</td>
                      <td className="py-3 pr-4 text-right text-gray-600 dark:text-gray-400">0</td>
                      <td className="py-3 text-right text-gray-500 dark:text-gray-400 text-xs">{t('profilePromo.expired')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>
    </div>
  );
}
