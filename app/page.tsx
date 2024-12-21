import React from "react";
import Container from "./Components/Container";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const Home = () => {
  return (
    <div className="bg-[#f5efe7] min-h-screen">
      <Container>
        <h1 className="text-2xl">BOLD STYLE EVERY DAY</h1>
        <p>
          Lorem ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the{" "}
        </p>
        <Image
          src="https://firebasestorage.googleapis.com/v0/b/tadorado-tailors.firebasestorage.app/o/fghdfhdhx.png?alt=media&token=8b763577-41c5-43d3-a6d1-f1123d938e76"
          alt="Uploaded Image"
          width={500} // Replace with the actual width of the image
          height={300} // Replace with the actual height of the image
          priority={true} // Optional: Ensures the image is loaded quickly
        />
        <Button variant="outline">Contact</Button>
      </Container>
    </div>
  );
};

export default Home;
