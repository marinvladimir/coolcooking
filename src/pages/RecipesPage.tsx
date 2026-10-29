import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Link, useSearchParams } from 'react-router-dom';
import type { CategoryFilter, Recipe } from '../types';
import { apiService, getErrorMessage } from '../api/api';
import {
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
  Lead,
  Page,
  PageTitle,
} from '../styles/ui';
import AddRecipeModal from '../components/AddRecipeModal';
import EmptyState from '../components/EmptyState';
import Pagination from '../components/Pagination';
import RecipeCard from '../components/RecipeCard';
import RecipeGridSkeleton from '../components/RecipeGridSkeleton';
import RecipeModal from '../components/RecipeModal';

const ITEMS_PER_PAGE = 9;
const FILTERS: CategoryFilter[] = ['all', ...RECIPE_CATEGORIES];

const Heading = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const Pills = styled.div`
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding-bottom: 0.25rem;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 100%;
  }
`;

const Pill = styled.button<{ $active: boolean }>`
  flex-shrink: 0;
  padding: 0.55rem 1.1rem;
  font-size: 0.925rem;
  font-weight: 600;
  border-radius: ${({ theme }) => theme.radius.pill};
  border: 1.5px solid
    ${({ $active, theme }) =>
      $active ? theme.colors.primary : theme.colors.border};
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.surface};
  color: ${({ $active, theme }) => ($active ? '#fff' : theme.colors.text)};
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease,
    color 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const SearchBox = styled.label`
  position: relative;
  flex: 0 1 300px;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-basis: 100%;
  }

  svg {
    position: absolute;
    top: 50%;
    left: 0.9rem;
    width: 18px;
    height: 18px;
    transform: translateY(-50%);
    color: ${({ theme }) => theme.colors.textMuted};
    pointer-events: none;
  }

  input {
    width: 100%;
    padding: 0.65rem 1rem 0.65rem 2.6rem;
    border: 1.5px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radius.pill};
    background: ${({ theme }) => theme.colors.surface};

    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.primary};
      box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primarySoft};
    }
  }
`;

const ResultCount = styled.p`
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const RecipesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { setCategory } = useTheme();
  const { isLoggedIn } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
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
    return recipes.filter(
      (recipe) =>
        (category === 'all' || recipe.category === category) &&
        (!query ||
          recipe.title.toLowerCase().includes(query) ||
          recipe.ingredients?.some((ingredient) =>
            ingredient.toLowerCase().includes(query)
          ))
    );
  }, [recipes, category, searchQuery]);

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
          title="We couldn’t load the recipes"
          description={error}
          actions={<Button onClick={loadRecipes}>Try again</Button>}
        />
      );
    }

    if (filteredRecipes.length === 0) {
      return (
        <EmptyState
          title="No recipes found"
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
          {filteredRecipes.length}{' '}
          {filteredRecipes.length === 1 ? 'recipe' : 'recipes'}
          {searchQuery && ` for “${searchQuery}”`}
        </ResultCount>
        <Grid>
          {visibleRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onSelect={setSelectedRecipe}
            />
          ))}
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
      <Container>
        <Heading>
          <div>
            <Eyebrow>Recipe collection</Eyebrow>
            <PageTitle>{CATEGORY_LABELS[category]}</PageTitle>
            <Lead>
              Pick a category, search by name or ingredient and open a recipe to
              start cooking.
            </Lead>
          </div>
          {isLoggedIn ? (
            <Button onClick={() => setIsAddOpen(true)}>
              <PlusIcon />
              Add recipe
            </Button>
          ) : (
            <Button as={Link} to="/login" $variant="secondary">
              Log in to share a recipe
            </Button>
          )}
        </Heading>

        <Toolbar>
          <Pills role="group" aria-label="Filter by category">
            {FILTERS.map((filter) => (
              <Pill
                key={filter}
                type="button"
                $active={filter === category}
                aria-pressed={filter === category}
                onClick={() => selectCategory(filter)}
              >
                {filter === 'all' ? 'All' : CATEGORY_LABELS[filter]}
              </Pill>
            ))}
          </Pills>
          <SearchBox>
            <SearchIcon />
            <input
              type="search"
              placeholder="Search recipes or ingredients…"
              aria-label="Search recipes"
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setCurrentPage(1);
              }}
            />
          </SearchBox>
        </Toolbar>

        {renderResults()}
      </Container>

      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
        />
      )}
      {isAddOpen && (
        <AddRecipeModal
          onClose={() => setIsAddOpen(false)}
          onCreated={handleCreated}
        />
      )}
    </Page>
  );
};

export default RecipesPage;
