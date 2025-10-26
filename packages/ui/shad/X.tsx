interface XProps {
  variant?: "standard" | "hover" | "inactive" | "round_standard" | "round_hover" | "round_inactive";
}

export default function X({ variant }: XProps) {
  const COLOR_BY_VARIANT: Record<NonNullable<XProps["variant"]>, string> = {
    standard: "#07634C",
    hover: "#D3F4E2",
    inactive: "#5C5C5C",
    round_standard: "#07634C",
    round_hover: "#D3F4E2",
    round_inactive: "#5C5C5C",
  };

  const color = COLOR_BY_VARIANT[variant ?? "standard"];

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        d="M4.57745 3.43499C4.26495 3.12249 3.75745 3.12249 3.44495 3.43499C3.13245 3.74749 3.13245 4.25499 3.44495 4.56749L6.87995 7.99999L3.44745 11.435C3.13495 11.7475 3.13495 12.255 3.44745 12.5675C3.75995 12.88 4.26745 12.88 4.57995 12.5675L8.01245 9.13249L11.4474 12.565C11.7599 12.8775 12.2674 12.8775 12.5799 12.565C12.8924 12.2525 12.8924 11.745 12.5799 11.4325L9.14495 7.99999L12.5774 4.565C12.8899 4.2525 12.8899 3.745 12.5774 3.4325C12.2649 3.12 11.7574 3.12 11.4449 3.4325L8.01245 6.8675L4.57745 3.43499Z"
        fill={color}
      />
    </svg>
  );
}
