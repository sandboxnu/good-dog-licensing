"use client";

import Link from "next/link";
import { trpc } from "@good-dog/trpc/client";
import NavLogo from "./svg/NavLogo";
import ProfileDropdown from "./base/ProfileDropdown";

export default function Nav() {
  const [user] = trpc.user.useSuspenseQuery();

  return (
    <header className="text-good-dog-main w-full">
      <div className="flex items-center justify-between bg-transparent">
        <Link href="/" className="flex items-center gap-3">
          <NavLogo />
          <p className="font-righteous text-2xl">GOOD DOG LICENSING</p>
        </Link>

        <nav className="flex items-center gap-8 text-lg">
          <Link href="/" className="hover:underline underline-offset-4">
            Home
          </Link>
          <Link href="/about" className="hover:underline underline-offset-4">
            About
          </Link>
          {user ? (
            <>
              <ProfileDropdown />
            </>
          ) : (
            <Link href="/login" className="hover:underline underline-offset-4">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
