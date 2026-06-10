import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export interface InvoiceRoom {
  room_name: string;
  detail?: string;
  price_per_night: number;
  room_count: number;
  total_price: number;
}

export interface InvoiceDocumentData {
  type: 'individual' | 'company';
  modalTitle: string;
  customerName: string;
  customerLastName: string;
  customerPhone: string;
  customerEmail: string;
  orgName?: string;
  orgRegister?: string;
  bookingCode: string;
  rooms: InvoiceRoom[];
  totalPrice: number;
  hotelName: string;
  issuedAt: string;
  paymentDeadline: string;
}

const MOCK_SUPPLIER = {
  bankName: 'Хаан банк',
  accountNumber: 'MN 35000 400 5682083754',
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function infoRow(label: string, value: string): string {
  return `
    <div style="display:flex;gap:4px;margin-bottom:4px;">
      <span style="color:#6b7280;font-size:11px;width:144px;flex-shrink:0;">${escapeHtml(label)}:</span>
      <span style="font-size:12px;color:#111827;font-weight:500;">${escapeHtml(value || '—')}</span>
    </div>
  `;
}

export function buildInvoiceHtmlDocument(data: InvoiceDocumentData): string {
  const supplierName = data.hotelName || 'Мая Хотелс ХХК';
  const customerBlock =
    data.type === 'individual'
      ? [
          infoRow('Овог', data.customerLastName),
          infoRow('Нэр', data.customerName),
          infoRow('Утас', data.customerPhone),
          infoRow('И-мэйл', data.customerEmail),
        ].join('')
      : [
          infoRow('Байгууллагын нэр', data.orgName || data.customerName),
          infoRow('Байгууллагын РД', data.orgRegister || '—'),
        ].join('');

  const roomRows = data.rooms
    .map(
      (room, index) => `
        <tr style="background:${index % 2 === 1 ? '#f9fafb' : '#ffffff'};">
          <td style="border:1px solid #d1d5db;padding:8px 10px;text-align:center;">${index + 1}</td>
          <td style="border:1px solid #d1d5db;padding:8px 10px;">${escapeHtml(room.room_name)}</td>
          <td style="border:1px solid #d1d5db;padding:8px 10px;color:#6b7280;">${escapeHtml(room.detail || '—')}</td>
          <td style="border:1px solid #d1d5db;padding:8px 10px;text-align:right;">${room.price_per_night.toLocaleString()} ₮</td>
          <td style="border:1px solid #d1d5db;padding:8px 10px;text-align:center;">${room.room_count}</td>
          <td style="border:1px solid #d1d5db;padding:8px 10px;text-align:right;font-weight:600;">${room.total_price.toLocaleString()} ₮</td>
        </tr>
      `
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="mn">
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(data.modalTitle)} — ${escapeHtml(data.bookingCode)}</title>
    <style>
      * { box-sizing: border-box; }
      body {
        margin: 0;
        padding: 32px;
        color: #111827;
        font-family: Arial, Helvetica, sans-serif;
        background: #ffffff;
      }
      @media print {
        body { padding: 20px; }
      }
    </style>
  </head>
  <body>
    <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:24px;">
      <span style="font-size:20px;font-weight:700;">MyRoom</span>
      <h1 style="flex:1;text-align:center;font-size:18px;font-weight:600;margin:0;">Нэхэмжлэх нь</h1>
      <div style="width:80px;"></div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:24px;">
      <div>
        <p style="font-size:12px;font-weight:600;margin:0 0 8px;padding-bottom:4px;border-bottom:1px solid #e5e7eb;">Нэхэмжлэгч:</p>
        ${infoRow('Байгууллагын нэр', supplierName)}
        ${infoRow('Байгууллагын РД', '6105122')}
        ${infoRow('Банкны нэр', MOCK_SUPPLIER.bankName)}
        ${infoRow('Дансны дугаар', MOCK_SUPPLIER.accountNumber)}
        ${infoRow('Дансны нэр', supplierName)}
        ${infoRow('Гүйлгээний утга', data.bookingCode)}
      </div>
      <div>
        <p style="font-size:12px;font-weight:600;margin:0 0 8px;padding-bottom:4px;border-bottom:1px solid #e5e7eb;">Захиалагч:</p>
        ${customerBlock}
        ${infoRow('Нэхэмжилсэн огноо', data.issuedAt)}
        ${infoRow('Төлбөр хийх хугацаа', data.paymentDeadline)}
      </div>
    </div>

    <table style="width:100%;border-collapse:collapse;font-size:12px;margin-bottom:24px;">
      <thead>
        <tr style="background:#4b5563;color:#ffffff;">
          <th style="border:1px solid #9ca3af;padding:8px 10px;text-align:left;width:32px;">№</th>
          <th style="border:1px solid #9ca3af;padding:8px 10px;text-align:left;">Өрөөний нэр</th>
          <th style="border:1px solid #9ca3af;padding:8px 10px;text-align:left;">Дэлгэрэнгүй</th>
          <th style="border:1px solid #9ca3af;padding:8px 10px;text-align:right;">Нэгжийн үнэ</th>
          <th style="border:1px solid #9ca3af;padding:8px 10px;text-align:center;">Өрөөний тоо</th>
          <th style="border:1px solid #9ca3af;padding:8px 10px;text-align:right;">Нийт үнэ</th>
        </tr>
      </thead>
      <tbody>
        ${roomRows}
      </tbody>
      <tfoot>
        <tr style="background:#f3f4f6;">
          <td colspan="5" style="border:1px solid #d1d5db;padding:8px 10px;text-align:right;font-weight:600;">Нийт дүн</td>
          <td style="border:1px solid #d1d5db;padding:8px 10px;text-align:right;font-weight:700;font-size:14px;">${data.totalPrice.toLocaleString()} ₮</td>
        </tr>
      </tfoot>
    </table>

    <div style="display:flex;gap:24px;padding-top:16px;border-top:1px solid #e5e7eb;">
      <div style="width:128px;height:112px;border:2px dashed #d1d5db;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
        <span style="font-size:12px;color:#9ca3af;">Тамга</span>
      </div>
      <div style="flex:1;">
        <p style="font-size:14px;font-weight:700;margin:0 0 4px;">MyRoom.mn</p>
        <p style="font-size:12px;color:#4b5563;margin:2px 0;"><strong>Утас:</strong> 7777-7777</p>
        <p style="font-size:12px;color:#4b5563;margin:2px 0;"><strong>И-мэйл:</strong> contact@myroom.mn</p>
        <p style="font-size:12px;color:#4b5563;margin:2px 0;"><strong>Вэб сайт:</strong> myroom.mn</p>
        <p style="font-size:12px;color:#4b5563;margin:2px 0;"><strong>Хаяг:</strong> Сеулийн гудамж, 3-р хороо, Сүхбаатар дүүрэг, Улаанбаатар хот, Монгол улс, Сарора төв</p>
      </div>
    </div>
  </body>
</html>`;
}

export function openInvoicePrintWindow(html: string): void {
  const win = window.open('', '_blank');
  if (!win) return;

  win.document.open();
  win.document.write(html);
  win.document.close();

  let printed = false;
  const triggerPrint = () => {
    if (printed || win.closed) return;
    printed = true;
    win.focus();
    win.print();
  };

  const closeWindow = () => {
    if (!win.closed) win.close();
  };

  win.addEventListener('afterprint', closeWindow);
  window.setTimeout(closeWindow, 2000);

  if (win.document.readyState === 'complete') {
    window.setTimeout(triggerPrint, 150);
  } else {
    win.addEventListener('load', () => window.setTimeout(triggerPrint, 150), { once: true });
  }
}

function addCanvasToPdf(canvas: HTMLCanvasElement, pdf: jsPDF): void {
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  const imgData = canvas.toDataURL('image/jpeg', 0.92);

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }
}

/** Render isolated inline-styled HTML (avoids Tailwind oklch that html2canvas cannot parse). */
async function renderInvoiceHtmlToCanvas(html: string): Promise<HTMLCanvasElement> {
  const iframe = document.createElement('iframe');
  iframe.setAttribute('aria-hidden', 'true');
  iframe.style.cssText =
    'position:fixed;left:-10000px;top:0;width:794px;height:1123px;border:0;visibility:hidden;';
  document.body.appendChild(iframe);

  try {
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) {
      throw new Error('Could not create invoice frame');
    }

    doc.open();
    doc.write(html);
    doc.close();

    await new Promise<void>((resolve) => {
      const done = () => resolve();
      iframe.addEventListener('load', done, { once: true });
      window.setTimeout(done, 80);
    });

    return html2canvas(doc.body, {
      scale: 1.25,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
      foreignObjectRendering: false,
      windowWidth: 794,
    });
  } finally {
    iframe.remove();
  }
}

export async function downloadInvoicePdf(data: InvoiceDocumentData): Promise<void> {
  const html = buildInvoiceHtmlDocument(data);
  const canvas = await renderInvoiceHtmlToCanvas(html);
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  addCanvasToPdf(canvas, pdf);
  pdf.save(`invoice-${data.bookingCode}.pdf`);
}
