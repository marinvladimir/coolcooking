import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardDetails,
  CardImage,
  CardTitle,
  ClockIcon,
  CookingTime,
  IngredientItem,
  Ingredients,
} from '../styles/ComponentStyles';

const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  setSelectedRecipe,
}) => {
  const openRecipeModal = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
  };

  return (
    <Card key={recipe.id} onClick={() => openRecipeModal(recipe)}>
      <CardImage loading="lazy" src={recipe.image} alt={recipe.title} />
      <CardContent>
        <CardTitle>{recipe.title}</CardTitle>
        <CardDescription>{recipe.description}</CardDescription>
        <CardDetails>
          <Ingredients>
            {recipe.ingredients.map((ingredient, index) => (
              <IngredientItem key={index}>
                <img
                  style={{ width: '24px' }}
                  loading="lazy"
                  src={`/assets/icons/${ingredient.toLowerCase()}.png`}
                />
                {ingredient}
              </IngredientItem>
            ))}
          </Ingredients>
          <ClockIcon src={'/icons/clockk.png'} />
          <CookingTime>{recipe.cooking_time + ' minutes'}</CookingTime>
        </CardDetails>
      </CardContent>
    </Card>
  );
};

export default RecipeCard;
