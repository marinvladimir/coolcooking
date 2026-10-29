import React, { useId } from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const Wrapper = styled.div<{ $size: number }>`
  position: relative;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.mustard};
  border: ${({ theme }) => theme.border};
  box-shadow: ${({ theme }) => theme.shadow.sm};

  svg {
    width: 100%;
    height: 100%;
    animation: ${spin} 14s linear infinite;
  }

  text {
    font-family: ${({ theme }) => theme.fonts.pixel};
    font-size: 11.5px;
    letter-spacing: 1px;
    fill: ${({ theme }) => theme.colors.ink};
  }

  img {
    position: absolute;
    inset: 30%;
    width: 40%;
    height: 40%;
  }
`;

interface SpinningBadgeProps {
  text: string;
  icon?: string;
  size?: number;
  className?: string;
}

const SpinningBadge: React.FC<SpinningBadgeProps> = ({
  text,
  icon,
  size = 120,
  className,
}) => {
  const pathId = `badge-${useId().replace(/:/g, '')}`;
  return (
    <Wrapper $size={size} className={className} aria-hidden="true">
      <svg viewBox="0 0 100 100">
        <defs>
          <path
            id={pathId}
            d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0"
          />
        </defs>
        <text>
          <textPath href={`#${pathId}`}>{text}</textPath>
        </text>
      </svg>
      {icon && <img className="pixel" src={icon} alt="" />}
    </Wrapper>
  );
};

export default SpinningBadge;
