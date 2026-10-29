import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { useAuth } from '../states/contexts';
import { CloseIcon, MenuIcon } from '../icons/icons';
import { Button, Container } from '../styles/ui';

const Bar = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  background: ${({ theme }) => theme.colors.paper};
  border-bottom: ${({ theme }) => theme.border};
`;

const Progress = styled(motion.div)`
  position: absolute;
  left: 0;
  right: 0;
  bottom: -3px;
  height: 5px;
  transform-origin: 0 50%;
  background: ${({ theme }) => theme.colors.accent};
  border-bottom: 2px solid ${({ theme }) => theme.colors.ink};
`;

const Inner = styled(Container)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  height: 76px;
`;

const Brand = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  text-decoration: none;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.45rem;
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 0.9;

  > span:first-child {
    display: grid;
    place-items: center;
    width: 48px;
    height: 48px;
    background: ${({ theme }) => theme.colors.accent};
    border: ${({ theme }) => theme.border};
    border-radius: ${({ theme }) => theme.radius.sm};
    box-shadow: ${({ theme }) => theme.shadow.sm};
    transition:
      transform 0.2s ease,
      background-color 0.3s ease;

    img {
      width: 36px;
      height: 36px;
    }
  }

  &:hover > span:first-child {
    transform: rotate(-8deg) scale(1.06);
  }

  small {
    display: block;
    font-family: ${({ theme }) => theme.fonts.pixel};
    font-size: 0.6rem;
    font-weight: 400;
    letter-spacing: 0.02em;
    color: ${({ theme }) => theme.colors.muted};
  }
`;

const DesktopNav = styled.nav`
  display: flex;
  align-items: center;
  gap: 0.35rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const NavItem = styled(NavLink)`
  position: relative;
  padding: 0.5rem 0.95rem;
  font-weight: 700;
  text-decoration: none;

  span {
    position: relative;
    z-index: 1;
  }

  &:hover span {
    text-decoration: underline;
    text-decoration-thickness: 2px;
    text-underline-offset: 4px;
  }
`;

const ActivePill = styled(motion.div)`
  position: absolute;
  inset: 0;
  background: ${({ theme }) => theme.colors.accent};
  border: ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  box-shadow: ${({ theme }) => theme.shadow.sm};
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const Avatar = styled.span`
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  font-family: ${({ theme }) => theme.fonts.pixel};
  font-size: 1rem;
  text-transform: uppercase;
  background: ${({ theme }) => theme.colors.mint};
  border: ${({ theme }) => theme.border};
  border-radius: 50%;
`;

const MenuButton = styled(Button)`
  display: none;
  padding: 0.55rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: inline-flex;
  }

  svg {
    width: 22px;
    height: 22px;
  }
`;

const MobileMenu = styled(motion.div)`
  position: fixed;
  inset: 76px 0 0;
  z-index: 99;
  display: flex;
  flex-direction: column;
  padding: 2rem 1.25rem;
  background: ${({ theme }) => theme.colors.accent};
  overflow-y: auto;

  nav {
    display: flex;
    flex-direction: column;
  }

  nav a {
    padding: 0.4rem 0;
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: clamp(2.4rem, 11vw, 3.4rem);
    font-weight: 800;
    letter-spacing: -0.04em;
    text-decoration: none;
    border-bottom: ${({ theme }) => theme.border};

    &.active::after {
      content: ' ←';
    }
  }
`;

const MobileActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 2rem;
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
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (to: string, end?: boolean) =>
    end ? pathname === to : pathname.startsWith(to);

  return (
    <Bar>
      <Inner>
        <Brand to="/" aria-label="Cool Cooking – home">
          <span>
            <img className="pixel" src="/food.png" alt="" />
          </span>
          <span>
            Cool Cooking
            <small>pixel kitchen</small>
          </span>
        </Brand>

        <DesktopNav aria-label="Main">
          {NAV_LINKS.map(({ to, label, end }) => (
            <NavItem key={to} to={to} end={end}>
              {isActive(to, end) && (
                <ActivePill
                  layoutId="nav-active"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <span>{label}</span>
            </NavItem>
          ))}
        </DesktopNav>

        <Actions>
          {isLoggedIn ? (
            <>
              {user && (
                <Avatar title={user.username}>{user.username.charAt(0)}</Avatar>
              )}
              <Button $variant="secondary" $size="sm" onClick={handleLogout}>
                Log out
              </Button>
            </>
          ) : (
            <>
              <Button as={Link} to="/login" $variant="secondary" $size="sm">
                Log in
              </Button>
              <Button as={Link} to="/register" $variant="dark" $size="sm">
                Sign up
              </Button>
            </>
          )}
        </Actions>

        <MenuButton
          type="button"
          $variant="secondary"
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </MenuButton>
      </Inner>
      <Progress style={{ scaleX: progress }} />

      <AnimatePresence>
        {isMenuOpen && (
          <MobileMenu
            id="mobile-menu"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <nav aria-label="Mobile">
              {NAV_LINKS.map(({ to, label, end }, index) => (
                <motion.div
                  key={to}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.06 }}
                >
                  <NavLink to={to} end={end}>
                    {label}
                  </NavLink>
                </motion.div>
              ))}
            </nav>
            <MobileActions>
              {isLoggedIn ? (
                <Button $variant="secondary" $size="lg" onClick={handleLogout}>
                  Log out{user ? ` (${user.username})` : ''}
                </Button>
              ) : (
                <>
                  <Button as={Link} to="/login" $variant="secondary" $size="lg">
                    Log in
                  </Button>
                  <Button as={Link} to="/register" $variant="dark" $size="lg">
                    Sign up
                  </Button>
                </>
              )}
            </MobileActions>
          </MobileMenu>
        )}
      </AnimatePresence>
    </Bar>
  );
};

export default Header;
