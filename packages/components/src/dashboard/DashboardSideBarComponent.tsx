"use client";

import Link from "next/link";
import clsx from "clsx";

interface DashboardSideBarComponentProps {
  name: "Songs" | "Projects" | "Users";
  curPage: "songs" | "projects" | "users";
}

export default function DashboardSideBarComponent({
  name,
  curPage,
}: DashboardSideBarComponentProps) {
  return (
    <Link
      href={`/dashboard/${name.toLowerCase()}`}
      className={clsx(
        "flex h-[50px] w-[200px] items-center rounded-xl pl-[10px]",
        {
          "bg-[#F6F8FA]": curPage !== name.toLowerCase(),
          "bg-[#D7D8D9]": curPage === name.toLowerCase(),
        },
      )}
    >
      {name === "Songs" && (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="vuesax/bold/music">
            <g id="music">
              <path
                id="Vector"
                d="M20.8899 5.18056V16.4806C20.8899 18.4606 19.2799 20.0706 17.2999 20.0706C15.3299 20.0706 13.7099 18.4606 13.7099 16.4806C13.7099 14.5106 15.3299 12.9006 17.2999 12.9006C18.1399 12.9006 18.8899 13.1906 19.4999 13.6706V7.72056L10.2899 10.3406V18.4106C10.2899 20.3906 8.66986 22.0006 6.69986 22.0006C4.71986 22.0006 3.10986 20.3906 3.10986 18.4106C3.10986 16.4406 4.71986 14.8306 6.69986 14.8306C7.52986 14.8306 8.27986 15.1206 8.88986 15.5906V6.75056C8.88986 5.28056 9.77986 4.14056 11.1899 3.76056L16.9699 2.18056C18.1399 1.86056 19.1299 1.97056 19.8299 2.51056C20.5399 3.04056 20.8899 3.94056 20.8899 5.18056Z"
                fill="#A3A3A3"
              />
            </g>
          </g>
        </svg>
      )}
      {name === "Projects" && (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="vuesax/bold/play-circle">
            <g id="play-circle">
              <path
                id="Vector"
                d="M11.9702 2C6.45021 2 1.97021 6.48 1.97021 12C1.97021 17.52 6.45021 22 11.9702 22C17.4902 22 21.9702 17.52 21.9702 12C21.9702 6.48 17.5002 2 11.9702 2ZM14.9702 14.23L12.0702 15.9C11.7102 16.11 11.3102 16.21 10.9202 16.21C10.5202 16.21 10.1302 16.11 9.77022 15.9C9.05021 15.48 8.62021 14.74 8.62021 13.9V10.55C8.62021 9.72 9.05021 8.97 9.77022 8.55C10.4902 8.13 11.3502 8.13 12.0802 8.55L14.9802 10.22C15.7002 10.64 16.1302 11.38 16.1302 12.22C16.1302 13.06 15.7002 13.81 14.9702 14.23Z"
                fill="#A3A3A3"
              />
            </g>
          </g>
        </svg>
      )}
      {name === "Users" && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M16.0253 20.5713L16.0256 17.3576C16.0258 15.5824 14.5867 14.1432 12.8115 14.1432H5.61432C3.83939 14.1432 2.40046 15.582 2.40026 17.3569L2.3999 20.5713M21.5996 20.5715L21.5999 17.3577C21.6001 15.5825 20.161 14.1434 18.3858 14.1434M15.4062 4.06109C16.1955 4.64673 16.7071 5.58559 16.7071 6.64392C16.7071 7.70225 16.1955 8.6411 15.4062 9.22674M12.4937 6.64374C12.4937 8.41882 11.0547 9.8578 9.27964 9.8578C7.50457 9.8578 6.06559 8.41882 6.06559 6.64374C6.06559 4.86867 7.50457 3.42969 9.27964 3.42969C11.0547 3.42969 12.4937 4.86867 12.4937 6.64374Z"
            stroke="#A3A3A3"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
      <div className="font-afacad pl-[10px] text-lg font-normal text-black">
        {name}
      </div>
    </Link>
  );
}
