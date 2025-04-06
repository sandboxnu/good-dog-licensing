"use client";

import type { z } from "zod";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { trpc } from "@good-dog/trpc/client";
import { zPasswordValues } from "@good-dog/trpc/schema";
import { Button } from "@good-dog/ui/button";

import GenericRegistrationForm from "./GenericRegistrationForm";
import RegistrationInput from "./inputs/RegistrationInput";

type FormValues = z.infer<typeof zPasswordValues>;

const TypedRegistrationInput = RegistrationInput<FormValues>;

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [resetId, setResetId] = useState<string | null>(null);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLinkValid, setIsLinkValid] = useState(true);

  const resetPasswordForm = useForm<FormValues>({
    resolver: zodResolver(zPasswordValues),
  });

  useEffect(() => {
    const idParam = searchParams.get("reset_id");

    if (idParam) {
      setResetId(idParam);
    } else {
      setResponseMessage(
        "Invalid password reset link. Please request a new one.",
      );
      setIsSuccess(false);
      setIsLinkValid(false);
    }
  }, [searchParams]);

  const resetPasswordMutation = trpc.confirmPasswordReset.useMutation({
    onSuccess: (data) => {
      setResponseMessage(data.message);
      setIsSuccess(true);

      setTimeout(() => {
        router.push("/login");
      }, 3000); // Redirect after 3 seconds
    },
    onError: (err) => {
      setResponseMessage(err.message);
      setIsSuccess(false);
    },
  });

  const onSubmit = resetPasswordForm.handleSubmit((values) => {
    if (resetId) {
      resetPasswordMutation.mutate({
        passwordResetId: resetId,
        newPassword: values.password,
      });
    } else {
      setResponseMessage(
        "Invalid password reset link. Please request a new one.",
      );
      setIsSuccess(false);
    }
  });

  return (
    <FormProvider {...resetPasswordForm}>
      <GenericRegistrationForm
        title="Reset Password"
        variant="light"
        error={
          responseMessage && !isSuccess ? (
            <p className="text-good-dog-pale-yellow">{responseMessage}</p>
          ) : null
        }
        ctaTitle="Reset Password"
        onSubmit={onSubmit}
        disabled={resetPasswordMutation.isPending || !resetId}
        secondaryAction="Remember your password?"
        secondaryActionLink="Sign in"
        secondaryActionUrl="/login"
      >
        {isLinkValid ? (
          <div className="flex flex-col gap-3">
            {responseMessage && isSuccess ? (
              <div className="relative mb-4 rounded border border-green-400 bg-green-100 px-4 py-3 text-green-700">
                <span className="block sm:inline">{responseMessage}</span>
                <span className="ml-1 block sm:inline">
                  Redirecting to login page...
                </span>
              </div>
            ) : (
              <TypedRegistrationInput
                fieldName="password"
                type="password"
                label="New Password"
              />
            )}
          </div>
        ) : (
          <Button
            className="mt-4 h-10 w-full rounded-full bg-good-dog-celadon px-4 py-3 text-lg text-good-dog-violet"
            onClick={(e) => {
              router.push("/forgot-password");
            }}
          >
            Request Password Reset
          </Button>
        )}
      </GenericRegistrationForm>
    </FormProvider>
  );
}
