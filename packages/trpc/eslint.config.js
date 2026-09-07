import baseConfig from "@good-dog/eslint/base";
import reactConfig from "@good-dog/eslint/react";

import requireOutputSchema from "./eslint-rules/require-output-schema.js";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    // The rule definition itself is plain JS run directly by ESLint's flat
    // config loader, not part of the TS project, so it can't go through
    // typed linting.
    ignores: ["eslint-rules/**"],
  },
  ...baseConfig,
  ...reactConfig,
  {
    files: ["src/procedures/**/*.ts"],
    plugins: {
      "good-dog-trpc": requireOutputSchema,
    },
    rules: {
      "good-dog-trpc/require-output-schema": "error",
    },
  },
];
