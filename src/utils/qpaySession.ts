export const QPAY_PAYMENT_WINDOW_MS = 10 * 60 * 1000;
export const QPAY_INVOICE_ID_KEY = 'qpay_invoice_id';
export const QPAY_QR_KEY = 'qpay_qr';
export const QPAY_INVOICE_STATUS_DATE_KEY = 'qpay_invoice_status_date';
export const QPAY_EXPIRY_KEY = 'qpay_expiry';
export const QPAY_BANK_URLS_KEY = 'qpay_bank_urls';

export interface QPayInvoiceResponse {
  id: string;
  qr_image?: string;
  invoice_status_date?: string;
  urls?: Array<{ name: string; description: string; logo: string; link: string }>;
}

/** Expiry = invoice_status_date (UTC ISO) + 10 minutes */
export function getQPayExpiryMs(invoiceStatusDate?: string | null): number | null {
  if (!invoiceStatusDate) return null;
  const createdMs = new Date(invoiceStatusDate).getTime();
  if (!Number.isFinite(createdMs)) return null;
  return createdMs + QPAY_PAYMENT_WINDOW_MS;
}

export function getQPayRemainingSeconds(invoiceStatusDate?: string | null): number {
  const expiryMs = getQPayExpiryMs(invoiceStatusDate);
  if (!expiryMs) return 0;
  return Math.max(0, Math.round((expiryMs - Date.now()) / 1000));
}

export function isQPaySessionActive(invoiceStatusDate?: string | null): boolean {
  return getQPayRemainingSeconds(invoiceStatusDate) > 0;
}

export function getStoredQPayInvoiceStatusDate(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(QPAY_INVOICE_STATUS_DATE_KEY);
}

export function saveQPayInvoiceSession(data: QPayInvoiceResponse): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(QPAY_INVOICE_ID_KEY, data.id);
  sessionStorage.setItem(QPAY_QR_KEY, data.qr_image ?? '');

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

export function loadStoredQPayInvoice(): {
  id: string;
  qrImage: string;
  invoiceStatusDate: string | null;
  bankUrls: QPayInvoiceResponse['urls'];
} | null {
  if (typeof window === 'undefined') return null;

  const id = sessionStorage.getItem(QPAY_INVOICE_ID_KEY);
  const qrImage = sessionStorage.getItem(QPAY_QR_KEY);
  const invoiceStatusDate = sessionStorage.getItem(QPAY_INVOICE_STATUS_DATE_KEY);

  if (!id || !qrImage || !invoiceStatusDate) return null;
  if (!isQPaySessionActive(invoiceStatusDate)) return null;

  let bankUrls: QPayInvoiceResponse['urls'] = [];
  try {
    const raw = sessionStorage.getItem(QPAY_BANK_URLS_KEY);
    bankUrls = raw ? JSON.parse(raw) : [];
  } catch {
    bankUrls = [];
  }

  return { id, qrImage, invoiceStatusDate, bankUrls };
}

export function clearQPaySession(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(QPAY_INVOICE_ID_KEY);
  sessionStorage.removeItem(QPAY_QR_KEY);
  sessionStorage.removeItem(QPAY_INVOICE_STATUS_DATE_KEY);
  sessionStorage.removeItem(QPAY_EXPIRY_KEY);
  sessionStorage.removeItem(QPAY_BANK_URLS_KEY);
}
