"use client"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Container from "./Components/Container"
import CategoriesSection from "@/components/CategoriesSection"

const Home = () => {
  return (
    <Container>
      {/* Banner Section */}
      <section className="min-h-screen flex flex-col lg:flex-row items-center justify-between px-4 sm:px-6 lg:px-16 py-12 lg:py-0">
        {/* Text */}
        <motion.div
          className="flex-1 max-w-2xl text-center lg:text-left mb-12 lg:mb-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-7xl xl:text-8xl font-bold text-[#46332E] mb-4 lg:mb-6 leading-tight">
            BOLD STYLE <br /> EVERY DAY
          </h1>
          <p className="text-[#46332E] text-base sm:text-lg lg:text-xl leading-relaxed mb-6 lg:mb-8 max-w-xl mx-auto lg:mx-0">
            Elevate your wardrobe with our unique blend of traditional craftsmanship and modern design. Experience
            fashion that speaks to your individuality and stands the test of time.
          </p>
          <Button
            variant="default"
            size="lg"
            className="bg-[#46332E] hover:bg-[#46332E]/90 text-white px-8 py-6 rounded-2xl text-lg transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            Explore Collections
          </Button>
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

      {/* About Section */}
      <section className="bg-[#1F1F1D] w-full px-4 sm:px-8 lg:px-16 py-16 lg:py-24 relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Image */}
          <motion.div
            className="flex justify-center relative"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Image
              src="https://firebasestorage.googleapis.com/v0/b/tadorado-tailors.firebasestorage.app/o/The%20besties.jpg?alt=media&token=6e218dd5-f398-410e-a4f05ff40b51"
              alt="fashion"
              width={700}
              height={900}
              className="object-cover rounded-2xl relative lg:-top-16 shadow-2xl"
              priority
            />
          </motion.div>

          {/* Text */}
          <motion.div
            className="text-white max-w-xl mx-auto lg:mx-0"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-center lg:text-left">ABOUT TADORADO</h2>
            <p className="text-base sm:text-lg leading-relaxed mb-6 text-center lg:text-left">
              At Tadorado, we believe in the power of fashion to express individuality and cultural heritage. Our
              designs are a harmonious blend of tradition and modernity, creating timeless pieces that resonate with the
              contemporary spirit.
            </p>
            <p className="text-base sm:text-lg leading-relaxed mb-6 text-center lg:text-left">
              Each garment is a testament to our commitment to quality craftsmanship and sustainable practices. We
              source the finest materials and work with skilled artisans to bring our vision to life, ensuring that
              every piece tells a unique story.
            </p>
            <p className="text-base sm:text-lg leading-relaxed mb-8 text-center lg:text-left">
              Experience fashion that not only looks good but feels good too. Join us in our journey to redefine style,
              one stitch at a time.
            </p>
            <div className="text-center lg:text-left">
              <Button
                variant="outline"
                size="lg"
                className="bg-transparent hover:bg-white text-white hover:text-[#1F1F1D] border-2 border-white px-8 py-6 rounded-2xl text-lg transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                Read More
              </Button>
            </div>
            {/* Sewing Image */}
            <motion.div
              className="flex justify-center lg:justify-start relative mt-12 lg:mt-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <Image
                src="https://firebasestorage.googleapis.com/v0/b/tadorado-tailors.firebasestorage.app/o/sewing%20image.jpg?alt=media&token=0ca23b9a-dfe4-4b89-a32b-8ea93475a352"
                alt="Sewing"
                width={450}
                height={350}
                className="object-cover rounded-2xl shadow-lg"
                priority
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <CategoriesSection />
    </Container>
  )
}

export default Home

