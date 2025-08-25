'use client';

import { motion } from 'framer-motion';
import { Shield, Zap, Users } from 'lucide-react';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';

export default function WhyChooseUs() {
  const { t } = useHydratedTranslation();
  
  const features = [
    {
      icon: Shield,
      title: t('features.instantConfirmation', 'Шууд баталгаажуулт'),
      description: t('features.instantConfirmationDesc', 'Манай сайтаар дамжуулан хийсэн захиалга нь хэрэглэгчдийн бүх захиалгууд.'),
      color: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      icon: Zap,
      title: t('features.fastService', 'Хурдан хүргэлт үйлчилгээ'),
      description: t('features.fastServiceDesc', 'Бид танд хамгийн чанартай хүргэлт үйлчилгээг санал болгож байна.'),
      color: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      icon: Users,
      title: t('features.wideSelection', 'Өргөн сонголт'),
      description: t('features.wideSelectionDesc', 'Монголын орон тооног хотод хүүхэдэд зориулсан хүүхэдийн болон өндөр зэрэглэлийн зочид буудлууд.'),
      color: 'bg-purple-100', 
      iconColor: 'text-purple-600'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t('features.whyChooseUs', 'Яагаад биднийг сонгох хэрэгтэй вэ?')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('features.whyChooseUsDesc', 'Why choose us')}
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="text-center group"
            >
              {/* Icon */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className={`inline-flex items-center justify-center w-20 h-20 ${feature.color} rounded-2xl mb-6 group-hover:shadow-lg transition-shadow duration-300`}
              >
                <feature.icon className={`w-10 h-10 ${feature.iconColor}`} />
              </motion.div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed max-w-sm mx-auto">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            {t('common.readMore', 'Дэлгэрэнгүй мэдээлэл авах')}
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}