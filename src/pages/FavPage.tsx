import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import type { Recipe } from '../types';
import { apiService, getErrorMessage } from '../api/api';
import { useAuth } from '../states/contexts';
import {
  Button,
  Container,
  Eyebrow,
  Grid,
  Highlight,
  Lead,
  Page,
  PageTitle,
} from '../styles/ui';
import { palette } from '../styles/theme';
import EmptyState from '../components/EmptyState';
import RecipeCard from '../components/RecipeCard';
import RecipeGridSkeleton from '../components/RecipeGridSkeleton';
import RecipeModal from '../components/RecipeModal';

const FavPage: React.FC = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const loadFavorites = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setFavorites(await apiService.fetchFavorites());
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to load your favorites'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const handleFavoriteChange = (recipeId: number, isFavorite: boolean) => {
    if (!isFavorite) {
      setFavorites((current) => current.filter(({ id }) => id !== recipeId));
      setSelectedRecipe(null);
    }
  };

  const renderContent = () => {
    if (isLoading) return <RecipeGridSkeleton count={3} />;

    if (error) {
      return (
        <EmptyState
          role="alert"
          title="We couldn’t load your favorites"
          description={error}
          actions={<Button onClick={loadFavorites}>Try again</Button>}
        />
      );
    }

    if (favorites.length === 0) {
      return (
        <EmptyState
          image="/assets/desserts.png"
          title="No favorites yet"
          description="Open any recipe and tap “Save to favorites” – it will show up here."
          actions={
            <Button as={Link} to="/recipes">
              Browse recipes
            </Button>
          }
        />
      );
    }

    return (
      <Grid>
        <AnimatePresence mode="popLayout">
          {favorites.map((recipe, index) => (
            <motion.div
              key={recipe.id}
              layout
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6, rotate: -8 }}
              transition={{
                type: 'spring',
                stiffness: 350,
                damping: 26,
                delay: Math.min(index, 8) * 0.05,
              }}
            >
              <RecipeCard recipe={recipe} onSelect={setSelectedRecipe} />
            </motion.div>
          ))}
        </AnimatePresence>
      </Grid>
    );
  };

  return (
    <Page>
      <Container>
        <Eyebrow>Your cookbook</Eyebrow>
        <PageTitle>
          {user ? `${user.username}’s` : 'Your'}{' '}
          <Highlight $color={palette.bubblegum}>favorites</Highlight>
        </PageTitle>
        <Lead style={{ marginBottom: '2.5rem' }}>
          The hall of fame – every recipe you have saved, in one place.
        </Lead>
        {renderContent()}
      </Container>

      <AnimatePresence>
        {selectedRecipe && (
          <RecipeModal
            key={selectedRecipe.id}
            recipe={selectedRecipe}
            initialFavorite
            onClose={() => setSelectedRecipe(null)}
            onFavoriteChange={handleFavoriteChange}
          />
        )}
      </AnimatePresence>
    </Page>
  );
};

export default FavPage;
