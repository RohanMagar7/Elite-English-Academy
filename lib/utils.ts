/* ============================================
   ELITE ENGLISH ACADEMY
          Developer : Rohan Magar
   ============================================ */

import { clsx, type ClassValue } from "clsx";

/**
 * Merge conditional class names into a single className string.
 * The project intentionally avoids tailwind-merge; utility classes in this
 * codebase are composition-safe, so simple concatenation is sufficient.
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
