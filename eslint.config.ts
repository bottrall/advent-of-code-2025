import js from "@eslint/js";
import prettier from "eslint-config-prettier/flat";
import unicorn from "eslint-plugin-unicorn";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.node },
  },
  prettier,
  tseslint.configs.recommended,
  unicorn.configs.recommended,
  {
    rules: {
      "@typescript-eslint/consistent-type-imports": "error",
      eqeqeq: ["error", "always"],
      "func-style": ["error", "declaration"],
      curly: "error",
      "no-implicit-coercion": "error",
      "object-shorthand": "error",
      "prefer-object-spread": "error",
      "prefer-template": "error",
    },
  },
]);
