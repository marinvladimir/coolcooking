import React, { useEffect } from 'react';
import styled from 'styled-components';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { GlobalStyles } from './styles/GlobalStyles';
import { ThemeProvider } from './states/ThemeContext';
import { AuthProvider } from './states/AuthContext';
import { useTheme } from './states/contexts';
import Header from './components/Header';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage';
import RecipesPage from './pages/RecipesPage';
import FavPage from './pages/FavPage';
import PlanPage from './pages/PlanPage';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

const Shell = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

// The accent colour follows the selected recipe category on the recipes
// page; every other page uses the default accent.
const CategoryThemeReset: React.FC = () => {
  const { pathname } = useLocation();
  const { setCategory } = useTheme();

  useEffect(() => {
    if (pathname !== '/recipes') setCategory('all');
  }, [pathname, setCategory]);

  return null;
};

const App: React.FC = () => (
  <AuthProvider>
    <ThemeProvider>
      <GlobalStyles />
      <Router>
        <ScrollToTop />
        <CategoryThemeReset />
        <Shell>
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
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </Shell>
      </Router>
      <ToastContainer position="bottom-right" newestOnTop />
    </ThemeProvider>
  </AuthProvider>
);

export default App;
