'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import screen from '@/assets/screen.png'
import { Button } from './ui/button';
import Link from 'next/link';

const features = [
  {
    title: 'Smart Document Processing',
    subTitle:'Manage and Analyze Documents',
    description:
      'Easily manage and analyze various document formats with AI-powered tools. Our system extracts key insights, generates summaries, and even performs sentiment analysis to help you quickly understand content. Streamline workflows by automating document organization and keyword extraction.',
    image: screen,
  },
  {
    title: 'Intelligent Query Processing',
    subTitle:'Seamless Database Integration',
    description:
      'Our NLP-powered query processing allows users to interact with databases naturally. Convert plain language questions into accurate SQL queries, retrieve data seamlessly, and get instant results without deep technical knowledge.',
    image: screen,
  },
  {
    title: 'Advanced Mathematical Computation',
    subTitle:'Solve Equations with Ease',
    description:
      'Solve complex equations, perform step-by-step derivations, and analyze mathematical problems effortlessly. Our AI-powered math assistant is designed to help students, researchers, and professionals tackle even the most challenging problems.',
    image: screen,
  },
  {
    title: 'Table Data Manipulation & SQL Generation',
    subTitle:'Work Smarter with Tables',
    description:
      'Simplify tabular data processing with AI-driven tools. Perform quick transformations, filter data efficiently, and generate SQL queries for deeper insights. Ideal for professionals handling structured data and reports.',
    image: screen,
  },
  {
    title: 'Interactive Data Visualization',
    subTitle:'Transform Data into Insights',
    description:
      'Transform raw data into meaningful insights with interactive charts and graphs. Our visualization tools provide real-time rendering, caching, and enhanced UI for seamless user experience.',
    image: screen,
  },
  {
    title: 'Intelligent Data Sourcing',
    subTitle:'Internal & Web Data Integration',
    description:
      'Retrieve structured and unstructured data from internal sources and the web. Our AI ensures reliable data enrichment, allowing for deeper analysis and business intelligence applications.',
    image: screen,
  },
  {
    title: 'Seamless Collaboration',
    subTitle:'Built for Teams & Individuals',
    description:
      'Designed for both teams and individuals, our platform enables real-time collaboration with role-based access, shared workflows, and seamless communication. Enhance productivity with AI-assisted teamwork.',
    image: screen,
  },
];

export default function FeaturesParallax() {
  return (
    <section className="py-16 px-4 space-y-16 mx-auto max-w-7xl ">
      {features.map((feature, index) => (
        <motion.div
          key={feature.title}
          className={`flex flex-col md:flex-row ${index % 2 === 0 ? 'md:flex-row-reverse' : ''} bg-gray-200 bg-opacity-90 rounded-xl p-8 shadow-lg backdrop-blur-md transition-transform hover:-translate-y-2 border-l-4 border-blue-500  items-center gap-8`}
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
              src={feature.image}
              alt={feature.title}
              width={500}
              height={500}
              className="rounded-lg shadow-lg"
            />
          </motion.div>
          <div className="w-full md:w-1/2">
           
            <motion.h2
              className="text-3xl font-bold text-blue-500 mb-1 "
              initial={{ x: -30, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
          {feature.title}
            </motion.h2>
            <motion.h2
             className="text-lg font-semibold text-gray-600 mb-4"
              initial={{ x: -30, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              {feature.subTitle}
            </motion.h2>
            <motion.p
              className="text-gray-600 text-lg"
              initial={{ x: -30, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            >
              {feature.description}
            </motion.p>
            <Button className="bg-blue-500 rounded-full text-white font-semibold mt-2"><Link href={'/login'}>Learn More</Link></Button>
          </div>
        </motion.div>
      ))}
    </section>
  );
}