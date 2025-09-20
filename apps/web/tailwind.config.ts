import type { Config } from "tailwindcss";

import baseConfig from "@good-dog/tailwind/web";

export default {
  // We need to append the path to the UI package to the content array so that
  // those classes are included correctly.
  content: [
    ...baseConfig.content,
    "../../packages/ui/shad/**/*.{ts,tsx}",
    "../../packages/components/src/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
  ],
  presets: [baseConfig],
  plugins: [require("tailwindcss-animate")],
  safelist: [
    "bg-good-dog-violet",
    "text-good-dog-violet",
    "text-good-dog-pale-yellow",
    "text-good-dog-celadon",
  ],
} satisfies Config;
