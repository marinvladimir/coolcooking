import type { CategoryFilter, RecipeCategory } from '../types';

export const INK = '#151210';

export const palette = {
  tomato: '#ff5a36',
  mustard: '#ffc23d',
  mint: '#3fd99a',
  bubblegum: '#ff8ccf',
  sky: '#5cc8ff',
  grape: '#a58bff',
};

// Every category owns a bold accent plus a pale tint for large surfaces.
export const CATEGORY_COLORS: Record<
  RecipeCategory,
  { accent: string; soft: string }
> = {
  mainDishes: { accent: palette.tomato, soft: '#ffd8cc' },
  soups: { accent: palette.mustard, soft: '#ffecbf' },
  salads: { accent: palette.mint, soft: '#c8f5e1' },
  desserts: { accent: palette.bubblegum, soft: '#ffdcef' },
  drinks: { accent: palette.sky, soft: '#d2efff' },
};

const accents: Record<CategoryFilter, { accent: string; soft: string }> = {
  all: CATEGORY_COLORS.mainDishes,
  ...CATEGORY_COLORS,
};

const makeTheme = (category: CategoryFilter) => ({
  colors: {
    paper: '#fff3df',
    surface: '#fffdf7',
    ink: INK,
    inkSoft: '#3d3530',
    muted: '#5e544c',
    accent: accents[category].accent,
    accentSoft: accents[category].soft,
    success: '#13854a',
    error: '#d62c1a',
    overlay: 'rgba(21, 18, 16, 0.6)',
    ...palette,
  },
  fonts: {
    display: "'Bricolage Grotesque', system-ui, sans-serif",
    body: "'Bricolage Grotesque', system-ui, -apple-system, 'Segoe UI', sans-serif",
    pixel: "'Silkscreen', 'Courier New', monospace",
  },
  border: `3px solid ${INK}`,
  radius: { sm: '10px', md: '14px', lg: '22px', pill: '999px' },
  shadow: {
    sm: `3px 3px 0 ${INK}`,
    md: `5px 5px 0 ${INK}`,
    lg: `8px 8px 0 ${INK}`,
    xl: `12px 12px 0 ${INK}`,
  },
  breakpoints: { sm: '640px', md: '960px' },
});

export type AppTheme = ReturnType<typeof makeTheme>;

export const themes = Object.fromEntries(
  (Object.keys(accents) as CategoryFilter[]).map((key) => [key, makeTheme(key)])
) as Record<CategoryFilter, AppTheme>;
