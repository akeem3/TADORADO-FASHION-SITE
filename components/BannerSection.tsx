"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BannerSection() {
  return (
    <section className="max-w-7xl mx-auto min-h-[60vh] flex flex-col lg:flex-row items-center justify-between px-4 sm:px-6 lg:px-16 pt-4 pb-12 lg:pb-0">
      {/* Text */}
      <motion.div
        className="flex-1 max-w-2xl text-center lg:text-left mb-8 lg:mb-0"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-[#46332E] mb-4 lg:mb-6 leading-tight tracking-tight">
          BOLD STYLE <br /> EVERY DAY
        </h1>
        <p className="text-[#5A3E36] text-lg sm:text-xl lg:text-2xl leading-relaxed mb-6 lg:mb-8 max-w-xl mx-auto lg:mx-0">
          Elevate your wardrobe with a unique blend of{" "}
          <span className="font-semibold">tradition</span> and{" "}
          <span className="font-semibold">modern elegance</span>. Experience
          fashion that speaks to your individuality.
        </p>
        <Link href="/collections">
          <Button
            variant="default"
            size="lg"
            className="bg-[#46332E] hover:bg-[#5c433d] text-white px-10 py-6 rounded-xl text-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg"
          >
            <ShoppingBag className="w-6 h-6 mr-2" />
            View Shop
          </Button>
        </Link>
      </motion.div>

      {/* Image */}
      <motion.div
        className="flex-1 flex justify-center lg:justify-end mt-6 lg:mt-0 relative"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Image
          src="https://firebasestorage.googleapis.com/v0/b/tadorado-tailors.firebasestorage.app/o/fghdfhdhx.png?alt=media&token=8b763577-41c5-43d3-a6d1-f1123d938e76"
          alt="Traditional Fashion"
          width={700}
          height={900}
          className="object-cover w-full max-w-[700px] lg:max-w-[900px] h-auto"
          priority
        />
      </motion.div>
    </section>
  );
}
