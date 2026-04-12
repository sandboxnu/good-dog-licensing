"use client";

import type z from "zod";
import { useMemo } from "react";
import Link from "next/link";
import { useFormContext } from "react-hook-form";

import type { zSignUpValues } from "@good-dog/trpc/schema";

import Button from "../../../base/Button";
import RHFRadioGroup from "../../../rhf-base/RHFRadioGroup";
import RHFTextInput from "../../../rhf-base/RHFTextInput";
import ErrorExclamation from "../../../svg/status-icons/ErrorExclamation";

interface InitialSignUpInfoProps {
  role: "MUSICIAN" | "MEDIA_MAKER" | undefined;
  onVerifyEmail: () => void;
  emailAlreadyExists: boolean;
  errorMessage?: string;
}

const formatRole = (role: "MUSICIAN" | "MEDIA_MAKER") => {
  return role === "MUSICIAN" ? "Musician" : "Media Maker";
};

type SignUpFormFields = z.input<typeof zSignUpValues>;

export default function InitialSignUpInfo({
  role,
  onVerifyEmail,
  emailAlreadyExists,
  errorMessage,
}: InitialSignUpInfoProps) {
  const {
    formState: { errors },
  } = useFormContext<SignUpFormFields>();

  const headerLabel = useMemo(
    () => (role ? `Sign up as a ${formatRole(role)}` : "Create account"),
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
      <h3 className="text-green-400 dark:text-mint-200">{headerLabel}</h3>
      <p className="pt-[8px] text-error dark:text-red-300">
        * Indicates a required question.
      </p>
      {errorMessage && (
        <div className="flex flex-row items-center gap-[4px] pt-[12px]">
          <ErrorExclamation size="medium" />
          <p className="text-red-400 dark:text-red-300">{errorMessage}</p>
        </div>
      )}
      <div className="flex flex-row gap-[24px] pt-[32px]">
        <RHFTextInput<SignUpFormFields>
          rhfName="firstName"
          label="First name"
          placeholder="Enter first name"
          id="firstName"
          errorText={errors.firstName?.message}
          required
        />
        <RHFTextInput<SignUpFormFields>
          rhfName="lastName"
          label="Last name"
          placeholder="Enter last name"
          id="lastName"
          errorText={errors.lastName?.message}
          required
        />
      </div>
      <div className="pt-[24px]">
        <RHFTextInput<SignUpFormFields>
          rhfName="email"
          label="Email"
          placeholder="example@email.com"
          id="email"
          errorText={
            emailAlreadyExists
              ? "User with email already exists"
              : errors.email?.message
          }
          required
        />
      </div>
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
          required
        />
      </div>
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
      <div className="flex flex-row flex-wrap items-center justify-center space-x-1 pt-[16px] text-body3">
        <p className="text-dark-gray-500 dark:text-gray-200">
          Already have an account?
        </p>
        <Link
          href="/login"
          className="font-medium text-secondary underline text-green-500 dark:text-mint-200"
        >
          Log in
        </Link>
      </div>
    </form>
  );
}
