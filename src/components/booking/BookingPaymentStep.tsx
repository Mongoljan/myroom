'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Copy, Check, Clock, QrCode } from 'lucide-react';
import GuestCountInline from '@/components/common/GuestCountInline';
import InvoiceTypeDialog from './InvoiceTypeDialog';
import InvoiceModal from './InvoiceModal';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import { formatHotelLocation } from '@/utils/formatHotelLocation';
import {
  clearQPaySession,
  getClientPaymentRemainingSeconds,
  restoreQPayInvoiceFromSession,
  saveQPayInvoiceSession,
} from '@/utils/qpaySession';

interface BookingRoom {
  room_category_id: number;
  room_type_id: number;
  room_count: number;
  room_name: string;
  price_per_night: number;
  total_price: number;
  max_adults?: number;
  max_children?: number;
}

interface BookingPaymentStepProps {
  bookingCode: string;
  pinCode: string;
  totalPrice: number;
  rooms: BookingRoom[];
  checkIn: string;
  checkOut: string;
  nights: number;
  hotelName: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  hotelDetails: any | null;
  adultsCount: number;
  childrenCount: number;
  customerName: string;
  customerLastName: string;
  customerPhone: string;
  customerEmail: string;
  orgName?: string;
  orgRegister?: string;
  onCancelBooking: () => void;
  onPaymentConfirmed: () => void;
}

type PaymentMethod = 'bankApp' | 'transfer' | 'wallet' | 'card';
type TransferBank = 'tdb' | 'khan';

const TRANSFER_BANK_ACCOUNTS: Record<TransferBank, { accountNumber: string }> = {
  tdb: { accountNumber: '453215361' },
  khan: { accountNumber: 'MN 35000 400 5682083754' },
};

function padTwo(n: number) {
  return String(n).padStart(2, '0');
}

function parseHotelStarCount(ratingStars?: { value?: string } | null): number {
  const match = ratingStars?.value?.match(/(\d+)/);
  return match ? Math.min(5, Math.max(0, parseInt(match[1], 10))) : 0;
}

/** Guest review score (e.g. 4.8). Star classification ("2 stars") is not a guest score. */
function getGuestRatingDisplay(ratingStars?: { value?: string; label?: string } | null): {
  score: number;
  label: string;
} | null {
  if (!ratingStars?.value || /star/i.test(ratingStars.value)) return null;
  const score = parseFloat(ratingStars.value);
  if (!Number.isFinite(score) || score <= 0 || score > 10) return null;
  const label = ratingStars.label?.replace(/\d+\.?\d*\s*stars?/i, '').trim() || '';
  return { score, label };
}

