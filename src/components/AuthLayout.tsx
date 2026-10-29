import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { bob, Container, Page } from '../styles/ui';
import { ingredientIconSrc } from '../utils/recipes';
import Steam from './fx/Steam';

const Split = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: 1040px;
  margin: 0 auto;
  background: ${({ theme }) => theme.colors.surface};
  border: ${({ theme }) => theme.border};
  border-radius: 28px;
  box-shadow: ${({ theme }) => theme.shadow.xl};
  overflow: hidden;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const Art = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 520px;
  padding: 2.5rem;
  background-color: ${({ theme }) => theme.colors.accent};
  background-image: radial-gradient(
    ${({ theme }) => theme.colors.ink}33 2px,
    transparent 2px
  );
  background-size: 20px 20px;
  border-right: ${({ theme }) => theme.border};

  blockquote {
    position: relative;
    z-index: 1;
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: clamp(2rem, 3.6vw, 2.8rem);
    font-weight: 800;
    letter-spacing: -0.04em;
    line-height: 1;
  }

  cite {
    display: block;
    margin-top: 0.9rem;
    font-family: ${({ theme }) => theme.fonts.pixel};
    font-size: 0.75rem;
    font-style: normal;
    text-transform: uppercase;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    min-height: 0;
    padding: 1.75rem;
    border-right: none;
    border-bottom: ${({ theme }) => theme.border};
  }
`;

const Chef = styled.div`
  position: relative;
  align-self: center;
  width: min(80%, 320px);
  animation: ${bob} 3.2s ease-in-out infinite;

  img {
    width: 100%;
    filter: drop-shadow(8px 10px 0 rgba(21, 18, 16, 0.25));
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const ChefSteam = styled(Steam)`
  top: 0;
  right: 18%;
  width: 60px;
`;

const Floater = styled.img<{ $delay: number }>`
  position: absolute;
  width: 52px;
  height: 52px;
  padding: 6px;
  background: ${({ theme }) => theme.colors.surface};
  border: ${({ theme }) => theme.border};
  border-radius: 14px;
  box-shadow: ${({ theme }) => theme.shadow.sm};
  animation: ${bob} 2.8s ease-in-out infinite;
  animation-delay: ${({ $delay }) => $delay}s;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const Panel = styled.div`
  padding: clamp(2rem, 5vw, 3.5rem);

  h1 {
    font-size: clamp(2.4rem, 5vw, 3.4rem);
    margin-bottom: 0.6rem;
  }

  > p {
    color: ${({ theme }) => theme.colors.inkSoft};
  }
`;

export const AuthForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  margin-top: 2rem;
`;

export const FormError = styled(motion.p).attrs({
  initial: { x: 0 },
  animate: { x: [0, -10, 10, -6, 6, 0] },
  transition: { duration: 0.4 },
})`
  padding: 0.75rem 1rem;
  font-size: 0.95rem;
  font-weight: 700;
  background: #ffd9d3;
  border: ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  box-shadow: ${({ theme }) => theme.shadow.sm};
`;

export const Switch = styled.p`
  margin-top: 1.75rem;
  font-weight: 500;

  a {
    font-weight: 800;
    text-decoration-thickness: 2px;
    text-underline-offset: 3px;
  }
`;

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  quote?: string;
  children: ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  title,
  subtitle,
  quote = 'Good food is better with friends.',
  children,
}) => (
  <Page>
    <Container>
      <Split
        initial={{ y: 40, rotate: -1, opacity: 0 }}
        animate={{ y: 0, rotate: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        <Art>
          <blockquote>
            “{quote}”<cite>— the pixel chef</cite>
          </blockquote>
          <Chef>
            <ChefSteam />
            <img className="pixel" src="/assets/chief.png" alt="" />
          </Chef>
          <Floater
            className="pixel"
            src={ingredientIconSrc('tomatoes')}
            alt=""
            $delay={0}
            style={{ top: '38%', left: '8%', rotate: '-8deg' }}
          />
          <Floater
            className="pixel"
            src={ingredientIconSrc('cheese')}
            alt=""
            $delay={0.6}
            style={{ top: '46%', right: '8%', rotate: '10deg' }}
          />
          <Floater
            className="pixel"
            src={ingredientIconSrc('eggs')}
            alt=""
            $delay={1.1}
            style={{ bottom: '8%', left: '14%', rotate: '6deg' }}
          />
        </Art>
        <Panel>
          <h1>{title}</h1>
          <p>{subtitle}</p>
          {children}
        </Panel>
      </Split>
    </Container>
  </Page>
);

export default AuthLayout;
