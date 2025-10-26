"use client";

import type { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { trpc } from "@good-dog/trpc/client";
import { zForgotPasswordValues } from "@good-dog/trpc/schema";
import RegistrationInput from "../../../oldStuff/registration/inputs/RegistrationInput";
import RHFTextInput from "../../../rhf-base/RHFTextInput";
import Button from "../../../base/Button";

type FormValues = z.input<typeof zForgotPasswordValues>;

const TypedRegistrationInput = RegistrationInput<FormValues>;

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const forgotPasswordForm = useForm<FormValues>({
    resolver: zodResolver(zForgotPasswordValues),
  });

  const forgotPasswordMutation = trpc.sendForgotPasswordEmail.useMutation({
    onSuccess: (data) => {
      setResponseMessage(data.message);
      setIsSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 3000); // Redirect after 3 seconds
    },
    onError: (err) => {
      console.error(err);
      setResponseMessage(err.message);
      setIsSuccess(false);
    },
  });
  //                            disabled={forgotPasswordMutation.isPending}

  const onSubmit = forgotPasswordForm.handleSubmit((values) => {
    forgotPasswordMutation.mutate(values);
  });

  return (
    <FormProvider {...forgotPasswordForm}>
      <div className="pr-[40px]">
      {responseMessage && isSuccess ? (
        <div className="relative mb-4 rounded border border-green-400 bg-green-100 px-4 py-3 text-green-700">
          <span className="block sm:inline">{responseMessage}</span>
          <span className="ml-1 block sm:inline">
            Redirecting to login page...
          </span>
        </div>
      ) : null}
      <RHFTextInput<FormValues>
        rhfName={"email"}
        label={"Email"}
        placeholder={"example@gmail.com"}
        id="email"

        // errorText={formMethods.formState.errors.email?.message}
      />
      <div className="pt-[32px]">
        <Button
          onClick={onSubmit}
          variant="contained"
          size="large"
          label="Send email"
          fullWidth
          shadow
        />
      </div>
      </div>
    </FormProvider>
  );
}
