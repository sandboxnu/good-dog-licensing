import MediaMakerPanelItem from "./MediaMakerPanelItem";
import MusicianPanelItem from "./MusicianPanelItem";

interface LandingPagePanelProps {
  type: "MUSICIAN" | "MEDIA_MAKER";
}

export default function LandingPagePanel({ type }: LandingPagePanelProps) {
  return (
    <div className="relative h-[350px] w-[553px]">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="553"
        height="350"
        viewBox="0 0 553 350"
        fill="none"
      >
        <g filter="url(#filter0_f_4871_1091)">
          <path
            d="M30 40C30 34.4772 34.4772 30 40 30H513C518.523 30 523 34.4772 523 40V310C523 315.523 518.523 320 513 320H40C34.4772 320 30 315.523 30 310V40Z"
            fill="url(#paint0_linear_4871_1091)"
          />
        </g>
        <defs>
          <filter
            id="filter0_f_4871_1091"
            x="0"
            y="0"
            width="553"
            height="350"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="15"
              result="effect1_foregroundBlur_4871_1091"
            />
          </filter>
          <linearGradient
            id="paint0_linear_4871_1091"
            x1="276.5"
            y1="30"
            x2="276.5"
            y2="320"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.11" stopColor="#03BC92" />
            <stop offset="0.61" stopColor="#06A07C" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center">
        {type === "MUSICIAN" ? <MusicianPanelItem /> : <MediaMakerPanelItem />}
      </div>
    </div>
  );
}
