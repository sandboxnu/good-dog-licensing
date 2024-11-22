"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { trpc } from "@good-dog/trpc/client";
import { Button } from "@good-dog/ui/button";
import { Checkbox } from "@good-dog/ui/checkbox";

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
      <form
        onSubmit={onSubmit}
        data-testid="sign-in-form"
        className="font-afacad mx-20"
      >
        <div>
          <h3 className="text-white">Email</h3>
          <TypedRegistrationInput fieldName="email" type="email" />
        </div>
        <div>
          <h3 className="text-white">Password</h3>
          <TypedRegistrationInput fieldName="password" type="password" />
        </div>
        <div className="flex flex-row justify-between">
          <div className="flex flex-row items-center space-x-1">
            <Checkbox className="border-good-dog-celadon" />
            <p className="text-good-dog-celadon">Remember me</p>
          </div>

          <a href="/forgot-password" className="text-white hover:underline">
            Forgot password?
          </a>
        </div>
        <Button
          type="submit"
          className="h-16 w-full rounded-full bg-good-dog-celadon font-righteous text-2xl text-good-dog-violet"
          disabled={signInMutation.isPending}
        >
          CONTINUE
        </Button>
        <div className="flex flex-row justify-center space-x-1 text-2xl">
          <h3 className="text-white">Don't have an account?</h3>
          <a href="/signup" className="text-good-dog-celadon hover:underline">
            Sign up
          </a>
        </div>
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
