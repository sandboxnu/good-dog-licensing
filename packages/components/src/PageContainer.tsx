import React from "react";
import clsx from "clsx";

import Footer from "./Footer";
import MobileNav from "./MobileNav";
import Nav from "./Nav";

const DISPLAY_ON_DESKTOP_CLASS = "max-md:hidden";
const DISPLAY_ON_MOBILE_CLASS = "md:hidden";

export const CONTENT_MAX_WIDTH_CLASSES = {
  small: "max-w-[1050px] px-[40px]",
  large: "max-w-[1650px] px-[40px]",
  full: "w-full",
};

const BACKGROUND_CLASSES = {
  gradient: "bg-main-bg-gradient-light! dark:bg-main-bg-gradient-dark!",
  solid: "bg-main-bg-solid-light! dark:bg-main-bg-solid-dark!",
};

interface PageContainerProps {
  background: keyof typeof BACKGROUND_CLASSES;
  widthType: keyof typeof CONTENT_MAX_WIDTH_CLASSES;
  smallHeader?: boolean;
  children: React.ReactNode;
}

export default function PageContainer({
  background,
  widthType,
  smallHeader = false,
  children,
}: PageContainerProps) {
  return (
    <div className="flex w-full flex-col">
      <div
        className={clsx("min-h-screen w-full", BACKGROUND_CLASSES[background])}
      >
        <div
          className={clsx(
            "mx-auto flex flex-col pt-[32px]",
            CONTENT_MAX_WIDTH_CLASSES[widthType],
            // Tighter gutters on phones
            widthType !== "full" && "max-md:px-[16px]",
            "max-md:pt-[16px]",
          )}
        >
          {/* Compact nav bar on phones */}
          <div
            className={clsx(
              DISPLAY_ON_MOBILE_CLASS,
              widthType === "full" && "px-[16px]",
            )}
          >
            <MobileNav />
          </div>

          {/* Full nav bar on desktop */}
          <div className={clsx(DISPLAY_ON_DESKTOP_CLASS)}>
            <div
              className={clsx(
                "mx-auto",
                smallHeader && CONTENT_MAX_WIDTH_CLASSES.small,
              )}
            >
              <Nav />
            </div>
          </div>

          <div className="flex w-full items-center justify-center pt-[32px] pb-[50px] max-md:pt-[16px] max-md:pb-[32px]">
            {children}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
