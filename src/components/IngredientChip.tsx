import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { ingredientIconSrc } from '../utils/recipes';

const Chip = styled(motion.li)`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.3rem 0.8rem 0.3rem 0.35rem;
  font-size: 0.95rem;
  font-weight: 600;
  background: ${({ theme }) => theme.colors.surface};
  border: 2.5px solid ${({ theme }) => theme.colors.ink};
  border-radius: ${({ theme }) => theme.radius.sm};
  box-shadow: 2px 2px 0 ${({ theme }) => theme.colors.ink};

  img {
    width: 28px;
    height: 28px;
  }
`;

export const IngredientIcon: React.FC<{ name: string; size?: number }> = ({
  name,
  size = 28,
}) => (
  <img
    className="pixel"
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

const IngredientChip: React.FC<{ name: string; index?: number }> = ({
  name,
  index = 0,
}) => (
  <Chip
    initial={{ opacity: 0, y: 12, rotate: -4 }}
    animate={{ opacity: 1, y: 0, rotate: 0 }}
    transition={{
      delay: 0.15 + index * 0.04,
      type: 'spring',
      stiffness: 400,
      damping: 22,
    }}
    whileHover={{ y: -3, rotate: index % 2 ? 2 : -2 }}
  >
    <IngredientIcon name={name} />
    {name}
  </Chip>
);

export default IngredientChip;
