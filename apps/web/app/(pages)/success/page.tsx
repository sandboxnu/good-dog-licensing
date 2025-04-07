import Link from "next/link";
import { ArrowLeftIcon, CheckIcon } from "@radix-ui/react-icons";

export default function SuccessPage() {
  // Get current date in the format "Month Day, Year"
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex min-h-screen flex-col">
      <main className="mx-auto flex max-w-2xl flex-1 flex-col items-center justify-center px-4 text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-800">
          <CheckIcon className="h-8 w-8 text-white" />
        </div>
        <h1 className="mb-1 text-3xl font-bold">Submitted Successfully</h1>
        <p className="mb-8 text-gray-500">on {currentDate}</p>
        <p className="mb-16 text-gray-700">
          Your music ratings have been submitted successfully. The team will
          review your selections and proceed with the next steps in the music
          selection process.
        </p>
        <Link
          href="/account"
          className="inline-flex items-center text-gray-700 hover:text-gray-900"
        >
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back to My Account
        </Link>
      </main>
    </div>
  );
}
