"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { trpc } from "@good-dog/trpc/client";

const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phoneNumber: z
    .string()
    .regex(
      /[-.\s]?(\(?\d{3}\)?)[-.\s]?\d{3}[-.\s]?\d{4}$/,
      "Phone number must be a valid US format such as 1234567890, 123-456-7890, or (123) 456-7890.",
    ),
  password: z.string().min(1, "Password is required"),
});

type FormFields = z.infer<typeof schema>;

export default function ModeratorOnboarding() {
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
      await Promise.all([
        trpcUtils.user.reset(),
        trpcUtils.authenticatedUser.reset(),
      ]);

      // TODO, alert the user they have successfully created an account
      router.push("/");
    },
    onError: (err) => {
      // TODO, alert the user there was an error creating their account
      console.error(err);
    },
  });

  return (
    <div className="flex">
      <div className="w-1/2 pl-20 pr-40 pt-28">
        <h2 className="font-afacad text-5xl font-medium font-normal text-black">
          Create your account
        </h2>
        <h3 className="font-afacad text-2xl font-medium font-normal text-black">
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
          <div className="flex flex-col pb-6">
            <div className="pb-2">
              <label
                className="font-afacad text-2xl font-medium font-normal text-black"
                htmlFor="first-name"
              >
                First Name
              </label>
              <label className="font-afacad text-2xl font-normal font-semibold text-[#F4392D]">
                {" *"}
              </label>
            </div>
            <input
              className="h-[40px] bg-[#D9D9D9] pl-[8px] placeholder-[#5F5F5F] placeholder:text-base placeholder:font-medium"
              id="first-name"
              {...register("firstName")}
              placeholder="Enter your first name"
            ></input>
            <p className="font-afacad text-sm font-medium text-[#75747A]">
              {errors.firstName?.message}
            </p>
          </div>
          <div className="flex flex-col pb-6">
            <div className="pb-2">
              <label
                className="font-afacad text-2xl font-medium font-normal text-black"
                htmlFor="last-name"
              >
                Last Name
              </label>
              <label className="font-afacad text-2xl font-normal font-semibold text-[#F4392D]">
                {" *"}
              </label>
            </div>
            <input
              className="h-[40px] bg-[#D9D9D9] pl-[8px] placeholder-[#5F5F5F] placeholder:text-base placeholder:font-medium"
              id="last-name"
              {...register("lastName")}
              placeholder="Enter your last name"
            ></input>
            <p className="font-afacad text-sm font-medium text-[#75747A]">
              {errors.lastName?.message}
            </p>
          </div>
          <div className="flex flex-col pb-6">
            <div className="pb-2">
              <label
                className="font-afacad text-2xl font-medium font-normal text-black"
                htmlFor="phone-number"
              >
                Phone Number
              </label>
              <label className="font-afacad text-2xl font-normal font-semibold text-[#F4392D]">
                {" *"}
              </label>
            </div>
            <input
              className="h-[40px] bg-[#D9D9D9] pl-[8px] placeholder-[#5F5F5F] placeholder:text-base placeholder:font-medium"
              id="phone-number"
              {...register("phoneNumber")}
              placeholder="Enter your phone number"
            ></input>
            <p className="font-afacad text-sm font-medium text-[#75747A]">
              {errors.phoneNumber?.message}
            </p>
          </div>
          <div className="flex flex-col pb-6">
            <div className="pb-2">
              <label
                className="font-afacad text-2xl font-medium font-normal text-black"
                htmlFor="password"
              >
                Password
              </label>
              <label className="font-afacad text-2xl font-normal font-semibold text-[#F4392D]">
                {" *"}
              </label>
            </div>
            <input
              className="h-[40px] bg-[#D9D9D9] pl-[8px] placeholder-[#5F5F5F] placeholder:text-base placeholder:font-medium"
              id="password"
              {...register("password")}
              placeholder="Enter your password"
            ></input>
            <p className="font-afacad text-sm font-medium text-[#75747A]">
              {errors.password?.message}
            </p>
          </div>
          <div className="flex items-center justify-center pt-4">
            <button
              className="font-afacad h-[59px] w-3/4 rounded-2xl bg-black text-2xl font-medium text-white"
              type="submit"
            >
              Create Account
            </button>
          </div>
        </form>
      </div>
      <div className="w-1/2 bg-red-100">Test</div>
    </div>
  );
}
