"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import CheckerColumn from "@good-dog/components/CheckerColumn";
import GoodDogLogo from "@good-dog/components/GoodDogLogo";
import {
  MediaMakerForm,
  MusicianForm,
} from "@good-dog/components/registration";
import { trpc } from "@good-dog/trpc/client";
import { Label } from "@good-dog/ui/label";
import { Switch } from "@good-dog/ui/switch";

export default function OnboardingFormPage() {
  const [user] = trpc.authenticatedUser.useSuspenseQuery();

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
        <FormComponent
          firstName={user.firstName}
          lastName={user.lastName}
          email={user.email}
        />
      </div>
      <CheckerColumn numSquares={4} className="absolute right-0 top-0 h-full" />
    </main>
  );
}
