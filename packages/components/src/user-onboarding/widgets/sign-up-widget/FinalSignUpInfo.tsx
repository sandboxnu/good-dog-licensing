"use client";

import type { zSignUpValues } from "@good-dog/trpc/schema";
import { useFormContext } from "react-hook-form";
import type z from "zod";
import { useMemo } from "react";
import RHFTextInput from "../../../rhf-base/RHFTextInput";
import Button from "../../../base/Button";
import Link from "next/link";
import PasswordRequirements from "../components/PasswordRequirements";
import ErrorExclamation from "../../../svg/ErrorExclamation";

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
      <p className="pt-[8px]">All fields below are required</p>
      {errorMessage && (
        <div className="flex flex-row gap-[4px] items-center pt-[12px]">
          <ErrorExclamation size="medium" />
          <p className="text-error">{errorMessage}</p>
        </div>
      )}
      <div className="pt-[32px] gap-[24px] flex flex-col">
        <div className="gap-[8px] flex flex-col">
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
      <div className="pt-[16px] flex flex-row flex-wrap justify-center space-x-1 text-body3">
        <span className="font-normal">Already have an account?</span>
        <Link href="/login" className="underline font-medium text-secondary">
          Log in
        </Link>
      </div>
    </form>
  );
}
