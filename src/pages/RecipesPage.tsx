import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Link, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import type { CategoryFilter, Recipe } from '../types';
import { apiService, getErrorMessage } from '../api/api';
import {
  CATEGORY_IMAGES,
  CATEGORY_LABELS,
  RECIPE_CATEGORIES,
  isCategoryFilter,
} from '../constants/categories';
import { useAuth, useTheme } from '../states/contexts';
import { PlusIcon, SearchIcon } from '../icons/icons';
import {
  Button,
  Container,
  Eyebrow,
  Grid,
  Page,
  Select,
  Sticker,
  bob,
} from '../styles/ui';
import AddRecipeModal from '../components/AddRecipeModal';
import EmptyState from '../components/EmptyState';
import Pagination from '../components/Pagination';
import RecipeCard from '../components/RecipeCard';
import RecipeGridSkeleton from '../components/RecipeGridSkeleton';
import RecipeModal from '../components/RecipeModal';
import { cookingMinutes } from '../utils/recipes';

const ITEMS_PER_PAGE = 9;
const FILTERS: CategoryFilter[] = ['all', ...RECIPE_CATEGORIES];

type SortKey = 'newest' | 'quickest' | 'az';

const SORTERS: Record<SortKey, (a: Recipe, b: Recipe) => number> = {
  newest: (a, b) => b.id - a.id,
  quickest: (a, b) =>
    cookingMinutes(a.cooking_time) - cookingMinutes(b.cooking_time),
  az: (a, b) => a.title.localeCompare(b.title),
};

const Banner = styled.section`
  position: relative;
  margin: -3rem 0 2.5rem;
  padding: 3.5rem 0 3rem;
  background-color: ${({ theme }) => theme.colors.accent};
  background-image: radial-gradient(
    ${({ theme }) => theme.colors.ink}33 2px,
    transparent 2px
  );
  background-size: 22px 22px;
  border-bottom: ${({ theme }) => theme.border};
  overflow: hidden;
  transition: background-color 0.4s ease;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    margin-top: -2rem;
    padding: 2.5rem 0 2rem;
  }
`;

const BannerInner = styled(Container)`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  min-height: 220px;

  h1 {
    font-size: clamp(3.2rem, 10vw, 7.5rem);
    letter-spacing: -0.06em;
  }

  p {
    max-width: 480px;
    margin-top: 1rem;
    font-size: 1.1rem;
    font-weight: 500;
  }
`;

const BannerArt = styled(motion.img)`
  width: clamp(140px, 24vw, 260px);
  flex-shrink: 0;
  filter: drop-shadow(8px 10px 0 rgba(21, 18, 16, 0.3));
  animation: ${bob} 3s ease-in-out infinite;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    position: absolute;
    right: 0.5rem;
    top: -1rem;
    width: 110px;
    opacity: 0.9;
  }
`;

const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const Tabs = styled.div`
  display: flex;
  gap: 0.35rem;
  padding: 0.35rem;
  overflow-x: auto;
  background: ${({ theme }) => theme.colors.surface};
  border: ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme }) => theme.shadow.sm};
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 100%;
  }
`;

const Tab = styled.button`
  position: relative;
  flex-shrink: 0;
  padding: 0.5rem 0.95rem;
  font-weight: 700;
  background: none;
  border: none;

  span {
    position: relative;
    z-index: 1;
  }
`;

const TabIndicator = styled(motion.div)`
  position: absolute;
  inset: 0;
  background: ${({ theme }) => theme.colors.accent};
  border: 2.5px solid ${({ theme }) => theme.colors.ink};
  border-radius: 9px;
`;

const Filters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 100%;

    > * {
      flex: 1 1 100%;
    }
  }
