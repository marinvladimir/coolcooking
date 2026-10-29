export type RecipeCategory =
  | 'mainDishes'
  | 'soups'
  | 'salads'
  | 'desserts'
  | 'drinks';

export type CategoryFilter = RecipeCategory | 'all';

export interface Recipe {
  id: number;
  title: string;
  description: string;
  category: RecipeCategory;
  ingredients: string[];
  cooking_time: string;
  image: string;
}

export interface AuthUser {
  id: number;
  username: string;
  email: string;
}

export interface NewRecipe {
  title: string;
  description: string;
  category: RecipeCategory;
  ingredients: string[];
  cooking_time: number;
}
