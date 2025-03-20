"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { trpc } from "@good-dog/trpc/client";

const schema = z.object({
  moderatorEmail: z.string().email(),
});

type FormFields = z.infer<typeof schema>;

export default function InviteModerator() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });

  const sendModeratorInviteMutation = trpc.sendModeratorInviteEmail.useMutation(
    {
      onSuccess: () => {
        console.log("Invite sent.");
      },
      onError: () => {
        console.log("Invite Failed to Send.");
      },
    },
  );

  return (
    <form
      onSubmit={handleSubmit((data) => {
        sendModeratorInviteMutation.mutate(data);
      })}
    >
      <input
        {...register("moderatorEmail")}
        placeholder="Moderator Email"
      ></input>
      <p>{errors.moderatorEmail?.message}</p>
      <button type="submit">Invite</button>
    </form>
  );
}
