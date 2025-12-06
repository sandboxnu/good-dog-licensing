export function NotificationBadge({ number }: { number: number }) {
  return (
    <div>
      {number > 0 && (
        <div className="rounded-full w-5 h-5 bg-error">
          <div className="bg-good-dog-accent text-white text-xs font-semibold w-5 h-5 flex items-center justify-center rounded-full">
            {number}
          </div>
        </div>
      )}
    </div>
  );
}
