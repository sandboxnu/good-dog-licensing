"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { trpc } from "@good-dog/trpc/client";
import { Button } from "@good-dog/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@good-dog/ui/dialog";
import { Input } from "@good-dog/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@good-dog/ui/input-otp";
import { Label } from "@good-dog/ui/label";

const zConfirmEmail = z.object({
  code: z
    .string()
    .length(6)
    .regex(/[0-9]{6}/, "Code must be 6 digits"),
});

export default function EmailVerifyModal({
  email = "",
  isOpen = true,
}: {
  email: string;
  isOpen?: boolean;
}) {
  const confirmEmailForm = useForm<z.infer<typeof zConfirmEmail>>({
    resolver: zodResolver(zConfirmEmail),
  });

  const confirmEmailMutation = trpc.confirmEmail.useMutation({
    onSuccess: (data) => {
      switch (data.status) {
        case "SUCCESS":
          // TODO
          // When the email is confirmed, show an toast or something
          break;
        case "RESENT":
          // TODO
          // When the email is resent, update the UI to show that the email was resent
          break;
      }
    },
    onError: (err) => {
      if (err.data?.code === "UNAUTHORIZED") {
        confirmEmailForm.setError("code", {
          message: "Invalid code",
        });
      } else {
        // TODO
        // Alert toast to the user that there was an error confirming the email
        console.error(err);
      }
    },
  });

  const onSubmit = confirmEmailForm.handleSubmit((values) => {
    confirmEmailMutation.mutate({
      ...values,
      email,
    });
  });

  return (
    <Dialog open={isOpen && confirmEmailMutation.data?.status !== "SUCCESS"}>
      <DialogContent className="border-black sm:max-w-[512px]">
        <DialogHeader>
          <DialogDescription className="font-afacad p-7 text-center text-2xl font-normal text-good-dog-violet">
            A 6-digit code has been sent to your email. Please enter the code
            below.
          </DialogDescription>
          <a
            href="/resend-email"
            className="text-center text-2xl text-good-dog-violet underline"
          >
            Resend code
          </a>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="flex items-center justify-center py-4">
            <InputOTP
              //{...confirmEmailForm.register("code")}

              maxLength={6}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={confirmEmailMutation.isPending}
            >
              {confirmEmailMutation.isPending ? "Verifying..." : "Verify"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
