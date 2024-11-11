"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { trpc } from "@good-dog/trpc/client";
import { Button } from "@good-dog/ui/button";

import RegistrationInput from "./inputs/RegistrationInput";

const zSignInValues = z.object({
  email: z.string().email(),
  password: z.string(),
});

type FormValues = z.infer<typeof zSignInValues>;

const TypedRegistrationInput = RegistrationInput<FormValues>;

export default function SignInForm() {
  const router = useRouter();
  const signInForm = useForm<FormValues>({
    resolver: zodResolver(zSignInValues),
  });

  const signInMutation = trpc.signIn.useMutation({
    onSuccess: () => {
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
      <form onSubmit={onSubmit} className="text-white">
        <TypedRegistrationInput
          fieldName="email"
          type="email"
          placeholder="Email"
        />
        <TypedRegistrationInput
          fieldName="password"
          type="password"
          placeholder="Password"
        />
        <Button
          type="submit"
          className="text-green-500"
          disabled={signInMutation.isPending}
        >
          Sign In
        </Button>
      </form>
      <div>
        {signInMutation.isError && (
          <p className="text-red-500">
            Error signing in: {signInMutation.error.message}
          </p>
        )}
      </div>
    </FormProvider>
  );
}
