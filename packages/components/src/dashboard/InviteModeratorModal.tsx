"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { trpc } from "@good-dog/trpc/client";
import { Button } from "@good-dog/ui/button";
import { Input } from "@good-dog/ui/input";

const schema = z.object({
  moderatorEmail: z.string().email(),
});

type FormFields = z.infer<typeof schema>;

enum InviteSentStatus {
  Sent,
  NotSent,
  Nothing,
}

export default function InviteModeratorModal(
  props: Readonly<{
    handleFinished: () => void;
    xPos: number;
    yPos: number;
  }>,
) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });
  const moderatorEmail = watch("moderatorEmail");
  const [inviteSentStatus, setInviteSentStatus] = useState<InviteSentStatus>(
    InviteSentStatus.Nothing,
  );

  const sendModeratorInviteMutation = trpc.sendModeratorInviteEmail.useMutation(
    {
      onSuccess: async () => {
        setInviteSentStatus(InviteSentStatus.Sent);
        setValue("moderatorEmail", "");
        reset();
        await refetch();
      },
      onError: () => {
        setInviteSentStatus(InviteSentStatus.NotSent);
        setValue("moderatorEmail", "");
        reset();
      },
    },
  );

  const { data: pnrsAndAdmins, refetch } = trpc.getPNRAndAdmins.useQuery();

  useEffect(() => {
    if (moderatorEmail) {
      setInviteSentStatus(InviteSentStatus.Nothing);
    }
  }, [moderatorEmail]);

  return (
    <div className="absolute inset-0 flex h-[calc(100vh+160px)] min-h-[960px] w-full justify-end bg-[#A3A3A382] pr-[150px] pt-[340px]">
      <div className="h-[500px] w-[480px] rounded-xl bg-white pl-[21px] pt-[22px]">
        <div className="font-afacad text-2xl font-medium text-black underline underline-offset-4">
          Invite P&R Rep
        </div>
        <div className="font-afacad pt-[21px] text-xl font-normal text-black">
          Invite your team to collaborate.
        </div>
        <form
          onSubmit={handleSubmit((data) => {
            sendModeratorInviteMutation.mutate(data);
          })}
          className="flex space-x-8 pt-[16px]"
        >
          <Input
            {...register("moderatorEmail")}
            className="h-[40px] w-[300px] rounded-xl border border-black pl-[8px] placeholder-[#A3A3A3] placeholder:text-lg placeholder:font-normal"
            placeholder="Add an email"
          ></Input>
          <Button
            className="h-[40px] w-[100px] rounded-xl bg-[#D9D9D9] text-lg font-normal text-black hover:bg-[#b5b5b5]"
            type="submit"
          >
            Send Invite
          </Button>
        </form>
        <div className="pl-[8px] pt-[4px]">
          {errors.moderatorEmail?.message}
        </div>
        {inviteSentStatus === InviteSentStatus.Sent && (
          <div className="pl-[8px] pt-[4px] text-green-600">Invite sent.</div>
        )}
        {inviteSentStatus === InviteSentStatus.NotSent && (
          <div className="pl-[8px] pt-[4px] text-red-600">
            Invite failed to send.
          </div>
        )}
        <div className="font-afacad pt-[20px] text-xl font-normal text-black">
          People in this dashboard
        </div>
        <div className="h-[180px] overflow-auto">
          {pnrsAndAdmins?.map((person) => {
            return (
              <div key={person.email} className="flex pt-[10px]">
                <div className="font-afacad w-1/2 text-left text-lg font-normal text-black">
                  {person.email}
                </div>
                <div className="font-afacad w-1/2 pr-[20px] text-right text-lg font-medium text-black">
                  {person.status === "PENDING"
                    ? "P&R Invite Pending"
                    : person.role === "MODERATOR"
                      ? "P&R Rep"
                      : "Admin"}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-end pr-[26px] pt-[30px]">
          <Button
            onClick={props.handleFinished}
            className="h-[40px] w-[100px] rounded-xl bg-[#D9D9D9] text-lg font-normal text-black hover:bg-[#b5b5b5]"
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
