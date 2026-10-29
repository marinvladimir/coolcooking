import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Container } from '../styles/ui';

const Wrapper = styled.footer`
  margin-top: auto;
  padding: 4rem 0 2rem;
  color: ${({ theme }) => theme.colors.paper};
  background: ${({ theme }) => theme.colors.ink};
  border-top: ${({ theme }) => theme.border};
  overflow: hidden;
`;

const Top = styled(Container)`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 2rem;

  p {
    max-width: 340px;
    opacity: 0.75;
  }
`;

const Links = styled.nav`
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem 1.75rem;

  a {
    font-family: ${({ theme }) => theme.fonts.pixel};
    font-size: 0.85rem;
    text-transform: uppercase;
    text-decoration: none;

    &:hover {
      color: ${({ theme }) => theme.colors.accent};
    }
  }
`;

const Wordmark = styled.div`
  margin: 3rem 0 1.5rem;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(3.5rem, 15.5vw, 15rem);
  font-weight: 800;
  letter-spacing: -0.06em;
  line-height: 0.8;
  white-space: nowrap;
  text-align: center;
  color: transparent;
  -webkit-text-stroke: 2px ${({ theme }) => theme.colors.paper};
  transition: color 0.4s ease;
  user-select: none;

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

const Bottom = styled(Container)`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1rem;
  font-family: ${({ theme }) => theme.fonts.pixel};
  font-size: 0.7rem;
  text-transform: uppercase;
  opacity: 0.6;
`;

const Footer: React.FC = () => (
  <Wrapper>
    <Top>
      <p>
        Recipes, a cook-along timer and a meal planner – served pixel by pixel.
      </p>
      <Links aria-label="Footer">
        <Link to="/recipes">Recipes</Link>
        <Link to="/favorites">Favorites</Link>
        <Link to="/plan">Meal planner</Link>
        <Link to="/register">Join</Link>
      </Links>
    </Top>
    <Wordmark aria-hidden="true">COOL COOKING</Wordmark>
    <Bottom>
      <span>© {new Date().getFullYear()} Cool Cooking</span>
      <span>Made with butter &amp; pixels</span>
    </Bottom>
  </Wrapper>
);

export default Footer;
