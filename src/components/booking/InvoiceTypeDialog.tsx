'use client';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Building2, User } from 'lucide-react';

interface InvoiceTypeDialogProps {
  open: boolean;
  onClose: () => void;
  onSelect: (type: 'individual' | 'company') => void;
}

export default function InvoiceTypeDialog({ open, onClose, onSelect }: InvoiceTypeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="w-[90vw] max-w-sm p-0 overflow-hidden">
        <div className="p-6">
          <DialogTitle className="text-base font-semibold text-gray-900 dark:text-white text-center mb-6">
            Нэхэмжлэлийг хэн дээр гаргах вэ?
          </DialogTitle>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onSelect('individual')}
              className="flex flex-col items-center gap-3 p-5 border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:border-primary hover:bg-primary/5 transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">Хувь хүн</span>
            </button>

            <button
              onClick={() => onSelect('company')}
              className="flex flex-col items-center gap-3 p-5 border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:border-primary hover:bg-primary/5 transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center group-hover:bg-emerald-200 dark:group-hover:bg-emerald-900/50 transition-colors">
                <Building2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">Байгууллага</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="mt-4 w-full text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 py-2 transition-colors"
          >
            Цуцлах
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
