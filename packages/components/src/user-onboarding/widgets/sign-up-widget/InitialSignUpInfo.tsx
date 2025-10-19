"use client";

import { zSignUpValues } from "@good-dog/trpc/schema";
import { useFormContext } from "react-hook-form";
import z from "zod";
import { useMemo } from "react";
import RHFTextInput from "../../../rhf-base/RHFTextInput";
import Button from "../../../base/Button";
import Link from "next/link";
import RHFRadioGroup from "../../../rhf-base/RHFRadioGroup";

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
      className="pr-[40px]"
      onSubmit={(e) => {
        e.preventDefault();
        onVerifyEmail();
      }}
    >
      <h1 className="text-h3 font-medium">{headerLabel}</h1>
      <h3 className="text-body3 font-normal">All fields below are required</h3>
      <div className="pt-[32px] flex flex-row gap-[24px]">
        <RHFTextInput<SignUpFormFields>
          rhfName="firstName"
          label="First name"
          placeholder="Enter first name"
          id="firstName"
          errorText={errors.firstName?.message}
        />
        <RHFTextInput<SignUpFormFields>
          rhfName="lastName"
          label="Last name"
          placeholder="Enter last name"
          id="lastName"
          errorText={errors.lastName?.message}
        />
      </div>
      <div className="pt-[24px]">
        <RHFTextInput<SignUpFormFields>
          rhfName="email"
          label="Email"
          placeholder="example@email.com"
          id="email"
          errorText={errors.email?.message}
          required={false}
        />
      </div>
      {!role && (
        <div className="pt-[24px]">
          <RHFRadioGroup<SignUpFormFields>
            rhfName="role"
            options={[
              { value: "MUSICIAN", label: "Musician" },
              { value: "MEDIA_MAKER", label: "Media Maker" },
            ]}
            id="role"
            label="Who are you signing up as?"
            errorText={errors.role?.message}
          />
        </div>
      )}
      <div className="pt-[32px]">
        <Button
          type="submit"
          variant="contained"
          size="large"
          label="Verify email"
          shadow
          fullWidth
        />
      </div>
      <div className="pt-[16px] flex flex-row flex-wrap justify-center space-x-1 text-body3">
        <span className="font-normal">Already have an account?</span>
        <Link href="/login" className="underline font-medium text-secondary">
          Log in
        </Link>
      </div>
    </form>
  );
}
