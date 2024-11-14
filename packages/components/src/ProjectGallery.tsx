"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

import "react-horizontal-scrolling-menu/dist/styles.css";

//commented out scroll logic to handle scrolling with touchpad vs mouse (broken) - tracy and sanjana

//import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu";

//type scrollVisibilityApiType = React.ContextType<typeof VisibilityContext>;

// function onWheel(apiObj: scrollVisibilityApiType, ev: React.WheelEvent): void {
//   const isThouchpad = Math.abs(ev.deltaX) !== 0 || Math.abs(ev.deltaY) < 15;

//   //var isTouchPad = ev.wheelDeltaY ? ev.wheelDeltaY === -3 * ev.deltaY : ev.deltaMode === 0

//   if (isThouchpad) {
//     ev.stopPropagation();
//     return;
//   }

//   if (ev.deltaY < 0) {
//     apiObj.scrollNext();
//   } else if (ev.deltaY > 0) {
//     apiObj.scrollPrev();
//   }
// }

// const preventDefault = (ev: Event) => {
//   if (ev.preventDefault) {
//     ev.preventDefault();
//   }
//   ev.returnValue = false;
// };

// const enableBodyScroll = () => {
//   document && document.removeEventListener("wheel", preventDefault, false);
// };
// const disableBodyScroll = () => {
//   document &&
//     document.addEventListener("wheel", preventDefault, {
//       passive: false,
//     });
// };

// function usePreventBodyScroll() {
//   const [hidden, setHidden] = React.useState(false);

//   React.useEffect(() => {
//     hidden ? disableBodyScroll() : enableBodyScroll();

//     return enableBodyScroll;
//   }, [hidden]);

//   const disableScroll = React.useCallback(() => setHidden(true), []);
//   const enableScroll = React.useCallback(() => setHidden(false), []);
//   return { disableScroll, enableScroll };
// }

const ProjectCard = () => {
  return (
    <div className="inline-block pr-8">
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

const ProjectGallery = () => {
  // filler items before we have actual projects to fill in
  const items = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isMouse, setIsMouse] = useState(true);

  //commented out scroll logic to handle scrolling with touchpad vs mouse (broken) - tracy and sanjana

  // const { disableScroll, enableScroll } = usePreventBodyScroll();

  // useEffect(() => {
  //   const handleWheel = (event: WheelEvent) => {
  //     if (event.deltaY) {
  //       if (Math.abs(event.deltaY) < 15) {
  //         setIsTrackpad(true);
  //       }
  //       // } else {
  //       //   setIsTrackpad(false);
  //       // }
  //     }

  //     if (scrollContainerRef.current) {
  //       event.preventDefault();
  //       const scrollAmount = isTrackpad ? event.deltaY : event.deltaY * 3;
  //       scrollContainerRef.current.scrollLeft += scrollAmount;
  //     }
  //   };

  //   const container = scrollContainerRef.current;
  //   if (container) {
  //     container.addEventListener("wheel", handleWheel);
  //   }

  //   return () => {
  //     if (container) {
  //       container.removeEventListener("wheel", handleWheel);
  //     }
  //   };
  // }, [isTrackpad]);

  const handleWheelScroll = useCallback((event: WheelEvent) => {
    if (scrollContainerRef.current) {
      if (event.deltaMode !== 0) {
        // Use customized horizontal scroll only for mouse wheel
        //event.preventDefault();
        setIsMouse(true);
        event.preventDefault();
        scrollContainerRef.current.scrollLeft += event.deltaY * 500;
      }
    }
  }, []);

  useEffect(() => {
    if (isMouse) {
      const container = scrollContainerRef.current;
      container?.addEventListener("wheel", handleWheelScroll);

      return () => {
        container?.removeEventListener("wheel", handleWheelScroll);
      };
    }
  }, [isMouse, handleWheelScroll]);

  return (
    <div className="pb-32">
      <h2 className="font-righteous m-16 text-4xl text-good-dog-pale-yellow">
        Project Gallery:
      </h2>
      <div
        style={{ scrollbarWidth: "none" }}
        className="scroll-container overflow-x-auto overflow-y-hidden scroll-smooth whitespace-nowrap"
        ref={scrollContainerRef}
      >
        {items.map((index) => (
          <div
            key={index}
            className="inline-block"
            style={{
              marginLeft: index === 0 ? "4rem" : "0",
            }}
          >
            <ProjectCard />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectGallery;
