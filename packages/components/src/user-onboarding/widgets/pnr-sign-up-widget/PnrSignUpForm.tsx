import RHFTextInput from "../../../rhf-base/RHFTextInput";
import Link from "next/link";
import type z from "zod";
import type { zModeratorSignUpValues } from "@good-dog/trpc/schema";
import PasswordRequirements from "../components/PasswordRequirements";
import Button from "../../../base/Button";
import { useFormContext } from "react-hook-form";
import ErrorExclamation from "../../../svg/status-icons/ErrorExclamation";

type PnrSignUpFormFields = z.input<typeof zModeratorSignUpValues>;

interface PnrSignUpFormProps {
  onSubmit: () => void;
  errorMessage?: string;
}

export default function PnrSignUpForm({
  onSubmit,
  errorMessage,
}: PnrSignUpFormProps) {
  const {
    formState: { errors },
  } = useFormContext<PnrSignUpFormFields>();

  return (
    <form className="pr-[40px]" onSubmit={onSubmit}>
      <h3 className="text-green-500 dark:text-mint-200">Sign up as a P&R</h3>
      <p className="pt-[8px] text-dark-gray-500 dark:text-gray-200">
        All fields below are required
      </p>
      {errorMessage && (
        <div className="flex flex-row items-center gap-[4px] pt-[12px]">
          <ErrorExclamation size="medium" />
          <p className="text-red-400 dark:text-red-300">{errorMessage}</p>
        </div>
      )}
      <div className="flex flex-col gap-[12px] pt-[20px]">
        <div className="flex flex-row gap-[24px]">
          <RHFTextInput<PnrSignUpFormFields>
            rhfName="firstName"
            label="First name"
            placeholder="Enter first name"
            id="firstName"
            errorText={errors.firstName?.message}
            required
          />
          <RHFTextInput<PnrSignUpFormFields>
            rhfName="lastName"
            label="Last name"
            placeholder="Enter last name"
            id="lastName"
            errorText={errors.lastName?.message}
            required
          />
        </div>
        <RHFTextInput<PnrSignUpFormFields>
          rhfName="phoneNumber"
          label="Phone Number"
          placeholder="123-456-7890"
          id="phoneNumber"
          errorText={errors.phoneNumber?.message}
          required
        />
        <div className="flex flex-col gap-[8px]">
          <RHFTextInput<PnrSignUpFormFields>
            rhfName="password"
            label="Password"
            placeholder="Your password"
            id="password"
            errorText={errors.password?.message}
            type="password"
            required
          />
          {!errors.password?.message && <PasswordRequirements />}
        </div>
        <RHFTextInput<PnrSignUpFormFields>
          rhfName="confirmPassword"
          label="Confirm Password"
          placeholder="Confirm your password"
          id="confirmPassword"
          errorText={errors.confirmPassword?.message}
          type="password"
          required
        />
      </div>
      <div className="pt-[32px]">
        <Button
          type="submit"
          variant="contained"
          size="large"
          label="Sign up"
          shadow
          fullWidth
        />
      </div>
      <div className="flex flex-row flex-wrap justify-center space-x-1 pt-[16px] text-body3">
        <span className="font-normal text-dark-gray-500 dark:text-gray-200">
          Already have an account?
        </span>
        <Link
          href="/login"
          className="font-medium text-secondary underline text-green-500 dark:text-mint-200"
        >
          Log in
        </Link>
      </div>
    </form>
  );
}
