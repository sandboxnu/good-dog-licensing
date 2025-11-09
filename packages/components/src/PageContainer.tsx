import React from "react";
import Nav from "./Nav";
import clsx from "clsx";
import Footer from "./Footer";

interface PageContainerProps {
  background: "solid" | "gradient";
  children: React.ReactNode;
}

export default function PageContainer({
  background,
  children,
}: PageContainerProps) {
  return (
    <div className="min-w-[1400px] w-full flex justify-center flex-col">
      <div
        className={clsx("w-full min-h-screen flex justify-center", {
          "!bg-main-bg-gradient": background === "gradient",
          "!bg-main-bg-solid": background === "solid",
        })}
      >
        <div className="px-[228px] flex flex-col max-w-[1500px] w-full pt-[32px]">
          <Nav />
          <div className="pt-[32px] pb-[50px] w-full flex items-center justify-center">
            {children}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
