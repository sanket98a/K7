
'use client'
import { motion } from 'framer-motion';
import GradientText from '../ui/GradientText';

type HeroSectionProps = {
  title?: string;
  subtitle?: string;
}

const HeroSection = ({title,subtitle}:HeroSectionProps) => {



  return (

    <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1, ease: "easeOut" }}
    className="text-center mt-24 mb-10"
  >
    <h1 className='text-5xl font-extrabold font-poppins  md:text-5xl'>
    <GradientText
  colors={["#5D3FD3", "#4079ff", "#483D8B", "#4079ff", "#6A5ACD"]}
  animationSpeed={3}
  showBorder={false}
  className="font-extrabold text-5xl md:text-6xl"
>
{title}
</GradientText>
</h1>
   

    <p className={`mt-2 text-lg text-blue-600 md:text-xl`}>
   {subtitle}
    </p>
  
  </motion.div>

  )
}

export default HeroSection