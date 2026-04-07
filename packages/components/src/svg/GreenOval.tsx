interface ContributorsBackgroundProps {
  className?: string;
}

export default function GreenOval({ className }: ContributorsBackgroundProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="949"
      viewBox="0 0 1440 949"
      preserveAspectRatio="none"
      className={className}
    >
      <path
        d="M1710 332.5C1710 516.135 1267.43 665 721.5 665C175.567 665 -267 516.135 -267 332.5C-267 148.865 175.567 -1.56364e-05 721.5 -1.56364e-05C1267.43 -1.56364e-05 1710 148.865 1710 332.5Z"
        fill="#098465"
      />
      <path
        d="M1711 616.5C1711 800.135 1268.43 949 722.5 949C176.567 949 -266 800.135 -266 616.5C-266 432.865 176.567 284 722.5 284C1268.43 284 1711 432.865 1711 616.5Z"
        fill="#098465"
      />
      <path
        d="M-59.1709 104.539H1494.83V840.539H-59.1709V104.539Z"
        fill="#098465"
      />
    </svg>
  );
}
