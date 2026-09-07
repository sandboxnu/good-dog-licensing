export function NotificationBadge({ number }: { number: number }) {
  return (
    <div className="h-5 w-5 rounded-full bg-error">
      <div className="bg-good-dog-accent flex h-5 w-5 items-center justify-center rounded-full text-xs font-semibold text-white">
        {number}
      </div>
    </div>
  );
}
