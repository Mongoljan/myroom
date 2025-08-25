'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Phone, MapPin, Mail } from 'lucide-react';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';

export default function Footer() {
  const { t } = useHydratedTranslation();
  return (
    <footer className="bg-slate-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 lg:col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">MR</span>
              </div>
              <span className="text-2xl font-bold">MyRoom</span>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-lg mb-4">{t('footer.contactUs', 'ХОЛБОО БАРИХ').toUpperCase()}</h4>
              
              <div className="flex items-center space-x-3 text-gray-300">
                <Phone className="w-5 h-5 text-blue-400" />
                <span>+976-7777-7777</span>
              </div>
              
              <div className="flex items-center space-x-3 text-gray-300">
                <Mail className="w-5 h-5 text-blue-400" />
                <span>info@myroom.mn</span>
              </div>
              
              <div className="flex items-start space-x-3 text-gray-300">
                <MapPin className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <span>
                  {t('footer.address', 'Peace Ave 14-6, 2nd Floor, Chingeltei District, Ulaanbaatar 14240, Ulaanbaatar, Mongolia')}
                </span>
              </div>
            </div>
          </div>

          {/* Hotel Services */}
          <div>
            <h4 className="font-semibold text-lg mb-6">{t('navigation.hotels', 'ЗОЧИД БУУДАЛ').toUpperCase()}</h4>
            <ul className="space-y-3 text-gray-300">
              <li><Link href="/hotels" className="hover:text-blue-400 transition-colors">{t('hotel.search', 'Зочид буудал хайх')}</Link></li>
              <li><Link href="/offers" className="hover:text-blue-400 transition-colors">{t('footer.specialOffers', 'Онцгой санал')}</Link></li>
              <li><Link href="/destinations" className="hover:text-blue-400 transition-colors">{t('navigation.destinations', 'Аялах газар')}</Link></li>
              <li><Link href="/reviews" className="hover:text-blue-400 transition-colors">{t('hotel.reviews', 'Үнэлгээ сэтгэгдэл')}</Link></li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h4 className="font-semibold text-lg mb-6">{t('footer.support', 'ТУСЛАМЖ').toUpperCase()}</h4>
            <ul className="space-y-3 text-gray-300">
              <li><Link href="/help" className="hover:text-blue-400 transition-colors">{t('footer.helpCenter', 'Тусламжийн төв')}</Link></li>
              <li><Link href="/contact" className="hover:text-blue-400 transition-colors">{t('navigation.contact', 'Холбоо барих')}</Link></li>
              <li><Link href="/cancellation" className="hover:text-blue-400 transition-colors">{t('footer.cancellationPolicy', 'Цуцлах бодлого')}</Link></li>
              <li><Link href="/faq" className="hover:text-blue-400 transition-colors">{t('faq.title', 'Түгээмэл асуулт')}</Link></li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="font-semibold text-lg mb-6">{t('footer.aboutUs', 'БИДНИЙ ТУХАЙ').toUpperCase()}</h4>
            <ul className="space-y-3 text-gray-300">
              <li><Link href="/about" className="hover:text-blue-400 transition-colors">{t('footer.aboutUs', 'Компанийн тухай')}</Link></li>
              <li><Link href="/careers" className="hover:text-blue-400 transition-colors">{t('footer.careers', 'Ажлын байр')}</Link></li>
              <li><Link href="/partners" className="hover:text-blue-400 transition-colors">{t('footer.partners', 'Хамтрагч байгууллага')}</Link></li>
              <li><Link href="/blog" className="hover:text-blue-400 transition-colors">{t('footer.blog', 'Блог мэдээлэл')}</Link></li>
            </ul>
          </div>
        </div>

        {/* App Download Section */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <span className="text-gray-300">{t('footer.downloadApp', 'Аппликешн татах')}:</span>
              <div className="flex items-center space-x-3">
                <Link href="#" className="hover:opacity-80 transition-opacity">
                  <div className="bg-black rounded-lg px-4 py-2 flex items-center space-x-2">
                    <Image 
                      src="/app-store-white.svg" 
                      alt="App Store" 
                      width={20} 
                      height={20}
                      className="w-5 h-5"
                    />
                    <div className="text-white text-xs">
                      <div>Download on the</div>
                      <div className="font-semibold">App Store</div>
                    </div>
                  </div>
                </Link>
                
                <Link href="#" className="hover:opacity-80 transition-opacity">
                  <div className="bg-black rounded-lg px-4 py-2 flex items-center space-x-2">
                    <Image 
                      src="/google-play-white.svg" 
                      alt="Google Play" 
                      width={20} 
                      height={20}
                      className="w-5 h-5"
                    />
                    <div className="text-white text-xs">
                      <div>Get it on</div>
                      <div className="font-semibold">Google Play</div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-300">{t('footer.followUs', 'Бидэнтэй холбогдох')}:</span>
              <div className="flex space-x-3">
                <Link href="#" className="w-10 h-10 bg-gray-700 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </Link>
                
                <Link href="#" className="w-10 h-10 bg-gray-700 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </Link>
                
                <Link href="#" className="w-10 h-10 bg-gray-700 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.093.112.106.21.078.323-.085.361-.278 1.13-.315 1.29-.053.225-.172.271-.402.163-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.748-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                  </svg>
                </Link>
                
                <Link href="#" className="w-10 h-10 bg-gray-700 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="bg-slate-950 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2025 MyRoom. {t('footer.allRightsReserved', 'Зохиогч эрхийн хуулиар хамгаалагдсан')}.
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <Link href="/privacy" className="hover:text-white transition-colors">
                {t('footer.privacyPolicy', 'Нууцлалын бодлого')}
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                {t('footer.termsOfService', 'Үйлчилгээний нөхцөл')}
              </Link>
              <Link href="/cookies" className="hover:text-white transition-colors">
                {t('footer.cookiePolicy', 'Cookie бодлого')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}