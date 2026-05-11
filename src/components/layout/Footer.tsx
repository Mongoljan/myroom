'use client';

import Link from 'next/link';
import { Phone, MapPin, Mail } from 'lucide-react';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';

export default function Footer() {
  const { t } = useHydratedTranslation();

  return (
    <footer className="bg-slate-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">

          {/* Col 1 — Brand + Contact + Socials */}
          <div className="md:col-span-1 flex flex-col gap-4">
            {/* Logo */}
            <div>
              <span className="text-2xl font-bold text-white">MyRoom</span>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-xs font-semibold text-slate-400 tracking-widest uppercase mb-3">
                {t('footer.contactUs', 'Холбоо барих')}
              </h4>
              <div className="space-y-2 text-sm text-slate-300">
                <a href="tel:77552323" className="flex items-center gap-2 hover:text-white transition-colors">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  7755-2323
                </a>
                <a href="mailto:info@cloudnine.mn" className="flex items-center gap-2 hover:text-white transition-colors">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  info@cloudnine.mn
                </a>
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>Khan-Uul district, 15th khoroo, Chinggis Avenue street, 33/2-1508, Ulaanbaatar, Mongolia</span>
                </div>
              </div>
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-3 mt-1">
              {/* Facebook */}
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              {/* X / Twitter */}
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              {/* Instagram */}
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              {/* LinkedIn */}
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              {/* Telegram */}
              <a href="https://t.me" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2 — БИДНИЙ ТУХАЙ */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 tracking-widest uppercase mb-4">БИДНИЙ ТУХАЙ</h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li><Link href="/about" className="hover:text-white transition-colors">Танилцуулга</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Үйлчилгээний нөхцөл</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Нууцлалын бодлого</Link></li>
              <li><Link href="/logo-download" className="hover:text-white transition-colors">Лого татаж авах</Link></li>
            </ul>
          </div>

          {/* Col 3 — ТУСЛАМЖ */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 tracking-widest uppercase mb-4">ТУСЛАМЖ</h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li><Link href="/help#videos" className="hover:text-white transition-colors">Заавар</Link></li>
              <li><Link href="/help#faq" className="hover:text-white transition-colors">Мэдээлэл</Link></li>
              <li><Link href="/help#faq" className="hover:text-white transition-colors">Түгээмэл асуулт, хариулт</Link></li>
              <li><Link href="/help#contact" className="hover:text-white transition-colors">Санал, хүсэлт</Link></li>
            </ul>
          </div>

          {/* Col 4 — ХАМТАРЧ АЖИЛЛАХ + partner icons */}
          <div className="flex flex-col gap-4">
            <div>
              <h4 className="text-xs font-semibold text-slate-400 tracking-widest uppercase mb-4">ХАМТАРЧ АЖИЛЛАХ</h4>
              <ul className="space-y-2.5 text-sm text-slate-300">
                <li><a href="https://hotel-front-five.vercel.app/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Өрөө удирдлагын систем</a></li>
                <li><a href="https://hotel-front-five.vercel.app/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Бүртгүүлэх / Нэвтрэх</a></li>
              </ul>
            </div>
            {/* Payment partner icons */}
            <div className="flex items-center gap-2 mt-auto pt-2">
              {/* QPay */}
              <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center overflow-hidden">
                <svg viewBox="0 0 40 40" className="w-7 h-7">
                  <circle cx="20" cy="20" r="20" fill="#1565C0"/>
                  <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">Q</text>
                </svg>
              </div>
              {/* SocialPay */}
              <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center overflow-hidden">
                <svg viewBox="0 0 40 40" className="w-7 h-7">
                  <circle cx="20" cy="20" r="20" fill="#E53935"/>
                  <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">SP</text>
                </svg>
              </div>
              {/* Golomt */}
              <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center overflow-hidden">
                <svg viewBox="0 0 40 40" className="w-7 h-7">
                  <circle cx="20" cy="20" r="20" fill="#1E88E5"/>
                  <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">G</text>
                </svg>
              </div>
              {/* Most Money */}
              <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center overflow-hidden">
                <svg viewBox="0 0 40 40" className="w-7 h-7">
                  <circle cx="20" cy="20" r="20" fill="#43A047"/>
                  <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">M</text>
                </svg>
              </div>
            </div>
          </div>

          {/* Col 5 — App downloads */}
          <div className="flex flex-col gap-3 justify-start">
            <a
              href="#"
              className="flex items-center gap-3 bg-black border border-slate-700 rounded-xl px-4 py-2.5 hover:border-slate-500 transition-colors"
            >
              <svg className="w-6 h-6 text-white shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.15-2.19 1.28-2.17 3.82.02 3.02 2.65 4.03 2.68 4.04l-.06.26zM13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <div className="leading-tight">
                <div className="text-slate-400 text-[10px]">Download on the</div>
                <div className="text-white text-sm font-semibold">App Store</div>
              </div>
            </a>
            <a
              href="#"
              className="flex items-center gap-3 bg-black border border-slate-700 rounded-xl px-4 py-2.5 hover:border-slate-500 transition-colors"
            >
              <svg className="w-6 h-6 text-white shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3.18 23.76c.3.17.64.24.99.2l12.6-7.27-2.88-2.88-10.71 9.95zM.54 1.96C.2 2.3 0 2.84 0 3.54v16.92c0 .7.2 1.24.55 1.58l.08.08 9.48-9.48v-.22L.62 1.88l-.08.08zm19.54 8.58l-2.69-1.55-3.19 3.19 3.19 3.19 2.7-1.56c.77-.44.77-1.16 0-1.6l-.01-.67zM4.17.24L16.77 7.5l-2.88 2.88L3.18.43C3.48 0 3.82-.07 4.17.24z"/>
              </svg>
              <div className="leading-tight">
                <div className="text-slate-400 text-[10px]">GET IT ON</div>
                <div className="text-white text-sm font-semibold">Google Play</div>
              </div>
            </a>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-sm text-slate-500">
            © 2025 MyRoom. {t('footer.allRightsReserved', 'Зохиогчийн эрхээр хамгаалагдсан')}.
          </p>
        </div>
      </div>
    </footer>
  );
}

