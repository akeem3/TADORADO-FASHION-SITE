"use client";

import React, { useEffect } from "react";
import Container from "../Components/Container";
import Banner from "@/components/ui/banner";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Contact() {
  // ✅ Scroll to top on route change
  const pathname = usePathname();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const location = "Shop B24, Awolowo Shopping Complex Mushin Lagos";
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    location
  )}`;
  const googleMapsEmbed = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(
    location
  )}`;

  return (
    <Container>
      <div>
        <Banner
          title="CONTACT US"
          description="Reach out to us for custom tailoring, inquiries, and collaborations. We're here to bring your designs to life."
        />

        {/* Contact Content Section */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto">
            {/* Plain text section (no Framer Motion) */}
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-[#46332E] mb-4">
                Get in Touch
              </h2>
              <p className="text-lg text-[#46332E]/80 max-w-2xl mx-auto">
                Have questions about our products or services? We&#39;re here to
                help. Reach out to us for personalized assistance.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Contact Info */}
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: false, amount: 0.3 }}
              >
                {/* Phone */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                  <div className="flex items-center mb-4">
                    <Phone className="w-6 h-6 text-[#8D6E63] mr-3" />
                    <h3 className="text-lg font-semibold text-[#46332E]">
                      Phone & WhatsApp
                    </h3>
                  </div>
                  <p className="text-[#46332E]/80 text-lg">+234 907 313 2616</p>
                  <p className="text-sm text-[#46332E]/60 mt-1">
                    Available for calls and WhatsApp messages
                  </p>
                </div>

                {/* Email */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                  <div className="flex items-center mb-4">
                    <Mail className="w-6 h-6 text-[#8D6E63] mr-3" />
                    <h3 className="text-lg font-semibold text-[#46332E]">
                      Email
                    </h3>
                  </div>
                  <p className="text-[#46332E]/80 text-lg">
                    tadorado247@gmail.com
                  </p>
                  <p className="text-sm text-[#46332E]/60 mt-1">
                    For inquiries and collaborations
                  </p>
                </div>

                {/* Address */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                  <div className="flex items-center mb-4">
                    <MapPin className="w-6 h-6 text-[#8D6E63] mr-3" />
                    <h3 className="text-lg font-semibold text-[#46332E]">
                      Visit Us
                    </h3>
                  </div>
                  <p className="text-[#46332E]/80 text-lg mb-3">{location}</p>
                  <Link
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-[#8D6E63] hover:text-[#46332E] transition-colors"
                  >
                    <span className="mr-2">View on Google Maps</span>
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>

              {/* Embedded Map */}
              <motion.div
                className="bg-white p-6 rounded-lg shadow-md border border-gray-100"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: false, amount: 0.3 }}
              >
                <h3 className="text-lg font-semibold text-[#46332E] mb-4">
                  Our Location
                </h3>
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  <iframe
                    src={googleMapsEmbed}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Tadorado Fashion Location"
                  />
                </div>
                <p className="text-sm text-[#46332E]/60 mt-3 text-center">
                  Click the map to get directions
                </p>
              </motion.div>
            </div>

            {/* Business Hours */}
            <motion.div
              className="bg-[#F5F3F0] p-8 rounded-lg text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: false, amount: 0.3 }}
            >
              <h3 className="text-xl font-semibold text-[#46332E] mb-4">
                Business Hours
              </h3>
              <div className="text-[#46332E]/80">
                <p className="font-medium">Monday - Friday</p>
                <p>8:00 AM - 6:00 PM</p>
              </div>
              <p className="text-sm text-[#46332E]/60 mt-4">
                Closed on Saturdays, Sundays and Public Holidays
              </p>
            </motion.div>
          </div>
        </section>
      </div>
    </Container>
  );
}
