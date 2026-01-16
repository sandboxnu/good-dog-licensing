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
    <div className="flex flex-row items-center gap-[4px]">
      <div className="h-[6px] w-[6px] rounded-full bg-green-400 dark:bg-mint-300"></div>
      <p className="text-dark-gray-600 dark:text-gray-100">{content}</p>
    </div>
  );
}
