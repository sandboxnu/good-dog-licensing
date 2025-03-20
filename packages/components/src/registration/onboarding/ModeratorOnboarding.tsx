"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { trpc } from "@good-dog/trpc/client";

const schema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z
    .string()
    .regex(
      /[-.\s]?(\(?\d{3}\)?)[-.\s]?\d{3}[-.\s]?\d{4}$/,
      "Phone number must be a valid US format such as 1234567890, 123-456-7890, or (123) 456-7890.",
    ),
  password: z.string(),
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
    <form
      onSubmit={handleSubmit((data) => {
        onboardModeratorMutation.mutate({
          moderatorInviteId: moderatorInviteId,
          ...data,
        });
      })}
    >
      <input {...register("firstName")} placeholder="First Name"></input>
      <p>{errors.firstName?.message}</p>
      <input {...register("lastName")} placeholder="Last Name"></input>
      <p>{errors.lastName?.message}</p>
      <input {...register("phoneNumber")} placeholder="Phone Number"></input>
      <p>{errors.phoneNumber?.message}</p>
      <input {...register("password")} placeholder="Password"></input>
      <p>{errors.password?.message}</p>
      <button type="submit">Create Account</button>
    </form>
  );
}
