import styled, { css, keyframes } from 'styled-components';

export const FormTitle = styled.h2`
  font-size: 1.75rem;
  margin-bottom: 1rem;
  color: ${(props) => props.theme.colors.accent};
  text-align: center;
  font-weight: bold;
  letter-spacing: 0.5px;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

export const FormWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const Input = styled.input`
  padding: 0.9rem 1.1rem;
  font-size: 1rem;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 8px;
  background-color: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.text};
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.accent};
    box-shadow: 0 0 10px ${(props) => props.theme.colors.accent};
  }

  &::placeholder {
    color: ${(props) => props.theme.colors.placeholder};
  }
`;

export const FileInputWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

export const HiddenInput = styled.input`
  display: none;
`;

export const UploadButton = styled.button<{ theme: string }>`
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  padding: 12px 24px;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.background};
    transform: scale(1.05);
  }

  &:focus {
    outline: none;
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.secondary};
    cursor: not-allowed;
  }
`;

export const SuccessMessage = styled.p`
  color: ${(props) => props.theme.colors.success};
  font-size: 0.9rem;
  text-align: center;
  margin-top: 1rem;
  opacity: 0.8;
`;

export const TextArea = styled.textarea`
  padding: 0.9rem 1.1rem;
  font-size: 1rem;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 8px;
  background-color: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.text};
  resize: none;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.accent};
    box-shadow: 0 0 10px ${(props) => props.theme.colors.accent};
  }

  &::placeholder {
    color: ${(props) => props.theme.colors.placeholder};
  }
`;

export const SubmitButton = styled.button<{ disabled?: boolean }>`
  padding: 1rem;
  font-size: 1.125rem;
  border: none;
  border-radius: 8px;
  background-color: ${(props) =>
    props.disabled
      ? props.theme.colors.disabledText
      : props.theme.colors.accent};
  color: ${(props) =>
    props.disabled
      ? props.theme.colors.disabledText
      : props.theme.colors.background};
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  transition:
    background-color 0.3s ease,
    transform 0.3s ease,
    box-shadow 0.3s ease;

  @media (max-width: 768px) {
    padding: 0.7rem;
    font-size: 0.95rem;
  }

  @media (max-width: 480px) {
    padding: 0.6rem;
    font-size: 0.85rem;
  }

  &:hover {
    background-color: ${(props) =>
      props.disabled ? undefined : props.theme.colors.accentHover};
    transform: ${(props) => (props.disabled ? 'none' : 'scale(1.05)')};
    box-shadow: ${(props) =>
      props.disabled ? 'none' : '0 8px 20px rgba(0, 0, 0, 0.25)'};
  }

  &:focus {
    outline: none;
    box-shadow: ${(props) =>
      props.disabled ? 'none' : `0 0 0 3px ${props.theme.colors.primary}`};
  }
`;

export const steam = keyframes`
  0% {
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateY(-20px);
    opacity: 0;
  }
`;

export const fadeIn = keyframes`
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const Content = styled.main`
  flex: 1;
  padding: 3rem;
  text-align: center;

  @media (max-width: 768px) {
    padding: 3rem 0;
  }

  h1 {
    font-size: 2.5rem;

    @media (max-width: 768px) {
      font-size: 1.5rem;
    }

    margin-bottom: 1.5rem;
    color: ${(props) => props.theme.colors.accent};
  }
`;

export const ContentParagraph = styled.p`
  font-size: 1rem;
  max-width: 800px;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }

  height: 3.2rem;
  overflow: overlay;
  text-overflow: ellipsis;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    button {
      width: 70%;
    }
  }
`;

export const Button = styled.button<{ $isSelected: boolean }>`
  padding: 0.8rem 1.5rem;
  background-color: ${(props) => props.theme.colors.accent};
  color: ${(props) => props.theme.colors.background};
  font-family: 'Raleway', sans-serif;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: ${(props) => (props.$isSelected ? 'not-allowed' : 'pointer')};
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  animation: ${(props) => (props.$isSelected ? steam : 'none')} 2s infinite
    ease-out;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.3);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${(props) => props.theme.colors.primary};
  }
`;

export const Wrapper = styled.div`
  background-color: ${(props) => props.theme.colors.lightBackground};
  border-radius: 12px;
  padding: 2rem 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: ${fadeIn} 1s ease-out;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
`;

export const StyledError = styled.div`
  color: ${({ theme }) => theme.colors.disabled};
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.secondary};
  text-align: center;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px; // Optional: rounded corners for a softer look
  margin: 1rem 0; // Adds some space around the error box
`;

