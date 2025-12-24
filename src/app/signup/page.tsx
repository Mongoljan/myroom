"use client";

import Link from "next/link";
import Image from 'next/image';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';

export default function SignupPage() {
  const { t } = useHydratedTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
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
            {t('AuthSignup.createAccount', 'Шинэ бүртгэл үүсгэх')}
          </h2>
        </div>
        <form className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <input
                type="text"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder={t('AuthSignup.fullName', 'Бүтэн нэр')}
              />
            </div>
            <div>
              <input
                type="email"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder={t('AuthSignup.emailAddress', 'Имэйл хаяг')}
              />
            </div>
            <div>
              <input
                type="password"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder={t('AuthSignup.password', 'Нууц үг')}
              />
            </div>
            <div>
              <input
                type="password"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder={t('AuthSignup.confirmPassword', 'Нууц үг баталгаажуулах')}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              {t('AuthSignup.signUpButton', 'Бүртгүүлэх')}
            </button>
          </div>

          <div className="text-center">
            <Link href="/login" className="text-primary hover:underline">
              {t('AuthSignup.hasAccount', 'Бүртгэлтэй юу?')} {t('AuthSignup.signIn', 'Нэвтрэх')}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}