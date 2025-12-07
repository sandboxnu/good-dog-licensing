import React from "react";
import clsx from "clsx";

import Footer from "./Footer";
import Nav from "./Nav";

interface PageContainerProps {
  background: "solid" | "gradient";
  children: React.ReactNode;
}

export default function PageContainer({
  background,
  children,
}: PageContainerProps) {
  return (
    <div className="flex w-full min-w-[1500px] flex-col justify-center">
      <div
        className={clsx("flex min-h-screen w-full justify-center", {
          "!bg-main-bg-gradient": background === "gradient",
          "!bg-main-bg-solid": background === "solid",
        })}
      >
        <div className="flex flex-col w-[1500px] px-[228px] pt-[32px]">
          <Nav />
          <div className="flex w-full items-center justify-center pb-[50px] pt-[32px]">
            {children}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
