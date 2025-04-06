"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

import { trpc } from "@good-dog/trpc/client";

export default function Nav() {
  const [user] = trpc.user.useSuspenseQuery();
  const signOutMutation = trpc.signOut.useMutation({
    onSuccess: () => {
      window.location.reload();
    },
  });

  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <nav className="items-center bg-good-dog-violet px-9 py-12 font-righteous font-semibold">
      <ul className="flex flex-row justify-between text-white">
        <li>
          <Link href="/">
            <Image
              src="/icons/Minimalist Logo.svg"
              width={64}
              height={64}
              alt="good-dog-logo"
            />
          </Link>
        </li>
        <div className="flex flex-row items-center space-x-16">
          <li>
            <Link href="/about">ABOUT US</Link>
          </li>
          {user ? (
            <>
              <li>
                <Link href="/account">ACCOUNT</Link>
              </li>
              <li>
                <button
                  onClick={() => {
                    signOutMutation.mutate();
                  }}
                >
                  LOGOUT
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link href="/login">LOGIN</Link>
            </li>
          )}
          {(user?.role === "ADMIN" || user?.role === "MODERATOR") && (
            <li>
              <Link href="/dashboard/projects">DASHBOARD</Link>
            </li>
          )}
          {(!user ||
            user.role === "MEDIA_MAKER" ||
            user.role === "MUSICIAN") && (
            <Link href="/submit">
              <li className="rounded-full bg-good-dog-celadon px-4 py-1 text-good-dog-violet">
                SUBMIT
              </li>
            </Link>
          )}
        </div>
      </ul>
    </nav>
  );
}
