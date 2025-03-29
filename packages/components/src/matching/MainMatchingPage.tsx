"use client";

import { trpc } from "@good-dog/trpc/client";

interface PageProps {
  sceneId: string;
}

export default function MainMatchingPage({ sceneId }: PageProps) {
  const sceneInfo = trpc.getSceneById.useSuspenseQuery({ sceneId: sceneId });
  const licensedMusic = trpc.music.useSuspenseQuery();

  return (
    <div className="flex h-screen w-screen bg-[#DEE0E2] px-[80px] py-[60px]">
      <div className="w-1/2 overflow-y-auto bg-white">
        <div className="pl-[33px] pt-[24]">
          <button className="flex">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path d="M15 6L9 12L15 18" stroke="#333333" />
            </svg>
            <div className="font-afacad text-base font-normal text-black">
              {sceneInfo[0].projectTitle}
            </div>
          </button>
        </div>
        <div className="font-afacad pl-[58px] pt-[26px] text-3xl font-semibold text-black">
          Scene
        </div>
        <div className="px-[50px] pt-[29px]">
          <div className="h-[0.5px] w-full bg-[#A3A3A3]"></div>
        </div>
        <div className="font-afacad pl-[57px] pt-[14px] text-2xl font-medium text-black">
          Scene Name
        </div>
        <div className="font-afacad pl-[57px] pt-[4px] text-lg font-normal text-black">
          {sceneInfo[0].sceneTitle}
        </div>
        <div className="px-[50px] pt-[14px]">
          <div className="h-[0.5px] w-full bg-[#A3A3A3]"></div>
        </div>
        <div className="font-afacad pl-[57px] pt-[19px] text-2xl font-medium text-black">
          Description
        </div>
        <div className="font-afacad px-[60px] pt-[5px] text-lg font-normal text-[#5F5F5F]">
          {sceneInfo[0].description}
        </div>
        <div className="font-afacad pl-[57px] pt-[32px] text-2xl font-medium text-black">
          Type of Music Needed
        </div>
        <div className="font-afacad px-[60px] pt-[5px] text-lg font-normal text-[#5F5F5F]">
          {sceneInfo[0].musicType}
        </div>
        <div className="font-afacad pl-[57px] pt-[32px] text-2xl font-medium text-black">
          Similar Types of Songs
        </div>
        <div className="font-afacad px-[60px] pt-[5px] text-lg font-normal text-[#5F5F5F]">
          {sceneInfo[0].similarSongs}
        </div>
        <div className="font-afacad pl-[57px] pt-[32px] text-2xl font-medium text-black">
          Additional Info
        </div>
        <div className="font-afacad px-[60px] pt-[5px] text-lg font-normal text-[#5F5F5F]">
          {sceneInfo[0].additionalInfo}
        </div>
      </div>
      <div className="w-1/2 bg-[#EDF3F9]">
        <div className="font-afacad pl-[60px] pt-[71px] text-3xl font-semibold text-black">
          Music
        </div>
        <div className="flex items-center pl-[58px] pt-[43px]">
          <div className="font-afacad text-2xl font-medium">Licensed Music</div>
          <div className="pl-[8px]">
            <div className="group flex items-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 18 18"
                fill="none"
              >
                <path
                  d="M9 9L9 12.375M9 6.49841V6.46875M2.25 9C2.25 5.27208 5.27208 2.25 9 2.25C12.7279 2.25 15.75 5.27208 15.75 9C15.75 12.7279 12.7279 15.75 9 15.75C5.27208 15.75 2.25 12.7279 2.25 9Z"
                  stroke="#A3A3A3"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="mt-[-20px] hidden pl-[20px] group-hover:block">
                <div className="h-[59px] w-[350px] rounded-xl bg-[#D9D9D9]">
                  test
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="pl-[60px] pt-[20px]">
          <select></select>
        </div>
      </div>
    </div>
  );
}
