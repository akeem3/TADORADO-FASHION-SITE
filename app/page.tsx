"use client"
import Container from "./Components/Container"
import BannerSection from "@/components/BannerSection"
import AboutSection from "@/components/AboutSection"
import CategoriesSection from "@/components/CategoriesSection"
import StepsSection from "@/components/StepsSection"
import TestimonialsSection from "@/components/TestimonialsSection"
import ContactSection from "@/components/ContactSection"

const Home = () => {
  return (
    <>
      <Container>
        <BannerSection />
        <AboutSection />
        <CategoriesSection />
        <StepsSection />
        <TestimonialsSection />
        <ContactSection />
      </Container>
    </> 
  )
}

export default Home

