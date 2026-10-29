import type { CategoryFilter } from '../types';

const base = {
  background: '#faf6f0',
  surface: '#ffffff',
  surfaceAlt: '#f3ece2',
  text: '#2a211b',
  textMuted: '#6b5f55',
  border: '#e6dbcd',
  success: '#15803d',
  error: '#b91c1c',
  overlay: 'rgba(28, 20, 14, 0.55)',
};

// Every category shares the same neutral base and only swaps its accent,
// so the site keeps one consistent look while still reflecting the category.
const accents: Record<
  CategoryFilter,
  { primary: string; primaryDark: string; primarySoft: string }
> = {
  all: { primary: '#c2410c', primaryDark: '#9a3412', primarySoft: '#fdeadf' },
  mainDishes: {
    primary: '#c2410c',
    primaryDark: '#9a3412',
    primarySoft: '#fdeadf',
  },
  soups: { primary: '#b45309', primaryDark: '#92400e', primarySoft: '#fdf1d8' },
  salads: {
    primary: '#3f7d20',
    primaryDark: '#2f5f17',
    primarySoft: '#e6f2dc',
  },
  desserts: {
    primary: '#be185d',
    primaryDark: '#9d174d',
    primarySoft: '#fce5ef',
  },
  drinks: {
    primary: '#0369a1',
    primaryDark: '#075985',
    primarySoft: '#e0f0fa',
  },
};

const makeTheme = (category: CategoryFilter) => ({
  colors: { ...base, ...accents[category] },
  fonts: {
    heading: "'Playfair Display', Georgia, serif",
    body: "'Raleway', system-ui, -apple-system, 'Segoe UI', sans-serif",
  },
  radius: { sm: '8px', md: '12px', lg: '20px', pill: '999px' },
  shadow: {
    sm: '0 1px 2px rgba(42, 33, 27, 0.06), 0 1px 3px rgba(42, 33, 27, 0.08)',
    md: '0 4px 12px rgba(42, 33, 27, 0.08), 0 2px 4px rgba(42, 33, 27, 0.05)',
    lg: '0 24px 48px rgba(42, 33, 27, 0.18)',
  },
  breakpoints: { sm: '600px', md: '900px' },
});

export type AppTheme = ReturnType<typeof makeTheme>;

export const themes = Object.fromEntries(
  (Object.keys(accents) as CategoryFilter[]).map((key) => [key, makeTheme(key)])
) as Record<CategoryFilter, AppTheme>;
