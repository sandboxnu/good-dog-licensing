import {
  RegistrationPageLayout,
  ResetPasswordForm,
} from "@good-dog/components/registration";

export default function Page() {
  return (
    <RegistrationPageLayout form={<ResetPasswordForm />} formLocation="right" />
  );
}
