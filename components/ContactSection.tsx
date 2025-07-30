"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const ContactSection = () => {
  return (
    <section className="bg-[#F5F3F0] py-7 mb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-[#46332E] mb-4">
            Get in Touch
          </h2>
          <p className="text-lg text-[#46332E]/80 max-w-2xl mx-auto">
            Have questions about our products or services? We`&lsquo;`re here to
            help. Reach out to us for personalized assistance.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {[
            {
              icon: Phone,
              text: "+234 907 313 2616",
              label: "Whatsapp / Call us",
            },
            { icon: Mail, text: "tadorado247@gmail.com", label: "Email us" },
            {
              icon: MapPin,
              text: "Shop B24, Awolowo Shopping Complex Mushin Lagos.",
              label: "Visit us at",
            },
          ].map((item, index) => (
            <motion.div
              key={item.text}
              className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <item.icon className="w-8 h-8 text-[#8D6E63] mb-4" />
              <h3 className="text-lg font-semibold text-[#46332E] mb-2">
                {item.label}
              </h3>
              <p className="text-[#46332E]/80 text-center">{item.text}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <Link href="/contact">
            <Button
              variant="default"
              size="lg"
              className="bg-[#46332E] hover:bg-[#46332E]/90 text-white px-8 py-6 rounded-2xl text-lg transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              Contact Us
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
