"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function AboutSection() {
  return (
    <section className="bg-[#1F1F1D] w-full relative py-16 lg:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Side with Main Image */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="relative lg:mb-20">
              <Image
                src="https://firebasestorage.googleapis.com/v0/b/tadorado-tailors.firebasestorage.app/o/The%20besties.jpg?alt=media&token=6e218dd5-f398-410e-a4f05ff40b51"
                alt="Traditional Fashion"
                width={800}
                height={1000}
                className="object-cover rounded-2xl shadow-2xl"
                priority
              />
            </div>
          </motion.div>

          {/* Right Side Content */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="max-w-xl">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-white">
                ABOUT TADORADO
              </h2>
              <div className="space-y-6 text-gray-300">
                <p className="text-base sm:text-lg leading-relaxed">
                  At Tadorado, we believe in the power of fashion to express
                  individuality and cultural heritage. Our designs are a
                  harmonious blend of tradition and modernity, creating timeless
                  pieces that resonate with the contemporary spirit.
                </p>
                <p className="text-base sm:text-lg leading-relaxed">
                  Each garment is a testament to our commitment to quality
                  craftsmanship and sustainable practices. We source the finest
                  materials and work with skilled artisans to bring our vision
                  to life, ensuring that every piece tells a unique story.
                </p>
              </div>
              <div className="mt-8">
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-transparent hover:bg-white text-white hover:text-[#1F1F1D] border-2 border-white px-8 py-6 rounded-2xl text-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                >
                  Read More
                </Button>
              </div>
            </div>

            {/* Bottom Image */}
            <motion.div
              className="relative mt-12 lg:mt-16"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="relative aspect-video lg:w-[120%]">
                <Image
                  src="https://firebasestorage.googleapis.com/v0/b/tadorado-tailors.firebasestorage.app/o/sewing%20image.jpg?alt=media&token=0ca23b9a-dfe4-4b89-a32b-8ea93475a352"
                  alt="Sewing"
                  width={500}
                  height={700}
                  className="object-cover rounded-2xl shadow-lg"
                  priority
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
