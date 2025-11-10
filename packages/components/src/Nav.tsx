"use client";

import Link from "next/link";

import { trpc } from "@good-dog/trpc/client";

import NavLogo from "./svg/NavLogo";

export default function Nav() {
  const [user] = trpc.user.useSuspenseQuery();
  const signOutMutation = trpc.signOut.useMutation({
    onSuccess: () => {
      window.location.replace("/");
    },
  });

  return (
    <header className="w-full text-good-dog-main">
      <div className="flex items-center justify-between bg-transparent">
        <Link href="/" className="flex items-center gap-3">
          <NavLogo />
          <p className="font-righteous text-2xl">GOOD DOG LICENSING</p>
        </Link>

        <nav className="flex items-center gap-8 text-lg">
          <Link href="/" className="underline-offset-4 hover:underline">
            Home
          </Link>
          <Link href="/about" className="underline-offset-4 hover:underline">
            About
          </Link>
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="underline-offset-4 transition hover:underline"
              >
                Account
              </Link>
              <button
                onClick={() => signOutMutation.mutate()}
                className="underline-offset-4 hover:underline"
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="underline-offset-4 hover:underline">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
