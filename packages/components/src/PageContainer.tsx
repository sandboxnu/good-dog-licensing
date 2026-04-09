import React from "react";
import clsx from "clsx";

import DeviceTooSmallModal from "./DeviceTooSmallModal";
import Footer from "./Footer";
import Nav from "./Nav";

const DISPLAY_ON_DESKTOP_CLASS = "max-[799px]:hidden";
const DISPLAY_ON_MOBILE_CLASS = "min-[800px]:hidden";

export const CONTENT_MAX_WIDTH_CLASSES = {
  small: "max-w-[1050px] px-[40px]",
  large: "max-w-[1650px] px-[40px]",
  full: "w-full",
};

const BACKGROUND_CLASSES = {
  gradient: "!bg-main-bg-gradient-light dark:!bg-main-bg-gradient-dark",
  solid: "!bg-main-bg-solid-light dark:!bg-main-bg-solid-dark",
};

function MobileBlocker() {
  return (
    // Only display mobile blocker if screen is small enough
    <div
      className={clsx(
        DISPLAY_ON_MOBILE_CLASS,
        "relative flex min-h-screen w-full items-center justify-center",
        BACKGROUND_CLASSES.gradient,
      )}
    >
      <div className="absolute inset-0 bg-overlay opacity-25" />
      <div className="relative z-10">
        <div className="max-w-[600px] px-[40px]">
          <DeviceTooSmallModal />
        </div>
      </div>
    </div>
  );
}

interface PageContainerProps {
  background: keyof typeof BACKGROUND_CLASSES;
  widthType: keyof typeof CONTENT_MAX_WIDTH_CLASSES;
  allowMobile?: boolean;
  smallHeader?: boolean;
  children: React.ReactNode;
}

export default function PageContainer({
  background,
  widthType,
  allowMobile = false,
  smallHeader = false,
  children,
}: PageContainerProps) {
  return (
    <>
      {/* Show mobile blocker when mobile isn't allowed and screen is too small*/}
      {!allowMobile && <MobileBlocker />}

      {/* Don't show main content if not allowing mobile and screen size is too small */}
      <div
        className={clsx(
          "flex w-full flex-col",
          !allowMobile && DISPLAY_ON_DESKTOP_CLASS,
        )}
      >
        <div
          className={clsx(
            "min-h-screen w-full",
            BACKGROUND_CLASSES[background],
          )}
        >
          <div
            className={clsx(
              "mx-auto flex flex-col pt-[32px]",
              CONTENT_MAX_WIDTH_CLASSES[widthType],
            )}
          >
            {/* Only show nav bar when on desktop */}
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

            <div
              className={clsx(
                "flex w-full items-center justify-center pb-[50px] pt-[32px]",
              )}
            >
              {children}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
