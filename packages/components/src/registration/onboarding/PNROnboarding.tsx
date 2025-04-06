"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { trpc } from "@good-dog/trpc/client";
import { zPasswordValidation } from "@good-dog/trpc/schema";
import { Button } from "@good-dog/ui/button";

import PNROnboardingInput from "./PNROnboardingInput";

const schema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    phoneNumber: z
      .string()
      .regex(
        /[-.\s]?(\(?\d{3}\)?)[-.\s]?\d{3}[-.\s]?\d{4}$/,
        "Phone number must be a valid US format such as 1234567890, 123-456-7890, or (123) 456-7890.",
      ),
    password: zPasswordValidation,
    confirmPassword: z.string(),
  })
  .refine(
    (data) => {
      return data.password === data.confirmPassword;
    },
    {
      message: "Passwords must match",
      path: ["confirmPassword"],
    },
  );

type FormFields = z.infer<typeof schema>;

export default function PNROnboarding() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const moderatorInviteId = searchParams.get("id") ?? "";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });

  const trpcUtils = trpc.useUtils();
  const onboardModeratorMutation = trpc.onboardModerator.useMutation({
    onSuccess: async () => {
      await trpcUtils.user.reset();

      router.push("/dashboard/projects");
    },
    onError: (err) => {
      console.error(err);
    },
  });

  return (
    <div className="flex">
      <div className="w-1/2 pl-20 pr-40 pt-28">
        <h2 className="font-afacad text-5xl font-medium text-black">
          Create your account
        </h2>
        <h3 className="font-afacad text-2xl font-medium text-black">
          Welcome! Please enter your details.
        </h3>
        <form
          className="pt-8"
          onSubmit={handleSubmit((data) => {
            onboardModeratorMutation.mutate({
              moderatorInviteId: moderatorInviteId,
              ...data,
            });
          })}
        >
          <PNROnboardingInput
            register={register}
            errorMessage={errors.firstName?.message}
            id="first-name"
            label="First Name"
            registerName="firstName"
          />
          <PNROnboardingInput
            register={register}
            errorMessage={errors.lastName?.message}
            id="last-name"
            label="Last Name"
            registerName="lastName"
          />
          <PNROnboardingInput
            register={register}
            errorMessage={errors.phoneNumber?.message}
            id="phone-number"
            label="Phone Number"
            registerName="phoneNumber"
          />
          <PNROnboardingInput
            register={register}
            errorMessage={errors.password?.message}
            id="password"
            label="Password"
            registerName="password"
          />
          <PNROnboardingInput
            register={register}
            errorMessage={errors.confirmPassword?.message}
            id="confirmPassword"
            label="Confirm Password"
            registerName="confirmPassword"
          />
          <div className="flex items-center justify-center pb-20 pt-8">
            <Button
              className="font-afacad h-[59px] w-3/4 rounded-2xl bg-black text-2xl font-medium text-white"
              type="submit"
            >
              Create Account
            </Button>
          </div>
        </form>
      </div>
      <div className="w-1/2 pr-[40px] pt-[40px]">
        <div className="h-[calc(100vh-88px)] min-h-[800px] rounded-2xl bg-black">
          <div className="px-4 pt-[69px] text-center">
            <h1 className="font-afacad text-6xl font-medium text-white">
              Welcome to Good Dog Licensing!
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}
