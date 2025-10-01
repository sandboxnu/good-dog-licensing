"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

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

interface EmailVerificationModalProps {
  isOpen: boolean;
  close: () => void;
  submit: (emailCode: string) => void;
  email: string;
  isLoading: boolean;
  isWrongCode: boolean;
}

const zConfirmEmail = z.object({
  code: z
    .string()
    .length(6)
    .regex(/[0-9]{6}/, "Code must be 6 digits"),
});

export default function EmailVerificationModal({
  isOpen,
  close,
  submit,
  email,
  isLoading,
  isWrongCode,
}: EmailVerificationModalProps) {
  const confirmEmailForm = useForm<z.input<typeof zConfirmEmail>>({
    resolver: zodResolver(zConfirmEmail),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = confirmEmailForm.handleSubmit(({ code }) => {
    submit(code);
  });

  const resendEmailVerificationMutation =
    trpc.sendEmailVerification.useMutation({
      onSuccess: () => {
        // TODO --> Alert it was resent
      },
      onError: (err) => {
        // TODO --> Alert there was an issue
        console.error(err);
      },
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
            A 6-digit code has been sent to {email}. Please enter the code
            below.
          </DialogDescription>
          <Button
            disabled={
              resendEmailVerificationMutation.isPending ||
              resendEmailVerificationMutation.isSuccess
            }
            onClick={(e) => {
              e.preventDefault();
              resendEmailVerificationMutation.mutate({ email });
            }}
          >
            Resend Email
          </Button>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          {isWrongCode && <p className="text-good-dog-error">Invalid code</p>}
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
              disabled={isLoading || enteredCode.length !== 6}
            >
              {isLoading ? "Verifying..." : "Verify"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
