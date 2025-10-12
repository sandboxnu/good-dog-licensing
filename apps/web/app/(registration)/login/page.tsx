import RegistrationPageLayout from "@good-dog/components/oldStuff/registration/RegistrationPageLayout";
import SignInForm from "@good-dog/components/oldStuff/registration/SignInForm";

export default function Page() {
  return <RegistrationPageLayout form={<SignInForm />} formLocation="right" />;
}
