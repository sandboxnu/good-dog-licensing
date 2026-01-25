export function Spinner({ className = "" }: { className?: string }) {
  return (
    <div
      className={`inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] ${className}`}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
