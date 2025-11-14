import Button from "../../../base/Button";
import ErrorExclamation from "../../../svg/ErrorExclamation";

export default function ProfileWidget() {
  return (
    <div className="flex flex-col gap-[24px] w-[752px]">
      <div>pfp + name + role</div>
      <div className="flex flex-col gap-y-[16px]">
        <div>personal details</div>
        <div className="rounded-2xl">
          <header className="bg-gray-200">Security</header>
          <div className="rounded-2xl">
            <div>email</div>
            <div>password</div>
          </div>
        </div>

        <div className="rounded-2xl bg-white border">
          <header className="bg-gray w-full self-stretch pb-[12px] pt-[13px] pl-[23.5px] text-error">
            Delete account
          </header>
          <div className="flex flex-col gap-y-[16px] rounded-2xl p-[24px] pt-[16px]">
            <div className="flex flex-row justify-left items-center text-[#5C5C5C]">
              <ErrorExclamation size="medium" /> This will permanently delete
              your account and all your information. This action can't be
              undone!
            </div>
            <Button
              label="Delete account"
              size="medium"
              variant="outlined"
              error={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
