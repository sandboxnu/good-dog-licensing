import LoginWidget from "./widgets/login-widget/LoginWidget";
import SignUpWidget from "./widgets/sign-up-widget/SignUpWidget";

interface MediaMakerOnboardingProps {
  type: "signUp" | "logIn";
}

export default function MediaMakerOnboarding({
  type,
}: MediaMakerOnboardingProps) {
  return (
    <div className="h-[4292px] w-full pt-[20px]">
      {type === "signUp" ? (
        <SignUpWidget role="MEDIA_MAKER" />
      ) : (
        <LoginWidget />
      )}
    </div>
  );
}
