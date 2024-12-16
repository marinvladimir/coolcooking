import React, { useEffect, useState } from 'react';
import { useTheme } from '../states/ThemeContext';
import { isAuthenticated } from '../components/PrivateRoute';
import {
  Button,
  ButtonWrapper,
  Content,
  ContentParagraph,
  Flex,
  ModalButtonWrapper,
  OpenModalButton,
  RecipeWrapper,
  StyledError,
  Wrapper,
} from '../styles/ComponentStyles';
import AddRecipeModal from '../components/AddRecipeModal';
import RecipeCard from '../components/RecipeCard';
import CurrentRecipeModal from '../components/CurrentRecipeModal';
import Pagination from '../components/Pagination';
import Search from '../components/Search';
import { apiService } from '../api/api';

const RecipesPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [animationTriggered, setAnimationTriggered] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [showElement, setShowElement] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const { category, setCategory } = useTheme();
  const { theme } = useTheme();

  const openModal = () => setIsOpen(true);

  useEffect(() => {
    if (category) {
      const filtered = recipes.filter((recipe) => recipe.category === category);
      setFilteredRecipes(filtered);
    } else {
      setFilteredRecipes(recipes);
    }
  }, [category, recipes]);

  useEffect(() => {
    let timer: any;
    if (isAuthenticated()) {
      timer = setTimeout(() => {
        setShowElement(true);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = (event: any) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const filteredBySearch = filteredRecipes?.filter((recipe) =>
    recipe.title.toLowerCase().includes(searchQuery)
  );

  const itemsPerPage = 5;
  const indexOfLastRecipe = currentPage * itemsPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - itemsPerPage;
  const currentRecipes = filteredBySearch.slice(
    indexOfFirstRecipe,
    indexOfLastRecipe
  );

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const data = await apiService.fetchRecipes();
        setRecipes(data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch recipes');
      }
    };
    fetchRecipes();
  }, []);

  const categories: RecipeCategory[] = [
    'mainDishes',
    'salads',
    'soups',
    'desserts',
    'drinks',
  ];

  const formatCategoryName = (category: string) => {
    return category
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/^./, (str) => str.toUpperCase());
  };

  return (
    <Content>
      <Wrapper style={{ padding: '2rem 0 0 0' }}>
        <h1>Explore Our Recipes</h1>
        <Flex>
          <ContentParagraph>
            Select a category to browse through various delicious recipes!
          </ContentParagraph>
        </Flex>
        <ButtonWrapper>
          {categories.map((cat) => (
            <Button
              key={cat}
              $isSelected={category === cat}
              onClick={() => {
                setCategory(cat);
                setCurrentPage(1);
              }}
              disabled={category === cat}
            >
              {formatCategoryName(cat)}
            </Button>
          ))}
        </ButtonWrapper>
        <Search handleSearch={handleSearch} triggered={animationTriggered} />
      </Wrapper>
      {error && <StyledError>{error}</StyledError>}

      {currentRecipes?.length > 0 && (
        <RecipeWrapper>
          {currentRecipes?.map((recipe, key) => (
            <RecipeCard
              key={key}
              recipe={recipe}
              setSelectedRecipe={setSelectedRecipe}
            />
          ))}
          {selectedRecipe && (
            <CurrentRecipeModal
              recipe={selectedRecipe}
              setRecipe={setSelectedRecipe}
              setHasStarted={setHasStarted}
              hasStarted={hasStarted}
            />
          )}
        </RecipeWrapper>
      )}

      {showElement && (
        <Wrapper>
          <h1>Add your own recipe</h1>
          <Flex>
            <ContentParagraph>
              Got a suggestion for your own recipe? Fill out the form and add it
              to our collection.
            </ContentParagraph>
          </Flex>
          <ButtonWrapper>
            <ModalButtonWrapper>
              <OpenModalButton theme={theme} onClick={openModal}>
                +
              </OpenModalButton>
            </ModalButtonWrapper>
          </ButtonWrapper>
        </Wrapper>
      )}
      {isOpen && (
        <AddRecipeModal
          setAnimationTriggered={setAnimationTriggered}
          setRecipes={setRecipes}
          setIsOpen={setIsOpen}
        />
      )}
      <Pagination
        list={filteredBySearch}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </Content>
  );
};

export default RecipesPage;
