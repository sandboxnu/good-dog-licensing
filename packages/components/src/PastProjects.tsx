"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu";

import "react-horizontal-scrolling-menu/dist/styles.css";

type scrollVisibilityApiType = React.ContextType<typeof VisibilityContext>;

function onWheel(apiObj: scrollVisibilityApiType, ev: React.WheelEvent): void {
  // const isThouchpad = Math.abs(ev.deltaX) !== 0 || Math.abs(ev.deltaY) < 15;

  // if (isThouchpad) {
  //   ev.stopPropagation();
  //   return;
  // }

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

interface ProjectCardProps {
  key: number;
}

const ProjectCard = (props: ProjectCardProps) => {
  return (
    <div style={{ paddingRight: "2rem" }} tabIndex={props.key}>
      <Image
        src="/icons/Project_Leaf.svg"
        alt="project background"
        width={360}
        height={248}
        style={{ maxWidth: "360px" }}
      ></Image>
      <h3 className="pt-2 text-center font-semibold text-good-dog-pale-yellow">
        Lorem ipsum dolor sit amet
      </h3>
    </div>
  );
};

const PastProjects = () => {
  const getItems = () => Array(10).fill(0);
  const [items, setItems] = useState(getItems);
  const { disableScroll, enableScroll } = usePreventBodyScroll();

  return (
    <div style={{ paddingBottom: "8rem" }}>
      <h2
        className="font-righteous text-good-dog-pale-yellow"
        style={{ fontSize: "40px", margin: "4rem" }}
      >
        Past Projects:
      </h2>
      <div
        className="scroll-container"
        onMouseEnter={disableScroll}
        onMouseLeave={enableScroll}
        style={{
          overflowX: "auto",
          whiteSpace: "nowrap",
        }}
      >
        <ScrollMenu onWheel={onWheel}>
          {items.map((item, index) => (
            <ProjectCard key={index} />
          ))}
        </ScrollMenu>
      </div>
    </div>
  );
};

export default PastProjects;
