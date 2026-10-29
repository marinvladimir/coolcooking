import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const Spinner = styled.span<{ $size?: number }>`
  display: inline-block;
  width: ${({ $size = 18 }) => $size}px;
  height: ${({ $size = 18 }) => $size}px;
  border: 2.5px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: ${spin} 0.7s linear infinite;
  vertical-align: middle;
`;

export default Spinner;
