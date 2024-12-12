import Link from "next/link";



export default function Navbar() {
  return (
    <header className="flex items-center justify-between p-4 bg-[#f5efe7]">
      <div className="writing-vertical-lr transform  text-[#5d4037] text-xl font-semibold space-y-1">
        <div>Tadorado</div>
        <div>Tailoring</div>
      </div>
      <nav className="flex-grow">
        <ul className="flex justify-center space-x-8">
          {["Home", "Services", "collections", "About", "Contact"].map(
            (item) => {
              const href = item === "Home" ? "/" : `/${item.toLowerCase()}`;
              return (
                <li key={item}>
                  <Link
                    href={href}
                    className="text-[#5d4037] hover:text-[#8d6e63] transition-colors duration-200"
                  >
                    {item}
                  </Link>
                </li>
              );
            }
          )}
        </ul>
      </nav>
    </header>
  );
}
