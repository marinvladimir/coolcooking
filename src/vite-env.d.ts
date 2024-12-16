/// <reference types="vite/client" />

type RecipeCategory = 'soups' | 'desserts' | 'salads' | 'mainDishes' | 'drinks';

type AppWrapperProps = {
  children: ReactNode;
};

interface Recipe {
  id: number;
  title: string;
  description: string;
  category: string;
  rating: number;
  ingredients: string[];
  cooking_time: string;
  image: string;
}

interface CountdownTimerProps {
  initialTime: number;
}

interface SearchProps {
  handleSearch: (event: any) => void;
  triggered: boolean;
}

type PaginationProps = {
  list: Recipe[];
  itemsPerPage: number;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
};

type RecipeCardProps = {
  recipe: Recipe;
  setSelectedRecipe: React.Dispatch<React.SetStateAction<Recipe | null>>;
};

interface CookingStep {
  step: string;
  time: number;
}

interface Props {
  cookingTime: number;
  category: RecipeCategory;
}

type IngredientFilterModalProps = {
  closeModal: () => void;
  selectedIngredients: string[];
  setSelectedIngredients: React.Dispatch<React.SetStateAction<string[]>>;
};

type CurrentRecipeModalProps = {
  recipe: Recipe;
  setRecipe: React.Dispatch<React.SetStateAction<Recipe | null>>;
  setHasStarted: React.Dispatch<React.SetStateAction<boolean>>;
  hasStarted: boolean;
};

type RecipeFormInputs = {
  title: string;
  description: string;
  category: string;
  ingredients: string;
  cooking_time: string;
  image: FileList;
};

type AddRecipeModalProps = {
  setAnimationTriggered: (value: boolean) => void;
  setRecipes: React.Dispatch<React.SetStateAction<any[]>>;
  setIsOpen: (value: boolean) => void;
};

interface ImportMetaEnv {
  VITE_API_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
