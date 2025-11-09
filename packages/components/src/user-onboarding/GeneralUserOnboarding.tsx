import ForgotPasswordWidget from "./widgets/forgot-password-widget/ForgotPasswordWidget";
import LoginWidget from "./widgets/login-widget/LoginWidget";
import ResetPasswordWidget from "./widgets/reset-password-widget/ResetPasswordWidget";
import SignUpWidget from "./widgets/sign-up-widget/SignUpWidget";

interface GeneralUserOnboardingProps {
  type: "signUp" | "logIn" | "forgotPassword" | "resetPassword";
}

export default function GeneralUserOnboarding({
  type,
}: GeneralUserOnboardingProps) {
  return (
    <div className="h-[1000px] w-full pt-[20px]">
      {type === "signUp" ? (
        <SignUpWidget role={undefined} />
      ) : type === "logIn" ? (
        <LoginWidget />
      ) : type === "forgotPassword" ? (
        <ForgotPasswordWidget />
      ) : (
        <ResetPasswordWidget />
      )}
    </div>
  );
}
