"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";

export default function AboutSection() {
  const [showModal, setShowModal] = useState(false);

  // Short summary for the about section
  const shortText = `At Tadorado, we believe in the power of fashion to express individuality and cultural heritage. Our designs are a harmonious blend of tradition and modernity, creating timeless pieces that resonate with the contemporary spirit.`;

  // Extended about text for the modal
  const longText = `At Tadorado, we believe in the power of fashion to express individuality and cultural heritage. Our designs are a harmonious blend of tradition and modernity, creating timeless pieces that resonate with the contemporary spirit.

Each garment is a testament to our commitment to quality craftsmanship and sustainable practices. We source the finest materials and work with skilled artisans to bring our vision to life, ensuring that every piece tells a unique story.

Founded by passionate designers, Tadorado Fashion sources the finest materials and employs skilled artisans to create clothing that stands out for its elegance, comfort, and durability. We believe that fashion is a powerful way to express identity and pride, and we strive to make every customer feel special.

Our collections feature a diverse range of traditional and contemporary designs, suitable for all occasions. Whether you are looking for everyday wear or something extraordinary for a special event, Tadorado Fashion has you covered.

We are committed to ethical practices, supporting local communities, and promoting sustainable fashion. Join us on our journey to redefine style and celebrate the beauty of cultural diversity.`;

  return (
    <div className="w-full bg-[#1F1F1D] py-12 px-4 sm:px-6 lg:px-8 rounded-3xl overflow-hidden">
      <section className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-stretch">
          {/* Left Side with Main Image */}
          <motion.div
            className="relative h-full"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="h-full w-full flex items-center">
              <Image
                src="/images/The besties.jpg"
                alt="Traditional Fashion"
                width={800}
                height={1000}
                className="object-cover rounded-2xl shadow-2xl w-full h-full max-h-[700px]"
                priority
              />
            </div>
          </motion.div>

          {/* Right Side Content */}
          <motion.div
            className="flex flex-col justify-between h-full"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="flex flex-col justify-start h-full">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-white">
                ABOUT TADORADO
              </h2>

              <div className="space-y-6 text-gray-300 text-base sm:text-lg leading-relaxed">
                <p>{shortText}</p>
              </div>

              <div className="mt-8">
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-transparent hover:bg-white text-white hover:text-[#1F1F1D] border-2 border-white px-8 py-6 rounded-2xl text-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                  onClick={() => setShowModal(true)}
                >
                  Read More
                </Button>
              </div>
            </div>

            {/* Bottom Image (smaller) */}
            <motion.div
              className="relative mt-12 lg:mt-16 mr-4"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="relative w-full max-w-sm mx-auto aspect-video">
                <Image
                  src="/images/sewing image.jpeg"
                  alt="Sewing"
                  width={300}
                  height={500}
                  className="object-cover rounded-2xl shadow-lg w-full h-full"
                  priority
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-[#1F1F1D] rounded-xl shadow-lg max-w-lg w-full p-8 relative max-h-[80vh] overflow-y-auto">
            <button
              className="absolute top-4 right-4 text-[#46332E] text-2xl font-bold hover:text-[#46332E]/70"
              onClick={() => setShowModal(false)}
              aria-label="Close"
            >
              ×
            </button>
            <h3 className="text-2xl font-bold mb-4 text-white">
              About Tadorado Fashion
            </h3>
            <p
              className="text-white whitespace-pre-line text-base"
              style={{ maxHeight: "60vh", overflowY: "auto" }}
            >
              {longText}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
