'use client';

import { useRef } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Printer, X } from 'lucide-react';

interface InvoiceRoom {
  room_name: string;
  detail?: string;
  price_per_night: number;
  room_count: number;
  total_price: number;
}

interface InvoiceModalProps {
  open: boolean;
  onClose: () => void;
  type: 'individual' | 'company';
  // Customer info
  customerName: string;
  customerLastName: string;
  customerPhone: string;
  customerEmail: string;
  orgName?: string;
  orgRegister?: string;
  // Booking data
  bookingCode: string;
  rooms: InvoiceRoom[];
  totalPrice: number;
  // Hotel / supplier info
  hotelName: string;
}

// Mock supplier bank details — replace with real API data when available
const MOCK_SUPPLIER = {
  bankName: 'Хаан банк',
  accountNumber: 'MN 35000 400 5682083754',
};

function formatDateTime(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const h = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${y}/${m}/${d} ${h}:${min}`;
}

export default function InvoiceModal({
  open,
  onClose,
  type,
  customerName,
  customerLastName,
  customerPhone,
  customerEmail,
  orgName,
  orgRegister,
  bookingCode,
  rooms,
  totalPrice,
  hotelName,
}: InvoiceModalProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const now = new Date();
  const issuedAt = formatDateTime(now);
  const paymentDeadline = type === 'individual' ? '10 минут дотор хүчинтэй' : '3 цаг дотор хүчинтэй';

  const handlePrint = () => {
    if (!printRef.current) return;
    const printContents = printRef.current.innerHTML;
    const win = window.open('', '_blank', 'width=900,height=700');
    if (!win) return;
    win.document.write(`
      <html>
        <head>
          <title>Нэхэмжлэх — ${bookingCode}</title>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Arial', sans-serif; }
            body { background: white; padding: 32px; color: #111; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ccc; padding: 6px 10px; font-size: 12px; }
            th { background: #4b5563; color: white; font-weight: 600; text-align: left; }
            tfoot td { background: #f3f4f6; font-weight: 700; }
            .label { color: #6b7280; font-size: 11px; }
            .value { font-size: 12px; color: #111; }
          </style>
        </head>
        <body>${printContents}</body>
      </html>
    `);
    win.document.close();
    win.focus();
    win.print();
    win.close();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="w-[95vw] max-w-3xl p-0 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 dark:border-gray-700 shrink-0">
          <DialogTitle className="text-sm font-semibold text-gray-900 dark:text-white">
            {type === 'individual' ? 'Хувь хүний нэхэмжлэх' : 'Байгууллагын нэхэмжлэх'}
          </DialogTitle>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Хэвлэх
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Invoice document */}
        <div className="overflow-y-auto flex-1">
          <div ref={printRef} className="bg-white p-8 text-gray-900">
            {/* Doc header */}
            <div className="flex items-start justify-between mb-6">
              <span className="text-xl font-bold tracking-tight text-gray-900">MyRoom</span>
              <h2 className="text-lg font-semibold text-gray-800 text-center flex-1">
                Нэхэмжлэх нь
              </h2>
              <div className="w-20" /> {/* spacer */}
            </div>

            {/* Two-column info */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              {/* Supplier (Нэхэмжлэгч) */}
              <div>
                <p className="text-xs font-semibold text-gray-700 mb-2 border-b border-gray-200 pb-1">
                  Нэхэмжлэгч:
                </p>
                <div className="space-y-1">
                  <InfoRow label="Байгууллагын нэр" value={hotelName || 'Мая Хотелс ХХК'} />
                  <InfoRow label="Байгууллагын РД" value="6105122" />
                  <InfoRow label="Банкны нэр" value={MOCK_SUPPLIER.bankName} />
                  <InfoRow label="Дансны дугаар" value={MOCK_SUPPLIER.accountNumber} />
                  <InfoRow label="Дансны нэр" value={hotelName || 'Мая Хотелс ХХК'} />
                  <InfoRow label="Гүйлгээний утга" value={bookingCode} />
                </div>
              </div>

              {/* Customer (Захиалагч) */}
              <div>
                <p className="text-xs font-semibold text-gray-700 mb-2 border-b border-gray-200 pb-1">
                  Захиалагч:
                </p>
                <div className="space-y-1">
                  {type === 'individual' ? (
                    <>
                      <InfoRow label="Овог" value={customerLastName || '—'} />
                      <InfoRow label="Нэр" value={customerName || '—'} />
                      <InfoRow label="Утас" value={customerPhone || '—'} />
                      <InfoRow label="И-мэйл" value={customerEmail || '—'} />
                    </>
                  ) : (
                    <>
                      <InfoRow label="Байгууллагын нэр" value={orgName || customerName || '—'} />
                      <InfoRow label="Байгууллагын РД" value={orgRegister || '—'} />
                    </>
                  )}
                  <InfoRow label="Нэхэмжилсэн огноо" value={issuedAt} />
                  <InfoRow label="Төлбөр хийх хугацаа" value={paymentDeadline} />
                </div>
              </div>
            </div>

            {/* Rooms table */}
            <table className="w-full border-collapse text-xs mb-6">
              <thead>
                <tr className="bg-gray-600 text-white">
                  <th className="border border-gray-400 px-2 py-2 text-left font-medium w-8">№</th>
                  <th className="border border-gray-400 px-2 py-2 text-left font-medium">Өрөөний нэр</th>
                  <th className="border border-gray-400 px-2 py-2 text-left font-medium">Дэлгэрэнгүй</th>
                  <th className="border border-gray-400 px-2 py-2 text-right font-medium">Нэгжийн үнэ</th>
                  <th className="border border-gray-400 px-2 py-2 text-center font-medium">Өрөөний тоо</th>
                  <th className="border border-gray-400 px-2 py-2 text-right font-medium">Нийт үнэ</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room, i) => (
                  <tr key={i} className={i % 2 === 1 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="border border-gray-300 px-2 py-2 text-center">{i + 1}</td>
                    <td className="border border-gray-300 px-2 py-2">{room.room_name}</td>
                    <td className="border border-gray-300 px-2 py-2 text-gray-500">{room.detail || '—'}</td>
                    <td className="border border-gray-300 px-2 py-2 text-right">
                      {room.price_per_night.toLocaleString()} ₮
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-center">{room.room_count}</td>
                    <td className="border border-gray-300 px-2 py-2 text-right font-medium">
                      {room.total_price.toLocaleString()} ₮
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-100">
                  <td colSpan={5} className="border border-gray-300 px-2 py-2 text-right font-semibold">
                    Нийт дүн
                  </td>
                  <td className="border border-gray-300 px-2 py-2 text-right font-bold text-sm">
                    {totalPrice.toLocaleString()} ₮
                  </td>
                </tr>
              </tfoot>
            </table>

            {/* Footer */}
            <div className="flex gap-6 pt-4 border-t border-gray-200">
              {/* Stamp placeholder */}
              <div className="w-32 h-28 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center shrink-0">
                <span className="text-xs text-gray-400">Тамга</span>
              </div>

              {/* Contact info */}
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-800 mb-1">MyRoom.mn</p>
                <div className="space-y-0.5 text-xs text-gray-600">
                  <p>
                    <span className="font-medium">Утас:</span> 7777-7777
                  </p>
                  <p>
                    <span className="font-medium">И-мэйл:</span>{' '}
                    <a href="mailto:contact@myroom.mn" className="text-blue-600 underline">
                      contact@myroom.mn
                    </a>
                  </p>
                  <p>
                    <span className="font-medium">Вэб сайт:</span> myroom.mn
                  </p>
                  <p>
                    <span className="font-medium">Хаяг:</span> Сеулийн гудамж, 3-р хороо, Сүхбаатар
                    дүүрэг, Улаанбаатар хот, Монгол улс, Сарора төв
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-1">
      <span className="text-xs text-gray-500 w-36 shrink-0">{label}:</span>
      <span className="text-xs text-gray-900 font-medium">{value}</span>
    </div>
  );
}
