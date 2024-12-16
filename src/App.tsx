import React from 'react';
import styled from 'styled-components';
import { GlobalStyles } from './styles/GlobalStyles';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RecipesPage from './pages/RecipesPage';
import Header from './components/Header';
import { ThemeProvider, useTheme } from './states/ThemeContext';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import FavPage from './pages/FavPage';
import PlanPage from './pages/PlanPage';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute';
import Register from './pages/Register';
import { ToastContainer } from 'react-toastify';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.text};
`;

const Footer = styled.footer`
  background-color: ${(props) => props.theme.colors.secondary};
  color: ${(props) => props.theme.colors.background};
  text-align: center;
  padding: 1rem;
  font-size: 0.9rem;
  box-shadow: 0px -2px 6px rgba(0, 0, 0, 0.1);
`;

const AppWrapper: React.FC<AppWrapperProps> = ({ children }) => {
  const { theme } = useTheme();
  return (
    <StyledThemeProvider theme={theme}>
      <GlobalStyles />
      {children}
    </StyledThemeProvider>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppWrapper>
        <Router>
          <Wrapper>
            <Header />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/recipes" element={<RecipesPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/favorites"
                element={
                  <PrivateRoute>
                    <FavPage />
                  </PrivateRoute>
                }
              />
              <Route path="/plan" element={<PlanPage />} />
            </Routes>
            <Footer>© 2024 Cooking Recipes. All rights reserved.</Footer>
          </Wrapper>
        </Router>
        <ToastContainer />
      </AppWrapper>
    </ThemeProvider>
  );
};

export default App;
