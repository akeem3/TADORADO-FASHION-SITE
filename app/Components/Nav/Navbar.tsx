import Link from "next/link";

export default function Navbar() {
  return (
    <header className="flex items-center justify-between p-4 bg-[#f5efe7]">
      <Link href="/" className="writing-vertical-lr transform leading-none text-[#5d4037] text-xl font-semibold space-y-1">
        <div>Tadorado</div>
        <div>Tailoring</div>
      </Link>
      <nav className="flex-grow">
        <ul className="flex justify-center space-x-8">
          <li>
            <Link href="/" className="text-[#5d4037] hover:text-[#8d6e63] transition-colors duration-200">
              Home
            </Link>
          </li>
          <li>
            <Link href="/services" className="text-[#5d4037] hover:text-[#8d6e63] transition-colors duration-200">
              Services
            </Link>
          </li>
          <li>
            <Link href="/collections" className="text-[#5d4037] hover:text-[#8d6e63] transition-colors duration-200">
              Collections
            </Link>
          </li>
          <li>
            <Link href="/about" className="text-[#5d4037] hover:text-[#8d6e63] transition-colors duration-200">
              About
            </Link>
          </li>
          <li>
            <Link href="/contact" className="text-[#5d4037] hover:text-[#8d6e63] transition-colors duration-200">
              Contact
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
