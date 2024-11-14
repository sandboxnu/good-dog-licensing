"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { trpc } from "@good-dog/trpc/client";
import { Button } from "@good-dog/ui/button";

import EmailVerifyModal from "./EmailVerifyModal";
import RegistrationInput from "./inputs/RegistrationInput";

const zSignUpValues = z.object({
  email: z.string().email(),
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

  const verifyEmailMutation = trpc.sendEmailVerification.useMutation({
    onSuccess: (data) => {
      switch (data.status) {
        case "EMAIL_SENT":
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

  return (
    <FormProvider {...signUpForm}>
      <div>
        <EmailVerifyModal
          isOpen={verifyEmailMutation.data?.status === "EMAIL_SENT"}
          email={email}
        />
        <form onSubmit={onSubmitSignUp}>
          <TypedRegistrationInput
            fieldName="email"
            type="email"
            placeholder="Email"
          />
          {verifyEmailMutation.isSuccess && (
            <p className="text-green-500">Email verified</p>
          )}
          <TypedRegistrationInput
            fieldName="password"
            type="password"
            placeholder="Password"
          />
          <TypedRegistrationInput
            fieldName="confirmPassword"
            type="password"
            placeholder="Confirm Password"
          />
          <TypedRegistrationInput
            fieldName="firstName"
            placeholder="First Name"
            type="text"
          />
          <TypedRegistrationInput
            fieldName="lastName"
            placeholder="Last Name"
            type="text"
          />
          <Button
            className="text-green-500"
            disabled={
              verifyEmailMutation.isPending || verifyEmailMutation.isSuccess
            }
            onClick={(e) => {
              // prevent actual form submission
              e.preventDefault();
              // Send the email verification email
              verifyEmailMutation.mutate({
                email,
              });
            }}
          >
            Verify Email
          </Button>
          <Button
            type="submit"
            className="text-green-500"
            disabled={
              !verifyEmailMutation.isSuccess || signUpMutation.isPending
            }
          >
            Sign Up
          </Button>
        </form>
      </div>
    </FormProvider>
  );
}
