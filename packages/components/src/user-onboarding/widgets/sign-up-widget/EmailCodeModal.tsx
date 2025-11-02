"use client";

import { InputOTP, InputOTPGroup, InputOTPSlot } from "@good-dog/ui/input-otp";
import { useState } from "react";
import Modal from "../../../base/Modal";

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
    <Modal
      open={isOpen}
      onClose={close}
      headerText="Verify your email address"
      width={500}
      height={285}
    >
      <div className="text-body2">We sent a link to {email}</div>
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
    </Modal>
  );
}
