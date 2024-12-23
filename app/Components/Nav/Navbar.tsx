'use client'
import Link from "next/link";
import { useState, useEffect } from "react";


export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0); // Update state when scrolled
    };

    window.addEventListener("scroll", handleScroll);

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
      <div className="flex items-center justify-between p-4 max-w-[1920px] mx-auto">
        {/* Logo */}
        <Link
          href="/"
          className="writing-vertical-lr transform leading-none text-[#5d4037] text-xl font-semibold space-y-1"
        >
          <div>Tadorado</div>
          <div>Tailoring</div>
        </Link>

        {/* Navigation Links */}
        <nav className="flex-grow">
          <ul className="flex justify-center space-x-8">
            <li>
              <Link
                href="/"
                className="text-[#5d4037] hover:text-[#8d6e63] transition-colors duration-200"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/services"
                className="text-[#5d4037] hover:text-[#8d6e63] transition-colors duration-200"
              >
                Services
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="text-[#5d4037] hover:text-[#8d6e63] transition-colors duration-200"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/collections"
                className="text-[#5d4037] hover:text-[#8d6e63] transition-colors duration-200"
              >
                Collections
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="text-[#5d4037] hover:text-[#8d6e63] transition-colors duration-200"
              >
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
