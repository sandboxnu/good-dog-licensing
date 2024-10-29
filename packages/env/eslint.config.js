import baseConfig from "@good-dog/eslint/base";

/** @type {import('typescript-eslint').Config} */

export default [
  ...baseConfig,
  {
    rules: {
      "no-restricted-properties": "off",
    },
  },
];
