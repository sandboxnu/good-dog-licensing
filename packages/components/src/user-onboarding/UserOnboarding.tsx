"use client";

import { useState } from "react";

import MediaMakerSection from "./MediaMakerSection";
import MusicianSection from "./MusicianSection";
import ForgotPasswordWidget from "./widgets/forgot-password-widget/ForgotPasswordWidget";
import LoginWidget from "./widgets/login-widget/LoginWidget";
import ResetPasswordWidget from "./widgets/reset-password-widget/ResetPasswordWidget";
import SignUpWidget from "./widgets/sign-up-widget/SignUpWidget";
import PnrSignUpWidget from "./widgets/pnr-sign-up-widget/PnrSignUpWidget";

interface UserOnboardingProps {
  initialRole: "MUSICIAN" | "MEDIA_MAKER" | undefined;
  type:
    | "SIGN_UP"
    | "LOG_IN"
    | "FORGOT_PASSWORD"
    | "RESET_PASSWORD"
    | "PNR_SIGN_UP";
}

export default function UserOnboarding({
  initialRole,
  type,
}: UserOnboardingProps) {
  const [role, setRole] = useState<"MUSICIAN" | "MEDIA_MAKER" | undefined>(
    initialRole,
  );

  return (
    <div className="flex w-full flex-col pt-[20px]">
      {type === "SIGN_UP" && (
        <SignUpWidget
          initialRole={role}
          onRoleChange={(newRole) => {
            setRole(newRole);
          }}
        />
      )}
      {type === "LOG_IN" && <LoginWidget />}
      {type === "FORGOT_PASSWORD" && <ForgotPasswordWidget />}
      {type === "RESET_PASSWORD" && <ResetPasswordWidget />}
      {type === "PNR_SIGN_UP" && <PnrSignUpWidget />}
      {role === "MEDIA_MAKER" && <MediaMakerSection />}
      {role === "MUSICIAN" && <MusicianSection />}
    </div>
  );
}
