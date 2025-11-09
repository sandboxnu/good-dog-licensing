"use client";

import { useState } from "react";

import MediaMakerSection from "./MediaMakerSection";
import MusicianSection from "./MusicianSection";
import ForgotPasswordWidget from "./widgets/forgot-password-widget/ForgotPasswordWidget";
import LoginWidget from "./widgets/login-widget/LoginWidget";
import ResetPasswordWidget from "./widgets/reset-password-widget/ResetPasswordWidget";
import SignUpWidget from "./widgets/sign-up-widget/SignUpWidget";

interface UserOnboardingProps {
  initialRole: "MUSICIAN" | "MEDIA_MAKER" | undefined;
  type: "signUp" | "logIn" | "forgotPassword" | "resetPassword";
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
      {type === "signUp" && (
        <SignUpWidget
          initialRole={role}
          onRoleChange={(newRole) => {
            setRole(newRole);
          }}
        />
      )}
      {type === "logIn" && <LoginWidget />}
      {type === "forgotPassword" && <ForgotPasswordWidget />}
      {type === "resetPassword" && <ResetPasswordWidget />}
      {role === "MEDIA_MAKER" && <MediaMakerSection />}
      {role === "MUSICIAN" && <MusicianSection />}
    </div>
  );
}
