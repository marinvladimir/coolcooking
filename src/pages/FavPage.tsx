import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';
import CookingTimeline from '../components/CookingTimeline';
import CountdownTimer from '../components/CountdownTimer';
import { StarIcon } from '../icons/icons';

const Content = styled.main`
  flex: 1;
  padding: 3rem;
  text-align: center;

  @media (max-width: 768px) {
    padding: 1.5rem 0;
  }

  h1 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: ${(props) => props.theme.colors.accent};
  }
`;

const fadeIn = keyframes`
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const RecipeWrapper = styled.section`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  gap: 2rem;
  margin-top: 3rem;
  padding: 2rem;
  border-radius: 8px;
  animation: ${fadeIn} 1s ease-out;
  background-color: ${(props) => props.theme.colors.lightBackground};
`;

const Card = styled.div`
  width: 280px;
  background-color: ${(props) => props.theme.colors.background};
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s;
  cursor: pointer;

  ::-webkit-scrollbar-track {
    background: ${(props) => props.theme.colors.lightBackground};
  }

  &:hover {
    transform: translateY(-10px);
  }
`;

const CardImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: contain;
  padding: 1rem;
`;

const CardContent = styled.div`
  padding: 1rem;
`;

const CardTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: ${(props) => props.theme.colors.primary};
`;

const CardDescription = styled.p`
  font-size: 0.75rem;
  height: 3.75rem;
  overflow: overlay;
  text-overflow: ellipsis;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding-bottom: 1rem;
`;

const Modal = styled.div<{ $isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  opacity: 0;
  pointer-events: none;
  transition:
    opacity 0.3s,
    pointer-events 0s 0.3s;

  ${(props) =>
    props.$isVisible &&
    `
    opacity: 1;
    pointer-events: auto;
  `}
`;

const ModalContent = styled.div`
  background-color: ${(props) => props.theme.colors.background};
  padding: 2rem;
  border-radius: 10px;
  max-width: 800px;
  width: 100%;
  animation: expand 0.3s ease-out;

  @keyframes expand {
    0% {
      transform: scale(0);
    }
    100% {
      transform: scale(1);
    }
  }
`;

const ModalImage = styled.img`
  width: 100%;
  height: 300px;
  object-fit: contain;
`;

const ModalTitle = styled.h2`
  font-size: 2rem;
  color: ${(props) => props.theme.colors.primary};
  margin-top: 1rem;
`;

const ModalDescription = styled.p`
  font-size: 1rem;
  color: ${(props) => props.theme.colors.text};
  margin-top: 1rem;
`;

const ModalIngredients = styled.ul`
  margin-top: 1rem;
  padding: 0;
  list-style: none;
`;

const ModalCookingTime = styled.p`
  font-size: 1rem;
  color: ${(props) => props.theme.colors.accent};
  margin: 1rem 0 0 0;
`;

const Ingredients = styled.ul`
  height: 3.25rem;
  overflow: overlay;
  text-overflow: ellipsis;
  list-style: none;
  padding: 0;
  margin: 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
`;

const CookingTime = styled.p`
  font-size: 0.8rem;
  margin: 0.5rem 0;
  color: ${(props) => props.theme.colors.accent};
`;

const CardDetails = styled.div`
  font-size: 0.9rem;
  color: ${(props) => props.theme.colors.text};
  padding-top: 1rem;
`;

const IngredientItem = styled.li`
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.colors.text};
`;

const ClockIcon = styled.img`
  width: 48px;
  border-radius: 8px;
  background: ${(props) => props.theme.colors.primary};
  box-shadow: 0 1px 3px rgba(255, 255, 255, 0.1);
`;

const OpenModalButton = styled.button<{ theme: string }>`
  background-color: ${(props) => props.theme.colors.accent};
  color: ${(props) => props.theme.colors.background};
  padding: 12px 24px;
  border: none;
  font-weight: 700;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition:
    background-color 0.3s,
    transform 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    transform: scale(1.05);
  }

  &:focus {
    outline: none;
  }
`;

const FavPage: React.FC = () => {
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

  const [favorites, setFavorites] = useState<Recipe[]>([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await api.get('/favorites');
        setFavorites(response.data.favorites);
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };

    fetchFavorites();
  }, []);

  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const openRecipeModal = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
  };

  const [hasStarted, setHasStarted] = useState(false);

  const closeRecipeModal = () => {
    setSelectedRecipe(null);
    setHasStarted(false);
  };

  const removeFavorite = async (recipeId: number) => {
    try {
      const response = await api.delete(`/favorites/${recipeId}`);
      if (response.status === 200) {
        setFavorites((prevFavorites) =>
          prevFavorites.filter((recipe) => recipe.id !== recipeId)
        );
        closeRecipeModal();
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  return (
    <Content>
      <h1>Your Favorite Recipes</h1>
      <p>Favorites</p>
      {favorites?.length > 0 && (
        <RecipeWrapper>
          {favorites?.map((recipe) => (
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
          ))}

          {selectedRecipe && (
            <Modal onClick={closeRecipeModal} $isVisible={!!selectedRecipe}>
              <ModalContent onClick={(e) => e.stopPropagation()}>
                <ModalImage
                  src={selectedRecipe.image}
                  alt={selectedRecipe.title}
                />

                <ToggleWrapper
                  onClick={() => removeFavorite(selectedRecipe.id)}
                >
                  Remove from Favorites
                  <SvgWrapper>
                    <StarIcon />
                  </SvgWrapper>
                </ToggleWrapper>
                <ModalTitle>{selectedRecipe.title}</ModalTitle>
                <ModalDescription>
                  {selectedRecipe.description}
                </ModalDescription>
                <ModalIngredients>
                  {selectedRecipe.ingredients.map((ingredient, index) => (
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
                    <CountdownTimer
                      initialTime={Number(selectedRecipe.cooking_time) * 60}
                    />
                    <CookingTimeline
                      category={selectedRecipe.category as RecipeCategory}
                      cookingTime={Number(selectedRecipe.cooking_time) * 60}
                    />
                  </>
                ) : (
                  <ModalCookingTime>
                    Cooking Time: {selectedRecipe.cooking_time + ' minutes'}
                  </ModalCookingTime>
                )}
              </ModalContent>
            </Modal>
          )}
        </RecipeWrapper>
      )}
    </Content>
  );
};

const ToggleWrapper = styled.button`
  border: none;
  background: unset;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease-in-out;
  margin: 0 auto;

  &:hover {
    background-color: ${({ theme }) => theme.colors.lightBackground};
  }

  span {
    margin-left: 8px;
    color: ${({ theme }) => theme.colors.accent};
  }
`;

const SvgWrapper = styled.div`
  margin-right: -0.5rem;
  svg {
    width: 24px;
    fill: ${({ theme }) => theme.colors.accent};
  }

  &:hover svg {
    fill: ${({ theme }) => theme.colors.primary};
  }
`;

export default FavPage;
