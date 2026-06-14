import { navLinks } from "@/constants";
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-secondary text-secondary-foreground flex justify-between items-center px-4 md:px-8 py-4">
      <Link href="/" className="text-3xl font-neutral-face flex-center gap-3">
        {/* LOGO */}
        <svg
          width="32"
          height="32"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 0H130V160H180V0H200V200H110V40H20V160H90V200H0V0Z"
            fill="#ffffff"
          />
        </svg>
      </Link>
      <nav>
        <ul className="flex gap-4 md:gap-8">
          {navLinks.map((link) => (
            <li
              key={link.name}
              className="hover:opacity-75 transition-opacity text-base md:text-lg"
            >
              <Link href={link.href} target={link.newTab ? "_blank" : "_self"}>
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
