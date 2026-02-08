import { Spinner } from "@good-dog/components/oldStuff/loading/Spinner";

export default function LoadingPage() {
  return (
    <div className="bg-good-dog-violet text-good-dog-pale-yellow flex min-h-screen flex-col items-center justify-start pt-44">
      <div className="space-y-6 text-center">
        <h1 className="animate-fade-in text-7xl font-bold tracking-wider">
          LOADING
        </h1>
        <div className="flex justify-center">
          <Spinner className="text-good-dog-celadon" />
        </div>
        <p className="text-good-dog-orange/70 animate-pulse text-lg">
          Please wait while we fetch your content.
        </p>
      </div>
    </div>
  );
}
