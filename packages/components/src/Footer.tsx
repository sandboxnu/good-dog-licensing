"use client";

import Link from "next/link";
import { FaYoutube } from "react-icons/fa";
import { FaFacebook, FaInstagram, FaXTwitter } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";

import Button from "./base/Button";
import NavLogo from "./svg/NavLogo";

export default function Footer() {
  return (
    <footer className="w-full bg-green-400 text-gray-100 lg:h-[160px]">
      {/* Mobile layout (below lg) */}
      <div className="flex flex-col px-8 py-6 lg:hidden">
        <div className="flex flex-row items-center gap-2">
          <Link href={"/"}>
            <NavLogo size={34} />
          </Link>
          <Link href={"/"}>
            <h2 className="font-righteous text-[25px] text-white">
              GOOD DOG LICENSING
            </h2>
          </Link>
        </div>
        <div className="mt-2 flex flex-row gap-3">
          <FaFacebook size={19} />
          <MdEmail size={19} />
          <FaXTwitter size={19} />
          <FaYoutube size={19} />
          <FaInstagram size={19} />
        </div>
        <div className="mt-2 flex flex-row items-center justify-between gap-[25px]">
          <div className="w-1/2">
            <div className="text-xl font-bold">
              Made by students at{" "}
              <a
                target="_blank"
                href="https://www.sandboxnu.com/"
                className="underline"
              >
                Sandbox
              </a>
            </div>
          </div>
          <div className="flex w-1/2 justify-end">
            <Button
              label="Back to top"
              size="large"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              variant="outlined"
              displayIcon="arrow"
              shadow
            />
          </div>
        </div>
      </div>

      {/* Desktop layout (lg and above) */}
      <div className="hidden h-full items-center px-8 py-6 lg:grid lg:grid-cols-[1.7fr_1fr_1fr] lg:gap-8">
        <div className="flex flex-row items-center">
          <Link className="h-full" href={"/"}>
            <NavLogo size={112} />
          </Link>
          <div className="h-fit pl-4">
            <Link href={"/"}>
              <h2 className="pb-2 font-righteous text-[32px] text-white">
                GOOD DOG LICENSING
              </h2>
            </Link>
            <div className="flex flex-row gap-3">
              <FaFacebook size={19} />
              <MdEmail size={19} />
              <FaXTwitter size={19} />
              <FaYoutube size={19} />
              <FaInstagram size={19} />
            </div>
          </div>
        </div>
        <div className="flex h-full flex-col items-center justify-center">
          <div className="flex flex-col items-start gap-2 text-xl font-medium">
            <Link href="/about" className="transition-opacity hover:opacity-80">
              About Us
            </Link>
            <Link
              href="/signup/musician"
              className="transition-opacity hover:opacity-80"
            >
              For Musicians
            </Link>
            <Link
              href="/signup/media-maker"
              className="transition-opacity hover:opacity-80"
            >
              For Media Makers
            </Link>
          </div>
        </div>
        <div className="flex h-full flex-col items-end justify-between">
          <div className="mb-auto mt-[10px] text-xl font-bold">
            Made by students at{" "}
            <a
              target="_blank"
              href="https://www.sandboxnu.com/"
              className="underline"
            >
              Sandbox
            </a>
          </div>
          <div className="flex justify-end">
            <Button
              label="Back to top"
              size="large"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              variant="outlined"
              displayIcon="arrow"
              shadow
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
