import LoginWidget from "./widgets/login-widget/LoginWidget";
import SignUpWidget from "./widgets/sign-up-widget/SignUpWidget";

interface MusicianOnboardingProps {
  type: "signUp" | "logIn";
}

export default function MusicianOnboarding({ type }: MusicianOnboardingProps) {
  return (
    <div className="h-[3312px] w-full pt-[20px]">
      {type === "signUp" ? <SignUpWidget role="MUSICIAN" /> : <LoginWidget />}
    </div>
  );
}
