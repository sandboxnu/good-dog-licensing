import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
        righteous: ["Righteous"],
      },
      fontSize: {
        h1: "50px",
        h2: "40px",
        h3: "35px",
        body1: "20px",
        body2: "18px",
        body3: "16px",
        caption: "14px",
        logo: "25px",
      },
      colors: {
        "good-dog-main": "#07634C",
        "header-primary": "#022119",
        "body-primary": "#2E2E2E",
        secondary: "#054233",
        error: "#B13433",
        "required-star": "#F4392D",
        "dark-green": "#07634C",
        "off-white": "#E9F9F1",
        "light-green": "#098465",
        "main-bg-solid": "#FFFBF6",
      },
      boxShadow: {
        active: "0 0 3px 0 var(--pine-200, #4C8B79)",
        error: "0 0 3px 0 var(--Red-100, #FF9D97)",
        button: "4px 4px 0 0 var(--button-drop-shadow, #000)",
        div: "16px 12px 0px 0px var(--carddrop-shadow, #098465)",
        modal: "0 4px 4px 0 rgba(0, 0, 0, 0.25)",
      },
      backgroundImage: {
        "main-bg-gradient":
          "linear-gradient(180deg, #FFFBF6 29.69%, #E9F8EC 55.49%, #D3F4E2 96.78%)",
      },
    },
  },
} satisfies Config;
