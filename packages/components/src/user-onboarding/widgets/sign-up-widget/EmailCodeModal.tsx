"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@good-dog/ui/dialog";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@good-dog/ui/input-otp";

interface EmailCodeModalProps {
  isOpen: boolean;
  close: () => void;
  email: string;
  verifyCode: (code: string) => void;
}

export default function EmailCodeModal({
  isOpen,
  close,
  email,
  verifyCode,
}: EmailCodeModalProps) {
  const [emailCode, setEmailCode] = useState<string>("");

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          close();
        }
      }}
    >
      <DialogOverlay className="!bg-transparent" />
      <DialogContent className="w-full !rounded-[16px] border border-solid border-black bg-white">
        <DialogHeader className="pt-[24px] !text-center">
          <DialogTitle className="!text-h3 font-medium">
            Verify your email address
          </DialogTitle>
          <DialogDescription className="flex flex-col items-center gap-[16px]">
            <p className="!text-body2">{`We sent a link to ${email}`}</p>
            <InputOTP
              maxLength={6}
              value={emailCode}
              onChange={(newCode) => {
                setEmailCode(newCode);
                if (newCode.length == 6) {
                  verifyCode(newCode);
                }
              }}
            >
              <InputOTPGroup className="flex flex-row gap-[16px]">
                <InputOTPSlot
                  index={0}
                  className="h-[64px] w-[48px] rounded-[4px] border border-solid border-[#858585] text-h1"
                />
                <InputOTPSlot
                  index={1}
                  className="h-[64px] w-[48px] rounded-[4px] border border-solid border-[#858585] text-h1"
                />
                <InputOTPSlot
                  index={2}
                  className="h-[64px] w-[48px] rounded-[4px] border border-solid border-[#858585] text-h1"
                />
                <InputOTPSlot
                  index={3}
                  className="h-[64px] w-[48px] rounded-[4px] border border-solid border-[#858585] text-h1"
                />
                <InputOTPSlot
                  index={4}
                  className="h-[64px] w-[48px] rounded-[4px] border border-solid border-[#858585] text-h1"
                />
                <InputOTPSlot
                  index={5}
                  className="h-[64px] w-[48px] rounded-[4px] border border-solid border-[#858585] text-h1"
                />
              </InputOTPGroup>
            </InputOTP>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
