"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

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
    <div className="h-[350px] w-[300px] bg-good-dog-teal-green pr-8 text-white">
      Test
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
      <div className="flex items-center pl-[100px]">
        <h2 className="font-afacad w-2/6 text-[60px] font-semibold text-white">
          Project gallery
        </h2>
        <p className="font-afacad w-4/6 pr-[130px] text-[35px] font-semibold text-good-dog-gray">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
          pharetra lacus sit Lorem
        </p>
      </div>
      <div
        style={{ scrollbarWidth: "none" }}
        className="scroll-container flex space-x-4 overflow-x-auto overflow-y-hidden scroll-smooth whitespace-nowrap pt-[70px]"
        ref={scrollContainerRef}
      >
        {items.map((index) => (
          <div key={index}>
            <ProjectCard />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectGallery;
