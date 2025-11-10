import { trpc } from "@good-dog/trpc/client";

interface ProfileIconProps {
  color: "light" | "dark";
  size?: number;
}

export default function ProfileIcon({ color, size }: ProfileIconProps) {
  const circleSize = size ? size : 48;
  const userQuery = trpc.user.useSuspenseQuery();
  const user = userQuery[0];
  const letter = user?.firstName.substring(0, 1);

  return (
    <div className="w-full h-full relative flex items-center justify-center">
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
