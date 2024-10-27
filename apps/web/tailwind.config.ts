import type { Config } from "tailwindcss";

import baseConfig from "@good-dog/ui/tailwind";

export default {
  // We need to append the path to the UI package to the content array so that
  // those classes are included correctly.
  content: [
    ...baseConfig.content,
    "../../packages/ui/shad/**/*.{ts,tsx}",
    "../../packages/components/src/**/*.{ts,tsx}",
  ],
  presets: [baseConfig],
  plugins: [require("tailwindcss-animate")],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
    },
  },
  safelist: [
    "bg-good-dog-violet",
    "text-good-dog-violet",
    "border-good-dog-violet",
    "ring-good-dog-violet",
  ],
} satisfies Config;
