import { CATEGORY_LABELS, RECIPE_CATEGORIES } from '../constants/categories';
import type { RecipeCategory } from '../types';

export const ingredientIconSrc = (ingredient: string) =>
  `/assets/icons/${encodeURIComponent(ingredient.trim().toLowerCase())}.png`;

export const categoryLabel = (category: string) =>
  CATEGORY_LABELS[category as RecipeCategory] ?? category;

export const toRecipeCategory = (category: string): RecipeCategory =>
  RECIPE_CATEGORIES.includes(category as RecipeCategory)
    ? (category as RecipeCategory)
    : 'mainDishes';

export const cookingMinutes = (cookingTime: string) => {
  const minutes = Number.parseInt(cookingTime, 10);
  return Number.isFinite(minutes) && minutes > 0 ? minutes : 0;
};

export const formatMinutes = (minutes: number) => {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours} h ${rest} min` : `${hours} h`;
};

export const formatClock = (totalSeconds: number) => {
  const seconds = Math.max(0, Math.round(totalSeconds));
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const mm = String(m).padStart(2, '0');
  const ss = String(s).padStart(2, '0');
  return h ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
};
