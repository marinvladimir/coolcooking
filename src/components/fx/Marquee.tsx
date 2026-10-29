import React, { ReactNode } from 'react';
import styled, { keyframes } from 'styled-components';

const scroll = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
`;

const Band = styled.div<{ $bg: string; $fg: string; $tilt: number }>`
  overflow: hidden;
  padding: 0.9rem 0;
  color: ${({ $fg }) => $fg};
  background: ${({ $bg }) => $bg};
  border-block: ${({ theme }) => theme.border};
  transform: rotate(${({ $tilt }) => $tilt}deg);
`;

const Track = styled.div<{ $duration: number; $reverse: boolean }>`
  display: flex;
  width: max-content;
  animation: ${scroll} ${({ $duration }) => $duration}s linear infinite;
  animation-direction: ${({ $reverse }) => ($reverse ? 'reverse' : 'normal')};

  ${Band}:hover & {
    animation-play-state: paused;
  }
`;

const Group = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  padding-right: 2rem;
`;

interface MarqueeProps {
  children: ReactNode;
  bg: string;
  fg: string;
  tilt?: number;
  duration?: number;
  reverse?: boolean;
}

/** Infinite horizontal ticker; the content is rendered twice for a seamless loop. */
const Marquee: React.FC<MarqueeProps> = ({
  children,
  bg,
  fg,
  tilt = 0,
  duration = 30,
  reverse = false,
}) => (
  <Band $bg={bg} $fg={fg} $tilt={tilt} aria-hidden="true">
    <Track $duration={duration} $reverse={reverse}>
      <Group>{children}</Group>
      <Group>{children}</Group>
    </Track>
  </Band>
);

export default Marquee;
