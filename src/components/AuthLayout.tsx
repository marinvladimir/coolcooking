import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { Card, Page } from '../styles/ui';

const Wrapper = styled(Page)`
  display: grid;
  place-items: center;
  padding-left: 1rem;
  padding-right: 1rem;
`;

const Panel = styled(Card)`
  width: 100%;
  max-width: 440px;
  padding: 2.5rem 2.25rem;
  text-align: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 2rem 1.25rem;
  }

  > img {
    width: 84px;
    height: 84px;
    margin: 0 auto 1rem;
    object-fit: contain;
  }

  h1 {
    font-size: 1.9rem;
    margin-bottom: 0.4rem;
  }

  > p {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

export const AuthForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.75rem;
`;

export const FormError = styled.p`
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  font-weight: 600;
  text-align: left;
  color: ${({ theme }) => theme.colors.error};
  background: #fdecec;
  border-radius: ${({ theme }) => theme.radius.sm};
`;

export const Switch = styled.p`
  margin-top: 1.5rem;
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.textMuted};

  a {
    font-weight: 700;
    color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  title,
  subtitle,
  children,
}) => (
  <Wrapper>
    <Panel>
      <img src="/assets/chief.png" alt="" />
      <h1>{title}</h1>
      <p>{subtitle}</p>
      {children}
    </Panel>
  </Wrapper>
);

export default AuthLayout;
