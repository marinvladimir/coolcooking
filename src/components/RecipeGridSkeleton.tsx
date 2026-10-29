import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Grid } from '../styles/ui';

const shimmer = keyframes`
  from { background-position: 200% 0; }
  to { background-position: -200% 0; }
`;

const SkeletonCard = styled.div`
  height: 360px;
  border-radius: ${({ theme }) => theme.radius.lg};
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.surfaceAlt} 25%,
    ${({ theme }) => theme.colors.surface} 50%,
    ${({ theme }) => theme.colors.surfaceAlt} 75%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.4s ease-in-out infinite;
`;

const RecipeGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => (
  <Grid aria-busy="true" aria-label="Loading recipes">
    {Array.from({ length: count }, (_, index) => (
      <SkeletonCard key={index} />
    ))}
  </Grid>
);

export default RecipeGridSkeleton;
