export const THEME_OPTIONS = ["system", "light", "dark"] as const;
export const ACCENT_OPTIONS = ["verde", "azul", "roxo", "terracota", "grafite"] as const;
export const HEADING_OPTIONS = ["divertido", "neutro"] as const;

export type ThemePreference = (typeof THEME_OPTIONS)[number];
export type AccentTheme = (typeof ACCENT_OPTIONS)[number];
export type HeadingStyle = (typeof HEADING_OPTIONS)[number];

export const ACCENT_LABELS: Record<AccentTheme, string> = {
  verde: "Verde",
  azul: "Azul",
  roxo: "Roxo",
  terracota: "Terracota",
  grafite: "Grafite",
};

export type Preferences = {
  theme_preference: ThemePreference;
  accent_theme: AccentTheme;
  heading_style: HeadingStyle;
};

export function normalizePreferences(raw: {
  theme_preference?: string | null;
  accent_theme?: string | null;
  heading_style?: string | null;
}): Preferences {
  return {
    theme_preference: THEME_OPTIONS.includes(raw.theme_preference as ThemePreference)
      ? (raw.theme_preference as ThemePreference)
      : "system",
    accent_theme: ACCENT_OPTIONS.includes(raw.accent_theme as AccentTheme)
      ? (raw.accent_theme as AccentTheme)
      : "verde",
    heading_style: HEADING_OPTIONS.includes(raw.heading_style as HeadingStyle)
      ? (raw.heading_style as HeadingStyle)
      : "divertido",
  };
}
