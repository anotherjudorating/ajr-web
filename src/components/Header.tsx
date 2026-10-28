import Link from "next/link";

import { NavLinks } from "@/components/NavLinks";

// Fixed top bar: the name and the sections. Below md the sections move to a
// second row (as in the prototype). Search comes later.
export function Header() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-paper border-b border-rule">
      <div className="max-w-[1440px] mx-auto h-12 md:h-16 px-4 md:px-8 lg:px-10 flex items-center">
        <Link
          href="/"
          className="font-serif text-[20px] md:text-[22px] leading-[28px] font-bold tracking-tight whitespace-nowrap"
        >
          Another Judo Rating
        </Link>
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 h-full ml-8 lg:ml-12">
          <NavLinks variant="desktop" />
        </nav>
      </div>
      <nav className="md:hidden h-10 px-4 border-t border-rule flex items-center justify-between text-[13px]">
        <NavLinks variant="mobile" />
      </nav>
    </header>
  );
}
