import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { Card, hop } from '../styles/ui';

const Wrapper = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 3.5rem 1.5rem;
  text-align: center;

  img {
    width: 120px;
    height: 120px;
    object-fit: contain;
    margin-bottom: 0.5rem;
    animation: ${hop} 1.6s steps(4) infinite;
  }

  h2 {
    font-size: clamp(1.8rem, 4vw, 2.4rem);
  }

  p {
    max-width: 440px;
    color: ${({ theme }) => theme.colors.inkSoft};
  }
`;

const Actions = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
`;

interface EmptyStateProps {
  image?: string;
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  role?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  image = '/assets/chief.png',
  title,
  description,
  actions,
  role,
}) => (
  <Wrapper role={role}>
    <img src={image} alt="" />
    <h2>{title}</h2>
    {description && <p>{description}</p>}
    {actions && <Actions>{actions}</Actions>}
  </Wrapper>
);

export default EmptyState;
