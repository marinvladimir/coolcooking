import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import type { Recipe } from '../types';
import { apiService, getErrorMessage } from '../api/api';
import { useAuth } from '../states/contexts';
import { ClockIcon, HeartIcon, PlayIcon } from '../icons/icons';
import { CATEGORY_COLORS } from '../styles/theme';
import { bob, Button, Sticker } from '../styles/ui';
import { showErrorNotification } from '../utils/notification';
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
import { pixelBurst } from './fx/pixelBurst';

const Layout = styled.div`
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const Media = styled.div<{ $bg: string }>`
  position: relative;
  display: grid;
  place-items: center;
  min-height: 380px;
  padding: 2.5rem;
  background-color: ${({ $bg }) => $bg};
  background-image: radial-gradient(
    ${({ theme }) => theme.colors.ink}26 1.5px,
    transparent 1.5px
  );
  background-size: 18px 18px;
  border-right: ${({ theme }) => theme.border};
  border-radius: 19px 0 0 19px;

  img {
    width: 100%;
    max-width: 340px;
    animation: ${bob} 3s ease-in-out infinite;
    filter: drop-shadow(6px 8px 0 rgba(21, 18, 16, 0.18));
  }

  ${Sticker} {
    position: absolute;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    min-height: 240px;
    padding: 2rem;
    border-right: none;
    border-bottom: ${({ theme }) => theme.border};
    border-radius: 19px 19px 0 0;

    img {
      max-width: 200px;
    }
  }
`;

const Content = styled.div`
  padding: 2.5rem 2.25rem 2.25rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 1.5rem 1.25rem;
  }
`;

const Title = styled.h2`
  font-size: clamp(2.2rem, 4.5vw, 3.2rem);
  margin: 0 3rem 1rem 0;
`;

const Description = styled.p`
  font-size: 1.05rem;
  color: ${({ theme }) => theme.colors.inkSoft};
  white-space: pre-line;
`;

const SectionTitle = styled.h3`
  margin: 1.75rem 0 0.85rem;
  font-family: ${({ theme }) => theme.fonts.pixel};
  font-size: 0.85rem;
  font-weight: 400;
  letter-spacing: 0;
  text-transform: uppercase;
`;

const Chips = styled.ul`
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 2rem;
`;

const FavoriteButton = styled(Button)<{ $active: boolean }>`
  background: ${({ $active, theme }) =>
    $active ? theme.colors.bubblegum : theme.colors.surface};
`;

const Session = styled.div`
  padding: 0 2.25rem 2.25rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 0 1.25rem 1.5rem;
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
  const favoriteRef = useRef<HTMLButtonElement>(null);
  const minutes = cookingMinutes(recipe.cooking_time);
  const category = toRecipeCategory(recipe.category);
  const colors = CATEGORY_COLORS[category];
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
      if (favorite && favoriteRef.current) {
        pixelBurst(favoriteRef.current, { kind: 'hearts', label: 'YUM!' });
      }
      onFavoriteChange?.(recipe.id, favorite);
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
      <Layout>
        <Media $bg={colors.soft}>
          <img src={recipe.image} alt={recipe.title} />
          <Sticker
            $color={colors.accent}
            $tilt={-5}
            style={{ top: 20, left: 20 }}
          >
            {categoryLabel(recipe.category)}
          </Sticker>
          <Sticker $color="#fffdf7" $tilt={4} style={{ bottom: 20, right: 20 }}>
            <ClockIcon />
            {formatMinutes(minutes)}
          </Sticker>
        </Media>
        <Content>
          <Title id={titleId}>{recipe.title}</Title>
          <Description>{recipe.description}</Description>

          {recipe.ingredients?.length > 0 && (
            <>
              <SectionTitle>
                Ingredients ×{recipe.ingredients.length}
              </SectionTitle>
              <Chips>
                {recipe.ingredients.map((ingredient, index) => (
                  <IngredientChip
                    key={ingredient}
                    name={ingredient}
                    index={index}
                  />
                ))}
              </Chips>
            </>
          )}

          <Actions>
            <Button
              type="button"
              $size="lg"
              $variant={isCooking ? 'dark' : 'primary'}
              onClick={() => setIsCooking((cooking) => !cooking)}
              aria-expanded={isCooking}
            >
              {!isCooking && <PlayIcon />}
              {isCooking ? 'Stop cooking' : 'Start cooking'}
            </Button>
            {isLoggedIn ? (
              <FavoriteButton
                ref={favoriteRef}
                type="button"
                $size="lg"
                $variant="secondary"
                $active={isFavorite}
                onClick={toggleFavorite}
                disabled={isSaving}
                aria-pressed={isFavorite}
              >
                {isSaving ? <Spinner /> : <HeartIcon filled={isFavorite} />}
                {isFavorite ? 'Saved' : 'Save'}
              </FavoriteButton>
            ) : (
              <Button as={Link} to="/login" $size="lg" $variant="secondary">
                <HeartIcon />
                Log in to save
              </Button>
            )}
          </Actions>
        </Content>
      </Layout>

      <AnimatePresence>
        {isCooking && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <Session>
              <CookingSession category={category} minutes={minutes} />
            </Session>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  );
};

export default RecipeModal;
