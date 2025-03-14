'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import {Link} from '@/i18n/navigation';

interface HeroButtonProps {
    link:string;
    text:string;
    icon?:React.ReactNode;
}
const HeroButton: React.FC<HeroButtonProps> = ({link,text,icon}) => {
  const t = useTranslations();
  return (
    <Link href={link}>
    <button
      className={cn(
        'relative flex items-center gap-2 px-6 py-3 rounded-full border-none outline-none',
        'bg-transparent transition-transform duration-300 ease-in-out scale-100 hover:scale-110',
        'before:content-[""] before:absolute before:inset-0 before:rounded-full before:bg-gray-900',
        'before:shadow-[inset_0_0.5px_hsl(0,0%,100%),inset_0_-1px_2px_0_hsl(0,0%,0%),0px_4px_10px_-4px_rgba(0,0,0,0.5),0_0_0_0.375rem_rgba(102,51,255,0.75)]',
        'hover:before:bg-purple-700'
      )}
    >
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-full">
        <div className="absolute w-full h-8 bg-white opacity-30 animate-spin" />
      </div>
      {icon && icon}
      <span className="relative z-10 text-white bg-clip-text bg-gradient-to-r from-white to-transparent text-lg">
        {text}
      </span>
    </button>
    </Link>
  );
};

export default HeroButton;
