import styled, { css, keyframes } from 'styled-components';
import { motion } from 'framer-motion';

export const blink = keyframes`
  50% { opacity: 0; }
`;

export const bob = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

// Two-frame "sprite" hop, stepped like an old game.
export const hop = keyframes`
  0%, 100% { transform: translateY(0); }
  40% { transform: translateY(-14px); }
  60% { transform: translateY(-14px); }
`;

export const Container = styled.div`
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 1.5rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 0 1rem;
  }
`;

export const Page = styled(motion.main).attrs({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
})`
  flex: 1;
  padding: 3rem 0 5rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 2rem 0 4rem;
  }
`;

export const Eyebrow = styled.p`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-family: ${({ theme }) => theme.fonts.pixel};
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;

  &::after {
    content: '';
    width: 0.55em;
    height: 1em;
    background: currentColor;
    animation: ${blink} 1s steps(1) infinite;
  }
`;

export const PageTitle = styled.h1`
  font-size: clamp(2.8rem, 7vw, 5.6rem);
  margin-bottom: 1rem;
`;

export const Highlight = styled.span<{ $color?: string }>`
  position: relative;
  display: inline-block;
  padding: 0 0.15em;
  z-index: 0;

  &::before {
    content: '';
    position: absolute;
    inset: 12% -0.05em 4%;
    z-index: -1;
    background: ${({ $color, theme }) => $color ?? theme.colors.accent};
    border: ${({ theme }) => theme.border};
    border-radius: 10px;
    box-shadow: ${({ theme }) => theme.shadow.sm};
    transform: rotate(-2deg);
  }
`;

export const Lead = styled.p`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.inkSoft};
  max-width: 620px;
`;

type ButtonVariant = 'primary' | 'secondary' | 'dark' | 'ghost';

const buttonVariants = {
  primary: css`
    background: ${({ theme }) => theme.colors.accent};
  `,
  secondary: css`
    background: ${({ theme }) => theme.colors.surface};
  `,
  dark: css`
    background: ${({ theme }) => theme.colors.ink};
    color: ${({ theme }) => theme.colors.surface};
  `,
  ghost: css`
    background: transparent;
    border-color: transparent;
    box-shadow: none !important;
    text-decoration: underline;
    text-decoration-thickness: 2px;
    text-underline-offset: 4px;

    &:hover:not(:disabled) {
      transform: none !important;
      text-decoration-thickness: 3px;
    }
  `,
};

export const Button = styled.button<{
  $variant?: ButtonVariant;
  $block?: boolean;
  $size?: 'sm' | 'md' | 'lg';
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  width: ${({ $block }) => ($block ? '100%' : 'auto')};
  padding: ${({ $size = 'md' }) =>
    ({ sm: '0.45rem 0.95rem', md: '0.75rem 1.35rem', lg: '1rem 1.8rem' })[
      $size
    ]};
  font-size: ${({ $size = 'md' }) =>
    ({ sm: '0.9rem', md: '1rem', lg: '1.15rem' })[$size]};
  font-weight: 700;
  line-height: 1.15;
  text-decoration: none;
  white-space: nowrap;
  color: ${({ theme }) => theme.colors.ink};
  border: ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme }) => theme.shadow.sm};
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease,
    background-color 0.2s ease;

  &:hover:not(:disabled) {
    transform: translate(-2px, -2px);
    box-shadow: ${({ theme }) => theme.shadow.md};
  }

  &:active:not(:disabled) {
    transform: translate(3px, 3px);
    box-shadow: 0 0 0 ${({ theme }) => theme.colors.ink};
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }

  svg {
    width: 1.15em;
    height: 1.15em;
    flex-shrink: 0;
  }

  ${({ $variant = 'primary' }) => buttonVariants[$variant]}
`;

export const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.md};
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  text-align: left;
`;

export const Label = styled.label`
  font-family: ${({ theme }) => theme.fonts.pixel};
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.03em;
`;

const fieldStyles = css`
  width: 100%;
  padding: 0.8rem 1rem;
  font-size: 1rem;
  font-weight: 500;
  background: ${({ theme }) => theme.colors.surface};
  border: ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  transition:
    box-shadow 0.15s ease,
    transform 0.15s ease;

  &::placeholder {
    color: ${({ theme }) => theme.colors.muted};
    opacity: 0.8;
  }

  &:focus {
    outline: none;
    transform: translate(-2px, -2px);
    box-shadow: 4px 4px 0 ${({ theme }) => theme.colors.accent};
  }

  &[aria-invalid='true'] {
    border-color: ${({ theme }) => theme.colors.error};
    box-shadow: 4px 4px 0 ${({ theme }) => theme.colors.error};
  }
`;

export const Input = styled.input`
  ${fieldStyles}
`;

export const TextArea = styled.textarea`
  ${fieldStyles}
  resize: vertical;
  min-height: 110px;
`;

export const Select = styled.select`
  ${fieldStyles}
  appearance: none;
  padding-right: 2.5rem;
  background-image: linear-gradient(45deg, transparent 50%, currentColor 50%),
    linear-gradient(135deg, currentColor 50%, transparent 50%);
  background-position:
    calc(100% - 20px) 55%,
    calc(100% - 14px) 55%;
  background-size: 6px 6px;
  background-repeat: no-repeat;
`;

export const FieldError = styled.p`
  font-size: 0.875rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.error};
`;

export const Hint = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.muted};
`;

export const Sticker = styled.span<{ $color?: string; $tilt?: number }>`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.3rem 0.6rem;
  font-family: ${({ theme }) => theme.fonts.pixel};
  font-size: 0.7rem;
  line-height: 1.2;
  text-transform: uppercase;
  white-space: nowrap;
  color: ${({ theme }) => theme.colors.ink};
  background: ${({ $color, theme }) => $color ?? theme.colors.accent};
  border: 2.5px solid ${({ theme }) => theme.colors.ink};
  border-radius: 8px;
  box-shadow: 2px 2px 0 ${({ theme }) => theme.colors.ink};
  transform: rotate(${({ $tilt = 0 }) => $tilt}deg);

  svg {
    width: 12px;
    height: 12px;
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
  gap: 1.75rem;
`;

export const visuallyHidden = css`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;
