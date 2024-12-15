'use client'; // Required if you're using Next.js app directory for client-side functionality

import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup the event listener on unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${
        isScrolled ? "bg-white shadow-md" : "bg-[#f5efe7]"
      }`}
    >
      <div className="flex items-center justify-between p-4">
        <div className="writing-vertical-lr transform leading-none text-[#5d4037] text-xl font-semibold space-y-1">
          <div>Tadorado</div>
          <div>Tailoring</div>
        </div>
        <nav className="flex-grow">
          <ul className="flex justify-center space-x-8">
            {["Home", "Services", "Collections", "About", "Contact"].map(
              (item) => {
                const href = item === "Home" ? "/" : `/${item.toLowerCase()}`;
                return (
                  <li key={item}>
                    <Link
                      href={href}
                      className={`${
                        isScrolled ? "text-black" : "text-[#5d4037]"
                      } hover:text-[#8d6e63] transition-colors duration-200`}
                    >
                      {item}
                    </Link>
                  </li>
                );
              }
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
