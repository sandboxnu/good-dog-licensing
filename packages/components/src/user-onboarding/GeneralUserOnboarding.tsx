import LoginWidget from "./widgets/login-widget/LoginWidget";
import SignUpWidget from "./widgets/sign-up-widget/SignUpWidget";

interface GeneralUserOnboardingProps {
  type: "signUp" | "logIn";
}

export default function GeneralUserOnboarding({
  type,
}: GeneralUserOnboardingProps) {
  return (
    <div className="h-[1000px] w-full pt-[20px]">
      {type === "signUp" ? <SignUpWidget role={undefined} /> : <LoginWidget />}
    </div>
  );
}
