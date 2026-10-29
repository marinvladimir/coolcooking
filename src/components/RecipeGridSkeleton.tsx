import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Grid } from '../styles/ui';

const pulse = keyframes`
  50% { opacity: 0.45; }
`;

const SkeletonCard = styled.div`
  height: 400px;
  border: ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.md};
  background:
    linear-gradient(
        ${({ theme }) => theme.colors.accentSoft},
        ${({ theme }) => theme.colors.accentSoft}
      )
      top / 100% 55% no-repeat,
    ${({ theme }) => theme.colors.surface};
  animation: ${pulse} 1.2s steps(3) infinite;
`;

const RecipeGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => (
  <Grid aria-busy="true" aria-label="Loading recipes">
    {Array.from({ length: count }, (_, index) => (
      <SkeletonCard key={index} style={{ animationDelay: `${index * 0.1}s` }} />
    ))}
  </Grid>
);

export default RecipeGridSkeleton;
