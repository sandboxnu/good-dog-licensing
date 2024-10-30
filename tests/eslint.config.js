import baseConfig from "@good-dog/eslint/base";
import nextjsConfig from "@good-dog/eslint/nextjs";
import reactConfig from "@good-dog/eslint/react";

/** @type {import('typescript-eslint').Config} */
export default [
  ...baseConfig,
  ...nextjsConfig,
  ...reactConfig,
  {
    ignores: [],
    rules: {
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
    },
  },
];
