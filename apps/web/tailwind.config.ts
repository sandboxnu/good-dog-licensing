import type { Config } from "tailwindcss";

import baseConfig from "@good-dog/ui/tailwind";

export default {
  // We need to append the path to the UI package to the content array so that
  // those classes are included correctly.
  content: [...baseConfig.content, "../../packages/ui/shad/**/*.{ts,tsx}"],
  presets: [baseConfig],
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
