"use client";

import { motion } from "framer-motion";
import { Ruler, CassetteTapeIcon as Tape, Shirt } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  {
    number: "01",
    title: "TAKE YOUR MEASUREMENTS",
    description:
      "Get precise measurements using our detailed guide. Every inch matters for the perfect fit.",
    icon: Tape,
  },
  {
    number: "02",
    title: "CHOOSE YOUR STYLE",
    description:
      "Select from our curated collection of designs or customize your own unique piece.",
    icon: Ruler,
  },
  {
    number: "03",
    title: "PERFECT FIT GUARANTEE",
    description:
      "We ensure your garment fits perfectly with our expert tailoring process.",
    icon: Shirt,
  },
];

export default function StepsSection() {
  return (
    <section className="relative bg-[#1F1F1D] py-24 lg:py-32 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-[#46332E] to-[#1F1F1D]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            STEPS TO FOLLOW
          </motion.h2>
          <motion.p
            className="text-lg text-gray-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Create your perfect custom-tailored garment in three simple steps.
            Quality craftsmanship meets modern convenience.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 mb-16">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              className="relative"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <div
                className="bg-[#2A2A28] rounded-2xl p-8 h-full hover:bg-[#332F2D] 
              transition-colors duration-300"
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="text-4xl font-bold text-[#8D6E63]">
                    {step.number}
                  </span>
                  <step.icon className="w-8 h-8 text-[#8D6E63]" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-400">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <Button
            size="lg"
            className="bg-transparent hover:bg-white text-white hover:text-[#1F1F1D] 
            border-2 border-white px-8 py-6 rounded-2xl text-lg transition-all duration-300 
            ease-in-out transform hover:scale-105"
          >
            Get Started
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
