import React from "react";

export default function Nav() {
  return (
    <nav className="font-poppins px-9 py-12 items-center font-semibold">
      <ul className="flex flex-row justify-between text-white">
        <li>
          <a href="/">Home</a>
        </li>
        <div className="flex flex-row items-center space-x-16">
          <li>
            <a href="/about">ABOUT US</a>
          </li>
          <li>
            <a href="/login">LOGIN</a>
          </li>
          <li className="rounded-full bg-good-dog-celadon text-good-dog-violet px-4 py-1">
            <a href="/submit">SUBMIT</a>
          </li>
        </div>
      </ul>
    </nav>
  );
}
