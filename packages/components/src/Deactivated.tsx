import Button from "./base/Button";
import DeactivatedUser from "./svg/DeactivatedUser";

const SUPPORT_EMAIL = "gooddoglicensing@gmail.com";

export default function Deactivated() {
  return (
    <div className="mx-auto flex w-full max-w-[650px] flex-col items-center gap-[24px] rounded-[24px] border border-cream-400 bg-cream-100 px-[24px] py-[48px] text-center shadow-card-light dark:border-cream-600 dark:bg-green-600 dark:shadow-card-dark">
      <DeactivatedUser />
      <div className="flex flex-col gap-[8px]">
        <h1 className="text-h3 font-semibold text-green-500 dark:text-mint-200">
          Account inactive
        </h1>
        <p className="text-body2 font-normal text-dark-gray-500 dark:text-gray-300">
          Your account has been deactivated, please email Good Dog Licensing
          at{" "}
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="font-semibold text-green-500 underline dark:text-mint-200"
          >
            {SUPPORT_EMAIL}
          </a>{" "}
          to reactivate it
        </p>
      </div>
      <Button
        label="Send email"
        size="medium"
        variant="contained"
        shadow
        onClick={() => {
          window.location.href = `mailto:${SUPPORT_EMAIL}`;
        }}
      />
    </div>
  );
}
