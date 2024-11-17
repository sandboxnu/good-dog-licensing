"use client";

import { z } from "zod";

import { zPreProcessEmptyString } from "@good-dog/trpc/utils";

import RegistrationInput from "../inputs/RegistrationInput";
import OnboardingFormProvider from "./OnboardingFormProvider";

const Schema = z.object({
  role: z.literal("MEDIA_MAKER"),
  firstName: zPreProcessEmptyString(z.string()),
  lastName: zPreProcessEmptyString(z.string()),
  discovery: z.string().optional(),
});

type FormValues = z.infer<typeof Schema>;

const TypedRegistrationInput = RegistrationInput<FormValues>;

export default function MediaMakerForm(
  props: Readonly<{
    firstName: string;
    lastName: string;
  }>,
) {
  return (
    <OnboardingFormProvider
      role="MEDIA_MAKER"
      schema={Schema}
      firstName={props.firstName}
      lastName={props.lastName}
    >
      <TypedRegistrationInput
        fieldName="firstName"
        placeholder="First Name"
        type="text"
      />
      <TypedRegistrationInput
        fieldName="lastName"
        placeholder="Last Name"
        type="text"
      />
    </OnboardingFormProvider>
  );
}
