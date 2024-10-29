"use client";

import React, { useState } from "react";
import Image from "next/image";
import LandingSubmission from "@good-dog/components/LandingSubmission";
import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu";
import "react-horizontal-scrolling-menu/dist/styles.css";

type scrollVisibilityApiType = React.ContextType<typeof VisibilityContext>;

function onWheel(apiObj: scrollVisibilityApiType, ev: React.WheelEvent): void {
  const isThouchpad = Math.abs(ev.deltaX) !== 0 || Math.abs(ev.deltaY) < 15;

  if (isThouchpad) {
    ev.stopPropagation();
    return;
  }

  if (ev.deltaY < 0) {
    apiObj.scrollNext();
  } else if (ev.deltaY > 0) {
    apiObj.scrollPrev();
  }
}

const preventDefault = (ev: Event) => {
  if (ev.preventDefault) {
    ev.preventDefault();
  }
  ev.returnValue = false;
};

const enableBodyScroll = () => {
  document && document.removeEventListener("wheel", preventDefault, false);
};
const disableBodyScroll = () => {
  document &&
    document.addEventListener("wheel", preventDefault, {
      passive: false,
    });
};

function usePreventBodyScroll() {
  const [hidden, setHidden] = React.useState(false);

  React.useEffect(() => {
    hidden ? disableBodyScroll() : enableBodyScroll();

    return enableBodyScroll;
  }, [hidden]);

  const disableScroll = React.useCallback(() => setHidden(true), []);
  const enableScroll = React.useCallback(() => setHidden(false), []);
  return { disableScroll, enableScroll };
}



export default function Home() {
  const Splash = () => {
    return (
      <div style={{ paddingTop: "10vh", paddingBottom: "15rem" }}>
        <Image
          src="/icons/Good Dog With Logo.svg"
          width={789}
          height={0}
          alt="good-dog-logo"
          style={{ margin: "auto", display: "block", marginBottom: "2.5rem" }}
          style={{ margin: "auto", display: "block", marginBottom: "2.5rem" }}
        />
        <div
          className="font-righteous rounded-full bg-good-dog-celadon px-4 py-1 font-semibold text-good-dog-violet"
          style={{ margin: "auto", width: "fit-content" }}
          className="font-righteous rounded-full bg-good-dog-celadon px-4 py-1 font-semibold text-good-dog-violet"
          style={{ margin: "auto", width: "fit-content" }}
        >
          <a href="/submit">SUBMIT A BRIEF</a>
        </div>
      </div>
    );
  };

  const ProjectCard = () => {
    return (
      <div
        style={{ marginRight: "2rem" }}
        tabIndex={0}
      >
        <Image
          src="/icons/Project_Leaf.svg"
          alt="project background"
          width={360}
          height={248}
        ></Image>
        <h3 className="text-good-dog-pale-yellow">
          Lorem ipsum dolor sit amet
        </h3>
      </div>
    );
  };

  const PastProjects = () => {
    const getItems = () => Array(8).fill(0);
    const [items, setItems] = useState(getItems);
    const { disableScroll, enableScroll } = usePreventBodyScroll();

    return (
      <div onMouseEnter={disableScroll} onMouseLeave={enableScroll} style={{ overflow: "scroll"}}>
        <h2
          className="font-righteous text-good-dog-pale-yellow"
          style={{ fontSize: "40px", margin: "4rem" }}
        >
          Past Projects:
        </h2>
          <ScrollMenu onWheel={onWheel}>
            {items.map(() => (
              <ProjectCard />
            ))}
          </ScrollMenu>
      </div>
    );
  };

  return (
    <main className="bg-good-dog-violet">
      <Splash />
      <LandingSubmission />
      <LandingSubmission
        flipX={true}
        flipY={true}
        reverseLayout={true}
        title="Music Makers"
        button="SEND US YOUR MUSIC"
      />
      <PastProjects />
    </main>
  );
}
