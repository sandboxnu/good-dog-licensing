import { trpc } from "@good-dog/trpc/client";
import PencilIcon from "./PencilIcon";

interface ProfileIconProps {
  color: "light" | "dark";
  size?: number;
  editable?: boolean;
  name?: string;
}

export default function ProfileIcon({
  color,
  size,
  editable,
  name,
}: ProfileIconProps) {
  const circleSize = size ? size : 48;
  const userQuery = trpc.user.useSuspenseQuery();
  const user = userQuery[0];
  const letter = name
    ? name.substring(0, 1).toUpperCase()
    : user?.firstName.substring(0, 1).toUpperCase();

  return editable ? (
    <div className="relative inline-block pr-[4.5px]">
      {/* ^ padding to account for the pencil icon */}
      <div className="relative flex items-center justify-center">
        <svg
          width={circleSize}
          height={circleSize}
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="20" cy="20" r="20" fill="url(#paint0_linear_2833_1960)" />
          <text
            x="50%"
            y="50%"
            dominantBaseline="central"
            textAnchor="middle"
            fill={color === "light" ? "#FFF" : "#1a1a1a"}
            fontSize="25"
            fontFamily="Righteous"
            fontWeight="400"
            fontStyle="normal"
          >
            {letter}
          </text>
          <defs>
            <linearGradient
              id="paint0_linear_2833_1960"
              x1="20"
              y1="-8.33333"
              x2="20"
              y2="40"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#C1E0D8" />
              <stop offset="0.400448" stopColor="#84C1B2" />
              <stop offset="1" stopColor="#098465" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <svg
        className="absolute bottom-0 right-0"
        width={(circleSize * 5) / 14}
        height={(circleSize * 5) / 14}
        viewBox="0 0 20 20"
        fill="normal"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="10"
          cy="10"
          r="10"
          fill="white"
          stroke="#404040"
          strokeWidth="0.25"
        />
        <g transform="translate(4, 4)">
          <PencilIcon />
        </g>
      </svg>
    </div>
  ) : (
    <div className="relative flex items-center justify-center">
      <svg
        width={circleSize}
        height={circleSize}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="20" cy="20" r="20" fill="url(#paint0_linear_2833_1960)" />
        <text
          x="50%"
          y="50%"
          dominantBaseline="central"
          textAnchor="middle"
          fill={color === "light" ? "#FFF" : "#1a1a1a"}
          fontSize="25"
          fontFamily="Righteous"
          fontWeight="400"
          fontStyle="normal"
        >
          {letter}
        </text>
        <defs>
          <linearGradient
            id="paint0_linear_2833_1960"
            x1="20"
            y1="-8.33333"
            x2="20"
            y2="40"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#C1E0D8" />
            <stop offset="0.400448" stopColor="#84C1B2" />
            <stop offset="1" stopColor="#098465" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
