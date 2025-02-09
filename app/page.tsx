import React from "react";
import Container from "./Components/Container";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const Home = () => {
  return (
    <Container>
      {/* Banner Section */}
      <div className="flex flex-col lg:flex-row items-center justify-between px-8 lg:px-16 pb-[10] lg:pb-[8]">
        {/* Text Section */}
        <div className="flex-1 max-w-2xl">
          <h1 className="text-4xl lg:text-7xl xl:text-8xl font-bold text-[#46332E] mb-8 leading-tight">
            BOLD STYLE <br /> EVERY DAY
          </h1>
          <p className="text-[#46332E] text-base lg:text-lg leading-relaxed mb-8 max-w-xl">
            Lorem ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry&apos;s standard dummy
            text.
          </p>
          <Button variant="default">Contact</Button>
        </div>

        {/* Image */}
        <div className="flex-1 flex justify-center lg:justify-end mt-12 lg:mt-0">
          <Image
            src="https://firebasestorage.googleapis.com/v0/b/tadorado-tailors.firebasestorage.app/o/fghdfhdhx.png?alt=media&token=8b763577-41c5-43d3-a6d1-f1123d938e76"
            alt="Traditional Fashion"
            width={600}
            height={800}
            className="object-contain scale-110 lg:scale-120"
            priority
          />
        </div>
      </div>

      {/* About Section */}
      <div className="bg-[#1F1F1D] w-full">
        <div className="text-white py-10">
          <h2 className="text-4xl font-bold mb-4">About Section</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut blandit
            arcu in pretium molestie. Interdum et malesuada fames ac ante ipsum
            primis in faucibus.
          </p>
        </div>
      </div>
    </Container>
  );
};

export default Home;
