import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
        righteous: ["Righteous"],
      },
      fontSize: {
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
        "required-star": "#FF3B30",
      },
      boxShadow: {
        active: "0 0 3px 0 var(--pine-200, #4C8B79)",
        error: "0 0 3px 0 var(--Red-100, #FF9D97)",
        button: "4px 4px 0 0 var(--button-drop-shadow, #000)",
      },
    },
  },
} satisfies Config;
