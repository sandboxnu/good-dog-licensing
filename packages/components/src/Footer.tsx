"use client";
import NavLogo from "./svg/NavLogo";
import { FaFacebook, FaXTwitter, FaInstagram } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { FaYoutube } from "react-icons/fa";
import Link from "next/link";
import Button from "./base/Button";

export default function Footer() {
  return (
    <footer className="bg-good-dog-main text-white w-full ">
      <div className="flex items-center justify-between px-8 py-6">
        <div className="flex flex-row items-center justify-between">
          <div className="h-full">
            <NavLogo width={64} height={64} />
          </div>
          <div className="pl-4">
            <h1 className="font-righteous text-2xl pb-2 text-white">
              GOOD DOG LICENSING
            </h1>
            <div className="flex flex-row gap-2">
              <FaFacebook />
              <MdEmail />
              <FaXTwitter />
              <FaYoutube />
              <FaInstagram />
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <Link href="/about">About Us</Link>
          <Link href="/">For Musicians</Link>
          <Link href="/">For Media Makers</Link>
        </div>
        <div className="flex flex-col justify-between">
          <div className="font-bold">
            Made by students at{" "}
            <a href="https://www.sandboxnu.com/" className="underline">
              Sandbox
            </a>
          </div>
          <div className="flex justify-end mt-auto">
            <Button
              label="Back to top"
              size="medium"
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
