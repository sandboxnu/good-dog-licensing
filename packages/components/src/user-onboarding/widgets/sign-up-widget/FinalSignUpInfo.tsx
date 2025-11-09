"use client";

import type { zSignUpValues } from "@good-dog/trpc/schema";
import { useFormContext } from "react-hook-form";
import type z from "zod";
import { useMemo } from "react";
import RHFTextInput from "../../../rhf-base/RHFTextInput";
import Button from "../../../base/Button";
import Link from "next/link";
import PasswordRequirements from "../components/password-requirements";

interface FinalSignUpInfoProps {
  role: "MUSICIAN" | "MEDIA_MAKER" | undefined;
  onSubmit: () => void;
}

const formatRole = (role: "MUSICIAN" | "MEDIA_MAKER") => {
  return role === "MUSICIAN" ? "Musician" : "Media Maker";
};

type SignUpFormFields = z.input<typeof zSignUpValues>;

export default function FinalSignUpInfo({
  role,
  onSubmit,
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
      <h1 className="text-h3 font-medium">{headerLabel}</h1>
      <h3 className="text-body3 font-normal">All fields below are required</h3>
      <div className="gap-[8px]">
        <div className="pt-[32px] flex flex-row gap-[24px]">
          <RHFTextInput<SignUpFormFields>
            rhfName="password"
            label="Password"
            placeholder="Your password"
            id="password"
            errorText={errors.password?.message}
            type="password"
          />

          <RHFTextInput<SignUpFormFields>
            rhfName="confirmPassword"
            label="Confirm Password"
            placeholder="Confirm your password"
            id="confirmPassword"
            errorText={errors.confirmPassword?.message}
            type="password"
          />
        </div>
        <PasswordRequirements />
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
