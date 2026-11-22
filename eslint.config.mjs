import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// The pages and components whose strings are not in the dictionary yet (src/i18n):
// the long texts the translation plan moves to src/content/<page>/<lang>.tsx in
// stage 1b. Everything else must take its words from the dictionary.
const NOT_YET_IN_DICTIONARY = [
  // "*" stands for the [lang] folder: in a glob, brackets would be a character class
  "src/app/*/methodology/page.tsx",
  "src/app/*/data/page.tsx",
  "src/app/*/contact/page.tsx",
];

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // The static HTML prototype (reference only).
    "prototype/**",
  ]),
  {
    // Every link to a page goes through the Link that adds the language to the path,
    // every navigation through the router that does the same (src/i18n/navigation.ts).
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["src/components/Link.tsx", "src/i18n/navigation.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            { name: "next/link", message: "Use @/components/Link: it puts the page's language in the path." },
            {
              name: "next/navigation",
              importNames: ["useRouter", "usePathname"],
              message: "Use @/i18n/navigation: its router adds the language to a path, its pathname has none.",
            },
          ],
        },
      ],
    },
  },
  {
    // The cached readers of the database must not know the language: a "use cache"
    // function that read it would be cached once a language and the database read N
    // times (docs/audits/2026-11-21-i18n-plan-v2.md §3.1).
    files: ["src/lib/api.ts", "src/lib/tables.ts", "src/lib/matchups.ts", "src/lib/data-client.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [{ name: "next/root-params", message: "A cached reader must not depend on the language." }],
          patterns: [{ group: ["@/i18n", "@/i18n/*"], message: "A cached reader must not depend on the language." }],
        },
      ],
    },
  },
  {
    // No English in the JSX: every visible string comes from the dictionary, so that a
    // translation cannot miss one. Punctuation, signs and numbers are not words.
    files: ["src/app/**/*.tsx", "src/components/**/*.tsx"],
    ignores: NOT_YET_IN_DICTIONARY,
    rules: {
      "react/jsx-no-literals": [
        "error",
        {
          noStrings: true,
          ignoreProps: true,
          allowedStrings: ["−", "+", "%", "›", "‹", "/", "(", ")", ",", ".", ":", "–", "—", "|", "=", "×", "↑", "↓", "→", "←", "…", "#", "?", "!", "&", "+/−", "+/-", "±", "vs", "kg", "P4P", "IJF", "AJR", "GitHub", "CSV", "JSON"],
        },
      ],
    },
  },
]);

export default eslintConfig;
