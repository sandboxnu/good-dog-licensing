"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { Label } from "@good-dog/ui/label";
import { Switch } from "@good-dog/ui/switch";

import CheckerColumn from "../../CheckerColumn";
import GoodDogLogo from "../../GoodDogLogo";
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
    <main className="relative h-screen overflow-y-hidden bg-good-dog-celadon">
      <Link href="/" className="absolute left-3 top-3">
        <Image
          src="/icons/back_button.svg"
          width={40}
          height={40}
          alt="back button"
        />
      </Link>
      <GoodDogLogo
        facingDirection="right"
        variant="dark"
        className="absolute bottom-0 left-0 w-[30%] translate-x-[-30%] translate-y-[20%]"
      />

      <div className="mx-auto flex w-1/2 flex-1 flex-col items-center overflow-y-auto pt-16">
        <h1 className="font-righteous text-5xl uppercase">Sign up as a...</h1>
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
      <CheckerColumn numSquares={4} className="absolute right-0 top-0 h-full" />
    </main>
  );
}
