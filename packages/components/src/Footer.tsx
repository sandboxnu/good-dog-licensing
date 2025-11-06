"use client";
import NavLogo from "./svg/NavLogo";
import { FaFacebook, FaXTwitter, FaInstagram } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { FaYoutube } from "react-icons/fa";
import Link from "next/link";
import Button from "./base/Button";

export default function Footer() {
  return (
    <footer className="bg-good-dog-main text-white w-full h-[160px] ">
      <div className="flex items-center justify-between px-8 py-6 h-full">
        <div className="flex flex-row items-center justify-between">
          <div className="h-full">
            <NavLogo size={112} />
          </div>
          <div className="pl-4 h-fit">
            <h2 className="font-righteous text-[32px] pb-2 text-white">
              GOOD DOG LICENSING
            </h2>
            <div className="flex flex-row gap-3">
              <FaFacebook size={19} />
              <MdEmail size={19} />
              <FaXTwitter size={19} />
              <FaYoutube size={19} />
              <FaInstagram size={19} />
            </div>
          </div>
        </div>
        <div className="flex flex-col text-lg">
          <Link href="/about">About Us</Link>
          <Link href="/">For Musicians</Link>
          <Link href="/">For Media Makers</Link>
        </div>
        <div className="flex flex-col justify-between h-full">
          <div className="font-bold mt-[10px] mb-auto text-xl">
            Made by students at{" "}
            <a href="https://www.sandboxnu.com/" className="underline">
              Sandbox
            </a>
          </div>
          <div className="flex justify-end ">
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
