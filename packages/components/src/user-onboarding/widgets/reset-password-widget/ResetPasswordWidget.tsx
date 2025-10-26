"use client";

import type { z } from "zod";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { trpc } from "@good-dog/trpc/client";
import type { zPasswordValues } from "@good-dog/trpc/schema";
import { Button } from "@good-dog/ui/button";
import UserOnboardingWidgetContainer from "../UserOnboardingWidgetContainer";
import RegistrationInput from "../../../oldStuff/registration/inputs/RegistrationInput";
import ResetPasswordForm from "./ResetPasswordForm";

type FormValues = z.input<typeof zPasswordValues>;

const TypedRegistrationInput = RegistrationInput<FormValues>;

export default function ResetPasswordWidget() {
  return (
    <UserOnboardingWidgetContainer>
      <div className="flex flex-row w-full items-center ">
        <div className="flex flex-row items-center w-1/2">
          <div className="flex flex-col gap-[32px] w-full">
            <div className="flex flex-col gap-[8px]">
              <h3>Reset password</h3>
              <p>Enter your details in the required fields below</p>
            </div>
            <ResetPasswordForm />
          </div>
        </div>
        <div className="bg-good-dog-main w-1/2 h-full"></div>
      </div>
    </UserOnboardingWidgetContainer>
  );
}
