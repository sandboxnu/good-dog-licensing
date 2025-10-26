import ForgotPasswordWidget from "./widgets/forgot-password-widget/ForgotPasswordWidget";
import ForgotPassword from "./widgets/forgot-password-widget/ForgotPasswordWidget";
import LoginWidget from "./widgets/login-widget/LoginWidget";
import SignUpWidget from "./widgets/sign-up-widget/SignUpWidget";
import UserOnboardingWidgetContainer from "./widgets/UserOnboardingWidgetContainer";

interface GeneralUserOnboardingProps {
  type: "signUp" | "logIn" | "forgotPassword";
}

export default function GeneralUserOnboarding({
  type,
}: GeneralUserOnboardingProps) {
  return (
    <div className="h-[1000px] w-full pt-[20px]">
      {type === "signUp" ? <SignUpWidget role={undefined} /> : 
      type === "logIn" ? <LoginWidget /> :
      <ForgotPasswordWidget/>}
    </div>
  );
}