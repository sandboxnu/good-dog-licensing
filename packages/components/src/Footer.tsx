"use client";

import { FaYoutube } from "react-icons/fa";
import { FaFacebook, FaInstagram, FaXTwitter } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";

import Button from "./base/Button";
import NavLogo from "./svg/NavLogo";

export default function Footer() {
  return (
    <footer className="h-[160px] w-full bg-green-400 text-gray-100">
      <div className="flex h-full items-center justify-between px-8 py-6">
        <div className="flex flex-row items-center justify-between">
          <div className="h-full">
            <NavLogo size={112} />
          </div>
          <div className="h-fit pl-4">
            <h2 className="pb-2 font-righteous text-[32px] text-white">
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
        <div className="flex h-full flex-col justify-between">
          <div className="mb-auto mt-[10px] text-xl font-bold">
            Made by students at{" "}
            <a href="https://www.sandboxnu.com/" className="underline">
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
