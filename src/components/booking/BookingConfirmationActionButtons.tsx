'use client';

import { Download, Printer } from 'lucide-react';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';

interface BookingConfirmationActionButtonsProps {
  onDownload: () => void;
  onPrint: () => void;
  className?: string;
}

export default function BookingConfirmationActionButtons({
  onDownload,
  onPrint,
  className = '',
}: BookingConfirmationActionButtonsProps) {
  const { t } = useHydratedTranslation();

  const buttonClass =
    'inline-flex items-center gap-1.5 text-sm font-medium text-[#4a5568] hover:text-[#2d3748] dark:text-gray-400 dark:hover:text-gray-200 underline underline-offset-2 transition-colors print:hidden';

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <button type="button" onClick={onDownload} className={buttonClass}>
        <Download className="w-4 h-4 shrink-0" strokeWidth={2} />
        <span>{t('bookingExtra.downloadPDF', 'Татах')}</span>
      </button>
      <button type="button" onClick={onPrint} className={buttonClass}>
        <Printer className="w-4 h-4 shrink-0" strokeWidth={2} />
        <span>{t('bookingExtra.print', 'Хэвлэх')}</span>
      </button>
    </div>
  );
}
