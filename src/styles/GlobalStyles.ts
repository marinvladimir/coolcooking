import { createGlobalStyle, keyframes } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
 * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

   body {
    margin: 0;
    padding: 0;
    font-family: "Raleway", sans-serif;
    background-color: ${(props) => props.theme.colors.background};
    color: ${(props) => props.theme.colors.text};
    transition: background-color 0.5s ease, color 0.5s ease;
  }

  input,
textarea,
select,
button {
  font-family: "Raleway", sans-serif;
}

    ::-webkit-scrollbar {
    width: 12px;
  }

  ::-webkit-scrollbar-track {
    background: white;
  }

  ::-webkit-scrollbar-thumb {
    background: ${(props) => props.theme.colors.text};
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${(props) => props.theme.colors.accent};
  }
    
`;

export const fadeAnimation = keyframes`
0% { opacity: 1; }
50% { opacity: 0; }
100% { opacity: 1; }
`;
