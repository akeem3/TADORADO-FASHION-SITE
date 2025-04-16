"use client";

import React from "react";
import Container from "../Components/Container";
import ContactSection from "@/components/ContactSection";
import Banner from "@/components/ui/banner";

export default function Contact() {
  return (
    <Container>
      <div>
        <Banner
          title="CONTACT US"
          description="Reach out to us for custom tailoring, inquiries, and collaborations. We're here to bring your designs to life."
        />

        {/* Contact Sectoin*/}
        <div>
          <ContactSection />
        </div>
      </div>
    </Container>
  );
}
