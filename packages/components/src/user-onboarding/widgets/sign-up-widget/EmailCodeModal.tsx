"use client";

import { InputOTP, InputOTPGroup, InputOTPSlot } from "@good-dog/ui/input-otp";
import { useState } from "react";
import Modal from "../../../base/Modal";
import clsx from "clsx";

interface EmailCodeModalProps {
  isOpen: boolean;
  close: () => void;
  email: string;
  verifyCode: (code: string) => void;
  resendEmail: () => void;
  codeIsWrong: boolean;
}

export default function EmailCodeModal({
  isOpen,
  close,
  email,
  verifyCode,
  resendEmail,
  codeIsWrong = true,
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
      <p className="text-body2 pt-[4px]">
        We sent a link to <strong>{email}</strong>
      </p>
      {codeIsWrong && (
        <div className="flex flex-row items-center justify-center gap-x-1 pt-[16px]">
          <CustomErrorExclamation />
          <p className="text-body2 text-error font-medium">Incorrect code</p>
        </div>
      )}
      <div className="pt-[16px]">
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
            <OPTSlot index={0} error={codeIsWrong} />
            <OPTSlot index={1} error={codeIsWrong} />
            <OPTSlot index={2} error={codeIsWrong} />
            <OPTSlot index={3} error={codeIsWrong} />
            <OPTSlot index={4} error={codeIsWrong} />
            <OPTSlot index={5} error={codeIsWrong} />
          </InputOTPGroup>
        </InputOTP>
      </div>
      <div className="pt-[16px] flex flex-row flex-wrap justify-center space-x-1 items-center">
        <p className="text-body2">Didn't get an email?</p>
        <button
          onClick={() => {
            setEmailCode("");
            resendEmail();
          }}
          type="button"
          className="text-body2 underline font-medium text-secondary"
        >
          Resend
        </button>
      </div>
    </Modal>
  );
}

function OPTSlot({ index, error }: { index: number; error: boolean }) {
  return (
    <InputOTPSlot
      index={index}
      className={clsx(
        "!text-h1 h-[64px] w-[48px] border border-solid border-[#858585] rounded-[4px]",
        { "border-error shadown-error": error },
      )}
    />
  );
}

function CustomErrorExclamation() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        d="M7.99961 14.3996C4.46461 14.3996 1.59961 11.5346 1.59961 7.99961C1.59961 4.46461 4.46461 1.59961 7.99961 1.59961C11.5346 1.59961 14.3996 4.46461 14.3996 7.99961C14.3996 11.5346 11.5346 14.3996 7.99961 14.3996ZM7.99961 9.59961C7.55711 9.59961 7.19961 9.95711 7.19961 10.3996C7.19961 10.8421 7.55711 11.1996 7.99961 11.1996C8.44211 11.1996 8.79961 10.8421 8.79961 10.3996C8.79961 9.95711 8.44211 9.59961 7.99961 9.59961ZM7.99961 4.79961C7.54461 4.79961 7.18211 5.18711 7.21461 5.64211L7.39961 8.24211C7.42211 8.55711 7.68461 8.79961 7.99711 8.79961C8.31211 8.79961 8.57211 8.55711 8.59461 8.24211L8.77961 5.64211C8.81211 5.18711 8.45211 4.79961 7.99461 4.79961H7.99961Z"
        fill="#B13433"
      />
    </svg>
  );
}
