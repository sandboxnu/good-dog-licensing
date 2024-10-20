import React from "react";

export default function Nav() {
  return (
    <nav>
      <ul className="space-x- flex flex-row font-['Poppins']">
        <li>
          <a href="/">Home</a>
        </li>
        <div className="flex flex-row">
          <li>
            <a href="/about">ABOUT US</a>
          </li>
          <li>
            <a href="/login">LOGIN</a>
          </li>
          <li className="bg-good-dog-celadon">
            <a href="/submit">SUBMIT</a>
          </li>
        </div>
      </ul>
    </nav>
  );
}
