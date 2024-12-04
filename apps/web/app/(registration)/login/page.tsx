import {
  RegistrationPageLayout,
  SignInForm,
} from "@good-dog/components/registration";

export default function Page() {
  return <RegistrationPageLayout form={<SignInForm />} formLocation="right" />;
}
