"use client";

import type { UseFormRegister } from "react-hook-form";

import { Input } from "@good-dog/ui/input";

interface PNROnboardingInputProps {
  register: UseFormRegister<{
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    confirmPassword: string;
  }>;
  errorMessage: string | undefined;
  id: string;
  label: string;
  registerName:
    | "password"
    | "firstName"
    | "lastName"
    | "phoneNumber"
    | "confirmPassword";
}

export default function PNROnboardingInput({
  register,
  errorMessage,
  id,
  label,
  registerName,
}: PNROnboardingInputProps) {
  return (
    <div className="flex flex-col pb-6">
      <div className="pb-2">
        <label
          className="font-afacad text-2xl font-medium text-black"
          htmlFor={id}
        >
          {label}
        </label>
        <label className="font-afacad text-2xl font-semibold text-[#F4392D]">
          {" *"}
        </label>
      </div>
      <Input
        type={
          registerName.toLowerCase().includes("password") ? "password" : "text"
        }
        className="h-[40px] bg-[#D9D9D9] pl-[8px] placeholder-[#5F5F5F] placeholder:text-base placeholder:font-medium"
        id={id}
        {...register(registerName)}
        placeholder={`Enter your ${label.toLowerCase()}`}
      ></Input>
      <p className="font-afacad text-sm font-medium text-[#75747A]">
        {errorMessage}
      </p>
    </div>
  );
}
