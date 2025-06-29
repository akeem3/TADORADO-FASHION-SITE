"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/components/ui/CartContext"; // ✅ Import Cart Context

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { cartCount } = useCart(); // ✅ Get cart item count
  const [mounted, setMounted] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header
      className={`sticky top-0 w-full z-30 transition-all duration-300 ${
        isScrolled ? "bg-white/95 shadow-sm" : "bg-transparent"
      } backdrop-blur-sm`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo and Brand */}
          <Link
            href="/"
            className="flex items-center gap-2 text-[#5d4037] text-xl font-semibold"
          >
            <div className="relative w-10 h-10">
              <Image
                src="https://firebasestorage.googleapis.com/v0/b/tadorado-tailors.firebasestorage.app/o/Tado%20logo%20Final.png?alt=media&token=2cac7d0f-db1e-4a38-88c0-58b79a4eb5c7"
                alt="Tadorado Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="hidden sm:block">Tadorado</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:block flex-grow">
            <ul className="flex justify-center space-x-8">
              {[
                { name: "Home", href: "/" },
                { name: "Shop", href: "/collections" },
                { name: "Contact", href: "/contact" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`relative py-2 text-[#5d4037] hover:text-[#8d6e63] transition-colors duration-200 ${
                      pathname === item.href ? "font-medium" : ""
                    }`}
                  >
                    {item.name}
                    {pathname === item.href && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#8d6e63] rounded-full" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* User Actions */}
          <div className="flex items-center">
            <button
              className="p-2 mr-2 text-[#5d4037] hover:text-[#8d6e63] transition-colors duration-200 rounded-full hover:bg-[#f5f5f5] relative"
              aria-label="Shopping cart"
            >
              <Link href={"/cart"}>
                <ShoppingBag size={24} />
              </Link>

              {/* Show badge only if cartCount > 0 and mounted */}
              {mounted && cartCount > 0 && (
                <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs text-white bg-[#8d6e63] rounded-full">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-[#5d4037] hover:text-[#8d6e63] transition-colors duration-200 rounded-full hover:bg-[#f5f5f5]"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <nav>
              <ul className="space-y-4 py-4">
                {[
                  { name: "Home", href: "/" },
                  { name: "Collections", href: "/collections" },
                  { name: "Contact", href: "/contact" },
                ].map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`block py-2 px-3 rounded-md ${
                        pathname === item.href
                          ? "bg-[#f5f5f5] text-[#5d4037] font-medium"
                          : "text-[#5d4037] hover:bg-[#f5f5f5]"
                      } transition-colors duration-200`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
