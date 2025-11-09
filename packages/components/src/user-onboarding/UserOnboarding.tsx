"use client";

import { useState } from "react";
import LoginWidget from "./widgets/login-widget/LoginWidget";
import SignUpWidget from "./widgets/sign-up-widget/SignUpWidget";
import MediaMakerSection from "./MediaMakerSection";
import MusicianSection from "./MusicianSection";
import ForgotPasswordWidget from "./widgets/forgot-password-widget/ForgotPasswordWidget";
import ResetPasswordWidget from "./widgets/reset-password-widget/ResetPasswordWidget";

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
    <div className="w-full pt-[20px] flex flex-col">
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
