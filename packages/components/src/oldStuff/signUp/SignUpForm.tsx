"use client";

import type { z } from "zod";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { trpc } from "@good-dog/trpc/client";
import { zSignUpValues } from "@good-dog/trpc/schema";
import { Button } from "@good-dog/ui/button";

import GenericRegistrationForm from "../registration/GenericRegistrationForm";
import RegistrationInput from "../registration/inputs/RegistrationInput";
import EmailVerificationModal from "./EmailVerificationModal";

type FormValues = z.input<typeof zSignUpValues>;

const TypedRegistrationInput = RegistrationInput<FormValues>;

export default function SignUpForm() {
  const signUpForm = useForm<FormValues>({
    resolver: zodResolver(
      zSignUpValues.refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
      }),
    ),
    defaultValues: {
      emailCode: "",
    },
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [showEmailVerificationModal, setShowEmailVerificationModal] =
    useState(false);
  // const [acceptedTOS, setAcceptedTOS] = useState(false);

  const sendEmailVerificationMutation = trpc.sendEmailVerification.useMutation({
    onSuccess: () => {
      setShowEmailVerificationModal(true);
    },
    onError: (err) => {
      // TODO
      // Alert toast to the user that there was an error signing up
      console.error(err);
    },
  });

  const signUpMutation = trpc.signUp.useMutation({
    onSuccess: () => {
      window.location.href = "/";
    },
    onError: (err) => {
      // TODO
      // Alert toast to the user that there was an error signing up
      console.error(err);
    },
  });

  const sendEmailVerification = signUpForm.handleSubmit((values) => {
    sendEmailVerificationMutation.mutate({ email: values.email });
  });

  const signUp = (emailCode: string) => {
    const values = signUpForm.getValues();
    signUpMutation.mutate({ ...values, emailCode });
  };

  const enteredEmail = signUpForm.watch("email");

  return (
    <FormProvider {...signUpForm}>
      {showEmailVerificationModal && (
        <EmailVerificationModal
          isOpen={showEmailVerificationModal}
          close={() => setShowEmailVerificationModal(false)}
          submit={signUp}
          email={enteredEmail}
          isLoading={signUpMutation.isPending}
          isWrongCode={signUpMutation.isError}
        />
      )}
      <GenericRegistrationForm
        title="Sign Up"
        variant="light"
        ctaTitle="Sign Up"
        onSubmit={sendEmailVerification}
        disabled={false}
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
        <TypedRegistrationInput
          fieldName="referral"
          type="text"
          label="FRIEND or OTHER ..."
          className="flex-1"
        />
        <TypedRegistrationInput
          fieldName="role"
          type="text"
          label="MUSICIAN or MEDIA_MAKER"
          className="flex-1"
        />
      </GenericRegistrationForm>
    </FormProvider>
  );
}
