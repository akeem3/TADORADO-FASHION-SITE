import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <header className="sticky top-0 flex items-center justify-between p-4 backdrop-blur-sm z-20">
      <div className="">
        <Image
          src="https://firebasestorage.googleapis.com/v0/b/tadorado-tailors.firebasestorage.app/o/Tado%20logo%20Final.png?alt=media&token=2cac7d0f-db1e-4a38-88c0-58b79a4eb5c7"
          alt=""
          width={40}
          height={40}
          className="object-contain scale-110 lg:scale-120"
          priority
        />
      </div>
      <Link
        href="/"
        className="writing-vertical-lr transform leading-none text-[#5d4037] text-xl font-semibold space-y-1"
      >
        <div>Tadorado</div>
        <div>Tailoring</div>
      </Link>

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
              href="/collections"
              className="text-[#5d4037] hover:text-[#8d6e63] transition-colors duration-200"
            >
              Collections
            </Link>
          </li>

          <li>
            <Link
              href="/about"
              className="text-[#5d4037] hover:text-[#8d6e63] transition-colors duration-200"
            >
              Blog
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
    </header>
  );
}
