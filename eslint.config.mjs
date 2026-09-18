import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Scoped exception: admin pages and client sections load data on mount
  // via `useEffect(() => { void load(); }, [])`. Every setState inside
  // `load` runs after an `await`, so the sync-flag is a false positive
  // here. Refactors to server components should remove the need for this.
  {
    files: [
      "app/admin/**/page.tsx",
      "app/admin/AdminShell.tsx",
      "app/login/page.tsx",
      "app/profile/page.tsx",
      "components/TestimonialCard.tsx",
      "hooks/useSupabaseQuery.ts",
    ],
    rules: {
      "react-hooks/set-state-in-effect": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
