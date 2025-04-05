"use client";

import type { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { trpc } from "@good-dog/trpc/client";
import { zSignInValues } from "@good-dog/trpc/schema";
import { Checkbox } from "@good-dog/ui/checkbox";

import GenericRegistrationForm from "./GenericRegistrationForm";
import RegistrationInput from "./inputs/RegistrationInput";

type FormValues = z.infer<typeof zSignInValues>;

const TypedRegistrationInput = RegistrationInput<FormValues>;

export default function SignInForm() {
  const router = useRouter();
  const signInForm = useForm<FormValues>({
    resolver: zodResolver(zSignInValues),
  });

  const trpcUtils = trpc.useUtils();

  const signInMutation = trpc.signIn.useMutation({
    onSuccess: async () => {
      // Reset the user query
      await trpcUtils.user.reset();

      // TODO, alert the user that they have successfully signed in
      router.push("/");
    },
    onError: (err) => {
      // TODO
      // Alert toast to the user that there was an error signing up
      console.error(err);
    },
  });

  const onSubmit = signInForm.handleSubmit((values) => {
    signInMutation.mutate(values);
  });

  return (
    <FormProvider {...signInForm}>
      <GenericRegistrationForm
        title="Login"
        variant="light"
        error={
          signInMutation.isError && (
            <p className="text-good-dog-error">
              Error signing in: {signInMutation.error.message}
            </p>
          )
        }
        ctaTitle="Continue"
        onSubmit={onSubmit}
        disabled={signInMutation.isPending}
        secondaryAction="Don't have an account?"
        secondaryActionLink="Sign up"
        secondaryActionUrl="/signup"
      >
        <div className="flex flex-col gap-3">
          <TypedRegistrationInput
            fieldName="email"
            type="email"
            label="Email"
          />
          <TypedRegistrationInput
            fieldName="password"
            type="password"
            label="Password"
          />

          <div className="flex flex-row flex-wrap justify-between">
            <div className="flex flex-row items-center space-x-1">
              <Checkbox className="border-good-dog-celadon" />
              <p className="text-good-dog-celadon">Remember me</p>
            </div>

            <Link
              href="/forgot-password"
              className="text-white hover:underline"
            >
              Forgot password?
            </Link>
          </div>
        </div>
      </GenericRegistrationForm>
    </FormProvider>
  );
}
