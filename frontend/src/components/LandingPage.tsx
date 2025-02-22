'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image, { StaticImageData } from 'next/image'

import { AuroraHero } from './AuroraHero'
import { ArrowBigRight, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import FeaturesParallax from './Features'
import ContactUs from './Contactus'
import { SparklesPreview } from './SparklesPreview'
import { section } from 'framer-motion/client'
import k7logo from '@/assets/k7logo4.png'


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

type ScreenshotCardProps = {
  src: StaticImageData
  alt: string
  delay: number
}

const ScreenshotCard: React.FC<ScreenshotCardProps> = ({ src, alt, delay }) => (
  <motion.div
    initial={{ y: 100, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay, duration: 0.8 }}
    whileHover={{ y: -10, scale: 1.05 }}
    className="relative w-full h-96 rounded-2xl overflow-hidden shadow-xl transform -rotate-6 hover:rotate-0 transition-transform border-2 duration-300 border-red-500"
  >
    <Image src={src} className='w-full h-auto' alt={alt}  />
  </motion.div>
)

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId)
  element?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const Header: React.FC = () => (
  <header className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-3xl w-full py-2 px-8 mx-auto">
    <nav className="container mx-auto px-6 py-4">
      <div className="flex justify-between items-center">
      <span className="flex gap-1 items-center">
    {/* <Image className="drop-shadow-xl shadow-gray-500 w-8" src={k7logo} alt="K7 Knowledge Organizer" width={40} height={40} /> */}
      <h1 className="text-xl md:text-3xl bg-gradient-to-b from-slate-300 to-white bg-clip-text text-transparent drop-shadow-lg font-poppins font-semibold"> K7 Info Harbor</h1>
      </span>
        <ul className="flex space-x-6">
          {['Home','Features', 'About Us', 'Contact'].map((item) => (
            <li key={item}>
              <button
                onClick={() => scrollToSection(item.toLowerCase().replace(' ', '-'))}
                className="text-white font-semibold hover:text-green-500 transition-colors"
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
        <Button variant="secondary" className="bg-green-500 text-white hover:bg-gray-100 hover:text-green-500 rounded-full">
        <Link href="/login">Get Started</Link>
         
        </Button>
      </div>
    </nav>
  </header>
)

const Hero: React.FC = () => (
  <section id='home' className="min-h-screen relative overflow-hidden bg-gradient-to-r from-purple-500 to-purple-900">
    <div className="absolute inset-0">
      <FloatingShape initialX={100} initialY={100}><div className="w-32 h-32 rounded-full bg-purple-200" /></FloatingShape>
      <FloatingShape initialX={700} initialY={200}><div className="w-24 h-24 rounded-full bg-purple-200" /></FloatingShape>
      <FloatingShape initialX={200} initialY={500}><div className="w-40 h-40 rounded-full bg-white" /></FloatingShape>
      <FloatingShape initialX={1200} initialY={400}><div className="w-40 h-40 rounded-full bg-white" /></FloatingShape>
    </div>
    <div className="container mx-auto px-6 pt-32 mt-28 relative">
      <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center max-w-4xl mx-auto">
        <h1 className="text-7xl font-bold mb-6 bg-gradient-to-r from-neutral-100 to-gray-300 bg-clip-text text-transparent">Revolutionize <span className="text-green-400">Enterprise</span> Data Interaction</h1>
        <p className="text-xl mb-8 text-gray-300">Simplify data management, analysis, and collaboration with K7 Enterprise AI Assistant.</p>
        <Button size="lg" variant={"outline"} className="rounded-full font-semibold bg-green-400 hover:bg-green-200 text-purple-900 text-lg px-8 py-6"><span>Start Your Free trial</span> <ArrowRight className='peer-hover:rotate-12 transition-all duration-100 ease-in' /> </Button>
        
      </motion.div>
    </div>
    {/* <div className="mt-20 flex justify-center items-center gap-6">
          {[0.2, 0.4, 0.6].map((delay, idx) => (
            <ScreenshotCard key={idx} src={screen} alt={`Product Screenshot ${idx + 1}`} delay={delay} />
          ))}
        </div> */}
  </section>
)

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

const Features = () => (
  <section className=' relative bg-gradient-to-r from-violet-600 to-indigo-600'>
    <AnimatedSection id="features">
      <SparklesPreview heading="Features"/>
      <FeaturesParallax />
    </AnimatedSection>

      {/* Glowing Blur Effect at Bottom */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-b from-blue-600 via-blue-500 to-transparent blur-2xl opacity-70"></div>
    </section>
  )
  
  const AboutUs = () => (
    <section className='h-screen' >
    <AnimatedSection id="about-us">
      <div className="container mx-auto px-6">
      <SparklesPreview heading="About Us"/>
        <div className="max-w-3xl mx-auto text-center text-gray-200">
          <p className="text-xl mb-6">
            At K7 Enterprise AI, we're dedicated to revolutionizing how businesses interact with their data. 
            Our mission is to empower enterprises with cutting-edge AI solutions that drive informed decision-making 
            and boost productivity.
          </p>
          <p className="text-xl mb-6">
            With a focus on innovation and a deep understanding of enterprise needs, we're committed to delivering 
            powerful, user-friendly AI tools that transform raw data into actionable insights.
          </p>
        </div>
      </div>
    </AnimatedSection>
    </section>
  )
  
  const Contact = () => (
    <section className=' relative bg-gradient-to-r  from-violet-600 to-indigo-600'>
    <AnimatedSection id="contact">
      <SparklesPreview heading="Contact Us"/>
      <ContactUs/>
    </AnimatedSection>
    </section>
  )

const LandingPage: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-r from-purple-500 to-purple-900 font-poppins ">
    <Header />
    <Hero />
    <Features />
   
    <AboutUs />
    <Contact />
  </div>
)

export default LandingPage
