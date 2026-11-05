"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Menu, X } from "lucide-react";

import { trpc } from "@good-dog/trpc/client";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
} from "@good-dog/ui/sheet";

import DarkModeSwitch from "./base/DarkModeSwitch";
import NavLogo from "./svg/NavLogo";

export default function MobileNav() {
  const [user] = trpc.user.useSuspenseQuery();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const homeLink = user ? "/home" : "/";
  const closeMenu = () => setIsOpen(false);

  const signOutMutation = trpc.signOut.useMutation({
    onSuccess: () => {
      window.location.replace("/");
    },
  });

  // Role-specific shortcut to start a new submission
  const submitLink =
    user?.role === "MUSICIAN"
      ? { href: "/music-submission", label: "Submit a song" }
      : user?.role === "MEDIA_MAKER"
        ? { href: "/project-submission", label: "New project request" }
        : null;

  // Deactivated users see the "Account inactive" screen on every page,
  // so only offer Log out (rendered below)
  const links = user
    ? user.active
      ? [
          { href: homeLink, label: "Home" },
          ...(submitLink ? [submitLink] : []),
          { href: "/profile", label: "Profile" },
        ]
      : []
    : [
        { href: homeLink, label: "Home" },
        { href: "/login", label: "Login" },
        { href: "/signup", label: "Sign up" },
      ];

  return (
    <header className="w-full">
      <div className="flex items-center justify-between gap-[12px]">
        <Link
          href={homeLink}
          className="flex min-w-0 items-center gap-2"
          onClick={closeMenu}
        >
          <NavLogo size={28} />
          {/* Hide the wordmark on narrow screens rather than truncating it */}
          <p className="hidden font-righteous text-xl whitespace-nowrap text-green-400 min-[360px]:block dark:text-mint-300">
            GOOD DOG LICENSING
          </p>
        </Link>
        <div className="flex shrink-0 items-center gap-[12px]">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="Open menu"
            className="flex h-[40px] w-[40px] items-center justify-center rounded-[8px] text-green-500 dark:text-mint-200"
          >
            <Menu size={28} />
          </button>
        </div>
      </div>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent
          side="right"
          aria-describedby={undefined}
          // Hide the sheet's built-in close icon; we render a larger one below
          className="flex w-[280px] max-w-[85vw] flex-col gap-0 border-l border-gray-600 bg-cream-300 p-0 dark:border-gray-200 dark:bg-green-600 [&>button:first-child]:hidden"
        >
          <div className="flex items-center justify-between px-[24px] pt-[24px] pb-[16px]">
            <SheetTitle className="font-righteous text-xl font-normal text-green-400 dark:text-mint-300">
              MENU
            </SheetTitle>
            <SheetClose
              aria-label="Close menu"
              className="flex h-[40px] w-[40px] items-center justify-center rounded-[8px] text-green-500 dark:text-mint-200"
            >
              <X size={28} />
            </SheetClose>
          </div>

          <nav className="flex flex-col px-[24px]">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  aria-current={isActive ? "page" : undefined}
                  className={clsx(
                    "border-b border-solid border-gray-600/30 py-[16px] text-xl text-green-500 dark:border-gray-200/30 dark:text-mint-200",
                    isActive &&
                      "font-semibold underline underline-offset-[6px]",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {user && (
            <div className="px-[24px] pt-[16px]">
              <button
                type="button"
                onClick={() => signOutMutation.mutate()}
                disabled={signOutMutation.isPending}
                className="py-[8px] text-xl text-red-400 dark:text-red-300"
              >
                Log out
              </button>
            </div>
          )}

          <div className="mt-auto flex items-center justify-between border-t border-solid border-gray-600/30 px-[24px] py-[20px] text-lg text-green-500 dark:border-gray-200/30 dark:text-mint-200">
            <span>Dark mode</span>
            <DarkModeSwitch />
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
