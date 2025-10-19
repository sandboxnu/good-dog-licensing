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
    <header className="text-good-dog-main">
      <div className="container flex items-center justify-between px-6 py-4">
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
