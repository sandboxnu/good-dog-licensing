// import { Spinner } from "@good-dog/components/loading/Spinner";

export default function LoadingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-good-dog-violet pt-44 text-good-dog-pale-yellow">
      <div className="space-y-6 text-center">
        <h1 className="animate-fade-in text-7xl font-bold tracking-wider">
          LOADING
        </h1>
        <div className="flex justify-center">
          {/* <Spinner className="text-good-dog-celadon" /> */}
        </div>
        <p className="animate-pulse text-lg text-good-dog-orange/70">
          Please wait while we fetch your content.
        </p>
      </div>
    </div>
  );
}
