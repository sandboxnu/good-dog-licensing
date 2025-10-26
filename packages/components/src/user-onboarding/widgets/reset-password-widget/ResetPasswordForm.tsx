"use client";

import type { z } from "zod";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { trpc } from "@good-dog/trpc/client";
import { zResetPasswordValues } from "@good-dog/trpc/schema";
import RegistrationInput from "../../../oldStuff/registration/inputs/RegistrationInput";
import RHFTextInput from "../../../rhf-base/RHFTextInput";
import Button from "../../../base/Button";

type FormValues = z.input<typeof zResetPasswordValues>;

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [resetId, setResetId] = useState<string | null>(null);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLinkValid, setIsLinkValid] = useState(true);

  const resetPasswordForm = useForm<FormValues>({
    resolver: zodResolver(zResetPasswordValues),
  });

  // TODO: Don't set state in useEffect??
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
      {/* {responseMessage && isSuccess ? (
            <div className="relative mb-4 rounded border border-green-400 bg-green-100 px-4 py-3 text-green-700">
              <span className="block sm:inline">{responseMessage}</span>
              <span className="ml-1 block sm:inline">
                Redirecting to login page...
              </span>
            </div>
          ) : null} */}
      <div className="flex flex-col w-full pr-[40px]">
        <div className="flex flex-col gap-[12px]">
        <div className="gap-[8px]">
          <RHFTextInput<FormValues>
            rhfName="password"
            label="Password"
            placeholder="Your password"
            id="password"
            //errorText={errors.password?.message}
            type="password"
          />
          <div className="flex flex-wrap justify-start gap-x-10">
            <BulletPoint content="8 characters minimum" />
            <BulletPoint content="1+ special character" />
            <BulletPoint content="1+ uppercase character" />
          </div>
        </div>

        <RHFTextInput<FormValues>
          rhfName="confirmPassword"
          label="Confirm Password"
          placeholder="Re-enter password"
          id="confirmPassword"
          //errorText={errors.confirmPassword?.message}
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

function BulletPoint({ content }: { content: string }) {
  return (
    <div className="flex flex-row gap-[4px] items-center">
      <div className="w-[6px] h-[6px] rounded-full bg-good-dog-main"></div>
      <p>{content}</p>
    </div>
  );
}
