import type { CategoryFilter, RecipeCategory } from '../types';

export const RECIPE_CATEGORIES: RecipeCategory[] = [
  'mainDishes',
  'soups',
  'salads',
  'desserts',
  'drinks',
];

export const CATEGORY_LABELS: Record<CategoryFilter, string> = {
  all: 'All recipes',
  mainDishes: 'Main dishes',
  soups: 'Soups',
  salads: 'Salads',
  desserts: 'Desserts',
  drinks: 'Drinks',
};

export const CATEGORY_IMAGES: Record<RecipeCategory, string> = {
  mainDishes: '/assets/mainMeal.png',
  soups: '/assets/soup.png',
  salads: '/assets/salads.png',
  desserts: '/assets/desserts.png',
  drinks: '/assets/drinks.png',
};

export const isCategoryFilter = (value: unknown): value is CategoryFilter =>
  value === 'all' || RECIPE_CATEGORIES.includes(value as RecipeCategory);
