'use client';

import { motion } from 'framer-motion';
import React from 'react';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';

// Breathtaking Professional SVG Icons
const InstantConfirmationIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 40 40" fill="none" className={className}>
    <defs>
      <linearGradient id="shield-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10b981" />
        <stop offset="50%" stopColor="#059669" />
        <stop offset="100%" stopColor="#047857" />
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
        <feMerge> 
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/> 
        </feMerge>
      </filter>
    </defs>
    {/* Modern Shield Base */}
    <path 
      d="M20 4l12 4.5v9c0 7.5-5.2 14.5-12 16.5-6.8-2-12-9-12-16.5v-9L20 4z" 
      fill="url(#shield-grad)" 
      filter="url(#glow)"
    />
    {/* Lightning Fast Check */}
    <path 
      d="m14 20 4 4 8-8" 
      stroke="#fff" 
      strokeWidth="3" 
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Sparkle Effects */}
    <circle cx="12" cy="12" r="1" fill="#fff" opacity="0.8" />
    <circle cx="28" cy="14" r="1.5" fill="#fff" opacity="0.6" />
    <circle cx="26" cy="26" r="1" fill="#fff" opacity="0.9" />
  </svg>
);

const CompetitivePriceIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 40 40" fill="none" className={className}>
    <defs>
      <linearGradient id="price-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3b82f6" />
        <stop offset="50%" stopColor="#2563eb" />
        <stop offset="100%" stopColor="#1d4ed8" />
      </linearGradient>
      <linearGradient id="coin-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fbbf24" />
        <stop offset="50%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#d97706" />
      </linearGradient>
    </defs>
    {/* Premium Wallet Base */}
    <rect x="8" y="12" width="24" height="18" rx="3" fill="url(#price-grad)" />
    <rect x="8" y="12" width="24" height="6" rx="3" fill="url(#price-grad)" opacity="0.8" />
    
    {/* Floating Coins */}
    <circle cx="15" cy="8" r="4" fill="url(#coin-grad)" />
    <path d="M13 8h4M15 6v4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
    
    <circle cx="25" cy="6" r="3" fill="url(#coin-grad)" opacity="0.8" />
    <path d="M23.5 6h3M25 4.5v3" stroke="#fff" strokeWidth="1" strokeLinecap="round" />
    
    <circle cx="30" cy="10" r="2.5" fill="url(#coin-grad)" opacity="0.6" />
    <path d="M29 10h2M30 9v2" stroke="#fff" strokeWidth="0.8" strokeLinecap="round" />
    
    {/* Card Details */}
    <rect x="12" y="20" width="8" height="2" rx="1" fill="#fff" opacity="0.3" />
    <rect x="12" y="24" width="12" height="2" rx="1" fill="#fff" opacity="0.2" />
  </svg>
);

const ProfessionalServiceIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 40 40" fill="none" className={className}>
    <defs>
      <linearGradient id="service-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8b5cf6" />
        <stop offset="50%" stopColor="#7c3aed" />
        <stop offset="100%" stopColor="#6d28d9" />
      </linearGradient>
      <linearGradient id="team-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ec4899" />
        <stop offset="100%" stopColor="#be185d" />
      </linearGradient>
    </defs>
    {/* Professional Team Formation */}
    <circle cx="20" cy="14" r="6" fill="url(#service-grad)" />
    <circle cx="20" cy="14" r="3" fill="#fff" />
    <circle cx="13" cy="18" r="4" fill="url(#team-grad)" opacity="0.8" />
    <circle cx="27" cy="18" r="4" fill="url(#team-grad)" opacity="0.8" />
    
    {/* Excellence Crown */}
    <path d="M14 10l2-4 4 2 4-2 2 4" stroke="url(#service-grad)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    
    {/* Network Connection Lines */}
    <path d="M17 16l-2 1M23 16l2 1" stroke="url(#service-grad)" strokeWidth="1.5" opacity="0.6" />
    
    {/* Premium Service Base */}
    <rect x="8" y="26" width="24" height="8" rx="4" fill="url(#service-grad)" opacity="0.2" />
    <rect x="10" y="28" width="6" height="2" rx="1" fill="url(#service-grad)" opacity="0.4" />
    <rect x="18" y="28" width="8" height="2" rx="1" fill="url(#service-grad)" opacity="0.4" />
    <rect x="28" y="28" width="2" height="2" rx="1" fill="url(#team-grad)" />
    
    {/* Quality Stars */}
    <path d="M32 8l1 2h2l-1.5 1.5L34 14l-2-1-2 1 .5-2.5L29 10h2l1-2z" fill="url(#team-grad)" opacity="0.7" />
  </svg>
);

export default function WhyChooseUs() {
  const { t } = useHydratedTranslation();
  
  const features = [
    {
      icon: InstantConfirmationIcon,
      title: t('features.instantConfirmation', 'Манай сайтаар дамжуулан хийсэн захиалга бүр шууд баталгаажна'),
      description: t('features.instantConfirmationDesc', 'Ингэснээр та захиалга давхардах, цуцлалттай холбоотой ямар нэг эрсдэлгүйгээр санаа амар аялаарай.'),
      color: 'text-green-600',
      bgColor: 'bg-gradient-to-br from-green-50 to-emerald-50',
      borderColor: 'border-green-200'
    },
    {
      icon: CompetitivePriceIcon,
      title: t('features.fastService', 'Өрсөлдөхүйц үнэ'),
      description: t('features.fastServiceDesc', 'Бид танд ямар нэг нэмэлт төлбөргүй, хамгийн боломжит хөнгөлөлттэй үнийг санал болгож байна.'),
      color: 'text-blue-600',
      bgColor: 'bg-gradient-to-br from-blue-50 to-indigo-50',
      borderColor: 'border-blue-200'
    },
    {
      icon: ProfessionalServiceIcon,
      title: t('features.wideSelection', 'Бидний мэргэжлийн багаар хурдан, найдвартай үйлчилгээг мэдэрээрэй'),
      description: t('features.wideSelectionDesc', 'Монголын орны томоохон хот, аялал жуулчлалын бүсүүд дэхь хамгийн хямдаас эхлээд тансаг зэрэглэлийн буудлуудаас та өөрийн хайж байгаа өрөөгөө хялбар олох боломжтой.'),
      color: 'text-purple-600',
      bgColor: 'bg-gradient-to-br from-purple-50 to-pink-50',
      borderColor: 'border-purple-200'
    }
  ];

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            {t('features.whyChooseUs', 'Яагаад биднийг сонгох хэрэгтэй вэ?')}
          </h2>
         
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-5 rounded-lg border border-gray-200 hover:shadow-md transition-shadow h-full flex flex-col"
            >
              <div className="flex gap-x-2">
              <div className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                <feature.icon className="w-8 h-8" />
              </div>
              
              <h3 className={`text-[16px] font-semibold ${feature.color} mb-3`}>
                {feature.title}
              </h3>
              </div>
              
              <p className="text-gray-600 text-sm flex-1">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}