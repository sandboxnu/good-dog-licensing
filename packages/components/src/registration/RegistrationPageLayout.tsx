import { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";

import CheckerColumn from "../CheckerColumn";
import { GoodDogLogo } from "../GoodDogLogo";

const Side = ({
  children,
  color,
}: Readonly<{
  children: ReactNode;
  color: "bg-good-dog-celadon" | "bg-good-dog-violet";
}>) => (
  <div
    className={clsx(
      "relative h-full flex-1 overflow-hidden bg-good-dog-celadon",
      color,
    )}
  >
    {children}
  </div>
);

export default function RegistrationPageLayout(props: {
  form: ReactNode;
  formLocation: "left" | "right";
}) {
  return (
    <main className="relative flex h-screen flex-row">
      <Side color="bg-good-dog-celadon">
        {props.formLocation === "left" ? (
          <div className="h-full p-10 pt-16">{props.form}</div>
        ) : (
          <Logo side="left" />
        )}
      </Side>
      <CheckerColumn numSquares={4} className="flex-shrink-0" />
      <Side color="bg-good-dog-violet">
        {props.formLocation === "right" ? (
          <div className="h-full p-10 pt-16">{props.form}</div>
        ) : (
          <Logo side="right" />
        )}
      </Side>

      <Link href="/" className="absolute left-3 top-3">
        <Image
          src="/icons/back_button.svg"
          width={40}
          height={40}
          alt="back button"
        />
      </Link>
    </main>
  );
}

const Logo = (props: { side: "left" | "right" }) => (
  <GoodDogLogo
    facingDirection={props.side === "left" ? "right" : "left"}
    variant={props.side === "left" ? "dark" : "light"}
    className={clsx(
      "absolute bottom-0 w-[120%] translate-y-[20%]",
      props.side === "left"
        ? "left-0 translate-x-[-30%]"
        : "right-0 translate-x-[30%]",
    )}
  />
);
