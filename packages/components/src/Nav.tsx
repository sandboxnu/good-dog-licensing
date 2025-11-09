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
    <header className="w-full">
      <div className="flex items-center justify-between bg-transparent">
        <Link href="/" className="flex items-center gap-3">
          <NavLogo />
          <p className="font-righteous text-2xl text-good-dog-main">
            GOOD DOG LICENSING
          </p>
        </Link>

        <nav className="flex items-center gap-8 text-lg text-secondary">
          <Link href="/" className="hover:underline underline-offset-4">
            Home
          </Link>
          <Link href="/about" className="hover:underline underline-offset-4">
            About
          </Link>
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="transition hover:underline underline-offset-4"
              >
                Account
              </Link>
              <button
                onClick={() => signOutMutation.mutate()}
                className="hover:underline underline-offset-4"
              >
                Logout
              </button>
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
