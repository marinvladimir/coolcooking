import styled, { css, keyframes } from 'styled-components';

export const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 0 1rem;
  }
`;

export const Page = styled.main`
  flex: 1;
  padding: 3rem 0 4rem;
  animation: ${fadeUp} 0.4s ease-out;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 2rem 0 3rem;
  }
`;

export const Eyebrow = styled.p`
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 0.5rem;
`;

export const PageTitle = styled.h1`
  font-size: clamp(2rem, 4vw, 2.75rem);
  margin-bottom: 0.75rem;
`;

export const Lead = styled.p`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.textMuted};
  max-width: 640px;
`;

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

const buttonVariants = {
  primary: css`
    background: ${({ theme }) => theme.colors.primary};
    color: #fff;
    border-color: ${({ theme }) => theme.colors.primary};

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.primaryDark};
      border-color: ${({ theme }) => theme.colors.primaryDark};
    }
  `,
  secondary: css`
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.text};
    border-color: ${({ theme }) => theme.colors.border};

    &:hover:not(:disabled) {
      border-color: ${({ theme }) => theme.colors.primary};
      color: ${({ theme }) => theme.colors.primaryDark};
    }
  `,
  ghost: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.primaryDark};
    border-color: transparent;

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.primarySoft};
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
  gap: 0.5rem;
  width: ${({ $block }) => ($block ? '100%' : 'auto')};
  padding: ${({ $size = 'md' }) =>
    ({ sm: '0.45rem 0.9rem', md: '0.7rem 1.3rem', lg: '0.9rem 1.7rem' })[
      $size
    ]};
  font-size: ${({ $size = 'md' }) => ($size === 'sm' ? '0.875rem' : '1rem')};
  font-weight: 600;
  line-height: 1.2;
  text-decoration: none;
  white-space: nowrap;
  border: 1.5px solid transparent;
  border-radius: ${({ theme }) => theme.radius.pill};
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;

  &:active:not(:disabled) {
    transform: translateY(1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  svg {
    width: 1.1em;
    height: 1.1em;
    flex-shrink: 0;
  }

  ${({ $variant = 'primary' }) => buttonVariants[$variant]}
`;

export const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.sm};
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  text-align: left;
`;

export const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
`;

const fieldStyles = css`
  width: 100%;
  padding: 0.75rem 0.9rem;
  font-size: 1rem;
  background: ${({ theme }) => theme.colors.surface};
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
    opacity: 0.8;
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primarySoft};
  }

  &[aria-invalid='true'] {
    border-color: ${({ theme }) => theme.colors.error};
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
`;

export const FieldError = styled.p`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.error};
`;

export const Hint = styled.p`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.25rem 0.7rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.primaryDark};
  background: ${({ theme }) => theme.colors.primarySoft};
  border-radius: ${({ theme }) => theme.radius.pill};
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.5rem;
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
