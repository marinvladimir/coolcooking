import React from 'react';
import styled from 'styled-components';
import { IngredientEnum } from '../enums/ingredientEnum';

const IngredientFilterModal: React.FC<IngredientFilterModalProps> = ({
  closeModal,
  selectedIngredients,
  setSelectedIngredients,
}) => {
  const handleIngredientClick = (ingredient: string) => {
    setSelectedIngredients((prev) => {
      if (prev.includes(ingredient)) {
        return prev.filter((item) => item !== ingredient);
      } else {
        return [...prev, ingredient];
      }
    });
  };

  const ingredients = Object.values(IngredientEnum);

  return (
    <FilterModalOverlay onClick={closeModal}>
      <FilterModalContainer onClick={(e) => e.stopPropagation()}>
        <FilterModalHeader>Filter by Ingredients</FilterModalHeader>
        <SelectedIngredients>
          {selectedIngredients.map((ingredient) => (
            <SelectedChip key={ingredient}>
              {ingredient}
              <RemoveButton onClick={() => handleIngredientClick(ingredient)}>
                x
              </RemoveButton>
            </SelectedChip>
          ))}
        </SelectedIngredients>
        <IngredientsFilterList>
          {ingredients.map((ingredient) => (
            <Chip
              key={ingredient}
              $isSelected={selectedIngredients.includes(ingredient)}
              onClick={() => handleIngredientClick(ingredient)}
            >
              {ingredient}
            </Chip>
          ))}
        </IngredientsFilterList>

        <CloseFilterModalButton onClick={closeModal}>
          Close
        </CloseFilterModalButton>
      </FilterModalContainer>
    </FilterModalOverlay>
  );
};

const FilterModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  display: ${(props) => (props.theme ? 'block' : 'none')};
`;

const FilterModalContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.text};
  border-radius: 10px;
  padding: 20px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  overflow-y: auto;
  z-index: 10000;
`;

const FilterModalHeader = styled.h2`
  color: ${(props) => props.theme.colors.primary};
  text-align: center;
  margin-bottom: 1rem;
`;

const IngredientsFilterList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 20px;
  border: solid 1px ${(props) => props.theme.colors.primary};
`;

const Chip = styled.div<{ $isSelected: boolean }>`
  padding: 10px 20px;
  background-color: ${(props) =>
    props.$isSelected
      ? props.theme.colors.secondary
      : props.theme.colors.primary};
  color: ${(props) =>
    props.$isSelected
      ? props.theme.colors.disabled
      : props.theme.colors.lightBackground};
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${(props) => props.theme.colors.accent};
  }
`;

const SelectedIngredients = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
`;

const SelectedChip = styled.div`
  padding: 5px 10px;
  background-color: ${(props) => props.theme.colors.secondary};
  color: ${(props) => props.theme.colors.disabled};
  border-radius: 20px;
  display: flex;
  align-items: center;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: ${(props) => props.theme.colors.primary};
  font-weight: bold;
  cursor: pointer;
  margin-left: 5px;
  font-size: 16px;
`;

const CloseFilterModalButton = styled.button`
  background-color: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.disabled};
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 16px;
  border-radius: 5px;
  margin-top: 20px;
  display: block;
  width: 100%;
  &:hover {
    background-color: ${(props) => props.theme.colors.secondary};
  }
`;

export default IngredientFilterModal;
