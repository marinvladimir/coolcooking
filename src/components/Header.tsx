import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useTheme } from '../states/ThemeContext';
import { isAuthenticated } from './PrivateRoute';

const HeaderWrapper = styled.header<{ $headerImage: string }>`
  background-color: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.background};
  padding: 2rem;
  text-align: center;
  font-size: 2rem;
  font-weight: bold;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
  background-image: ${(props) => `url(${props.$headerImage})`};
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  height: 150px;
  overflow: hidden;
  transition: background-image 0.3s ease-in-out;

  h1 {
    position: absolute;
    bottom: 1rem;
    left: 50%;
    transform: translateX(-50%);
    font-size: 3rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  }
`;

const Nav = styled.nav`
  display: flex;
  justify-content: center;
  background-color: ${(props) => props.theme.colors.secondary};
  padding: 1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    display: none;
  }
`;

const StyledLink = styled(Link)`
  margin: 0 1.5rem;
  text-decoration: none;
  color: ${(props) => props.theme.colors.background};
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 1.1rem;

  &:hover {
    color: ${(props) => props.theme.colors.accent};
    transform: translateY(-2px);
    transition: transform 0.3s ease;
  }
`;

const BurgerContainer = styled.div`
  display: none;
  cursor: pointer;
  position: absolute;
  top: 20px;
  right: 20px;

  @media (max-width: 768px) {
    display: block;
  }
`;

export const BurgerIcon = styled.div<{ $isOpen: boolean }>`
  width: 30px;
  height: 3px;
  background-color: ${(props) => props.theme.colors.background};
  border-radius: 2px;
  position: relative;
  transition: all 0.3s ease-in-out;
  cursor: pointer;

  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 30px;
    height: 3px;
    background-color: ${(props) => props.theme.colors.background};
    border-radius: 2px;
    transition: all 0.3s ease-in-out;
  }

  &::before {
    top: -10px;
  }

  &::after {
    top: 10px;
  }

  ${({ $isOpen }: { $isOpen: boolean }) =>
    $isOpen &&
    `
      background-color: transparent;

      &::before {
        transform: rotate(45deg);
        top: 0;
      }

      &::after {
        transform: rotate(-45deg);
        top: 0;
      }
    `}
`;

const MobileMenu = styled.div<{ $isOpen: boolean }>`
  display: ${(props) => (props.$isOpen ? 'grid' : 'none')};
  grid-template-columns: 1fr;
  position: absolute;
  top: 150px;
  right: 0;
  background-color: ${(props) => props.theme.colors.secondary};
  width: 100%;
  padding: 2rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  gap: 1rem;

  @media (min-width: 769px) {
    display: none;
  }
`;

const Header: React.FC = () => {
  const { theme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <>
      <HeaderWrapper $headerImage={theme.colors.headerImage}>
        <h1>Cooking Recipes</h1>
      </HeaderWrapper>

      <BurgerContainer onClick={toggleMenu}>
        <BurgerIcon $isOpen={isMenuOpen} />
      </BurgerContainer>

      <MobileMenu $isOpen={isMenuOpen}>
        <StyledLink to="/" onClick={() => setIsMenuOpen(false)}>
          Home
        </StyledLink>
        <StyledLink to="/recipes" onClick={() => setIsMenuOpen(false)}>
          Recipes
        </StyledLink>
        <StyledLink to="/favorites" onClick={() => setIsMenuOpen(false)}>
          Favorites
        </StyledLink>
        <StyledLink to="/plan" onClick={() => setIsMenuOpen(false)}>
          Plan
        </StyledLink>
        <StyledLink to="/login" onClick={() => setIsMenuOpen(false)}>
          {isAuthenticated() ? 'Login' : 'Logout'}
        </StyledLink>
      </MobileMenu>

      <Nav>
        <StyledLink to="/">Home</StyledLink>
        <StyledLink to="/recipes">Recipes</StyledLink>
        <StyledLink to="/favorites">Favorites</StyledLink>
        <StyledLink to="/plan">Plan</StyledLink>
        <StyledLink to="/login">
          {isAuthenticated() ? 'Login' : 'Logout'}
        </StyledLink>
      </Nav>
    </>
  );
};

export default Header;
