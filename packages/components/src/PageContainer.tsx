import React from "react";
import Nav from "./Nav";
import clsx from "clsx";

interface PageContainerProps {
  background: "solid" | "gradient";
  children: React.ReactNode;
}

export default function PageContainer({
  background,
  children,
}: PageContainerProps) {
  return (
    <div className="min-w-[1250px] w-full flex justify-center flex-col">
      <div
        className={clsx("w-full min-h-screen flex justify-center", {
          "!bg-main-bg-gradient": background === "gradient",
          "!bg-main-bg-solid": background === "solid",
        })}
      >
        <div className="px-[228px] flex flex-col max-w-[1500px] w-full pt-[32px]">
          <Nav />
          <div className="pt-[32px] w-full">{children}</div>
        </div>
      </div>
      <div className="h-[100px] bg-good-dog-main w-full" />
    </div>
  );
}