`;

const SearchBox = styled.label`
  position: relative;
  width: 280px;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 100%;
  }

  svg {
    position: absolute;
    top: 50%;
    left: 0.9rem;
    width: 20px;
    height: 20px;
    transform: translateY(-50%);
    pointer-events: none;
  }

  input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 2.7rem;
    font-weight: 600;
    background: ${({ theme }) => theme.colors.surface};
    border: ${({ theme }) => theme.border};
    border-radius: ${({ theme }) => theme.radius.md};
    box-shadow: ${({ theme }) => theme.shadow.sm};
    transition:
      transform 0.15s ease,
      box-shadow 0.15s ease;

    &:focus {
      outline: none;
      transform: translate(-2px, -2px);
      box-shadow: 5px 5px 0 ${({ theme }) => theme.colors.accent};
    }
  }
`;

const SortSelect = styled(Select)`
  width: auto;
  font-weight: 700;
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme }) => theme.shadow.sm};
`;

const ResultCount = styled.p`
  margin-bottom: 1.25rem;
  font-family: ${({ theme }) => theme.fonts.pixel};
  font-size: 0.8rem;
  text-transform: uppercase;
`;

const Fab = styled(motion.div)`
  position: fixed;
  right: 1.5rem;
  bottom: 1.5rem;
  z-index: 50;

  ${Button} {
    padding: 1rem 1.3rem;
    border-radius: 999px;
    box-shadow: ${({ theme }) => theme.shadow.md};
  }

  svg {
    transition: transform 0.25s ease;
  }

  ${Button}:hover svg {
    transform: rotate(90deg);
  }
