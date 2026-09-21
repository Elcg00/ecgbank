import "server-only";
import { cookies } from "next/headers";
import type { Preferences } from "@/lib/preferences-shared";

export * from "@/lib/preferences-shared";

const COOKIE_NAMES = {
  theme: "theme_preference",
  accent: "accent_theme",
  heading: "heading_style",
} as const;

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

/** Persists preferences to a cookie so the root layout can render the right
 * theme/accent/heading on the very first byte, without a DB round trip on
 * every request. */
export async function setPreferenceCookies(prefs: Preferences) {
  const store = await cookies();
  store.set(COOKIE_NAMES.theme, prefs.theme_preference, { maxAge: COOKIE_MAX_AGE, path: "/" });
  store.set(COOKIE_NAMES.accent, prefs.accent_theme, { maxAge: COOKIE_MAX_AGE, path: "/" });
  store.set(COOKIE_NAMES.heading, prefs.heading_style, { maxAge: COOKIE_MAX_AGE, path: "/" });
}
