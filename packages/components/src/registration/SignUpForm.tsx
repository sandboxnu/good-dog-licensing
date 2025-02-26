"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { trpc } from "@good-dog/trpc/client";
import { Button } from "@good-dog/ui/button";

import EmailVerifyModal from "./EmailVerifyModal";
import GenericRegistrationForm from "./GenericRegistrationForm";
import RegistrationInput from "./inputs/RegistrationInput";

const zSignUpValues = z.object({
  emailConfirmed: z.string(),
  email: z.string().email(),
  phoneNumber: z
    .string()
    .regex(
      /[-.\s]?(\(?\d{3}\)?)[-.\s]?\d{3}[-.\s]?\d{4}$/,
      "Phone number must be a valid US format such as 1234567890, 123-456-7890, or (123) 456-7890.",
    ),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^a-zA-Z0-9]/,
      "Password must contain at least one special character",
    ),
  confirmPassword: z.string(),
  firstName: z.string(),
  lastName: z.string(),
});

type FormValues = z.infer<typeof zSignUpValues>;

const TypedRegistrationInput = RegistrationInput<FormValues>;

export default function SignUpForm() {
  const router = useRouter();
  const signUpForm = useForm<FormValues>({
    resolver: zodResolver(
      zSignUpValues.refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
      }),
    ),
  });

  const [isEmailVerificationModalOpen, setIsEmailVerificationModalOpen] =
    useState(false);
  const sendVerificationEmailMutation = trpc.sendEmailVerification.useMutation({
    onSuccess: (data) => {
      switch (data.status) {
        case "EMAIL_SENT":
          setIsEmailVerificationModalOpen(true);
          // TODO
          // alert somehow that a verification email was sent
          break;
        case "ALREADY_VERIFIED":
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

  const signUpMutation = trpc.signUp.useMutation({
    onSuccess: () => {
      router.push("/onboarding");
    },
    onError: (err) => {
      // Set server error as an error on the form
      Object.entries(err.data?.zodError?.fieldErrors ?? {}).forEach(
        ([key, fieldError]) => {
          if (fieldError && key in zSignUpValues.shape) {
            signUpForm.setError(key as keyof typeof zSignUpValues.shape, {
              message: fieldError.join(", "),
            });
          }
        },
      );

      // TODO
      // Alert toast to the user that there was an error signing up
      console.error(err);
    },
  });
  // Submitting the form will finish the registration process
  const onSubmitSignUp = signUpForm.handleSubmit((values) => {
    signUpMutation.mutate(values);
  });

  const email = signUpForm.watch("email");
  const isEmailVerified =
    sendVerificationEmailMutation.isSuccess &&
    signUpForm.watch("emailConfirmed") === email;

  return (
    <FormProvider {...signUpForm}>
      {isEmailVerificationModalOpen && (
        <EmailVerifyModal
          email={email}
          close={() => {
            setIsEmailVerificationModalOpen(false);
          }}
        />
      )}
      <GenericRegistrationForm
        title="Sign Up"
        variant="dark"
        ctaTitle="Sign Up"
        onSubmit={onSubmitSignUp}
        disabled={!isEmailVerified}
        secondaryAction="Already have an account?"
        secondaryActionLink="Sign In"
        secondaryActionUrl="/login"
        error={
          <div>
            {sendVerificationEmailMutation.isError && (
              <p className="text-good-dog-error">
                Failed to send verification email:{" "}
                {sendVerificationEmailMutation.error.message}
              </p>
            )}
            {signUpMutation.isError && (
              <p className="text-good-dog-error">
                Failed to sign up: {signUpMutation.error.message}
              </p>
            )}
          </div>
        }
      >
        <TypedRegistrationInput fieldName="email" type="email" label="Email" />
        <Button
          className="h-4 w-full rounded-full"
          disabled={sendVerificationEmailMutation.isPending}
          onClick={(e) => {
            // prevent actual <form/> submission
            e.preventDefault();
            // Send the email verification email
            if (
              sendVerificationEmailMutation.isSuccess &&
              email === sendVerificationEmailMutation.data.email
            ) {
              setIsEmailVerificationModalOpen(true);
            } else {
              sendVerificationEmailMutation.mutate({
                email,
              });
            }
          }}
        >
          Verify Email
        </Button>
        {isEmailVerified && <p className="text-green-500">Email verified</p>}
        <TypedRegistrationInput
          fieldName="phoneNumber"
          type="text"
          label="Phone Number"
        />
        <TypedRegistrationInput
          fieldName="password"
          type="password"
          label="Password"
        />
        <TypedRegistrationInput
          fieldName="confirmPassword"
          type="password"
          label="Confirm Password"
        />
        <div className="flex flex-row space-x-2">
          <TypedRegistrationInput
            fieldName="firstName"
            type="text"
            label="First Name"
            classname="flex-1"
          />
          <TypedRegistrationInput
            fieldName="lastName"
            type="text"
            label="Last Name"
            classname="flex-1"
          />
        </div>
      </GenericRegistrationForm>
    </FormProvider>
  );
}
