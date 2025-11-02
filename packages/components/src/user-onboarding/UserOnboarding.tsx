"use client";

import { useState } from "react";
import LoginWidget from "./widgets/login-widget/LoginWidget";
import SignUpWidget from "./widgets/sign-up-widget/SignUpWidget";
import MediaMakerSection from "./MediaMakerSection";
import MusicianSection from "./MusicianSection";

interface UserOnboardingProps {
  initialRole: "MUSICIAN" | "MEDIA_MAKER" | undefined;
  type: "signUp" | "logIn";
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
      {type === "signUp" ? (
        <SignUpWidget
          initialRole={role}
          onRoleChange={(newRole) => {
            setRole(newRole);
          }}
        />
      ) : (
        <LoginWidget />
      )}
      {role === "MEDIA_MAKER" && <MediaMakerSection />}
      {role === "MUSICIAN" && <MusicianSection />}
    </div>
  );
}
