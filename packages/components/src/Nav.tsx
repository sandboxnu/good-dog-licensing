"use client";

import Link from "next/link";

import { trpc } from "@good-dog/trpc/client";

import ProfileDropdown from "./base/ProfileDropdown";
import DarkModeSwitch from "./base/DarkModeSwitch";
import NavLogo from "./svg/NavLogo";

export default function Nav() {
  const [user] = trpc.user.useSuspenseQuery();

  return (
    <header className="w-full">
      <div className="flex items-center justify-between bg-transparent">
        <Link href="/" className="flex items-center gap-3">
          <NavLogo />
          <p className="font-righteous text-green-400 dark:text-mint-300 text-2xl">
            GOOD DOG LICENSING
          </p>
        </Link>

        <nav className="flex items-center gap-8 text-lg text-green-500 dark:text-mint-200">
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
                  <DarkModeSwitch />

        </nav>
      </div>
    </header>
  );
}
