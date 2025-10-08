"use client";
import Image from "next/image";
import { motion } from "framer-motion";

interface BannerProps {
  title: string;
  description: string;
}

export default function Banner({ title, description }: BannerProps) {
  return (
    <div className="relative bg-[#1F1F1D] overflow-hidden py-16 md:py-24">
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#1F1F1D]/85 to-transparent z-10"></div>

      {/* Image container - pushed toward center */}
      <div className="absolute inset-0 flex justify-center items-center translate-x-[22%] sm:translate-x-[26%] lg:translate-x-[28%] mr-8">
        <Image
          src="/images/female style.png"
          alt="Banner"
          width={420}
          height={420}
          className="object-contain h-auto max-h-[220px] sm:max-h-[280px] md:max-h-[340px] lg:max-h-[400px] xl:max-h-[440px] opacity-95"
          priority
        />
      </div>

      {/* Text content */}
      <div className="relative h-full flex flex-col justify-center max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl lg:mr-12"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            {title}
          </h1>
          <p className="text-lg text-gray-200 max-w-xl">{description}</p>
        </motion.div>
      </div>
    </div>
  );
}
