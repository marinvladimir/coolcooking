import styled, { keyframes } from 'styled-components';

const blocks = keyframes`
  0%, 100% { box-shadow: 6px 0 0 currentColor, 0 6px 0 transparent, 6px 6px 0 transparent; }
  25% { box-shadow: 6px 0 0 transparent, 0 6px 0 transparent, 6px 6px 0 currentColor; }
  50% { box-shadow: 6px 0 0 transparent, 0 6px 0 currentColor, 6px 6px 0 transparent; }
  75% { box-shadow: 6px 0 0 transparent, 0 6px 0 transparent, 6px 6px 0 transparent; }
`;

/** Tiny 2×2 "pixel" loader that cycles its blocks. */
const Spinner = styled.span`
  display: inline-block;
  width: 6px;
  height: 6px;
  margin-right: 6px;
  margin-bottom: 6px;
  background: currentColor;
  animation: ${blocks} 0.8s steps(1) infinite;
  vertical-align: middle;
`;

export default Spinner;
