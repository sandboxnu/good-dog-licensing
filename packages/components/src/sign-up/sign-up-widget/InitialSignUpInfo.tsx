"use client";

import { zSignUpValues } from "@good-dog/trpc/schema";
import { useFormContext } from "react-hook-form";
import z from "zod";
import RHFTextInput from "../../rhf-base/RHFTextInput";
import { Button } from "@good-dog/ui/button";
import { useMemo } from "react";

interface InitialSignUpInfoProps {
  role: "MUSICIAN" | "MEDIA_MAKER" | undefined;
  onVerifyEmail: () => void;
}

const formatRole = (role: "MUSICIAN" | "MEDIA_MAKER") => {
  return role === "MUSICIAN" ? "Musician" : "Media Maker";
};

type SignUpFormFields = z.input<typeof zSignUpValues>;

export default function InitialSignUpInfo({
  role,
  onVerifyEmail,
}: InitialSignUpInfoProps) {
  const {
    formState: { errors },
  } = useFormContext<SignUpFormFields>();

  const headerLabel = useMemo(
    () => (role ? `Sign up as a ${formatRole(role)}` : "Create Account"),
    [role],
  );

  return (
    <form
      className="pt-[70px] pr-[40px]"
      onSubmit={(e) => {
        e.preventDefault();
        onVerifyEmail();
      }}
    >
      <h1 className="text-sign-up-header font-medium">{headerLabel}</h1>
      <h3 className="text-base-label">All fields below are required</h3>
      <div className="pt-[32px] flex flex-row gap-[24px]">
        <RHFTextInput<SignUpFormFields>
          rhfName="firstName"
          label="First name"
          placeholder="Enter first name"
          id="firstName"
          errorText={errors.firstName ? errors.firstName.message : undefined}
          required={false}
        />
        <RHFTextInput<SignUpFormFields>
          rhfName="lastName"
          label="Last name"
          placeholder="Enter last name"
          id="lastName"
          errorText={errors.lastName ? errors.lastName.message : undefined}
          required={false}
        />
      </div>
      <div className="pt-[24px]">
        <RHFTextInput<SignUpFormFields>
          rhfName="email"
          label="Email"
          placeholder="example@email.com"
          id="email"
          errorText={errors.email ? errors.email.message : undefined}
          required={false}
        />
      </div>
      <div className="pt-[32px]">
        <Button type="submit" className="w-full">
          Verify email
        </Button>
      </div>
    </form>
  );
}
