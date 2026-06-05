import { Suspense } from 'react';
import BookingConfirmationPageContent from '@/components/booking/BookingConfirmationPageContent';

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-[#eef0f3] dark:bg-gray-900 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function BookingConfirmationPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <BookingConfirmationPageContent />
    </Suspense>
  );
}
