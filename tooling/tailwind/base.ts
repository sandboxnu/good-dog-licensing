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
      spacing: {
        "placeholder-sep": "8px",
        "label-input-sep": "8px",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
        righteous: ["Righteous"],
      },
      fontSize: {
        "10xl": "150px",
        "7xl": "72px",
        "base-input": "16px",
        "base-label": "16px",
        "base-helper": "14px",
        "sign-up-header": "35px",
      },
      height: {
        "base-input": "32px",
        textarea: "80px",
        "sign-up-widget": "584px",
      },
      colors: {
        // OLD FALL '24 COLORS, CAN BE REMOVED LATER
        "good-dog-violet": "#0D0039",
        "good-dog-teal": "#538687",
        "good-dog-pale-yellow": "#F6F8DE",
        "good-dog-celadon": "#ACDD92",
        "good-dog-orange": "#EF946C",
        "good-dog-purple": "#574AE2",

        // NEW COLORS
        "label-black": "#171717",
        "input-black": "#2E2E2E",
        error: "#B13433",
        placeholder: "#ADADAD",
        "inactive-border": "#858585",
        "hover-border": "#404040",
        "active-border": "#098465",
        "error-border": "#B13433",
        "required-star": "#FF3B30",
        checkbox: "#07634C",
        radio: "#07634C",
        "sign-up-widget": "#FFFBF6",

        // BASE CONFIG
        border: "hsl(var(--border))",
        input: {
          DEFAULT: "hsl(var(--input))",
          background: "hsl(var(--input-background))",
        },
        ring: "hsl(var(--ring))",
        background: {
          DEFAULT: "hsl(var(--background))",
          muted: "hsl(var(--background-muted))",
        },
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      boxShadow: {
        "active-shadow": "0 0 3px 0 var(--pine-200, #4C8B79)",
        "error-shadow": "0 0 3px 0 var(--Red-100, #FF9D97)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "base-input": "8px",
        "sign-up-widget": "16px",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
} satisfies Config;
