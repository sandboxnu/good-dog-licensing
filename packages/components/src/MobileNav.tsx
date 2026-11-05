"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Menu, X } from "lucide-react";

import { trpc } from "@good-dog/trpc/client";

import DarkModeSwitch from "./base/DarkModeSwitch";
import ProfileDropdown from "./base/ProfileDropdown";
import NavLogo from "./svg/NavLogo";

export default function MobileNav() {
  const [user] = trpc.user.useSuspenseQuery();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const homeLink = user ? "/home" : "/";
  const closeMenu = () => setIsOpen(false);

  const links = [
    { href: homeLink, label: "Home" },
    ...(user
      ? []
      : [
          { href: "/login", label: "Login" },
          { href: "/signup", label: "Sign up" },
        ]),
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
          {/* Hide the wordmark on narrow screens rather than truncating it.
              Logged-in users also have the profile icon, so they need more room. */}
          <p
            className={clsx(
              "hidden font-righteous text-xl whitespace-nowrap text-green-400 dark:text-mint-300",
              user ? "min-[400px]:block" : "min-[360px]:block",
            )}
          >
            GOOD DOG LICENSING
          </p>
        </Link>
        <div className="flex shrink-0 items-center gap-[12px]">
          {user && <ProfileDropdown />}
          <button
            type="button"
            onClick={() => setIsOpen((open) => !open)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-nav-menu"
            className="flex h-[40px] w-[40px] items-center justify-center rounded-[8px] text-green-500 dark:text-mint-200"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <nav
          id="mobile-nav-menu"
          className="mt-[12px] flex flex-col rounded-[16px] border border-solid border-gray-600 bg-cream-300 px-[16px] py-[8px] text-lg text-green-500 dark:border-gray-200 dark:bg-green-600 dark:text-mint-200"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              className={clsx(
                "py-[10px] underline-offset-[6px]",
                pathname === link.href && "underline",
              )}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex items-center justify-between py-[10px]">
            <span>Dark mode</span>
            <DarkModeSwitch />
          </div>
        </nav>
      )}
    </header>
  );
}
