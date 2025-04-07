"use client";

import type { ReactNode } from "react";
import type { FieldValues } from "react-hook-form";
import type { z } from "zod";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import type { ReferralSource } from "@good-dog/db";
import { trpc } from "@good-dog/trpc/client";
import { Button } from "@good-dog/ui/button";

import EmailVerifyModal from "../EmailVerifyModal";

interface BaseValues {
  role: "MEDIA_MAKER" | "MUSICIAN";
  firstName: string;
  lastName: string;
  referral?: {
    source: ReferralSource;
    customSource?: string;
  };
}

export default function OnboardingFormProvider<
  Values extends FieldValues & BaseValues,
  T extends z.ZodObject<
    Record<keyof Values, z.ZodTypeAny>,
    z.UnknownKeysParam,
    z.ZodTypeAny,
    Values
  >,
>(
  props: Readonly<{
    children: ReactNode;
    schema: T;
    firstName: string;
    lastName: string;
    role: "MEDIA_MAKER" | "MUSICIAN";
    email: string;
  }>,
) {
  const onboardingForm = useForm<BaseValues>({
    resolver: zodResolver(props.schema),
    defaultValues: {
      role: props.role,
      firstName: props.firstName,
      lastName: props.lastName,
    },
  });

  const [isEmailVerificationModalOpen, setIsEmailVerificationModalOpen] =
    useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const sendVerificationEmailMutation = trpc.sendEmailVerification.useMutation({
    onSuccess: (data) => {
      switch (data.status) {
        case "EMAIL_SENT":
          setIsEmailVerificationModalOpen(true);
          // TODO
          // alert somehow that a verification email was sent
          break;
        case "ALREADY_VERIFIED":
          setIsEmailVerified(true);
          // TODO
          // alert somehow that the email has already been verified
          break;
      }
    },
    onError: (err) => {
      // TODO
      // Alert toast to the user that there was an error sending the verification email
      console.error(err);
    },
  });

  const onboardingMutation = trpc.onboarding.useMutation({
    onSuccess: () => {
      window.location.href = "/";
      // TODO
      // Show a toast or something to the user that they have successfully onboarded
    },
    onError: (err) => {
      Object.entries(err.data?.zodError?.fieldErrors ?? {}).forEach(
        ([key, fieldError]) => {
          if (fieldError && key in props.schema.shape) {
            // Technically, the wrong type here, but the type check on the line
            // will handle it at runtime
            onboardingForm.setError(key as keyof BaseValues, {
              message: fieldError.join(", "),
            });
          }
        },
      );
      // TODO
      // Alert toast to the user that there was an error onboarding
      console.error(err);
    },
  });

  // Submitting the form will finish the onboarding process
  const onSubmit = onboardingForm.handleSubmit((values) => {
    onboardingMutation.mutate(values);
  });

  return (
    <FormProvider {...onboardingForm}>
      <form onSubmit={onSubmit} className="flex flex-col justify-between">
        <div className="my-4">
          {!sendVerificationEmailMutation.isSuccess ? (
            <Button
              className="h-8 w-full rounded-full"
              disabled={sendVerificationEmailMutation.isPending}
              onClick={(e) => {
                // prevent actual <form/> submission
                e.preventDefault();

                sendVerificationEmailMutation.mutate();
              }}
            >
              Verify Email
            </Button>
          ) : (
            "Email verified"
          )}
          {sendVerificationEmailMutation.isError && (
            <p className="text-good-dog-error">
              Failed to send verification email:{" "}
              {sendVerificationEmailMutation.error.message}
            </p>
          )}
        </div>
        <div className="mb-2">{props.children}</div>

        {!isEmailVerified && (
          <p className="mb-2 text-center text-good-dog-error">
            You must verify your email before signing up.
          </p>
        )}
        <Button
          className="bottom-16 h-16 w-full rounded-full font-righteous text-2xl text-white"
          type="submit"
          disabled={
            onboardingMutation.isPending ||
            !sendVerificationEmailMutation.isSuccess ||
            !isEmailVerified
          }
        >
          SIGN UP
        </Button>
      </form>

      {isEmailVerificationModalOpen && (
        <EmailVerifyModal
          email={props.email}
          close={(didVerify) => {
            setIsEmailVerified(didVerify);
            setIsEmailVerificationModalOpen(false);
          }}
        />
      )}
    </FormProvider>
  );
}
