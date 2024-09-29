import reactPlugin from "eslint-plugin-react";
import hooksPlugin from "eslint-plugin-react-hooks";

/** @type {Awaited<import('typescript-eslint').Config>} */
export default [
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      react: reactPlugin,
      "react-hooks": hooksPlugin,
    },
    rules: {
      ...reactPlugin.configs["jsx-runtime"].rules,
      ...hooksPlugin.configs.recommended.rules,
      "no-restricted-imports": [
        "error",
        {
          name: "react",
          importNames: ["cache"],
          message:
            "Use `import React from 'React` instead to ensure the module can be mocked during testing",
        },
      ],
    },
    languageOptions: {
      globals: {
        React: "writable",
      },
    },
  },
];
