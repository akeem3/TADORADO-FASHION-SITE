"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";



interface BannerProps {
  title: string;
  description: string;
}

export default function Banner({ title, description }: BannerProps) {
  return (
    
    <div className="relative h-[40vh] md:h-[50vh] bg-[#1F1F1D] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-[#1F1F1D]/80 to-transparent z-8"></div>
      <Image
        src="https://firebasestorage.googleapis.com/v0/b/tadorado-tailors.firebasestorage.app/o/banner-image.png?alt=media&token=2c3279ed-a418-4be3-9ca7-fa42ff72ff8c"
        alt="Banner"
        fill
        className="object-cover"
        priority
      />
      <div className="relative z-20 h-full flex flex-col justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-10">
            {title}
          </h1>
          <p className="text-lg text-gray-200 max-w-xl">{description}</p>
        </motion.div>
      </div>
    </div>
  );
}
