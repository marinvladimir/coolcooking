import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import type { Recipe } from '../types';
import { apiService, getErrorMessage } from '../api/api';
import { useAuth } from '../states/contexts';
import { ClockIcon, HeartIcon, PlayIcon } from '../icons/icons';
import { Badge, Button } from '../styles/ui';
import {
  showErrorNotification,
  showSuccessNotification,
} from '../utils/notification';
import {
  categoryLabel,
  cookingMinutes,
  formatMinutes,
  toRecipeCategory,
} from '../utils/recipes';
import CookingSession from './CookingSession';
import IngredientChip from './IngredientChip';
import Modal from './Modal';
import Spinner from './Spinner';

const Media = styled.div`
  height: 300px;
  background: ${({ theme }) => theme.colors.surfaceAlt};
  border-radius: ${({ theme }) => theme.radius.lg}
    ${({ theme }) => theme.radius.lg} 0 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 1.5rem;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    height: 220px;
  }
`;

const Content = styled.div`
  padding: 1.75rem 2rem 2rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 1.25rem 1.25rem 1.5rem;
  }
`;

const MetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;

  svg {
    width: 14px;
    height: 14px;
  }
`;

const Title = styled.h2`
  font-size: clamp(1.6rem, 3vw, 2.1rem);
  margin-bottom: 0.75rem;
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  white-space: pre-line;
`;

const SectionTitle = styled.h3`
  margin: 1.5rem 0 0.75rem;
  font-size: 1.1rem;
`;

const Chips = styled.ul`
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1.75rem;
`;

const FavoriteButton = styled(Button)<{ $active: boolean }>`
  svg {
    color: ${({ $active, theme }) =>
      $active ? theme.colors.error : 'inherit'};
  }
`;

interface RecipeModalProps {
  recipe: Recipe;
  onClose: () => void;
  onFavoriteChange?: (recipeId: number, isFavorite: boolean) => void;
  initialFavorite?: boolean;
}

const RecipeModal: React.FC<RecipeModalProps> = ({
  recipe,
  onClose,
  onFavoriteChange,
  initialFavorite,
}) => {
  const { isLoggedIn } = useAuth();
  const [isFavorite, setIsFavorite] = useState(Boolean(initialFavorite));
  const [isSaving, setIsSaving] = useState(false);
  const [isCooking, setIsCooking] = useState(false);
  const minutes = cookingMinutes(recipe.cooking_time);
  const titleId = `recipe-title-${recipe.id}`;

  useEffect(() => {
    if (!isLoggedIn || initialFavorite !== undefined) return;
    let cancelled = false;
    apiService
      .checkIfFavorite(recipe.id)
      .then((favorite) => !cancelled && setIsFavorite(favorite))
      .catch((error) => console.error('Error checking favorite:', error));
    return () => {
      cancelled = true;
    };
  }, [recipe.id, isLoggedIn, initialFavorite]);

  const toggleFavorite = async () => {
    setIsSaving(true);
    try {
      const favorite = await apiService.setFavorite(recipe.id, !isFavorite);
      setIsFavorite(favorite);
      onFavoriteChange?.(recipe.id, favorite);
      showSuccessNotification(
        favorite ? 'Saved to your favorites' : 'Removed from favorites'
      );
    } catch (error) {
      showErrorNotification(
        getErrorMessage(error, 'Could not update your favorites')
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal onClose={onClose} labelledBy={titleId}>
      <Media>
        <img src={recipe.image} alt={recipe.title} />
      </Media>
      <Content>
        <MetaRow>
          <Badge>{categoryLabel(recipe.category)}</Badge>
          <Badge>
            <ClockIcon />
            {formatMinutes(minutes)}
          </Badge>
        </MetaRow>
        <Title id={titleId}>{recipe.title}</Title>
        <Description>{recipe.description}</Description>

        {recipe.ingredients?.length > 0 && (
          <>
            <SectionTitle>
              Ingredients ({recipe.ingredients.length})
            </SectionTitle>
            <Chips>
              {recipe.ingredients.map((ingredient) => (
                <IngredientChip key={ingredient} name={ingredient} />
              ))}
            </Chips>
          </>
        )}

        <Actions>
          <Button
            type="button"
            onClick={() => setIsCooking((cooking) => !cooking)}
            aria-expanded={isCooking}
          >
            {!isCooking && <PlayIcon />}
            {isCooking ? 'Stop cooking' : 'Start cooking'}
          </Button>
          {isLoggedIn ? (
            <FavoriteButton
              type="button"
              $variant="secondary"
              $active={isFavorite}
              onClick={toggleFavorite}
              disabled={isSaving}
              aria-pressed={isFavorite}
            >
              {isSaving ? <Spinner /> : <HeartIcon filled={isFavorite} />}
              {isFavorite ? 'Saved' : 'Save to favorites'}
            </FavoriteButton>
          ) : (
            <Button as={Link} to="/login" $variant="ghost">
              <HeartIcon />
              Log in to save
            </Button>
          )}
        </Actions>

        {isCooking && (
          <CookingSession
            category={toRecipeCategory(recipe.category)}
            minutes={minutes}
          />
        )}
      </Content>
    </Modal>
  );
};

export default RecipeModal;
