"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const testimonials = [
  {
    name: "Sarah Johnson",
    rating: 5,
    text: "The attention to detail in my custom dress was exceptional. The fit is perfect and the quality is outstanding.",
    image: "https://firebasestorage.googleapis.com/v0/b/tadorado-tailors.firebasestorage.app/o/review%20imag.jpeg?alt=media&token=dc174a1f-59ca-4d48-a96d-9fa925e746cb",
  },
  {
    name: "Michael Obi",
    rating: 5,
    text: "Incredible craftsmanship and service. My suit fits better than anything I've ever worn before.",
    image: "https://firebasestorage.googleapis.com/v0/b/tadorado-tailors.firebasestorage.app/o/male%20portrait.jpeg?alt=media&token=8d00f901-daaf-427f-9905-937c8ec979cd",
  },
  {
    name: "Aisha Patel",
    rating: 4,
    text: "Beautiful traditional wear with a modern twist. The team really understood my vision.",
    image: "https://firebasestorage.googleapis.com/v0/b/tadorado-tailors.firebasestorage.app/o/mulim%20female.jpeg?alt=media&token=7b767731-7f89-4902-9c27-3228cf8757e0",
  },
];

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  return (
    <section className="bg-[#F5F3F0] py-24 lg:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#46332E] mb-6">
            WHAT OUR CLIENTS SAY
          </h2>
          <p className="text-lg text-[#46332E]/80">
            Discover why our clients love their custom-tailored garments. Read
            their experiences and join our community of satisfied customers.
          </p>
        </motion.div>

        <div className="relative max-w-5xl mx-auto">
          <div className="flex justify-center items-center gap-6">
            <button
              onClick={prev}
              className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-6 h-6 text-[#46332E]" />
            </button>

            <div className="relative overflow-hidden w-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                  className="bg-[#46332E] rounded-2xl p-8 md:p-12"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full overflow-hidden mb-6">
                      <Image
                        src={
                          testimonials[currentIndex].image || "/placeholder.svg"
                        }
                        alt={testimonials[currentIndex].name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-2xl font-semibold text-white mb-4">
                      {testimonials[currentIndex].name}
                    </h3>
                    <div className="flex gap-1 mb-6">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < testimonials[currentIndex].rating
                              ? "text-yellow-400"
                              : "text-gray-400"
                          }`}
                          fill={
                            i < testimonials[currentIndex].rating
                              ? "currentColor"
                              : "none"
                          }
                        />
                      ))}
                    </div>
                    <p className="text-lg text-gray-200 text-center max-w-2xl">
                      &ldquo;{testimonials[currentIndex].text}&rdquo;
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <button
              onClick={next}
              className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-6 h-6 text-[#46332E]" />
            </button>
          </div>

          {/* Mobile Navigation */}
          <div className="flex justify-center gap-4 mt-8 md:hidden">
            <button
              onClick={prev}
              className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-6 h-6 text-[#46332E]" />
            </button>
            <button
              onClick={next}
              className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-6 h-6 text-[#46332E]" />
            </button>
          </div>
        </div>

        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <Button
            size="lg"
            className="bg-[#46332E] hover:bg-[#46332E]/90 text-white px-8 py-6 rounded-2xl text-lg"
          >
            Get Started
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
