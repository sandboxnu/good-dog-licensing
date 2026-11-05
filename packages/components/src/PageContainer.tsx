import React from "react";
import clsx from "clsx";

import DesktopOnlyNotice from "./DesktopOnlyNotice";
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

function MobileBlocker({
  background,
}: {
  background: keyof typeof BACKGROUND_CLASSES;
}) {
  return (
    // Only shown on small screens for pages that don't support mobile.
    // Keeps the mobile nav so users can still reach their profile or log out.
    <div
      className={clsx(
        DISPLAY_ON_MOBILE_CLASS,
        "flex min-h-screen w-full flex-col px-[16px] pt-[16px] pb-[48px]",
        BACKGROUND_CLASSES[background],
      )}
    >
      <MobileNav />
      <div className="flex flex-1 items-center justify-center pt-[32px]">
        <DesktopOnlyNotice />
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
      {!allowMobile && <MobileBlocker background={background} />}

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
              // Tighter gutters on phones for pages that support mobile
              allowMobile && widthType !== "full" && "max-md:px-[16px]",
              allowMobile && "max-md:pt-[16px]",
            )}
          >
            {/* Compact nav bar for pages that support mobile */}
            {allowMobile && (
              <div
                className={clsx(
                  DISPLAY_ON_MOBILE_CLASS,
                  widthType === "full" && "px-[16px]",
                )}
              >
                <MobileNav />
              </div>
            )}

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

            <div
              className={clsx(
                "flex w-full items-center justify-center pt-[32px] pb-[50px]",
                allowMobile && "max-md:pt-[16px] max-md:pb-[32px]",
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
