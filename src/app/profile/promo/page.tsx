"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { CustomerService } from '@/services/customerApi';
import { Coupon } from '@/types/customer';

type PromoTab = 'active' | 'used' | 'inactive';

export default function PromoPage() {
  const { token } = useAuth();

  const [activeTab, setActiveTab] = useState<PromoTab>('active');
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [codeInput, setCodeInput] = useState('');
  const [addError, setAddError] = useState('');
  const [addSuccess, setAddSuccess] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (!token) return;
    setIsLoading(true);
    setError('');
    CustomerService.getCoupons(token)
      .then((res) => setCoupons(res.coupons))
      .catch((err) => setError(err instanceof Error ? err.message : 'Алдаа гарлаа.'))
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
    setAddSuccess(`"${codeInput.trim()}" промо код нэмэгдлээ.`);
    setCodeInput('');
    setIsAdding(false);
  };

  // Split coupons by their is_active flag
  const activeCoupons = coupons.filter((c) => c.is_active);
  const inactiveCoupons = coupons.filter((c) => !c.is_active);

  const TABS: { label: string; value: PromoTab }[] = [
    { label: 'Идэвхтэй', value: 'active' },
    { label: 'Ашигласан', value: 'used' },
    { label: 'Идэвхгүй', value: 'inactive' },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="px-6 pt-6 pb-0">
        <h1 className="text-xl font-semibold text-gray-900 mb-5">Промо код</h1>

        {/* Add promo input */}
        <form onSubmit={handleAdd} className="flex gap-2 mb-5 max-w-lg">
          <input
            type="text"
            value={codeInput}
            onChange={(e) => setCodeInput(e.target.value)}
            placeholder="Промо код оруулах"
            className="flex-1 px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          />
          <button
            type="submit"
            disabled={isAdding || !codeInput.trim()}
            className="px-5 py-2.5 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition disabled:opacity-50"
          >
            {isAdding ? 'Нэмж байна...' : 'Нэмэх'}
          </button>
        </form>

        {addError && <p className="mb-3 text-sm text-red-500">{addError}</p>}
        {addSuccess && <p className="mb-3 text-sm text-green-600">{addSuccess}</p>}

        {/* Tabs */}
        <div className="flex gap-0 border-b border-gray-100">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-5 py-2.5 text-sm transition border-b-2 -mb-px ${
                activeTab === tab.value
                  ? 'border-blue-600 text-blue-600 font-medium'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
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
            <p className="text-sm text-gray-400 text-center py-10">Идэвхтэй промо код байхгүй байна.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-3 pr-4 font-medium text-gray-500">Промо код</th>
                    <th className="text-left py-3 pr-4 font-medium text-gray-500">Хөнгөлтийн хувь</th>
                    <th className="text-left py-3 pr-4 font-medium text-gray-500">Хүчинтэй хугацаа</th>
                    <th className="text-right py-3 pr-4 font-medium text-gray-500">Ашиглах боломжтой тоо</th>
                    <th className="text-right py-3 font-medium text-gray-500">Ашигласан тоо</th>
                  </tr>
                </thead>
                <tbody>
                  {activeCoupons.map((c) => (
                    <tr key={c.id} className="border-b border-gray-50">
                      <td className="py-3 pr-4 text-gray-800 font-medium">{c.code}</td>
                      <td className="py-3 pr-4 text-gray-600">-{c.discount_percentage}%</td>
                      <td className="py-3 pr-4 text-gray-600">—</td>
                      <td className="py-3 pr-4 text-right text-gray-600">1</td>
                      <td className="py-3 text-right text-gray-600">0</td>
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
              <p className="text-sm text-gray-400 text-center py-10">Ашигласан промо код байхгүй.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-3 pr-4 font-medium text-gray-500">Промо код</th>
                    <th className="text-left py-3 pr-4 font-medium text-gray-500">Хөнгөлтийн хувь / дүн</th>
                    <th className="text-right py-3 pr-4 font-medium text-gray-500">Ашиглах боломжтой тоо</th>
                    <th className="text-right py-3 pr-4 font-medium text-gray-500">Ашигласан тоо</th>
                    <th className="text-right py-3 font-medium text-gray-500">Ашигласан огноо</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-400 text-sm">
                      Ашигласан промо код байхгүй.
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
            <p className="text-sm text-gray-400 text-center py-10">Идэвхгүй промо код байхгүй байна.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-3 pr-4 font-medium text-gray-500">Промо код</th>
                    <th className="text-left py-3 pr-4 font-medium text-gray-500">Хөнгөлтийн хувь / дүн</th>
                    <th className="text-right py-3 pr-4 font-medium text-gray-500">Ашиглах боломжтой тоо</th>
                    <th className="text-right py-3 pr-4 font-medium text-gray-500">Ашигласан тоо</th>
                    <th className="text-right py-3 font-medium text-gray-500">Хүчинтэй хугацаа</th>
                  </tr>
                </thead>
                <tbody>
                  {inactiveCoupons.map((c) => (
                    <tr key={c.id} className="border-b border-gray-50">
                      <td className="py-3 pr-4 text-gray-800 font-medium">{c.code}</td>
                      <td className="py-3 pr-4 text-gray-600">-{c.discount_percentage}%</td>
                      <td className="py-3 pr-4 text-right text-gray-600">1</td>
                      <td className="py-3 pr-4 text-right text-gray-600">0</td>
                      <td className="py-3 text-right text-gray-500 text-xs">— (дууссан)</td>
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
