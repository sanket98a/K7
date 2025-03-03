'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import screen from '@/assets/screen.png'
import tabularinsights from '@/assets/tabular_insights.png'
import tabularrepo from '@/assets/tabular_repo.png'
import documentrepo from '@/assets/document_repo.png'
import documentinsights from '@/assets/document_insights.png'
import mathinsights from '@/assets/math_insights.png'
import { Button } from './ui/button';
import Link from 'next/link';

const features = [
  {
    title: 'Smart Document Processing',
    subTitle: 'Manage and Analyze Documents',
    description:
      'Easily manage and analyze various document formats with AI-powered tools. Our system extracts key insights, generates summaries, and even performs sentiment analysis to help you quickly understand content. Streamline workflows by automating document organization and keyword extraction.',
    image: documentinsights,
  },
  {
    title: 'Intelligent Query Processing',
    subTitle: 'Seamless Database Integration',
    description:
      'Our NLP-powered query processing allows users to interact with databases naturally. Convert plain language questions into accurate SQL queries, retrieve data seamlessly, and get instant results without deep technical knowledge.',
    image: documentinsights,
  },
  {
    title: 'Advanced Mathematical Computation',
    subTitle: 'Solve Equations with Ease',
    description:
      'Solve complex equations, perform step-by-step derivations, and analyze mathematical problems effortlessly. Our AI-powered math assistant is designed to help students, researchers, and professionals tackle even the most challenging problems.',
    image: mathinsights,
  },
  {
    title: 'Table Data Manipulation & SQL Generation',
    subTitle: 'Work Smarter with Tables',
    description:
      'Simplify tabular data processing with AI-driven tools. Perform quick transformations, filter data efficiently, and generate SQL queries for deeper insights. Ideal for professionals handling structured data and reports.',
    image: tabularinsights,
  },
  {
    title: 'Interactive Data Visualization',
    subTitle: 'Transform Data into Insights',
    description:
      'Transform raw data into meaningful insights with interactive charts and graphs. Our visualization tools provide real-time rendering, caching, and enhanced UI for seamless user experience.',
    image: tabularrepo,
  },
  {
    title: 'Intelligent Data Sourcing',
    subTitle: 'Internal & Web Data Integration',
    description:
      'Retrieve structured and unstructured data from internal sources and the web. Our AI ensures reliable data enrichment, allowing for deeper analysis and business intelligence applications.',
    image: documentrepo,
  },
  {
    title: 'Seamless Collaboration',
    subTitle: 'Built for Teams & Individuals',
    description:
      'Designed for both teams and individuals, our platform enables real-time collaboration with role-based access, shared workflows, and seamless communication. Enhance productivity with AI-assisted teamwork.',
    image: documentinsights,
  },
];

export default function FeaturesParallax() {
  return (
    <section className="py-16 px-4 space-y-16 mx-auto max-w-7xl">
      {features.map((feature, index) => (
        <motion.div
          key={feature.title}
          className={`flex flex-col md:flex-row ${
            index % 2 === 0 ? 'md:flex-row-reverse' : ''
          } bg-white/5 backdrop-blur-lg rounded-xl p-8 shadow-lg hover:shadow-white/50 transition-transform hover:-translate-y-2 border-l-4 border-gray-200 items-center gap-8`}
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
              className="text-3xl font-bold text-blue-300 mb-1"
              initial={{ x: -30, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              {feature.title}
            </motion.h2>
            <motion.h3
              className="text-lg font-semibold text-gray-300 mb-4"
              initial={{ x: -30, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              {feature.subTitle}
            </motion.h3>
            <motion.p
              className="text-gray-400 text-lg"
              initial={{ x: -30, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            >
              {feature.description}
            </motion.p>
            <Button className="bg-gradient-to-r from-[#2563EB] to-[#67E8F9] hover:from-[#67E8F9] hover:to-[#2563EB] text-white font-semibold mt-4 px-6 py-2 rounded-full shadow-md transition-all duration-300 transform hover:scale-105">
              <Link href={'/login'}>Learn More</Link>
            </Button>
          </div>
        </motion.div>
      ))}
    </section>
  );
}