export const Flex = styled.div`
  display: flex;
  justify-content: center;
`;

export const RecipeWrapper = styled.section`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  gap: 2rem;
  margin-top: 3rem;
  padding: 2rem;
  border-radius: 8px;
  animation: ${fadeIn} 1s ease-out;
  background-color: ${(props) => props.theme.colors.lightBackground};
`;

export const Card = styled.div`
  width: 280px;
  background-color: ${(props) => props.theme.colors.background};
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s;
  cursor: pointer;

  ::-webkit-scrollbar-track {
    background: ${(props) => props.theme.colors.lightBackground};
  }

  &:hover {
    transform: translateY(-10px);
  }
`;

export const CardImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: contain;
  padding: 1rem;
`;

export const CardContent = styled.div`
  padding: 1rem;
`;

export const CardTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: ${(props) => props.theme.colors.primary};
`;

export const CardDescription = styled.p`
  font-size: 0.75rem;
  height: 3.75rem;
  overflow: overlay;
  text-overflow: ellipsis;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding-bottom: 1rem;
`;

export const Modal = styled.div<{ $isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  opacity: 0;
  pointer-events: none;
  transition:
    opacity 0.3s,
    pointer-events 0s 0.3s;

  ${(props) =>
    props.$isVisible &&
    `
    opacity: 1;
    pointer-events: auto;
  `}
`;

export const ModalContent = styled.div`
  background-color: ${(props) => props.theme.colors.background};
  padding: 2rem;
  border-radius: 10px;
  max-width: 800px;
  width: 100%;
  animation: expand 0.3s ease-out;

  @keyframes expand {
    0% {
      transform: scale(0);
    }
    100% {
      transform: scale(1);
    }
  }
`;

export const BoardChopAnimation = keyframes`
  0% {
    transform: rotate(0);
  }
  25% {
    transform: rotate(-5deg);
  }
      50% {
    transform: rotate(0deg);
  }
      75% {
    transform: rotate(5deg);
  }
  100% {
    transform: rotate(0);
  }
`;

export const SearchContainer = styled.div`
  display: flex;
  justify-content: space-between;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const SearchWrapper = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const ChoppingBoard = styled.img<{ $isChopping: boolean }>`
  width: 150px;
  height: auto;
  object-fit: contain;
  animation: ${({ $isChopping }) =>
    $isChopping
      ? css`
          ${BoardChopAnimation} 0.2s ease-in-out
        `
      : 'none'};
`;

export const moveUpAndDown = keyframes`
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0);
  }
`;

export const PotImage = styled.img<{ $animate: boolean }>`
  width: 150px;
  height: auto;
  object-fit: contain;
  animation: ${({ $animate }) =>
    $animate
      ? css`
          ${moveUpAndDown} 0.2s ease-in-out
        `
      : 'none'};
`;

export const SearchInput = styled.input`
  width: 250px;
  padding: 10px 15px;
  font-size: 16px;
  border: none;
  outline: none;
  border: 2px solid ${(props) => props.theme.colors.border};
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.text};

  @media (max-width: 768px) {
    width: 70%;
  }

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.accent};
  }
`;

export const StyledSelectContainer = styled.div`
  .my-custom-select__control {
    background-color: ${(props) => props.theme.colors.background};
    border: 2px solid ${(props) => props.theme.colors.border};
    color: ${(props) => props.theme.colors.text};
  }

  .my-custom-select__control .my-custom-select__value-container {
    padding: 8px 8px !important;
  }

  .my-custom-select__menu {
    background-color: ${(props) => props.theme.colors.lightBackground};
  }

  .my-custom-select__option {
    background-color: ${(props) => props.theme.colors.lightBackground};
    color: ${(props) => props.theme.colors.text};
    &:hover {
      background-color: ${(props) => props.theme.colors.primary};
      color: #fff;
    }
  }

  .my-custom-select__multi-value {
    background-color: ${(props) => props.theme.colors.accent};
    color: #fff;
  }

  .my-custom-select__multi-value__label {
    color: #fff;
  }

  .my-custom-select__multi-value__remove {
    color: #fff;
    &:hover {
      background-color: ${(props) => props.theme.colors.secondary};
      color: ${(props) => props.theme.colors.text};
    }
  }
`;

export const ModalImage = styled.img`
  width: 100%;
  height: 300px;
  object-fit: contain;
`;

export const ModalTitle = styled.h2`
  font-size: 2rem;
  color: ${(props) => props.theme.colors.primary};
  margin-top: 1rem;
`;

export const ModalDescription = styled.p`
  font-size: 1rem;
  color: ${(props) => props.theme.colors.text};
  margin-top: 1rem;
`;

export const ModalIngredients = styled.ul`
  margin-top: 1rem;
  padding: 0;
  list-style: none;
`;

export const ModalCookingTime = styled.p`
  font-size: 1rem;
  color: ${(props) => props.theme.colors.accent};
  margin: 1rem 0 0 0;
`;

export const Ingredients = styled.ul`
  height: 3.25rem;
  overflow: overlay;
  text-overflow: ellipsis;
  list-style: none;
  padding: 0;
  margin: 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
`;

export const CookingTime = styled.p`
  font-size: 0.8rem;
  margin: 0.5rem 0;
  color: ${(props) => props.theme.colors.accent};
`;

export const CardDetails = styled.div`
  font-size: 0.9rem;
  color: ${(props) => props.theme.colors.text};
  padding-top: 1rem;
`;

export const IngredientItem = styled.li`
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.colors.text};
`;

export const ClockIcon = styled.img`
  width: 48px;
  border-radius: 8px;
  background: ${(props) => props.theme.colors.primary};
  box-shadow: 0 1px 3px rgba(255, 255, 255, 0.1);
`;

export const StyledSelect = styled.select`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 0.25rem;
  background-color: ${(props) => props.theme.colors.background};
  font-size: 1rem;
  color: ${(props) => props.theme.colors.text};
`;

export const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  padding: 1rem 0;
`;

export const PageButton = styled.button<{ $active: boolean }>`
  background-color: ${(props) =>
    props.$active ? props.theme.colors.accent : props.theme.colors.background};
  border: 1px solid ${(props) => props.theme.colors.border};
  color: ${(props) =>
    props.$active ? props.theme.colors.background : props.theme.colors.accent};
  padding: 10px 15px;
  margin: 0 5px;
  cursor: pointer;
  border-radius: 5px;
  font-size: 16px;
  transition:
    background-color 0.3s ease,
    color 0.3s ease;

  &:hover {
    background-color: ${(props) =>
      props.$active
        ? props.theme.colors.background
        : props.theme.colors.accent};
    color: ${(props) =>
      props.$active ? props.theme.colors.accent : props.theme.colors.disabled};
  }

  &:disabled {
    background-color: ${(props) => props.theme.colors.disabled};
    border: 1px solid ${(props) => props.theme.colors.disabledBorder};
    cursor: not-allowed;
  }
`;

export const OpenModalButton = styled.button<{ theme: string }>`
  background-color: ${(props) => props.theme.colors.accent};
  color: ${(props) => props.theme.colors.background};
  padding: 12px 24px;
  width: 100% !important;
  border: none;
  font-weight: 700;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition:
    background-color 0.3s,
    transform 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    transform: scale(1.05);
  }

  &:focus {
    outline: none;
  }
