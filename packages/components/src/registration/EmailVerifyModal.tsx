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
      <DialogContent className="sm:max-w-[425px]" hideCloseButton>
        <DialogHeader>
          <DialogTitle>Email Verification</DialogTitle>
          <DialogDescription>
            Enter the 6-digit code sent to your email address.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="verification-code" className="text-right">
                Code
              </Label>
              <Input
                {...confirmEmailForm.register("code")}
                type="text"
                placeholder="Enter 6-digit code"
                maxLength={6}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={confirmEmailMutation.isPending}>
              {confirmEmailMutation.isPending ? "Verifying..." : "Verify"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