export default function BookingPaymentStep({
  bookingCode,
  pinCode,
  totalPrice,
  rooms,
  checkIn,
  checkOut,
  nights,
  hotelName,
  hotelDetails,
  adultsCount,
  childrenCount,
  customerName,
  customerLastName,
  customerPhone,
  customerEmail,
  orgName,
  orgRegister,
  onCancelBooking,
  onPaymentConfirmed,
}: BookingPaymentStepProps) {
  const { t, tAny } = useHydratedTranslation();

  const PAYMENT_TABS: Array<{ id: PaymentMethod; label: string }> = useMemo(() => [
    { id: 'bankApp', label: t('payment.methods.bankApp') },
    { id: 'transfer', label: t('payment.methods.transfer') },
    { id: 'wallet', label: t('payment.methods.wallet') },
    { id: 'card', label: t('payment.methods.card') },
  ], [t]);

  const weekdays = tAny('payment.weekdays', { returnObjects: true }) as string[];

  const formatDateShort = useCallback((d: string) => {
    if (!d) return '';
    const date = new Date(d);
    const wk = Array.isArray(weekdays) ? weekdays[date.getDay()] : '';
    return `${date.getFullYear()} -${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}, ${wk}`;
  }, [weekdays]);

  const transferBanks = useMemo(() => ({
    tdb: {
      name: t('payment.banks.tdb'),
      accountNumber: TRANSFER_BANK_ACCOUNTS.tdb.accountNumber,
      accountName: t('payment.accountHolder'),
    },
    khan: {
      name: t('payment.banks.khan'),
      accountNumber: TRANSFER_BANK_ACCOUNTS.khan.accountNumber,
      accountName: t('payment.accountHolder'),
    },
  }), [t]);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bankApp');
  const [transferBank, setTransferBank] = useState<TransferBank>('tdb');
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerExpired, setTimerExpired] = useState(false);
  const invoiceInitRef = useRef(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [checkMessage, setCheckMessage] = useState<string | null>(null);

  // QPay state
  const [invoiceId, setInvoiceId] = useState<string | null>(null);
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [bankUrls, setBankUrls] = useState<Array<{ name: string; description: string; logo: string; link: string }>>([]);
  const [qpayLoading, setQpayLoading] = useState(false);
  const [qpayError, setQpayError] = useState<string | null>(null);

  // Invoice modal state
  const [invoiceTypeDialogOpen, setInvoiceTypeDialogOpen] = useState(false);
  const [invoiceType, setInvoiceType] = useState<'individual' | 'company' | null>(null);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);

  // Restore existing QPay invoice — never create a duplicate while the 10-min window is active
  useEffect(() => {
    if (invoiceInitRef.current) return;
    invoiceInitRef.current = true;

    const applyStoredInvoice = () => {
      const stored = restoreQPayInvoiceFromSession(bookingCode);
      if (!stored) return false;
      setInvoiceId(stored.id);
      setQrImage(stored.qrImage);
      setBankUrls(stored.bankUrls ?? []);
      setTimeLeft(stored.remainingSeconds);
      setTimerExpired(stored.remainingSeconds <= 0);
      return true;
    };

    if (applyStoredInvoice()) return;

    const createInvoice = async () => {
      if (applyStoredInvoice()) return;

      setQpayLoading(true);
      setQpayError(null);
      try {
        const res = await fetch('https://dev.kacc.mn/api/qpay/invoice/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            booking_code: bookingCode,
            pin_code: pinCode,
          }),
        });
        const data = await res.json();

        if (applyStoredInvoice()) return;

        if (!res.ok || data.error || !data.id || !data.qr_image) {
          clearQPaySession();
          setQpayError(data.error || t('payment.qpayError'));
          return;
        }

        const invoiceStatusDate = data.invoice_status_date || new Date().toISOString();
        saveQPayInvoiceSession({ ...data, invoice_status_date: invoiceStatusDate }, bookingCode);
        setInvoiceId(data.id);
        setQrImage(data.qr_image);
        setBankUrls(data.urls ?? []);
        const remaining = getClientPaymentRemainingSeconds();
        setTimeLeft(remaining);
        setTimerExpired(remaining <= 0);
      } catch {
        setQpayError(t('payment.qpayError'));
      } finally {
        setQpayLoading(false);
      }
    };
    createInvoice();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Countdown — only while a valid invoice is active
  useEffect(() => {
    if (timerExpired || !invoiceId) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setTimerExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerExpired, invoiceId]);

  const handleCopy = useCallback((text: string, field: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 1500);
    });
  }, []);

  const handleCheckPayment = async () => {
    if (!invoiceId) return;
    setCheckingPayment(true);
    setCheckMessage(null);
    try {
      const res = await fetch('https://dev.kacc.mn/api/qpay/check/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoice_id: invoiceId }),
      });
      const data = await res.json();
      if (data.is_paid) {
        onPaymentConfirmed();
      } else {
        setCheckMessage(t('payment.notPaid'));
      }
    } catch {
      setCheckMessage(t('payment.checkError'));
    } finally {
      setCheckingPayment(false);
    }
  };

  const handleInvoiceTypeSelect = (type: 'individual' | 'company') => {
    setInvoiceType(type);
    setInvoiceTypeDialogOpen(false);
    setInvoiceModalOpen(true);
  };

  const timerMinutes = Math.floor(timeLeft / 60);
  const timerSeconds = timeLeft % 60;

  const heroImage = (() => {
    try {
      const cover = hotelDetails?.images?.cover;
      if (typeof cover === 'string') return cover;
      if (cover?.url) return cover.url;
      return hotelDetails?.images?.gallery?.[0]?.url || '';
    } catch {
      return '';
    }
  })();

  const displayHotelName = hotelDetails?.property_name || hotelName;
  const locationText = formatHotelLocation(hotelDetails?.location);
  const hotelStarCount = parseHotelStarCount(hotelDetails?.rating_stars);
  const guestRating = getGuestRatingDisplay(hotelDetails?.rating_stars);

  const selectedTransferInfo = transferBanks[transferBank];

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ─── Left: Payment panel ─── */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            {/* Timer banner */}
            <div
              className={`flex items-center gap-4 px-5 py-4 ${
                timerExpired ? 'bg-red-500' : 'bg-primary'
              } text-white`}
            >
              <span className="text-2xl font-bold font-mono tabular-nums shrink-0">
                {padTwo(timerMinutes)} : {padTwo(timerSeconds)}
              </span>
              <div className="h-5 w-px bg-white/40" />
              <p className="text-sm font-medium">
                {timerExpired
                  ? t('payment.timerExpired')
                  : t('payment.timerWarning')}
              </p>
            </div>

            <div className="p-5">
              {/* Action row */}
              <div className="flex items-center justify-between mb-5">
                <button
                  type="button"
                  onClick={onCancelBooking}
                  className="text-sm sm:text-base  text-gray-400 hover:text-primary/80 transition-colors border-slate-150 border px-4 py-2 rounded-md"
                >
                  {t('payment.cancelBooking')}
                </button>
                <button
                  type="button"
                  onClick={() => setInvoiceTypeDialogOpen(true)}
                  className="text-sm sm:text-base font-semibold text-primary hover:text-primary/80 transition-colors underline"
                >
                  {t('payment.downloadInvoice')}
                </button>
              </div>

              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                {t('payment.selectMethod')}
              </p>

              {/* Tabs */}
              <div className="flex gap-1 mb-5 overflow-x-auto pb-1">
                {PAYMENT_TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setPaymentMethod(tab.id)}
                    className={`shrink-0 px-3 py-2 text-sm rounded-md transition-colors ${
                      paymentMethod === tab.id
                        ? 'bg-primary text-white'
                        : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              {paymentMethod === 'bankApp' && (
                <QPayContent
                  qrImage={qrImage}
                  bankUrls={bankUrls}
                  loading={qpayLoading}
                  error={qpayError}
                />
              )}

              {paymentMethod === 'transfer' && (
                <TransferContent
                  transferBank={transferBank}
                  onSelectBank={setTransferBank}
                  bankInfo={selectedTransferInfo}
                  totalPrice={totalPrice}
                  bookingCode={bookingCode}
                  copiedField={copiedField}
                  onCopy={handleCopy}
                />
              )}

              {(paymentMethod === 'wallet' || paymentMethod === 'card') && (
                <ComingSoonContent />
              )}

              {/* Check payment button */}
              {!timerExpired && (
                <div className="mt-6 flex flex-col items-center gap-2 ">
                  <button
                    type="button"
                    onClick={handleCheckPayment}
                    disabled={checkingPayment}
                    className="text-sm sm:text-base font-semibold text-primary hover:text-primary/80 disabled:opacity-50 transition-colors border-slate-150 border px-6 py-2 rounded-md "
                  >
                    {checkingPayment ? (
                      <span className="flex items-center gap-2">
                        <Clock className="w-4 h-4 animate-spin" />
                        {t('payment.checking')} ...
                      </span>
                    ) : (
                      t('payment.checkPayment')
                    )} ...
                  </button>
                  {checkMessage && (
                    <p className="text-sm text-red-500 dark:text-red-400">{checkMessage}</p>
                  )}
                </div>
              )}

              {/* Notes */}
              {(paymentMethod === 'transfer' || paymentMethod === 'bankApp') && (
                <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">{t('payment.noteTitle')}</p>
                  <ul className="space-y-1">
                    <li className="text-xs text-gray-500 dark:text-gray-400 flex gap-1.5">
                      <span className="shrink-0">•</span>
                      {t('payment.noteTransferRef')}
                    </li>
                    <li className="text-xs text-gray-500 dark:text-gray-400 flex gap-1.5">
                      <span className="shrink-0">•</span>
                      {t('payment.noteTransferAmount')}
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* ─── Right: Booking summary sidebar ─── */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 sticky top-6"
          >
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
              {t('payment.bookingSummary')}
            </h3>

            {/* Hotel summary */}
            <div className="flex gap-3 mb-4">
              {heroImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={heroImage}
                  alt={displayHotelName}
                  className="w-20 h-20 object-cover rounded-lg shrink-0"
                />
              ) : (
                <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                {hotelStarCount > 0 && (
                  <div className="flex items-center gap-0.5 mb-1">
                    {[...Array(hotelStarCount)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                )}
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white leading-snug line-clamp-2">
                  {displayHotelName}
                </h4>
                {locationText && (
                  <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span className="truncate">{locationText}</span>
                  </div>
                )}
                {guestRating && (
                  <div className="inline-flex items-center gap-1.5 mt-1.5">
                    <span className="bg-primary text-white text-xs font-semibold px-1.5 py-0.5 rounded">
                      {guestRating.score.toFixed(1)}
                    </span>
                    {guestRating.label ? (
                      <span className="text-xs text-gray-700 dark:text-gray-300">{guestRating.label}</span>
                    ) : null}
                  </div>
                )}
              </div>
            </div>

            {/* Dates */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{t('payment.checkInTime')}</div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    {formatDateShort(checkIn)}
                  </div>
                </div>
                <div className="flex flex-col items-center px-2 pt-1">
                  <span className="text-xs text-gray-500">{t('payment.nights', { count: nights })}</span>
                  <div className="w-px h-5 bg-gray-300 mt-1" />
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500 dark:text-gray-400">{t('payment.checkOutTime')}</div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    {formatDateShort(checkOut)}
                  </div>
                </div>
              </div>
            </div>

            {/* Rooms */}
            <div className="mb-3">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">{t('payment.selectedRooms')}</div>
              {rooms.map((room, i) => (
                <div key={i} className="flex justify-between items-center py-1">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white truncate pr-2">
                    {room.room_name}
                  </span>
                  <span className="text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                    {t('payment.roomCount', { count: room.room_count })}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-gray-500 dark:text-gray-400">{t('payment.guestCapacity')}</span>
              <GuestCountInline
                adults={adultsCount}
                childCount={Number(childrenCount) || 0}
                className="text-sm text-gray-700 dark:text-gray-300"
                iconClassName="w-4 h-4 text-gray-500 dark:text-gray-400"
              />
            </div>

            {/* Pricing */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-3 space-y-1.5 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">{t('payment.basePrice')}</span>
                <span className="text-gray-900 dark:text-white">{totalPrice.toLocaleString()} ₮</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">{t('payment.coupon')}</span>
                <span className="text-gray-900 dark:text-white">0 ₮</span>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mb-4">
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {t('payment.totalDue')}
                </span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {totalPrice.toLocaleString()}₮
                </span>
              </div>
            </div>

            {/* Customer info */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {t('payment.guestInfo')}
              </p>
              <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                <div className="flex gap-1">
                  <span className="w-24 shrink-0">{t('payment.guestFullName')}</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {[customerLastName, customerName].filter(Boolean).join(' ') || '—'}
                  </span>
                </div>
                <div className="flex gap-1">
                  <span className="w-24 shrink-0">{t('payment.guestPhone')}</span>
                  <span className="text-gray-900 dark:text-white font-medium">{customerPhone || '—'}</span>
                </div>
                <div className="flex gap-1">
                  <span className="w-24 shrink-0">{t('payment.guestEmail')}</span>
                  <span className="text-gray-900 dark:text-white font-medium break-all">
                    {customerEmail || '—'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Invoice type selection dialog */}
      <InvoiceTypeDialog
        open={invoiceTypeDialogOpen}
        onClose={() => setInvoiceTypeDialogOpen(false)}
        onSelect={handleInvoiceTypeSelect}
      />

      {/* Invoice modal */}
      {invoiceType && (
        <InvoiceModal
          open={invoiceModalOpen}
          onClose={() => setInvoiceModalOpen(false)}
          type={invoiceType}
          customerName={customerName}
          customerLastName={customerLastName}
          customerPhone={customerPhone}
          customerEmail={customerEmail}
          orgName={orgName}
          orgRegister={orgRegister}
          bookingCode={bookingCode}
          rooms={rooms}
          totalPrice={totalPrice}
          hotelName={hotelName}
        />
      )}
    </>
  );
}

// ─── Sub-components ────────────────────────────────────────────────

function QPayContent({
  qrImage,
  bankUrls,
  loading,
  error,
}: {
  qrImage: string | null;
  bankUrls: Array<{ name: string; description: string; logo: string; link: string }>;
  loading: boolean;
  error: string | null;
}) {
  const { t } = useHydratedTranslation();
  if (loading) {
    return (
      <div className="flex items-center justify-center h-40 text-sm text-gray-500">
        {t('payment.qpayCreating')}
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center justify-center h-40 text-sm text-red-500">{error}</div>
    );
  }
  return (
    <div>
      {/* QR image — desktop/tablet only */}
      {qrImage && (
        <div className="hidden sm:flex flex-col items-center gap-2 mb-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`data:image/png;base64,${qrImage}`}
            alt="QPay QR код"
            className="w-48 h-48 rounded-lg border border-gray-200 dark:border-gray-600"
          />
          <span className="text-xs text-gray-500">{t('payment.qpayScan')}</span>
        </div>
      )}

      {/* Bank app links — mobile only */}
      {bankUrls.length > 0 && (
        <div className="sm:hidden grid grid-cols-3 gap-2">
          {bankUrls.map((url) => (
            <a
              key={url.name}
              href={url.link}
              className="flex flex-col items-center gap-1.5 p-2 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-primary transition-colors"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url.logo}
                alt={url.name}
                className="w-10 h-10 rounded-lg object-contain"
              />
              <span className="text-[10px] text-center text-gray-700 dark:text-gray-300 leading-tight line-clamp-2">
                {url.description}
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function TransferContent({
  transferBank,
  onSelectBank,
  bankInfo,
  totalPrice,
  bookingCode,
  copiedField,
  onCopy,
}: {
  transferBank: TransferBank;
  onSelectBank: (b: TransferBank) => void;
  bankInfo: { name: string; accountNumber: string; accountName: string };
  totalPrice: number;
  bookingCode: string;
  copiedField: string | null;
  onCopy: (text: string, field: string) => void;
}) {
  const { t } = useHydratedTranslation();
  return (
    <div>
      <div className="flex gap-2 mb-5">
        {(['tdb', 'khan'] as TransferBank[]).map((key) => {
          const bankName = t(`payment.banks.${key}`);
          const isActive = transferBank === key;
          return (
            <button
              key={key}
              onClick={() => onSelectBank(key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 transition-all ${
                isActive
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
              }`}
            >
              {/* Bank logo placeholder */}
              <div
                className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${
                  key === 'tdb' ? 'bg-blue-700' : 'bg-green-600'
                }`}
              >
                <span className="text-white text-[10px] font-bold">
                  {key === 'tdb' ? 'TDB' : 'KB'}
                </span>
              </div>
              <span className="text-xs font-medium text-gray-800 dark:text-gray-200">
                {bankName}
              </span>
            </button>
          );
        })}
      </div>

      {/* Account details + QR */}
      <div className="flex gap-4">
        {/* Details */}
        <div className="flex-1 space-y-3">
          <CopyField
            label={t('payment.receivingAccount')}
            value={bankInfo.accountNumber}
            field="account"
            copiedField={copiedField}
            onCopy={onCopy}
            copyTitle={t('payment.copy')}
          />
          <CopyField
            label={t('payment.recipientName')}
            value={bankInfo.accountName}
            field="holder"
            copiedField={copiedField}
            onCopy={onCopy}
            copyTitle={t('payment.copy')}
          />
          <CopyField
            label={t('payment.transferAmount')}
            value={`${totalPrice.toLocaleString()} ₮`}
            field="amount"
            copiedField={copiedField}
            onCopy={onCopy}
            copyTitle={t('payment.copy')}
          />
          <CopyField
            label={t('payment.transactionRef')}
            value={bookingCode}
            field="ref"
            copiedField={copiedField}
            onCopy={onCopy}
            copyTitle={t('payment.copy')}
          />
        </div>

        {/* QR placeholder */}
        <div className="shrink-0 flex flex-col items-center gap-2 pt-1">
          <div className="w-32 h-32 bg-gray-100 dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center gap-1">
            <QrCode className="w-8 h-8 text-gray-400" />
            <span className="text-xs text-gray-400">{t('payment.qrCode')}</span>
          </div>
          <span className="text-xs text-gray-500">{t('payment.scanQrShort')}</span>
        </div>
      </div>
    </div>
  );
}

function CopyField({
  label,
  value,
  field,
  copiedField,
  onCopy,
  copyTitle,
}: {
  label: string;
  value: string;
  field: string;
  copiedField: string | null;
  onCopy: (text: string, field: string) => void;
  copyTitle: string;
}) {
  const copied = copiedField === field;
  return (
    <div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      <div className="flex items-center justify-between gap-2 px-3 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md">
        <span className="text-sm text-gray-900 dark:text-white font-medium">{value}</span>
        <button
          onClick={() => onCopy(value, field)}
          className="shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          title={copyTitle}
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-500" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
}

function ComingSoonContent() {
  const { t } = useHydratedTranslation();
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
        <Clock className="w-7 h-7 text-gray-400" />
      </div>
      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('payment.comingSoon')}</p>
      <p className="text-xs text-gray-400 text-center max-w-xs">
        {t('payment.comingSoonDesc')}
      </p>
    </div>
  );
}
