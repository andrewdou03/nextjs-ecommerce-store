// eslint.config.mjs
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const compat = new FlatCompat({ baseDirectory: __dirname });

export default [
  // ⬅️ make sure this block is FIRST
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      // prisma generated client (both historical locations)
      "src/lib/generated/prisma/**",
      "lib/generated/prisma/**",
      // optional: skip schema dir too
      "prisma/**",
      "dist/**",
      "build/**",
    ],
  },

  // keep your existing presets
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // ensure TS rules don't run on plain .js files (like generated prisma files)
  {
    files: ["**/*.js", "**/*.jsx"],
    rules: {
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-this-alias": "off",
    },
  },
];
