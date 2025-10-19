"use client";

import type { zSignInValues } from "@good-dog/trpc/schema";
import { useFormContext } from "react-hook-form";
import type { z } from "zod";
import RHFTextInput from "../../../rhf-base/RHFTextInput";
import { Checkbox } from "@good-dog/ui/checkbox";
import Link from "next/link";
import { Button } from "@good-dog/ui/button";

interface LoginInfoProps {
  onVerifyCredentials: () => void;
}

type LoginFormFields = z.input<typeof zSignInValues>;

export default function LoginInfo({ onVerifyCredentials }: LoginInfoProps) {
  const {
    formState: { errors },
  } = useFormContext<LoginFormFields>();

  return (
    <form
      className="pt-[70px] pr-[40px]"
      onSubmit={(e) => {
        e.preventDefault();
        onVerifyCredentials();
      }}
    >
      <h1 className="text-sign-up-header font-medium">Welcome back!</h1>
      <h3 className="text-base-label">All fields below are required</h3>
      <div className="pt-[32px]">
        <RHFTextInput<LoginFormFields>
          rhfName={"email"}
          label={"Email"}
          placeholder={"example@gmail.com"}
          id="email"
          errorText={errors.email ? errors.email.message : undefined}
          required={true}
        ></RHFTextInput>
      </div>
      <div className="pt-[24px]">
        <RHFTextInput<LoginFormFields>
          rhfName={"password"}
          label={"Password"}
          placeholder={"Enter password"}
          id="password"
          errorText={errors.password ? errors.password.message : undefined}
          required={true}
        ></RHFTextInput>
        <div className="pt-[24px] flex flex-row flex-wrap justify-between">
          <div className="flex flex-row items-center space-x-1">
            <Checkbox className="" />
            <p className="">Remember me</p>
          </div>

          <Link href="/forgot-password" className="text-radio underline">
            Forgot password?
          </Link>
        </div>
        <div className="pt-[32px]">
          <Button
            type="submit"
            className="w-full rounded flex radio bg-radio shadow-boxShadow"
          >
            Log in
          </Button>
        </div>
      </div>
      <div className="pt-[16px] flex flex-row flex-wrap justify-center space-x-1 text-lg">
        <span className="">Don't have an account?</span>
        <Link href="/signup" className="underline">
          Sign up
        </Link>
      </div>
    </form>
  );
}
