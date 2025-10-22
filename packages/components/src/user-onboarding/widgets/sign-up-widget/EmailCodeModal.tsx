"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@good-dog/ui/dialog";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@good-dog/ui/input-otp";
import { useState } from "react";

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
      <DialogContent className="w-full bg-white !rounded-[16px] border border-solid border-black">
        <DialogHeader className="!text-center pt-[24px]">
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
                  className="text-h1 h-[64px] w-[48px] border border-solid border-[#858585] rounded-[4px]"
                />
                <InputOTPSlot
                  index={1}
                  className="text-h1 h-[64px] w-[48px] border border-solid border-[#858585] rounded-[4px]"
                />
                <InputOTPSlot
                  index={2}
                  className="text-h1 h-[64px] w-[48px] border border-solid border-[#858585] rounded-[4px]"
                />
                <InputOTPSlot
                  index={3}
                  className="text-h1 h-[64px] w-[48px] border border-solid border-[#858585] rounded-[4px]"
                />
                <InputOTPSlot
                  index={4}
                  className="text-h1 h-[64px] w-[48px] border border-solid border-[#858585] rounded-[4px]"
                />
                <InputOTPSlot
                  index={5}
                  className="text-h1 h-[64px] w-[48px] border border-solid border-[#858585] rounded-[4px]"
                />
              </InputOTPGroup>
            </InputOTP>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
