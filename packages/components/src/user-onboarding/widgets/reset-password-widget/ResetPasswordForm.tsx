"use client";

import type { z } from "zod";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { trpc } from "@good-dog/trpc/client";
import { zResetPasswordValues } from "@good-dog/trpc/schema";
import RHFTextInput from "../../../rhf-base/RHFTextInput";
import Button from "../../../base/Button";
import PasswordRequirements from "../components/password-requirements";

type FormValues = z.input<typeof zResetPasswordValues>;

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [resetId, setResetId] = useState<string | null>(null);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const resetPasswordForm = useForm<FormValues>({
    resolver: zodResolver(zResetPasswordValues),
  });

  useEffect(() => {
    const idParam = searchParams.get("reset_id");

    if (idParam) {
      // eslint-disable-next-line
      setResetId(idParam);
    } else {
      setResponseMessage(
        "Invalid password reset link. Please request a new one.",
      );

      setIsSuccess(false);
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
      {responseMessage && isSuccess ? (
        <div className="relative mb-4 rounded border border-green-400 bg-green-100 px-4 py-3 text-green-700">
          <span className="block sm:inline">{responseMessage}</span>
          <span className="ml-1 block sm:inline">
            Redirecting to login page...
          </span>
        </div>
      ) : null}
      <div className="flex flex-col w-full pr-[40px]">
        <div className="flex flex-col gap-[12px]">
          <div className="gap-[8px]">
            <RHFTextInput<FormValues>
              rhfName="password"
              label="Password"
              placeholder="Your password"
              id="password"
              errorText={resetPasswordForm.formState.errors.password?.message}
              type="password"
            />
            <PasswordRequirements />
          </div>

          <RHFTextInput<FormValues>
            rhfName="confirmPassword"
            label="Confirm Password"
            placeholder="Re-enter password"
            id="confirmPassword"
            errorText={
              resetPasswordForm.formState.errors.confirmPassword?.message
            }
            type="password"
          />
        </div>
        <div className="pt-[32px]">
          <Button
            onClick={onSubmit}
            variant="contained"
            size="large"
            label="Reset password"
            fullWidth
            shadow
          />
        </div>
      </div>
    </FormProvider>
  );
}
