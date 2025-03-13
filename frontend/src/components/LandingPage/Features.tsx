'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import documentinsights from '@/assets/document_insights.png'
import { Button } from '../ui/button';
import {Link} from '@/i18n/navigation';

export default function FeaturesParallax() {
  const t = useTranslations('HomePage.features');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  
  const features = t.raw('items');

  return (
    <section className="py-16 px-4 space-y-16 mx-auto max-w-7xl" dir={isRTL ? 'rtl' : 'ltr'}>
      {features.map((feature: any, index: number) => (
        <motion.div
          key={feature.title}
          className={`flex flex-col md:flex-row ${
            isRTL ? 
              (index % 2 === 0 ? '' : 'md:flex-row-reverse') :
              (index % 2 === 0 ? 'md:flex-row-reverse' : '')
          } bg-white/5 backdrop-blur-lg rounded-xl p-8 shadow-lg hover:shadow-white/50 transition-transform hover:-translate-y-2 border-${isRTL ? 'r' : 'l'}-4 border-gray-200 items-center gap-8`}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <motion.div
            className="w-full md:w-1/2"
            initial={{ scale: 0.8 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <Image
              src={feature.image || documentinsights}
              alt={feature.title}
              width={500}
              height={500}
              className="rounded-lg shadow-lg"
            />
          </motion.div>
          <div className="w-full md:w-1/2">
            <motion.h2
              className="text-3xl font-bold text-blue-300 mb-1"
              initial={{ x: isRTL ? 30 : -30, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              {feature.title}
            </motion.h2>
            <motion.h3
              className="text-lg font-semibold text-gray-200 mb-4"
              initial={{ x: isRTL ? 30 : -30, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              {feature.subTitle}
            </motion.h3>
            <motion.p
              className="text-gray-300 text-lg"
              initial={{ x: isRTL ? 30 : -30, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            >
              {feature.description}
            </motion.p>
            <Button className={`bg-gradient-to-r ${isRTL ? 'from-[#67E8F9] to-[#2563EB] hover:from-[#2563EB] hover:to-[#67E8F9]' : 'from-[#2563EB] to-[#67E8F9] hover:from-[#67E8F9] hover:to-[#2563EB]'} text-slate-900 font-bold mt-4 px-6 py-2 rounded-full shadow-md transition-all duration-300 transform hover:scale-105`}>
              <Link href={'/login'}>{t('learnMore')}</Link>
            </Button>
          </div>
        </motion.div>
      ))}
    </section>
  );
}
