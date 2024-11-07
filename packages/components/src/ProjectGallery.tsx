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
    <div style={{ display: "inline-block", paddingRight: "2rem" }}>
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
  const getItems = () => Array(10).fill(0);
  const [items, setItems] = useState(getItems);
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
    <div style={{ paddingBottom: "8rem" }}>
      <h2
        className="font-righteous text-good-dog-pale-yellow"
        style={{ fontSize: "40px", margin: "4rem" }}
      >
        Project Gallery:
      </h2>
      <div
        className="scroll-container scroll-smooth"
        style={{
          overflowY: "hidden",
          overflowX: "scroll",
          whiteSpace: "nowrap",
          scrollbarWidth: "none",
        }}
        ref={scrollContainerRef}
      >
        {items.map((index) => (
          <div
            key={index}
            style={{
              display: "inline-block",
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
