"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useFormContext } from "react-hook-form";
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
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@good-dog/ui/input-otp";

const zConfirmEmail = z.object({
  code: z
    .string()
    .length(6)
    .regex(/[0-9]{6}/, "Code must be 6 digits"),
});

export default function EmailVerifyModal({
  email = "",
  isOpen = true,
  close,
}: {
  email: string;
  isOpen?: boolean;
  close: () => void;
}) {
  const confirmEmailForm = useForm<z.infer<typeof zConfirmEmail>>({
    resolver: zodResolver(zConfirmEmail),
    defaultValues: {
      code: "",
    },
  });
  const signUpFormContext = useFormContext<{
    emailConfirmed: string;
  }>();

  const confirmEmailMutation = trpc.confirmEmail.useMutation({
    onSuccess: (data) => {
      switch (data.status) {
        case "SUCCESS":
          signUpFormContext.setValue("emailConfirmed", data.email);
          close();
          // TODO
          // When the email is confirmed, show a toast or something
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

  const resendVerificationEmailMutation =
    trpc.sendEmailVerification.useMutation({
      onSuccess: (data) => {
        switch (data.status) {
          case "EMAIL_SENT":
            // TODO
            // alert somehow that a verification email was sent
            break;
          case "ALREADY_VERIFIED":
            signUpFormContext.setValue("emailConfirmed", data.email);
            close();
            // TODO
            // alert somehow that the email has already been verified
            break;
        }
      },
      onError: (err) => {
        // TODO
        // Alert toast to the user that there was an error sending the verification email
        console.error(err);
      },
    });

  const onSubmit = confirmEmailForm.handleSubmit((values) => {
    confirmEmailMutation.mutate({
      ...values,
      email,
    });
  });

  const enteredCode = confirmEmailForm.watch("code");

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          close();
        }
      }}
    >
      <DialogContent className="border-black sm:max-w-[512px]">
        <DialogHeader>
          <DialogTitle>Verify Email</DialogTitle>
          <DialogDescription className="font-afacad p-7 text-center text-2xl font-normal text-good-dog-violet">
            A 6-digit code has been sent to your email. Please enter the code
            below.
          </DialogDescription>
          <Button
            disabled={
              resendVerificationEmailMutation.isPending ||
              resendVerificationEmailMutation.isSuccess
            }
            onClick={(e) => {
              e.preventDefault();
              resendVerificationEmailMutation.mutate({ email });
            }}
          >
            Resend Email
          </Button>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          {confirmEmailMutation.isError && (
            <p className="text-good-dog-error">
              Invalid code: {confirmEmailMutation.error.message}
            </p>
          )}
          <div className="flex items-center justify-center py-4">
            <Controller
              name="code"
              control={confirmEmailForm.control}
              render={({ field }) => (
                <InputOTP onChange={field.onChange} maxLength={6}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              )}
            />
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={
                confirmEmailMutation.isPending || enteredCode.length !== 6
              }
            >
              {confirmEmailMutation.isPending ? "Verifying..." : "Verify"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
