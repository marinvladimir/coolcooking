import React, { useEffect, useState } from 'react';
import {
  IngredientItem,
  Modal,
  ModalContent,
  ModalCookingTime,
  ModalDescription,
  ModalImage,
  ModalIngredients,
  ModalTitle,
  OpenModalButton,
  SvgWrapper,
  ToggleWrapper,
} from '../styles/ComponentStyles';
import CountdownTimer from './CountdownTimer';
import CookingTimeline from './CookingTimeline';
import { StarIcon } from '../icons/icons';
import axios from 'axios';
import { useTheme } from '../states/ThemeContext';
const { isLoggedIn } = useAuth();
import { apiService } from '../api/api';
import { useAuth } from '../states/AuthContext';

const CurrentRecipeModal: React.FC<CurrentRecipeModalProps> = ({
  recipe,
  setRecipe,
  hasStarted,
  setHasStarted,
}) => {
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const { category } = useTheme();

  const api = axios.create({
    baseURL: 'http://localhost:3000',
  });

  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    if (recipe && isLoggedIn) {
      checkIfFavorite(recipe.id);
    }
  }, [recipe]);

  const closeRecipeModal = () => {
    setRecipe(null);
    setHasStarted(false);
  };

  const checkIfFavorite = async (recipeId: number) => {
    try {
      const response = await apiService.checkIfFavorite(recipeId);
      setIsFavorite(response.isFavorite);
    } catch (error) {
      console.error('Error checking if favorite:', error);
    }
  };

  const toggleFavorite = async (recipeId: number) => {
    try {
      if (isLoggedIn) {
        const updatedFavoriteStatus = await apiService.toggleFavorite(
          recipeId,
          isFavorite
        );
        setIsFavorite(!!updatedFavoriteStatus);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  return (
    <Modal onClick={closeRecipeModal} $isVisible={!!recipe}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalImage src={recipe.image} alt={recipe.title} />
        {isLoggedIn && (
          <>
            <ToggleWrapper onClick={() => toggleFavorite(recipe.id)}>
              {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              <SvgWrapper>
                <StarIcon />
              </SvgWrapper>
            </ToggleWrapper>
          </>
        )}
        <ModalTitle>{recipe.title}</ModalTitle>
        <ModalDescription>{recipe.description}</ModalDescription>
        <ModalIngredients>
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
        </ModalIngredients>
        <OpenModalButton
          style={{ marginTop: '1rem' }}
          onClick={() => setHasStarted(!hasStarted)}
        >
          {!hasStarted ? 'Start cooking?' : 'End cooking'}
        </OpenModalButton>
        {hasStarted ? (
          <>
            <CountdownTimer initialTime={Number(recipe.cooking_time) * 60} />
            <CookingTimeline
              category={category}
              cookingTime={Number(recipe.cooking_time) * 60}
            />
          </>
        ) : (
          <ModalCookingTime>
            Cooking Time: {recipe.cooking_time + ' minutes'}
          </ModalCookingTime>
        )}
      </ModalContent>
    </Modal>
  );
};

export default CurrentRecipeModal;
