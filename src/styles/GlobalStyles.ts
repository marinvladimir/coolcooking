import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  *,
  *::before,
  *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    -webkit-text-size-adjust: 100%;
  }

  body {
    font-family: ${({ theme }) => theme.fonts.body};
    font-size: 17px;
    line-height: 1.55;
    color: ${({ theme }) => theme.colors.ink};
    background-color: ${({ theme }) => theme.colors.paper};
    background-image: radial-gradient(
      ${({ theme }) => theme.colors.ink}1f 1.2px,
      transparent 1.2px
    );
    background-size: 22px 22px;
    font-variant-numeric: lining-nums;
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }

  /* Paper grain on top of everything. */
  body::after {
    content: '';
    position: fixed;
    inset: 0;
    z-index: 9999;
    pointer-events: none;
    opacity: 0.05;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  }

  h1, h2, h3, h4 {
    font-family: ${({ theme }) => theme.fonts.display};
    font-weight: 800;
    line-height: 1;
    letter-spacing: -0.035em;
  }

  img {
    display: block;
    max-width: 100%;
  }

  img.pixel {
    image-rendering: pixelated;
  }

  a {
    color: inherit;
  }

  input,
  textarea,
  select,
  button {
    font: inherit;
    color: inherit;
  }

  button {
    cursor: pointer;
  }

  :focus-visible {
    outline: 3px dashed ${({ theme }) => theme.colors.ink};
    outline-offset: 3px;
  }

  ::selection {
    background: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.ink};
  }

  ::-webkit-scrollbar {
    width: 14px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.paper};
    border-left: 3px solid ${({ theme }) => theme.colors.ink};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.accent};
    border: 3px solid ${({ theme }) => theme.colors.ink};
  }

  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }

  .Toastify__toast {
    font-family: ${({ theme }) => theme.fonts.body};
    font-weight: 600;
    color: ${({ theme }) => theme.colors.ink};
    background: ${({ theme }) => theme.colors.surface};
    border: ${({ theme }) => theme.border};
    border-radius: ${({ theme }) => theme.radius.md};
    box-shadow: ${({ theme }) => theme.shadow.md};
  }

  .Toastify__progress-bar {
    background: ${({ theme }) => theme.colors.accent};
  }
`;
