'use client';

import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Building2,
  Shield,
  TrendingUp,
  BarChart3,
  Globe2,
  Package,
  Target,
  Users2,
  Sparkles,
  Award
} from 'lucide-react';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';

export default function AboutPageContent() {
  const { t } = useHydratedTranslation();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Clean and simple */}
      <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute inset-0 opacity-20"
            style={{
              background: "linear-gradient(45deg, #3b82f6, #2563eb, #1e40af, #1d4ed8, #3b82f6)",
              backgroundSize: "400% 400%"
            }}
          />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Танилцуулга
            </h1>
            <p className="text-lg md:text-xl text-blue-100 leading-relaxed max-w-3xl mx-auto">
              Монгол орны хаанаас ч хамгийн хялбар, найдвартай өрөө захиалгын үйлчилгээ
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us - 3 simple cards */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Эрхэм зорилго
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: CheckCircle2,
                title: 'Манай сайтаар дамжуулан хийсэн захиалга бүр шууд батлагдахына',
                description: 'Ингэснээр та захиалга дээрээдээх цуцлалтаай хэзээд эмзэглэхгүй хөлсөөдэл амар нөхөөрхөн эргээн тоочлоод үлэгч ээмэг цагдаа боломжтой.'
              },
              {
                icon: TrendingUp,
                title: 'Өрсөлдөхүйц үнэ',
                description: 'Бид таны ямагт нэмэлт төлбөртэй, хамгийн боломжит хөнгөлөлттэй үнийг санал болгох байна.'
              },
              {
                icon: Shield,
                title: 'Найдвартай үйлчилгээ',
                description: 'Монголын орон төөөлбөн хот, аялал жуулчлалын өөсад дэх хамгийн хөмчээг эклээд таньсыг зэрэгтээлийн буудлуудаас өрийн хайж байгаа өрөөгөө олох боломжтой.'
              }
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                >
                  <div className="bg-white border border-gray-200 rounded-xl p-8 h-full hover:shadow-xl hover:border-gray-300 transition-all duration-300">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-slate-900 mb-6">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 leading-snug">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Vision Section - Gradient card like before */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 md:p-12 overflow-hidden relative">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl" />

            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-6 text-sm font-semibold text-white">
                  <Target className="w-4 h-4" />
                  Алсын хараа
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Алсын хараа
                </h2>
                <p className="text-lg text-gray-300 leading-relaxed">
                  Өөрсдийн турших болон олон улсын ноу-хаугаас ямагт сурвалцан, дэлхийн стандарттай хэл нийлүүлэн алхаж, хэрэглэг болон харилцагчдынхаа итгэлийг хүлээсэн үйлчилгээг цогцлооно.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="grid grid-cols-2 gap-4"
              >
                {[
                  { label: 'Сэтгэл ханамж', value: '100%', icon: Sparkles },
                  { label: 'Найдвартай', value: 'шилд', icon: Shield },
                  { label: 'Харилцагатай', value: 'түслэгч', icon: Users2 },
                  { label: 'Өсөлт хөгжил', value: 'руу', icon: TrendingUp }
                ].map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all"
                    >
                      <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 mb-3">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                      <div className="text-sm text-gray-400">{stat.label}</div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section - Clean and simple */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Бидний үйлчилгээ
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Globe2,
                title: 'MYROOM.MN',
                subtitle: 'өрөө захиалгын платформ',
                description: 'Монголын хаанаас ч хэзээд өөрийн хайж байгаа өрөөгөө хамгийн хөлөөр бөгөөд хамгийн хялбар боломж'
              },
              {
                icon: Building2,
                title: 'ӨРӨӨ БҮРТГЭЛИЙН СИСТЕМ',
                subtitle: 'Зөвхөн тодорхой тооны өрөө',
                description: 'Зөвхөн тодорхой тооны өрөгөө сайтаар дамж, боролдаттай аз өсгөхөр зорих байгаа бол'
              },
              {
                icon: BarChart3,
                title: 'ӨРӨӨ МЕНЕЖМЕНТИЙН СИСТЕМ',
                subtitle: 'Буудлын үйл ажиллагаа',
                description: 'Буудлынхаа дотоод үйл ажиллагааг хянах, үдрддэх нэгдсэн систем сонирхож байгаа бол'
              },
              {
                icon: Package,
                title: 'БУУДЛЫН ХАНГАМЖ',
                subtitle: 'Барааг захиалга',
                description: 'Буудлынхаа хангамж, бараад хамгийн боломжит үнэ, төлбөрийн уян хатан нөхцлөөр'
              }
            ].map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="bg-white rounded-xl p-6 h-full shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-slate-900 mb-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xs font-bold text-gray-900 mb-1 uppercase tracking-wider">
                      {service.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3 font-medium">
                      {service.subtitle}
                    </p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
