"use client";

import { useState } from "react";
import Image from "next/image";

import { Label } from "@good-dog/ui/label";
import { Switch } from "@good-dog/ui/switch";

import MediaMakerForm from "./MediaMakerForm";
import MusicianForm from "./MusicianForm";

export default function OnboardingFormSwitcher(
  props: Readonly<{
    firstName: string;
    lastName: string;
    email: string;
  }>,
) {
  const [isChecked, setIsChecked] = useState(true);

  const roleName = isChecked ? "Musician" : "Media Maker";
  const FormComponent = isChecked ? MusicianForm : MediaMakerForm;

  return (
    <main className="bg-good-dog-celadon">
      <div
        className={`flex max-h-screen bg-good-dog-celadon ${roleName === "Media Maker" ? "overflow-hidden" : ""}`}
      >
        <div className="flex-1">
          <a href="/" className="ml-10 mt-10 inline-block">
            <Image
              src="/icons/back_button.svg"
              width={40}
              height={40}
              alt="back button"
            />
          </a>
          <Image
            src="/icons/Dark Mode Logo.svg"
            width={494}
            height={494}
            alt="good-dog-logo"
            className="-ml-44 mt-64"
          />
        </div>

        <div className="mt-24 flex flex-1 flex-col items-center">
          <h1 className="font-righteous text-5xl">SIGN UP AS A...</h1>
          <Label
            htmlFor="role-toggle"
            className="text-lg font-medium text-foreground"
          >
            {roleName}
          </Label>
          <Switch
            id="role-toggle"
            checked={isChecked}
            onCheckedChange={setIsChecked}
          />
          <FormComponent {...props} />
        </div>
        <div className="flex-1">
          <Image
            src="/bg-assets/checker_divider.svg"
            alt="footer-checker"
            width={0}
            height={0}
            className="float-right h-screen w-auto"
          />
        </div>
      </div>
    </main>
  );
}
