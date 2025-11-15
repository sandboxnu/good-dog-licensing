"use client";

import Link from "next/link";

import { trpc } from "@good-dog/trpc/client";

import NavLogo from "./svg/NavLogo";
import ProfileDropdown from "./base/ProfileDropdown";

export default function Nav() {
  const [user] = trpc.user.useSuspenseQuery();

  return (
    <header className="w-full text-good-dog-main">
      <div className="flex items-center justify-between bg-transparent">
        <Link href="/" className="flex items-center gap-3">
          <NavLogo />
          <p className="font-righteous text-good-dog-main text-2xl">
            GOOD DOG LICENSING
          </p>
        </Link>

        <nav className="flex items-center gap-8 text-lg">
          <Link href="/" className="underline-offset-4 hover:underline">
            Home
          </Link>
          {user ? (
            <ProfileDropdown />
          ) : (
            <>
              <Link
                href="/login"
                className="underline-offset-4 hover:underline"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="underline-offset-4 hover:underline"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
