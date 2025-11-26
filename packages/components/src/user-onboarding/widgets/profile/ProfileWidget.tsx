import Button from "../../../base/Button";
import ErrorExclamation from "../../../svg/ErrorExclamation";

function InfoField({ header, content }: { header: string; content: string }) {
  return (
    <div className="flex flex-col">
      <header className="text-[#858585]">{header}</header>
      <div>{content}</div>
    </div>
  );
}

export default function ProfileWidget() {
  return (
    <div className="flex flex-col gap-[24px] w-[752px]">
      <div>pfp + name + role</div>
      <div className="flex flex-col gap-y-[16px]">
        <div className="rounded-2xl bg-white border">
          <header className="flex justify-between items-center bg-gray-200 rounded-t-2xl pb-[12px] pt-[13px] px-[23.5]">
            Personal details
            <Button
              size="small"
              variant="outlined"
              displayIcon="pencil"
              label="Edit"
            />
          </header>
          <div className="flex flex-col gap-y-[16px] rounded-2xl p-[24px] pt-[16px]">
            <div className="flex flex-row ">
              <div className="w-[380px]">
                <InfoField header="First name" content="John" />
              </div>
              <InfoField header="Last name" content="Doe" />
            </div>
            <div className="flex flex-row ">
              <div className="w-[380px]">
                <InfoField header="Group" content="ASCAP" />
              </div>
              <InfoField header="IPI No." content="000106060" />
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-white border">
          <header className="bg-gray-200 rounded-t-2xl pb-[12px] pt-[13px] px-[23.5]">
            Security
          </header>
          <div className="flex flex-col gap-y-[16px] rounded-2xl p-[24px] pt-[16px]">
            <div className="flex flex-row justify-between items-center">
              <InfoField header="Email" content="actualEmail@example.com" />
              <Button label="Change email" size="small" variant="outlined" />
            </div>
            <div className="flex flex-row justify-between items-center">
              <InfoField header="Password" content="example password" />
              <Button label="Change password" size="small" variant="outlined" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white border">
          <header className="bg-gray pb-[12px] pt-[13px] px-[23.5px] text-error">
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
