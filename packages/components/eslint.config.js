import baseConfig from "@good-dog/eslint/base";
import reactConfig from "@good-dog/eslint/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [],
  },
  ...baseConfig,
  ...reactConfig,
];