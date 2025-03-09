"use client"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function BannerSection() {
  return (
    <section className="min-h-[calc(100vh-4rem)] flex flex-col lg:flex-row items-center justify-between px-4 sm:px-6 lg:px-16 pt-8 pb-12 lg:py-0">
      {/* Text */}
      <motion.div
        className="flex-1 max-w-2xl text-center lg:text-left mb-8 lg:mb-0 mt-4 lg:mt-0"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl sm:text-5xl lg:text-7xl xl:text-8xl font-bold text-[#46332E] mb-4 lg:mb-6 leading-tight">
          BOLD STYLE <br /> EVERY DAY
        </h1>
        <p className="text-[#46332E] text-base sm:text-lg lg:text-xl leading-relaxed mb-6 lg:mb-8 max-w-xl mx-auto lg:mx-0">
          Elevate your wardrobe with our unique blend of traditional craftsmanship and modern design. Experience fashion
          that speaks to your individuality and stands the test of time.
        </p>
        <Link href="/collections">
          <Button
            variant="default"
            size="lg"
            className="bg-[#46332E] hover:bg-[#46332E]/90 text-white px-8 py-6 rounded-2xl text-lg transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            <ShoppingBag className="w-6 h-6 mr-2" />
            View Collection
          </Button>
        </Link>
      </motion.div>

      {/* Image */}
      <motion.div
        className="flex-1 flex justify-center lg:justify-end mt-8 lg:mt-0 relative"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Image
          src="https://firebasestorage.googleapis.com/v0/b/tadorado-tailors.firebasestorage.app/o/fghdfhdhx.png?alt=media&token=8b763577-41c5-43d3-a6d1-f1123d938e76"
          alt="Traditional Fashion"
          width={900}
          height={1100}
          className="object-contain w-full max-w-[600px] lg:max-w-[800px] h-auto"
          priority
        />
      </motion.div>
    </section>
  )
}

