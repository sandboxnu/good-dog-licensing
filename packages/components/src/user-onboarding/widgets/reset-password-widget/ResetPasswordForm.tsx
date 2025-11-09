"use client";

import type { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { trpc } from "@good-dog/trpc/client";
import { zResetPasswordValues } from "@good-dog/trpc/schema";
import RHFTextInput from "../../../rhf-base/RHFTextInput";
import Button from "@good-dog/components/base/Button";
import PasswordRequirements from "../components/password-requirements";
import Modal from "../../../base/Modal";

type FormValues = z.input<typeof zResetPasswordValues>;

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetId = searchParams.get("reset_id");
  const resetPasswordForm = useForm<FormValues>({
    resolver: zodResolver(zResetPasswordValues),
  });

  const resetPasswordMutation = trpc.confirmPasswordReset.useMutation({
    onSuccess: () => {
      setTimeout(() => {
        router.push("/login");
      }, 3000); // Redirect after 3 seconds
    },
  });

  const onSubmit = resetPasswordForm.handleSubmit((values) => {
    // If no resetId, UI to submit forms will not show.
    if (resetId) {
      resetPasswordMutation.mutate({
        passwordResetId: resetId,
        newPassword: values.password,
      });
    }
  });

  if (!resetId) {
    return (
      <p className="text-red-500">
        Invalid password reset link. Please request a new one.
      </p>
    );
  }

  return (
    <FormProvider {...resetPasswordForm}>
      {resetPasswordMutation.isSuccess ? (
        <div className="relative mb-4 rounded border border-green-400 bg-green-100 px-4 py-3 text-green-700">
          <span className="block sm:inline">
            {resetPasswordMutation.data.message}
          </span>
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
            {resetPasswordForm.formState.errors.password?.message ? null : (
              <PasswordRequirements />
            )}
          </div>

          <RHFTextInput<FormValues>
            rhfName="confirmPassword"
            label="Confirm Password"
            placeholder="Re-enter password"
            id="confirmPassword"
            errorText={
              resetPasswordForm.formState.isSubmitted &&
              resetPasswordForm.formState.errors.confirmPassword?.message
                ? resetPasswordForm.formState.errors.confirmPassword.message
                : undefined
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
      <Modal
        open={
          !!resetPasswordMutation.data?.message &&
          resetPasswordMutation.isSuccess
        }
        upperPadding={false}
        onClose={() => resetPasswordMutation.reset()}
        headerText={"Reset Successful"}
        height={212}
        width={440}
        children={
          <div className="flex flex-col gap-[16px] pt-[16px] items-center">
            <p>You can now sign in with your new password</p>
            <Button
              size={"medium"}
              variant={"contained"}
              label={"Log In Now"}
              shadow={true}
              onClick={() => router.replace("/login")}
            ></Button>
          </div>
        }
      ></Modal>
    </FormProvider>
  );
}
