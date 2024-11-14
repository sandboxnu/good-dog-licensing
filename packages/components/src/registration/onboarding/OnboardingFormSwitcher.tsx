"use client";

import { useState } from "react";

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
    <main>
      <div className="flex items-center justify-between">
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
      </div>
      <FormComponent {...props} />
    </main>
  );
}
