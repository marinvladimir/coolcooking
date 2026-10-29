import React from 'react';
import styled, { keyframes } from 'styled-components';

const rise = keyframes`
  0% { transform: translate(0, 0); opacity: 0; }
  15% { opacity: 0.9; }
  50% { transform: translate(6px, calc(var(--rise) * -0.5)); }
  100% { transform: translate(-4px, calc(var(--rise) * -1)); opacity: 0; }
`;

const Wrapper = styled.div`
  position: absolute;
  pointer-events: none;

  span {
    position: absolute;
    bottom: 0;
    width: 10px;
    height: 10px;
    background: #ffffff;
    border: 2px solid ${({ theme }) => theme.colors.ink};
    opacity: 0;
    animation: ${rise} 2.4s steps(8) infinite;
  }
`;

/** Little square "pixel steam" puffs rising in stepped motion. */
const Steam: React.FC<{
  className?: string;
  puffs?: number;
  rise?: number;
}> = ({ className, puffs = 5, rise = 72 }) => (
  <Wrapper
    className={className}
    aria-hidden="true"
    style={{ '--rise': `${rise}px` } as React.CSSProperties}
  >
    {Array.from({ length: puffs }, (_, index) => (
      <span
        key={index}
        style={{
          left: `${index * 14}px`,
          animationDelay: `${index * 0.45}s`,
        }}
      />
    ))}
  </Wrapper>
);

export default Steam;