`;

const RecipesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { setCategory } = useTheme();
  const { isLoggedIn } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sort, setSort] = useState<SortKey>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const categoryParam = searchParams.get('category');
  const category: CategoryFilter = isCategoryFilter(categoryParam)
    ? categoryParam
    : 'all';

  useEffect(() => {
    setCategory(category);
  }, [category, setCategory]);

  const loadRecipes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setRecipes(await apiService.fetchRecipes());
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to load recipes'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRecipes();
  }, [loadRecipes]);

  const filteredRecipes = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return recipes
      .filter(
        (recipe) =>
          (category === 'all' || recipe.category === category) &&
          (!query ||
            recipe.title.toLowerCase().includes(query) ||
            recipe.ingredients?.some((ingredient) =>
              ingredient.toLowerCase().includes(query)
            ))
      )
      .sort(SORTERS[sort]);
  }, [recipes, category, searchQuery, sort]);

  const pageCount = Math.max(
    1,
    Math.ceil(filteredRecipes.length / ITEMS_PER_PAGE)
  );
  const page = Math.min(currentPage, pageCount);
  const visibleRecipes = filteredRecipes.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const selectCategory = (next: CategoryFilter) => {
    setCurrentPage(1);
    setSearchParams(next === 'all' ? {} : { category: next }, {
      replace: true,
    });
  };

  const changePage = (next: number) => {
    setCurrentPage(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCreated = (recipe: Recipe) => {
    setIsAddOpen(false);
    setRecipes((current) => [recipe, ...current]);
    setSearchQuery('');
    selectCategory(recipe.category);
  };

  const renderResults = () => {
    if (isLoading) return <RecipeGridSkeleton />;

    if (error) {
      return (
        <EmptyState
          role="alert"
          title="The kitchen is closed"
          description={error}
          actions={<Button onClick={loadRecipes}>Try again</Button>}
        />
      );
    }

    if (filteredRecipes.length === 0) {
      return (
        <EmptyState
          image={category === 'all' ? undefined : CATEGORY_IMAGES[category]}
          title="Nothing cooking here"
          description={
            searchQuery
              ? `Nothing matches “${searchQuery}”. Try another word or category.`
              : 'There are no recipes in this category yet.'
          }
          actions={
            <>
              {searchQuery && (
                <Button $variant="secondary" onClick={() => setSearchQuery('')}>
                  Clear search
                </Button>
              )}
              {isLoggedIn && (
                <Button onClick={() => setIsAddOpen(true)}>
                  <PlusIcon />
                  Add the first one
                </Button>
              )}
            </>
          }
        />
      );
    }

    return (
      <>
        <ResultCount aria-live="polite">
          ▸ {filteredRecipes.length}{' '}
          {filteredRecipes.length === 1 ? 'recipe' : 'recipes'}
          {searchQuery && ` for “${searchQuery}”`}
        </ResultCount>
        <Grid>
          <AnimatePresence mode="popLayout" initial={false}>
            {visibleRecipes.map((recipe, index) => (
              <motion.div
                key={recipe.id}
                layout
                initial={{ opacity: 0, scale: 0.85, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{
                  type: 'spring',
                  stiffness: 350,
                  damping: 28,
                  delay: Math.min(index, 8) * 0.03,
                }}
              >
                <RecipeCard recipe={recipe} onSelect={setSelectedRecipe} />
              </motion.div>
            ))}
          </AnimatePresence>
        </Grid>
        <Pagination
          totalItems={filteredRecipes.length}
          itemsPerPage={ITEMS_PER_PAGE}
          currentPage={page}
          onPageChange={changePage}
        />
      </>
    );
  };

  return (
    <Page>
      <Banner>
        <BannerInner>
          <div>
            <Eyebrow>Recipe collection</Eyebrow>
            <AnimatePresence mode="wait" initial={false}>
              <motion.h1
                key={category}
                initial={{ y: 40, opacity: 0, rotate: -2 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                exit={{ y: -30, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                {CATEGORY_LABELS[category]}
              </motion.h1>
            </AnimatePresence>
            <p>
              Search by name or ingredient, pick a dish and hit start – the
              timer does the rest.
            </p>
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <BannerArt
              key={category}
              className="pixel"
              src={
                category === 'all'
                  ? '/assets/chief.png'
                  : CATEGORY_IMAGES[category]
              }
              alt=""
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
            />
          </AnimatePresence>
        </BannerInner>
      </Banner>

      <Container>
        <Toolbar>
          <Tabs role="group" aria-label="Filter by category">
            {FILTERS.map((filter) => (
              <Tab
                key={filter}
                type="button"
                aria-pressed={filter === category}
                onClick={() => selectCategory(filter)}
              >
                {filter === category && (
                  <TabIndicator
                    layoutId="category-tab"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
                <span>
                  {filter === 'all' ? 'All' : CATEGORY_LABELS[filter]}
                </span>
              </Tab>
            ))}
          </Tabs>
          <Filters>
            <SearchBox>
              <SearchIcon />
              <input
                type="search"
                placeholder="Search recipes…"
                aria-label="Search recipes"
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                  setCurrentPage(1);
                }}
              />
            </SearchBox>
            <SortSelect
              aria-label="Sort recipes"
              value={sort}
              onChange={(event) => setSort(event.target.value as SortKey)}
            >
              <option value="newest">Newest first</option>
              <option value="quickest">Quickest first</option>
              <option value="az">A → Z</option>
            </SortSelect>
          </Filters>
        </Toolbar>

        {!isLoggedIn && (
          <p style={{ marginBottom: '1.5rem' }}>
            <Sticker $color="#fffdf7" $tilt={-1}>
              Psst
            </Sticker>{' '}
            <Link to="/login">Log in</Link> to save favorites and share your own
            recipes.
          </p>
        )}

        {renderResults()}
      </Container>

      {isLoggedIn && (
        <Fab
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 15,
            delay: 0.4,
          }}
        >
          <Button $variant="dark" onClick={() => setIsAddOpen(true)}>
            <PlusIcon />
            Add recipe
          </Button>
        </Fab>
      )}

      <AnimatePresence>
        {selectedRecipe && (
          <RecipeModal
            key={selectedRecipe.id}
            recipe={selectedRecipe}
            onClose={() => setSelectedRecipe(null)}
          />
        )}
        {isAddOpen && (
          <AddRecipeModal
            key="add-recipe"
            onClose={() => setIsAddOpen(false)}
            onCreated={handleCreated}
          />
        )}
      </AnimatePresence>
    </Page>
  );
};

export default RecipesPage;
