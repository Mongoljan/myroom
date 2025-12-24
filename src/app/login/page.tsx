"use client";

import Link from "next/link";
import Image from 'next/image';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';

export default function LoginPage() {
  const { t } = useHydratedTranslation();

  return (
    <div className="flex items-center justify-center bg-gray-50" style={{ minHeight: 'calc(100vh - 80px)' }}>
      <div className="max-w-md w-full space-y-8">
        <div>
          <Image
            className="mx-auto h-12 w-auto"
            src="/img/general/logo-dark.svg"
            alt="MyRoom"
            width={48}
            height={48}
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {t('AuthLogin.signIn', 'Бүртгэлдээ нэвтрэх')}
          </h2>
        </div>
        <form className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder={t('AuthLogin.emailPlaceholder', 'Имэйл хаяг')}
              />
            </div>
            <div>
              <input
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder={t('AuthLogin.passwordPlaceholder', 'Нууц үг')}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              {t('AuthLogin.signInButton', 'Нэвтрэх')}
            </button>
          </div>

          <div className="text-center">
            <Link href="/signup" className="text-primary hover:underline">
              {t('AuthLogin.noAccount', 'Бүртгэл байхгүй юу?')} {t('AuthLogin.signUp', 'Бүртгүүлэх')}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}