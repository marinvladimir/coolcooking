import React, { ReactNode } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 3.5rem 1.5rem;
  text-align: center;
  background: ${({ theme }) => theme.colors.surface};
  border: 1.5px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};

  img {
    width: 120px;
    height: 120px;
    object-fit: contain;
    margin-bottom: 0.5rem;
  }

  h2 {
    font-size: 1.5rem;
  }

  p {
    max-width: 420px;
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const Actions = styled.div`
  margin-top: 0.75rem;
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
