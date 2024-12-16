import React, { useState } from 'react';
import {
  ChoppingBoard,
  PotImage,
  SearchContainer,
  SearchInput,
  SearchWrapper,
} from '../styles/ComponentStyles';
// import IngredientFilterModal from '../components/IngredientsFilterModal';

const Search: React.FC<SearchProps> = ({ handleSearch, triggered }) => {
  const [isChopping, setIsChopping] = useState(false);
  const handleKeyPress = () => {
    setIsChopping(true);
    setTimeout(() => setIsChopping(false), 200);
  };

  // const [filteringIngredients, setFilteringIngredients] = useState<string[]>([]);

  // const filteredByIngredientsRecipes = currentRecipes.filter((recipe) => {
  //   if (filteringIngredients.length === 0) return true;
  //   return recipe.ingredients.some((ingredient) =>
  //     filteringIngredients.includes(ingredient)
  //   );
  // });

  // const [filterModalOpen, setFilterModalOpen] = useState(false);

  // const openFilterModal = () => {
  //   setFilterModalOpen(true);
  // };

  // const closeFilterModal = () => {
  //   setFilterModalOpen(false);
  // };

  return (
    <SearchContainer>
      <SearchWrapper>
        <ChoppingBoard
          $isChopping={isChopping}
          src={`/assets/chopping_board.png`}
          alt="Chopping board"
        />
        <SearchInput
          onChange={handleSearch}
          type="text"
          placeholder="Search recipes..."
          onKeyDown={handleKeyPress}
        />
      </SearchWrapper>
      <div style={{ paddingRight: '8px' }}>
        <PotImage
          $animate={triggered}
          src="/assets/ingredients.png"
          alt="Ingredients"
          // onClick={openFilterModal}
        />
        {/* {filterModalOpen && (
    <IngredientFilterModal
          closeModal={closeFilterModal} 
          selectedIngredients={filteringIngredients} 
          setSelectedIngredients={setFilteringIngredients}        
          />
    )} */}
      </div>
    </SearchContainer>
  );
};

export default Search;
