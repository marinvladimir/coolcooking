import React from 'react';
import styled from 'styled-components';
import { ingredientIconSrc } from '../utils/recipes';

const Chip = styled.li`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.35rem 0.8rem 0.35rem 0.4rem;
  font-size: 0.9rem;
  font-weight: 500;
  background: ${({ theme }) => theme.colors.surfaceAlt};
  border-radius: ${({ theme }) => theme.radius.pill};

  img {
    width: 26px;
    height: 26px;
    object-fit: contain;
    image-rendering: pixelated;
  }
`;

export const IngredientIcon: React.FC<{ name: string; size?: number }> = ({
  name,
  size = 26,
}) => (
  <img
    src={ingredientIconSrc(name)}
    alt=""
    width={size}
    height={size}
    loading="lazy"
    onError={(event) => {
      event.currentTarget.style.visibility = 'hidden';
    }}
  />
);

const IngredientChip: React.FC<{ name: string }> = ({ name }) => (
  <Chip>
    <IngredientIcon name={name} />
    {name}
  </Chip>
);

export default IngredientChip;
