"use client";

import type { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { trpc } from "@good-dog/trpc/client";
import { zForgotPasswordValues } from "@good-dog/trpc/schema";

import GenericRegistrationForm from "./GenericRegistrationForm";
import RegistrationInput from "./inputs/RegistrationInput";

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

  const onSubmit = forgotPasswordForm.handleSubmit((values) => {
    forgotPasswordMutation.mutate(values);
  });

  return (
    <FormProvider {...forgotPasswordForm}>
      <GenericRegistrationForm
        title="Forgot Password"
        variant="light"
        error={
          responseMessage && !isSuccess ? (
            <p className="text-good-dog-pale-yellow">{responseMessage}</p>
          ) : null
        }
        ctaTitle="Send Reset Link"
        onSubmit={onSubmit}
        disabled={forgotPasswordMutation.isPending}
        secondaryAction="Remember your password?"
        secondaryActionLink="Sign in"
        secondaryActionUrl="/login"
      >
        <div className="flex flex-col gap-3">
          <p className="mb-2 text-white">
            Enter your email address and we'll send you a link to reset your
            password.
          </p>

          {responseMessage && isSuccess ? (
            <div className="relative mb-4 rounded border border-green-400 bg-green-100 px-4 py-3 text-green-700">
              <span className="block sm:inline">{responseMessage}</span>
              <span className="ml-1 block sm:inline">
                Redirecting to login page...
              </span>
            </div>
          ) : null}

          <TypedRegistrationInput
            fieldName="email"
            type="email"
            label="Email"
          />
        </div>
      </GenericRegistrationForm>
    </FormProvider>
  );
}
