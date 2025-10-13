import RegistrationPageLayout from "@good-dog/components/oldStuff/registration/RegistrationPageLayout";
import ResetPasswordForm from "@good-dog/components/oldStuff/registration/ResetPassword";

export default function Page() {
  return (
    <RegistrationPageLayout form={<ResetPasswordForm />} formLocation="right" />
  );
}
