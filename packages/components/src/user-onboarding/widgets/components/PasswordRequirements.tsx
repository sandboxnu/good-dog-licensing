export default function PasswordRequirements() {
  return (
    <div className="flex flex-wrap justify-start gap-x-10">
      <BulletPoint content="8 characters minimum" />
      <BulletPoint content="1+ special character" />
      <BulletPoint content="1+ uppercase character" />
    </div>
  );
}

function BulletPoint({ content }: { content: string }) {
  return (
    <div className="flex flex-row gap-[4px] items-center">
      <div className="w-[6px] h-[6px] rounded-full bg-good-dog-main"></div>
      <p>{content}</p>
    </div>
  );
}
