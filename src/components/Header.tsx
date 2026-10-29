import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../states/contexts';
import { CloseIcon, MenuIcon } from '../icons/icons';
import { Button, Container } from '../styles/ui';

const Bar = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  background: ${({ theme }) => theme.colors.background}ee;
  backdrop-filter: saturate(1.4) blur(10px);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Inner = styled(Container)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  height: 72px;
`;

const Brand = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  text-decoration: none;
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 1.45rem;
  font-weight: 700;
  letter-spacing: -0.01em;

  img {
    width: 40px;
    height: 40px;
    object-fit: contain;
  }

  span {
    color: ${({ theme }) => theme.colors.primary};
    transition: color 0.3s ease;
  }
`;

const DesktopNav = styled.nav`
  display: flex;
  align-items: center;
  gap: 0.25rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const NavItem = styled(NavLink)`
  position: relative;
  padding: 0.5rem 0.9rem;
  font-weight: 600;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.textMuted};
  border-radius: ${({ theme }) => theme.radius.pill};
  transition:
    color 0.2s ease,
    background-color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.text};
    background: ${({ theme }) => theme.colors.surfaceAlt};
  }

  &.active {
    color: ${({ theme }) => theme.colors.primaryDark};
    background: ${({ theme }) => theme.colors.primarySoft};
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const Greeting = styled.span`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textMuted};
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  strong {
    color: ${({ theme }) => theme.colors.text};
  }
`;

const MenuButton = styled.button`
  display: none;
  place-items: center;
  width: 44px;
  height: 44px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.surface};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: grid;
  }
`;

const MobilePanel = styled.div`
  display: none;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.background};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: block;
  }

  nav {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding-top: 1rem;
    padding-bottom: 1.25rem;
  }

  ${NavItem} {
    padding: 0.8rem 1rem;
    border-radius: ${({ theme }) => theme.radius.md};
  }
`;

const NAV_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/recipes', label: 'Recipes' },
  { to: '/favorites', label: 'Favorites' },
  { to: '/plan', label: 'Meal planner' },
];

const Header: React.FC = () => {
  const { isLoggedIn, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const links = NAV_LINKS.map(({ to, label, end }) => (
    <NavItem key={to} to={to} end={end}>
      {label}
    </NavItem>
  ));

  return (
    <Bar>
      <Inner>
        <Brand to="/" aria-label="Cool Cooking – home">
          <img src="/food.png" alt="" />
          Cool <span>Cooking</span>
        </Brand>

        <DesktopNav aria-label="Main">{links}</DesktopNav>

        <Actions>
          {isLoggedIn ? (
            <>
              {user && (
                <Greeting>
                  Hi, <strong>{user.username}</strong>
                </Greeting>
              )}
              <Button $variant="secondary" $size="sm" onClick={handleLogout}>
                Log out
              </Button>
            </>
          ) : (
            <>
              <Button as={Link} to="/login" $variant="ghost" $size="sm">
                Log in
              </Button>
              <Button as={Link} to="/register" $size="sm">
                Sign up
              </Button>
            </>
          )}
        </Actions>

        <MenuButton
          type="button"
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </MenuButton>
      </Inner>

      {isMenuOpen && (
        <MobilePanel id="mobile-menu">
          <Container as="nav" aria-label="Mobile">
            {links}
            {isLoggedIn ? (
              <Button $variant="secondary" onClick={handleLogout}>
                Log out{user ? ` (${user.username})` : ''}
              </Button>
            ) : (
              <>
                <Button as={Link} to="/login" $variant="secondary">
                  Log in
                </Button>
                <Button as={Link} to="/register">
                  Sign up
                </Button>
              </>
            )}
          </Container>
        </MobilePanel>
      )}
    </Bar>
  );
};

export default Header;
