import {
  ForgotPasswordForm,
  RegistrationPageLayout,
} from "@good-dog/components/registration";

export default function Page() {
  return (
    <RegistrationPageLayout
      form={<ForgotPasswordForm />}
      formLocation="right"
    />
  );
}
