import React from 'react';
import styled from 'styled-components';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import type { Recipe } from '../types';
import { ArrowRightIcon, ClockIcon } from '../icons/icons';
import { CATEGORY_COLORS } from '../styles/theme';
import { Sticker } from '../styles/ui';
import {
  categoryLabel,
  cookingMinutes,
  formatMinutes,
  toRecipeCategory,
} from '../utils/recipes';
import { IngredientIcon } from './IngredientChip';

const MAX_ICONS = 5;

const CardButton = styled(motion.button)`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 0;
  text-align: left;
  background: ${({ theme }) => theme.colors.surface};
  border: ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.md};
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadow.xl};
  }

  &:hover .sprite {
    transform: translateY(-10px) scale(1.06);
  }

  &:hover .go {
    transform: translateX(4px);
  }
`;

const Media = styled.div<{ $bg: string }>`
  position: relative;
  aspect-ratio: 5 / 4;
  background-color: ${({ $bg }) => $bg};
  background-image: radial-gradient(
    ${({ theme }) => theme.colors.ink}26 1.5px,
    transparent 1.5px
  );
  background-size: 16px 16px;
  border-bottom: ${({ theme }) => theme.border};
  border-radius: 19px 19px 0 0;
  overflow: hidden;

  .sprite {
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 1.4rem;
    transition: transform 0.3s steps(3);
  }

  ${Sticker} {
    position: absolute;
  }
`;

const Body = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.2rem 1.3rem 1.3rem;
`;

const Title = styled.h3`
  font-size: 1.55rem;
`;

const Description = styled.p`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.inkSoft};
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-top: auto;
  padding-top: 0.9rem;
  border-top: 2.5px dashed ${({ theme }) => theme.colors.ink};
`;

const Icons = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.1rem;

  em {
    margin-left: 0.3rem;
    font-family: ${({ theme }) => theme.fonts.pixel};
    font-size: 0.7rem;
    font-style: normal;
  }
`;

const Go = styled.span`
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  background: ${({ theme }) => theme.colors.ink};
  color: ${({ theme }) => theme.colors.surface};
  border-radius: 50%;
  transition: transform 0.2s ease;

  svg {
    width: 18px;
    height: 18px;
  }
`;

interface RecipeCardProps {
  recipe: Recipe;
  onSelect: (recipe: Recipe) => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onSelect }) => {
  const ingredients = recipe.ingredients ?? [];
  const hiddenCount = ingredients.length - MAX_ICONS;
  const colors = CATEGORY_COLORS[toRecipeCategory(recipe.category)];

  // Subtle 3D tilt that follows the pointer.
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(py, [0, 1], [7, -7]), {
    stiffness: 300,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(px, [0, 1], [-7, 7]), {
    stiffness: 300,
    damping: 20,
  });

  const handleMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType !== 'mouse') return;
    const rect = event.currentTarget.getBoundingClientRect();
    px.set((event.clientX - rect.left) / rect.width);
    py.set((event.clientY - rect.top) / rect.height);
  };

  const reset = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <CardButton
      type="button"
      onClick={() => onSelect(recipe)}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.97 }}
      aria-label={`View recipe: ${recipe.title}`}
    >
      <Media $bg={colors.soft}>
        <img
          className="sprite"
          src={recipe.image}
          alt=""
          loading="lazy"
          decoding="async"
        />
        <Sticker
          $color={colors.accent}
          $tilt={-4}
          style={{ top: 14, left: 14 }}
        >
          {categoryLabel(recipe.category)}
        </Sticker>
        <Sticker $color="#fffdf7" $tilt={3} style={{ bottom: 14, right: 14 }}>
          <ClockIcon />
          {formatMinutes(cookingMinutes(recipe.cooking_time))}
        </Sticker>
      </Media>
      <Body>
        <Title>{recipe.title}</Title>
        <Description>{recipe.description}</Description>
        <Meta>
          <Icons title={ingredients.join(', ')}>
            {ingredients.slice(0, MAX_ICONS).map((ingredient) => (
              <IngredientIcon key={ingredient} name={ingredient} size={28} />
            ))}
            {hiddenCount > 0 && <em>+{hiddenCount}</em>}
          </Icons>
          <Go className="go">
            <ArrowRightIcon />
          </Go>
        </Meta>
      </Body>
    </CardButton>
  );
};

export default RecipeCard;
