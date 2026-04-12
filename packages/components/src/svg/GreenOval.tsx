import type { ReactNode } from "react";

interface GreenOvalProps {
  children?: ReactNode;
  className?: string;
  overlayClassName?: string;
}

export default function GreenOval({
  children,
  className,
  overlayClassName,
}: GreenOvalProps) {
  const rootClassName = ["relative w-full", className]
    .filter(Boolean)
    .join(" ");
  const contentClassName = ["relative z-10", overlayClassName]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootClassName}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        viewBox="0 0 1440 949"
        fill="none"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 -z-0 block hidden h-full w-full lg:block"
        aria-hidden="true"
      >
        <path
          d="M1710 260C1710 403.646 1267.43 520 721.5 520C175.567 520 -267 403.646 -267 260C-267 116.354 175.567 0 721.5 0C1267.43 0 1710 116.354 1710 260Z"
          fill="#098465"
        />
        <path
          d="M1711 689C1711 832.646 1268.43 949 722.5 949C176.567 949 -266 832.646 -266 689C-266 545.354 176.567 429 722.5 429C1268.43 429 1711 545.354 1711 689Z"
          fill="#098465"
        />
        <path
          d="M-59.1709 104.539H1494.83V840.539H-59.1709V104.539Z"
          fill="#098465"
        />
      </svg>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        viewBox="0 0 1440 949"
        fill="none"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 -z-0 block h-full w-full lg:hidden"
        aria-hidden="true"
      >
        <path
          d="M1710 165C1710 237.514 1267.43 290 721.5 290C175.567 290 -267 237.514 -267 165C-267 92.486 175.567 40 721.5 40C1267.43 40 1710 92.486 1710 165Z"
          fill="#098465"
        />
        <path
          d="M1711 784C1711 856.514 1268.43 909 722.5 909C176.567 909 -266 856.514 -266 784C-266 711.486 176.567 659 722.5 659C1268.43 659 1711 711.486 1711 784Z"
          fill="#098465"
        />
        <path
          d="M-59.1709 104.539H1494.83V840.539H-59.1709V104.539Z"
          fill="#098465"
        />
      </svg>

      {children ? <div className={contentClassName}>{children}</div> : null}
    </div>
  );
}
