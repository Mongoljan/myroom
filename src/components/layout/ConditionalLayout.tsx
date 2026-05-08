'use client';

import { usePathname } from 'next/navigation';
import Header1 from '@/components/header/Header1';
import Footer from '@/components/layout/Footer';
import AuthHeader from '@/components/layout/AuthHeader';

const AUTH_PATHS = ['/login', '/signup'];

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = AUTH_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'));

  if (isAuthPage) {
    return (
      <>
        <div className="print:hidden">
          <AuthHeader />
        </div>
        <main>{children}</main>
      </>
    );
  }

  return (
    <>
      <div className="print:hidden">
        <Header1 />
      </div>
      <main>{children}</main>
      <div className="print:hidden">
        <Footer />
      </div>
    </>
  );
}
