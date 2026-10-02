import js from "@eslint/js"
import { plugin as shadcn } from "@shadcn/lint"
import tsParser from "@typescript-eslint/parser"
import reactHooks from "eslint-plugin-react-hooks"
import { defineConfig, globalIgnores } from "eslint/config"
import globals from "globals"
import tseslint from "typescript-eslint"

// Design-system policy. Pages compose components and may only place them (layout);
// appearance lives in src/components/ui as variants and sizes. Containers whose padding
// belongs to the page accept spacing. See DESIGN.md for the reasoning and exceptions.
const design = {
  "shadcn/no-restyle": [
    "error",
    {
      allow: ["layout"],
      contracts: [
        { pattern: "^Card$|(Content|Header|Footer|Group|Panel|Body)$", allow: ["layout", "spacing"] },
        { pattern: "^(TableHead|TableCell)$", allow: ["layout", "spacing", "typography"] },
        { pattern: "^Avatar$", allow: ["layout", "size-*"] },
        { pattern: "^(Skeleton|Spinner)$", allow: ["layout", "size-*", "rounded-*", "h-*", "w-*"] },
      ],
    },
  ],
  "shadcn/no-raw-colors": "error",
  "shadcn/no-arbitrary-values": ["error", { allow: ["layout"] }],
  "shadcn/no-inline-styles": "error",
  "shadcn/no-unknown-classes": "error",
  "shadcn/require-static-classes": "error",
}

export default defineConfig([
  globalIgnores(["dist", "public/r"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [js.configs.recommended, tseslint.configs.recommended, reactHooks.configs.flat.recommended],
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: globals.browser,
    },
    plugins: { shadcn },
    settings: { shadcn: { note: "See DESIGN.md for the design rules and approved exceptions." } },
    rules: design,
  },
  // Components own their appearance and may need structural values such as ring-[3px].
  {
    files: ["src/components/ui/**"],
    rules: {
      "shadcn/no-restyle": "off",
      "shadcn/no-arbitrary-values": "off",
      "shadcn/require-static-classes": "off",
    },
  },
])
