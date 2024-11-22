import Image from "next/image";

import { SignInForm } from "@good-dog/components/registration";

export default function Page() {
  return (
    <div className="flex max-h-screen flex-row">
      <div className="max-h-screen flex-1 overflow-hidden bg-good-dog-celadon">
        <a href="/" className="m-10 inline-block">
          <Image
            src="/icons/back_button.svg"
            width={40}
            height={40}
            alt="back button"
          />
        </a>
        <Image
          src="/icons/Dark Mode Logo.svg"
          width={828}
          height={828}
          alt="good-dog-logo"
          className="mt-38 -ml-52"
        />
      </div>

      <Image
        src="/bg-assets/checker_divider.svg"
        alt="footer-checker"
        width={0}
        height={0}
        className="h-screen w-auto"
      />
      <div className="flex flex-1 flex-col bg-good-dog-violet">
        <div>
          <ul className="float-right m-9 flex flex-row items-center space-x-16 font-righteous">
            <li>
              <a className="text-white" href="/about">
                ABOUT US
              </a>
            </li>
            <a href="/submit">
              <li className="rounded-full bg-good-dog-celadon px-4 py-1 text-good-dog-violet">
                SUBMIT
              </li>
            </a>
          </ul>
        </div>
        <h1 className="mx-14 font-righteous text-5xl text-good-dog-celadon">
          LOGIN
        </h1>
        <SignInForm />
      </div>
    </div>
  );
}
