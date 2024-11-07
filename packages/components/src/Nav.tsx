import React from "react";
import Image from "next/image";

export default function Nav() {
  return (
    <nav className="font-righteous items-center bg-good-dog-violet px-9 py-12 font-semibold">
      <ul className="flex flex-row justify-between text-white">
        <li>
          <a href="/">
            <Image
              src="/icons/Minimalist Logo.svg"
              width={64}
              height={64}
              alt="good-dog-logo"
            />
          </a>
        </li>
        <div className="flex flex-row items-center space-x-16">
          <li>
            <a href="/about">ABOUT US</a>
          </li>
          <li>
            <a href="/login">LOGIN</a>
          </li>
          <a href="/submit">
            <li className="rounded-full bg-good-dog-celadon px-4 py-1 text-good-dog-violet">
              SUBMIT
            </li>
          </a>
        </div>
      </ul>
    </nav>
  );
}
