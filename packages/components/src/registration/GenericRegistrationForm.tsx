import type { ReactNode } from "react";
import Link from "next/link";
import clsx from "clsx";

import { Button } from "@good-dog/ui/button";

export default function GenericRegistrationForm({
  title,
  variant,
  children,
  error,
  ctaTitle,
  onSubmit,
  disabled,
  secondaryAction,
  secondaryActionLink,
  secondaryActionUrl,
}: Readonly<{
  title: string;
  variant: "light" | "dark";
  error?: ReactNode;
  children: ReactNode;
  ctaTitle: string;
  onSubmit: () => void;
  disabled: boolean;
  secondaryAction?: string;
  secondaryActionLink?: string;
  secondaryActionUrl?: string;
}>) {
  return (
    <form onSubmit={onSubmit} className="font-afacad" role="form">
      <h1
        className={clsx(
          "mb-8 text-left font-righteous text-4xl uppercase",
          variant === "light"
            ? "text-good-dog-celadon"
            : "text-good-dog-violet",
        )}
      >
        {title}
      </h1>
      {error}
      <div
        className={clsx(
          "mb-6",
          variant === "light" ? "text-white" : "text-good-dog-violet",
        )}
      >
        {children}
      </div>
      <Button
        type="submit"
        className={clsx(
          "mb-3 h-16 w-full rounded-full font-righteous text-2xl uppercase",
          variant === "light"
            ? "bg-good-dog-celadon text-good-dog-violet"
            : "bg-good-dog-violet text-white",
        )}
        disabled={disabled}
      >
        {ctaTitle}
      </Button>
      {!!secondaryAction && !!secondaryActionUrl && !!secondaryActionLink && (
        <div className="flex flex-row flex-wrap justify-center space-x-1 text-lg">
          <span
            className={clsx(
              "text-center",
              variant === "light" ? "text-white" : "text-good-dog-violet",
            )}
          >
            {secondaryAction}
          </span>
          <Link
            href={secondaryActionUrl}
            className={clsx(
              "hover:underline",
              variant === "light"
                ? "text-good-dog-celadon"
                : "text-good-dog-violet",
            )}
          >
            {secondaryActionLink}
          </Link>
        </div>
      )}
    </form>
  );
}
