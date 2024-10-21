import React from "react";

export default function Nav() {
  return (
    <nav>
      <ul className="mx-9 mt-12 flex flex-row items-center justify-between font-poppins font-semibold">
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
          <li className="rounded-full bg-good-dog-celadon px-4 py-1">
            <a href="/submit">SUBMIT</a>
          </li>
        </div>
      </ul>
    </nav>
  );
}
