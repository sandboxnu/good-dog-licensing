export default function PasswordRequirements() {
  return (
    <div className="flex flex-wrap justify-start gap-x-10 gap-y-[8px]">
      <BulletPoint content="8 characters minimum" />
      <BulletPoint content="1+ special character" />
      <BulletPoint content="1+ uppercase character" />
    </div>
  );
}

function BulletPoint({ content }: { content: string }) {
  return (
    <div className="flex flex-row items-center gap-[4px]">
      <div className="h-[6px] w-[6px] rounded-full bg-good-dog-main"></div>
      <p>{content}</p>
    </div>
  );
}
