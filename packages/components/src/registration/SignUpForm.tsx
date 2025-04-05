"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { trpc } from "@good-dog/trpc/client";
import { Button } from "@good-dog/ui/button";

import GenericRegistrationForm from "./GenericRegistrationForm";
import RegistrationInput from "./inputs/RegistrationInput";
import TOSModal from "./TOSModal";

const zSignUpValues = z.object({
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
  const signUpForm = useForm<FormValues>({
    resolver: zodResolver(
      zSignUpValues.refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
      }),
    ),
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [isTOSModalOpen, setIsTOSModalOpen] = useState(false);

  const signUpMutation = trpc.signUp.useMutation({
    onSuccess: () => {
      window.location.href = "/onboarding";
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

  const [acceptedTOS, setAcceptedTOS] = useState(false);

  return (
    <FormProvider {...signUpForm}>
      {isTOSModalOpen && (
        <TOSModal
          close={() => {
            setIsTOSModalOpen(false);
          }}
          accept={() => {
            setIsTOSModalOpen(false);
            setAcceptedTOS(true);
          }}
        />
      )}
      <GenericRegistrationForm
        title="Sign Up"
        variant="dark"
        ctaTitle="Sign Up"
        onSubmit={onSubmitSignUp}
        disabled={!acceptedTOS}
        secondaryAction="Already have an account?"
        secondaryActionLink="Sign In"
        secondaryActionUrl="/login"
        error={
          <div>
            {signUpMutation.isError && (
              <p className="text-good-dog-error">
                Failed to sign up: {signUpMutation.error.message}
              </p>
            )}
          </div>
        }
      >
        <TypedRegistrationInput
          fieldName="email"
          type="email"
          label="Email"
          autocomplete="username"
        />
        <TypedRegistrationInput
          fieldName="phoneNumber"
          type="text"
          label="Phone Number"
          autocomplete="tel"
        />
        <div className="flex items-center">
          <TypedRegistrationInput
            fieldName="password"
            type={isPasswordVisible ? "text" : "password"}
            label="Password"
            autocomplete="new-password"
            className="flex-1"
          />
          <Button
            className="ml-2 rounded-full"
            onClick={(e) => {
              e.preventDefault();
              setIsPasswordVisible((prev) => !prev);
            }}
          >
            {isPasswordVisible ? "Hide" : "Show"}
          </Button>
        </div>
        <div className="flex items-center">
          <TypedRegistrationInput
            fieldName="confirmPassword"
            type={isConfirmPasswordVisible ? "text" : "password"}
            label="Confirm Password"
            autocomplete="new-password"
            className="flex-1"
          />
          <Button
            className="ml-2 rounded-full"
            onClick={(e) => {
              e.preventDefault();
              setIsConfirmPasswordVisible((prev) => !prev);
            }}
          >
            {isConfirmPasswordVisible ? "Hide" : "Show"}
          </Button>
        </div>
        <div className="flex flex-row space-x-2">
          <TypedRegistrationInput
            fieldName="firstName"
            type="text"
            label="First Name"
            autocomplete="given-name"
            className="flex-1"
          />
          <TypedRegistrationInput
            fieldName="lastName"
            type="text"
            label="Last Name"
            autocomplete="family-name"
            className="flex-1"
          />
        </div>
        <Button
          className="mt-4 h-6 w-full rounded-full"
          onClick={(e) => {
            // prevent actual <form/> submission
            e.preventDefault();
            // Open TOS modal
            setIsTOSModalOpen(true);
          }}
        >
          {!acceptedTOS
            ? "Please read and accept the Terms of Service"
            : "Terms of Service Accepted"}
        </Button>
      </GenericRegistrationForm>
    </FormProvider>
  );
}
