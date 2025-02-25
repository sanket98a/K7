"use client";
import React from "react";
import { SparklesCore } from "@/components/ui/sparkles";

type SparklePreviewProps = {
    heading:string;
    textColor?:string
};

export function SparklesPreview({heading,textColor}:SparklePreviewProps) {
  return (
    <div className="h-fit w-full bg-transparent flex flex-col items-center justify-center overflow-hidden rounded-md">
      <h1 className={`${textColor?textColor:"text-blue-500"} md:text-5xl text-3xl lg:text-6xl font-bold text-center  relative z-20`}>
        {heading}
      </h1>
      <div className="w-[40rem] h-20 relative">
        {/* Gradients */}
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent h-[2px] w-3/4 blur-sm" />
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-blue-400 to-transparent h-px w-3/4" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent h-[5px] w-1/4 blur-sm" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-cyan-600 to-transparent h-px w-1/4" />
 
        {/* Core component */}
         <SparklesCore
          background="transparent"
          minSize={0.4}
          maxSize={1}
          particleDensity={1200}
          className="w-full h-full"
          particleColor="#ffff"
        />
 
        {/* Radial Gradient to prevent sharp edges */}
        {/* <div className="absolute inset-0 w-full h-full bg-transparent [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div> */}
      </div>
    </div>
  );
}