import React from "react";
import clsx from "clsx";

import Footer from "./Footer";
import Nav from "./Nav";
import DeviceTooSmallModal from "./DeviceTooSmallModal";

const DISPLAY_ON_DESKTOP_CLASS = "max-[799px]:hidden";
const DISPLAY_ON_MOBILE_CLASS = "min-[800px]:hidden";

const CONTENT_MAX_WIDTH_CLASSES = {
  small: "max-w-[1050px]",
  large: "max-w-[1650px]",
};

const BACKGROUND_CLASSES = {
  gradient: "!bg-main-bg-gradient-light dark:!bg-main-bg-gradient-dark",
  solid: "!bg-main-bg-solid-light dark:!bg-main-bg-solid-dark",
  spottedGradient:
    "!bg-main-bg-spotted-gradient-light dark:!bg-main-spotted-gradient-dark",
};

function MobileBlocker() {
  return (
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
  children: React.ReactNode;
}

export default function PageContainer({
  background,
  widthType,
  allowMobile = false,
  children,
}: PageContainerProps) {
  return (
    <>
      {!allowMobile && <MobileBlocker />}

      <div className={clsx("flex w-full flex-col", DISPLAY_ON_DESKTOP_CLASS)}>
        <div
          className={clsx(
            "w-full min-h-screen",
            BACKGROUND_CLASSES[background],
          )}
        >
          <div
            className={clsx(
              "flex flex-col w-full px-[40px] pt-[32px] mx-auto",
              CONTENT_MAX_WIDTH_CLASSES[widthType],
            )}
          >
            <Nav />

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
