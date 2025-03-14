'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import {  ArrowRight } from 'lucide-react'
import FeaturesParallax from './Features'
import { ContactUsOne} from './Contactus'
import { SparklesPreview } from './SparklesPreview'
import { Spotlight } from '../ui/spotlight-new'
import NavHeader from './header'
import {Link} from '@/i18n/navigation'
import { useLocale, useTranslations } from 'next-intl'




type FloatingShapeProps = {
  children: React.ReactNode
  initialX: number
  initialY: number
}

const FloatingShape: React.FC<FloatingShapeProps> = ({ children, initialX, initialY }) => (
  <motion.div
    initial={{ x: initialX, y: initialY }}
    animate={{ x: initialX + 20, y: initialY + 20 }}
    transition={{ repeat: Infinity, repeatType: 'reverse', duration: 5, ease: 'easeInOut' }}
    className="absolute opacity-20"
  >
    {children}
  </motion.div>
)



const Hero: React.FC = () => {
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const t = useTranslations('HomePage.hero')
  
  return (
    <section id='home' className="min-h-screen relative overflow-hidden bg-gradient-to-r from-slate-900 to-slate-700">

      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      <div className="absolute inset-0">
        <FloatingShape initialX={100} initialY={100}><div className="w-16 h-16 md:w-32 md:h-32 rounded-full bg-[#1E293B]" /></FloatingShape>
        <FloatingShape initialX={700} initialY={200}><div className="w-12 h-12 md:w-24 md:h-24 rounded-full bg-[#334155]" /></FloatingShape>
        <FloatingShape initialX={200} initialY={500}><div className="w-20 h-20 md:w-40 md:h-40 rounded-full bg-white opacity-10" /></FloatingShape>
        <FloatingShape initialX={1200} initialY={400}><div className="w-20 h-20 md:w-40 md:h-40 rounded-full bg-white opacity-10" /></FloatingShape>
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-32 mt-20 md:mt-28 relative">
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center max-w-2xl md:max-w-5xl mx-auto">
          <h1 className={`text-4xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent drop-shadow-lg ${isRTL ? 'font-notoKufiArabic h-44' : 'font-poppins'}`}>
            {t('mainHeading')}
          </h1>
          <p className="text-lg md:text-xl mb-6 md:mb-8 text-gray-300">
            {t('subtitle')}
          </p>
          {/* <HeroButton link={'/login'} text={t('ctaButton')} icon={<ArrowRight className='peer-hover:rotate-12 transition-all duration-100 ease-in' />} /> */}
          <Link href={'/login'}>
            <Button size="lg" variant={"outline"} className="rounded-full font-semibold bg-[#38BDF8] hover:bg-[#67E8F9] text-gray-900 text-lg px-6 md:px-8 py-4 md:py-6 transition-shadow duration-300 shadow-lg hover:shadow-[#38BDF8]">
              <span>{t('ctaButton')}</span> 
              <ArrowRight className='peer-hover:rotate-12 transition-all duration-100 ease-in' />
            </Button>
            </Link>
         
        </motion.div>
      </div>
    </section>
  )
}


type AnimatedSectionProps = {
  children: React.ReactNode
  className?: string
  id: string
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({ children, id }) => {
  return (
    <motion.section id={id} className="py-20 " initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
      {children}
    </motion.section>
  )
}

const Features = () => {
  const t = useTranslations('HomePage.features')
  return (
    <section className='relative bg-gradient-to-r from-slate-900 to-slate-700'>
      <AnimatedSection id="features">
        <SparklesPreview heading={t('title')} textColor='bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent' />
        <FeaturesParallax />
      </AnimatedSection>
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-b from-[#1E293B] via-gray-800 to-transparent blur-2xl opacity-70"></div>
    </section>
  )
}
  
const AboutUs = () => {
  const t = useTranslations('HomePage.aboutUs')
  
  return (
    <section className='bg-gradient-to-r from-slate-900 to-slate-700'>
      <AnimatedSection id="about-us">
        <div className="container mx-auto px-6">
          <SparklesPreview heading={t('title')} textColor="bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent" />
          <div className="max-w-3xl mx-auto text-center text-gray-300">
            <p className="text-xl mb-6">
              {t('description1')}
            </p>
            <p className="text-xl mb-6">
              {t('description2')}
            </p>
          </div>
        </div>
      </AnimatedSection>
    </section>
  )
}

const Contact = () => {
  const t = useTranslations('HomePage.contact')
  return (
    <section className='relative bg-gradient-to-r from-slate-900 to-slate-700'>
      <AnimatedSection id="contact">
        <SparklesPreview heading={t('title')} textColor="bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent" />
        <ContactUsOne/>
      </AnimatedSection>
    </section>
  )
}


const LandingPage: React.FC = () => {
  const locale = useLocale();
  const isRTL = locale === 'ar';
  
  return (
    <div className={`h-fit bg-gradient-to-r from-purple-500 to-purple-900 ${isRTL ? 'font-notoNaskhArabic' : 'font-poppins'}`}>
      {/* <Header /> */}
      <NavHeader/>
      <Hero />
      <Features />
      <AboutUs />
      <Contact />
    </div>
  );
}

export default LandingPage
