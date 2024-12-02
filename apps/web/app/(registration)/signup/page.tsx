import Image from "next/image";
import Link from "next/link";

import {
  RegistrationPageLayout,
  SignUpForm,
} from "@good-dog/components/registration";

export default function Page() {
  return <RegistrationPageLayout form={<SignUpForm />} formLocation="left" />;
}
