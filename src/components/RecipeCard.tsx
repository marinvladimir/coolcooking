import React from 'react';
import styled from 'styled-components';
import type { Recipe } from '../types';
import { ClockIcon } from '../icons/icons';
import { Badge } from '../styles/ui';
import { categoryLabel, cookingMinutes, formatMinutes } from '../utils/recipes';
import { IngredientIcon } from './IngredientChip';

const MAX_ICONS = 4;

const CardButton = styled.button`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 0;
  text-align: left;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.sm};
  overflow: hidden;
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    border-color 0.25s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadow.md};
    border-color: ${({ theme }) => theme.colors.primary}55;
  }

  &:hover img.cover {
    transform: scale(1.04);
  }
`;

const Media = styled.div`
  position: relative;
  aspect-ratio: 4 / 3;
  background: ${({ theme }) => theme.colors.surfaceAlt};
  overflow: hidden;

  img.cover {
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 1rem;
    transition: transform 0.35s ease;
  }

  ${Badge} {
    position: absolute;
    top: 0.75rem;
    left: 0.75rem;
    background: ${({ theme }) => theme.colors.surface};
    box-shadow: ${({ theme }) => theme.shadow.sm};
  }
`;

const Body = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.1rem 1.2rem 1.2rem;
`;

const Title = styled.h3`
  font-size: 1.25rem;
`;

const Description = styled.p`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 0.925rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-top: auto;
  padding-top: 0.75rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 0.875rem;
  font-weight: 600;
`;

const Time = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: ${({ theme }) => theme.colors.primaryDark};

  svg {
    width: 16px;
    height: 16px;
  }
`;

const Icons = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.15rem;
  color: ${({ theme }) => theme.colors.textMuted};

  img {
    image-rendering: pixelated;
  }

  em {
    margin-left: 0.25rem;
    font-style: normal;
    font-size: 0.8rem;
  }
`;

interface RecipeCardProps {
  recipe: Recipe;
  onSelect: (recipe: Recipe) => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onSelect }) => {
  const ingredients = recipe.ingredients ?? [];
  const hiddenCount = ingredients.length - MAX_ICONS;

  return (
    <CardButton
      type="button"
      onClick={() => onSelect(recipe)}
      aria-label={`View recipe: ${recipe.title}`}
    >
      <Media>
        <img
          className="cover"
          src={recipe.image}
          alt=""
          loading="lazy"
          decoding="async"
        />
        <Badge>{categoryLabel(recipe.category)}</Badge>
      </Media>
      <Body>
        <Title>{recipe.title}</Title>
        <Description>{recipe.description}</Description>
        <Meta>
          <Time>
            <ClockIcon />
            {formatMinutes(cookingMinutes(recipe.cooking_time))}
          </Time>
          <Icons title={ingredients.join(', ')}>
            {ingredients.slice(0, MAX_ICONS).map((ingredient) => (
              <IngredientIcon key={ingredient} name={ingredient} size={24} />
            ))}
            {hiddenCount > 0 && <em>+{hiddenCount}</em>}
          </Icons>
        </Meta>
      </Body>
    </CardButton>
  );
};

export default RecipeCard;
