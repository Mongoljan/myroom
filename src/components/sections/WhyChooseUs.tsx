'use client';

import { motion, Variants } from 'framer-motion';
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

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 30 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <section className="py-12 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-3">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            {t('features.whyChooseUs', 'Яагаад биднийг сонгох хэрэгтэй вэ?')}
          </h2>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto">
            {t('features.whyChooseUsDesc', 'Why choose us')}
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
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
                className={`inline-flex items-center justify-center w-12 h-12 ${feature.color} rounded-xl mb-4 group-hover:shadow-sm transition-shadow duration-200`}
              >
                <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
              </motion.div>

              {/* Content */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 max-w-sm mx-auto">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}