`;

export const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 1000;
  backdrop-filter: blur(10px);
  animation: fadeIn 0.3s ease-out;
`;

export const ModalContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: ${(props) => props.theme.colors.lightBackground};
  border-radius: 16px;
  padding: 2rem;
  width: 85%;
  max-width: 500px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-out;
  overflow: hidden;

  @media (max-width: 768px) {
    width: 90%;
    padding: 1.5rem;
  }

  @media (max-width: 480px) {
    width: 95%;
    padding: 1rem;
  }
`;

export const CloseButton = styled.button`
  background-color: transparent;
  border: none;
  color: ${(props) => props.theme.colors.primary};
  font-size: 1.5rem;
  position: absolute;
  top: 10px;
  right: 15px;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: ${(props) => props.theme.colors.accent};
  }

  @media (max-width: 768px) {
    top: 10px;
    right: 15px;
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    top: 5px;
    right: 10px;
    font-size: 0.9rem;
  }
`;

export const ModalButtonWrapper = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
  height: 30px;
  align-self: center;
  border-radius: 8px;
`;

export const ToggleWrapper = styled.button`
  border: none;
  background: unset;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease-in-out;
  margin: 0 auto;

  &:hover {
    background-color: ${({ theme }) => theme.colors.lightBackground};
  }

  span {
    margin-left: 8px;
    color: ${({ theme }) => theme.colors.accent};
  }
`;

export const SvgWrapper = styled.div`
  margin-right: -0.5rem;
  svg {
    width: 24px;
    fill: ${({ theme }) => theme.colors.accent};
  }

  &:hover svg {
    fill: ${({ theme }) => theme.colors.primary};
  }
`;

export const ErrorMessage = styled.p`
  color: ${(props) => props.theme.colors.primary};
  font-size: 14px;
  display: block;
`;
