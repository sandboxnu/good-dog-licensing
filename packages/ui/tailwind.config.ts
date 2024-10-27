/*
 * This file is not used for any compilation purpose, it is only used
 * for Tailwind Intellisense & Autocompletion in the source files
 */
import type { Config } from "tailwindcss";

import baseConfig from "@good-dog/tailwind/web";

export default {
  content: ["./shad/**/*.{ts,tsx}"],
  presets: [baseConfig],
} satisfies Config;
