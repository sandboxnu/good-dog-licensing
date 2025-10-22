import ForgotPasswordForm from "@good-dog/components/oldStuff/registration/ForgotPassword";
import RegistrationPageLayout from "@good-dog/components/oldStuff/registration/RegistrationPageLayout";

export default function Page() {
  return (
    <RegistrationPageLayout
      form={<ForgotPasswordForm />}
      formLocation="right"
    />
  );
}
