import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Container } from '../styles/ui';

const Wrapper = styled.footer`
  margin-top: auto;
  padding: 2.5rem 0;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surfaceAlt};
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Inner = styled(Container)`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

const Links = styled.nav`
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;

  a {
    text-decoration: none;
    font-weight: 600;

    &:hover {
      color: ${({ theme }) => theme.colors.primaryDark};
    }
  }
`;

const Footer: React.FC = () => (
  <Wrapper>
    <Inner>
      <p>© {new Date().getFullYear()} Cool Cooking. All rights reserved.</p>
      <Links aria-label="Footer">
        <Link to="/recipes">Recipes</Link>
        <Link to="/favorites">Favorites</Link>
        <Link to="/plan">Meal planner</Link>
      </Links>
    </Inner>
  </Wrapper>
);

export default Footer;
