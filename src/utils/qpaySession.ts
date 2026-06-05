export const QPAY_PAYMENT_WINDOW_MS = 10 * 60 * 1000;
export const QPAY_PAYMENT_WINDOW_SECONDS = QPAY_PAYMENT_WINDOW_MS / 1000;
export const QPAY_INVOICE_ID_KEY = 'qpay_invoice_id';
export const QPAY_QR_KEY = 'qpay_qr';
export const QPAY_INVOICE_STATUS_DATE_KEY = 'qpay_invoice_status_date';
export const QPAY_EXPIRY_KEY = 'qpay_expiry';
export const QPAY_BANK_URLS_KEY = 'qpay_bank_urls';
export const QPAY_BOOKING_CODE_KEY = 'qpay_booking_code';

export interface QPayInvoiceResponse {
  id: string;
  qr_image?: string;
  invoice_status_date?: string;
  urls?: Array<{ name: string; description: string; logo: string; link: string }>;
}

/** Parse QPay invoice_status_date (UTC ISO) to epoch ms */
export function parseInvoiceStatusDateMs(invoiceStatusDate?: string | null): number | null {
  if (!invoiceStatusDate?.trim()) return null;
  let normalized = invoiceStatusDate.trim();
  if (!normalized.includes('T')) {
    normalized = normalized.replace(' ', 'T');
  }
  if (!/[zZ]|[+-]\d{2}:?\d{2}$/.test(normalized)) {
    normalized += 'Z';
  }
  const ms = new Date(normalized).getTime();
  return Number.isFinite(ms) ? ms : null;
}

/** Expiry = invoice_status_date (UTC) + 10 minutes */
export function getQPayExpiryMs(invoiceStatusDate?: string | null): number | null {
  const createdMs = parseInvoiceStatusDateMs(invoiceStatusDate);
  if (createdMs === null) return null;
  return createdMs + QPAY_PAYMENT_WINDOW_MS;
}

export function getQPayRemainingSeconds(invoiceStatusDate?: string | null): number {
  const expiryMs = getQPayExpiryMs(invoiceStatusDate);
  if (!expiryMs) return 0;
  const remaining = Math.floor((expiryMs - Date.now()) / 1000);
  return Math.max(0, Math.min(QPAY_PAYMENT_WINDOW_SECONDS, remaining));
}

export function isQPaySessionActive(invoiceStatusDate?: string | null): boolean {
  return getQPayRemainingSeconds(invoiceStatusDate) > 0;
}

export function getStoredQPayInvoiceStatusDate(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(QPAY_INVOICE_STATUS_DATE_KEY);
}

export function saveQPayInvoiceSession(data: QPayInvoiceResponse, bookingCode: string): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(QPAY_INVOICE_ID_KEY, data.id);
  sessionStorage.setItem(QPAY_QR_KEY, data.qr_image ?? '');
  sessionStorage.setItem(QPAY_BOOKING_CODE_KEY, bookingCode);

  if (data.invoice_status_date) {
    sessionStorage.setItem(QPAY_INVOICE_STATUS_DATE_KEY, data.invoice_status_date);
    const expiryMs = getQPayExpiryMs(data.invoice_status_date);
    if (expiryMs) {
      sessionStorage.setItem(QPAY_EXPIRY_KEY, String(expiryMs));
    }
  }

  if (data.urls?.length) {
    sessionStorage.setItem(QPAY_BANK_URLS_KEY, JSON.stringify(data.urls));
  }
}

export function restoreQPayInvoiceFromSession(bookingCode?: string): {
  id: string;
  qrImage: string;
  invoiceStatusDate: string;
  bankUrls: QPayInvoiceResponse['urls'];
  remainingSeconds: number;
} | null {
  if (typeof window === 'undefined') return null;

  const id = sessionStorage.getItem(QPAY_INVOICE_ID_KEY);
  const qrImage = sessionStorage.getItem(QPAY_QR_KEY);
  const invoiceStatusDate = sessionStorage.getItem(QPAY_INVOICE_STATUS_DATE_KEY);
  const storedBookingCode = sessionStorage.getItem(QPAY_BOOKING_CODE_KEY);

  if (!id || !qrImage || !invoiceStatusDate) {
    if (id || qrImage || invoiceStatusDate) clearQPaySession();
    return null;
  }

  if (bookingCode && storedBookingCode && storedBookingCode !== bookingCode) {
    clearQPaySession();
    return null;
  }

  const remainingSeconds = getQPayRemainingSeconds(invoiceStatusDate);
  if (remainingSeconds <= 0) return null;

  let bankUrls: QPayInvoiceResponse['urls'] = [];
  try {
    const raw = sessionStorage.getItem(QPAY_BANK_URLS_KEY);
    bankUrls = raw ? JSON.parse(raw) : [];
  } catch {
    bankUrls = [];
  }

  return { id, qrImage, invoiceStatusDate, bankUrls, remainingSeconds };
}

/** @deprecated use restoreQPayInvoiceFromSession */
export function loadStoredQPayInvoice(): ReturnType<typeof restoreQPayInvoiceFromSession> {
  return restoreQPayInvoiceFromSession();
}

export function hasStoredActiveQPayInvoice(): boolean {
  return restoreQPayInvoiceFromSession() !== null;
}

export function clearQPaySession(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(QPAY_INVOICE_ID_KEY);
  sessionStorage.removeItem(QPAY_QR_KEY);
  sessionStorage.removeItem(QPAY_INVOICE_STATUS_DATE_KEY);
  sessionStorage.removeItem(QPAY_EXPIRY_KEY);
  sessionStorage.removeItem(QPAY_BANK_URLS_KEY);
  sessionStorage.removeItem(QPAY_BOOKING_CODE_KEY);
}

export function syncTimerFromStoredInvoice(): number {
  return getQPayRemainingSeconds(getStoredQPayInvoiceStatusDate());
}
