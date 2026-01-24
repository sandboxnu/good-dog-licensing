"use client";

import type z from "zod";
import { useMemo } from "react";
import Link from "next/link";
import { useFormContext } from "react-hook-form";

import type { zSignUpValues } from "@good-dog/trpc/schema";

import Button from "../../../base/Button";
import RHFTextInput from "../../../rhf-base/RHFTextInput";
import ErrorExclamation from "../../../svg/status-icons/ErrorExclamation";
import PasswordRequirements from "../components/PasswordRequirements";

interface FinalSignUpInfoProps {
  role: "MUSICIAN" | "MEDIA_MAKER" | undefined;
  onSubmit: () => void;
  errorMessage?: string;
}

const formatRole = (role: "MUSICIAN" | "MEDIA_MAKER") => {
  return role === "MUSICIAN" ? "Musician" : "Media Maker";
};

type SignUpFormFields = z.input<typeof zSignUpValues>;

export default function FinalSignUpInfo({
  role,
  onSubmit,
  errorMessage,
}: FinalSignUpInfoProps) {
  const {
    formState: { errors },
  } = useFormContext<SignUpFormFields>();

  const headerLabel = useMemo(
    () => (role ? `Sign up as a ${formatRole(role)}` : "Create Account"),
    [role],
  );

  return (
    <form className="pr-[40px]" onSubmit={onSubmit}>
      <h3>{headerLabel}</h3>
      <p className="pt-[8px]">* Indicates a required question</p>
      {errorMessage && (
        <div className="flex flex-row items-center gap-[4px] pt-[12px]">
          <ErrorExclamation size="medium" />
          <p className="text-error">{errorMessage}</p>
        </div>
      )}
      <div className="flex flex-col gap-[24px] pt-[32px]">
        <div className="flex flex-col gap-[8px]">
          <RHFTextInput<SignUpFormFields>
            rhfName="password"
            label="Password"
            placeholder="Your password"
            id="password"
            errorText={errors.password?.message}
            type="password"
          />
          {!errors.password?.message && <PasswordRequirements />}
        </div>
        <RHFTextInput<SignUpFormFields>
          rhfName="confirmPassword"
          label="Confirm Password"
          placeholder="Confirm your password"
          id="confirmPassword"
          errorText={errors.confirmPassword?.message}
          type="password"
        />
        <RHFTextInput<SignUpFormFields>
          rhfName="phoneNumber"
          label="Phone Number"
          placeholder="123-456-7890"
          id="phoneNumber"
          errorText={errors.phoneNumber?.message}
        />
      </div>
      <div className="pt-[32px]">
        <Button
          type="submit"
          variant="contained"
          size="large"
          label="Sign up"
          shadow
          fullWidth
        />
      </div>
      <div className="flex flex-row flex-wrap justify-center space-x-1 pt-[16px] text-body3">
        <span className="font-normal">Already have an account?</span>
        <Link href="/login" className="font-medium text-secondary underline">
          Log in
        </Link>
      </div>
    </form>
  );
}
