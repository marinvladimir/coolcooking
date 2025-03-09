import React, { useState } from 'react';
import Select from 'react-select';
import {
  CloseButton,
  ErrorMessage,
  FileInputWrapper,
  Form,
  FormTitle,
  FormWrapper,
  HiddenInput,
  Input,
  ModalBackground,
  ModalContainer,
  StyledSelect,
  StyledSelectContainer,
  SubmitButton,
  SuccessMessage,
  TextArea,
  UploadButton,
} from '../styles/ComponentStyles';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import SpinnerComponent from './SpinnerComponent';
import { useTheme } from '../states/ThemeContext';
import { IngredientEnum } from '../enums/ingredientEnum';
import { apiService } from '../api/api';

const AddRecipeModal: React.FC<AddRecipeModalProps> = ({
  setAnimationTriggered,
  setRecipes,
  setIsOpen,
}) => {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const { theme } = useTheme();
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<RecipeFormInputs>({
    defaultValues: {
      ingredients: '',
    },
  });

  const closeModal = () => setIsOpen(false);

  const handleIngredientChange = (selectedOptions: any) => {
    const selectedValues = selectedOptions.map((option: any) => option.value);
    setSelectedIngredients(selectedValues);
    setValue('ingredients', selectedValues.join(', '));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      setUploadSuccess(true);
    } else {
      setFile(null);
      setUploadSuccess(false);
    }
  };

  const IngredientOptions = Object.values(IngredientEnum).map((ingredient) => ({
    value: ingredient,
    label: ingredient,
  }));

  const onSubmit: SubmitHandler<RecipeFormInputs> = async (data: any) => {
    setIsSubmitting(true);
    try {
      await apiService.uploadRecipe(data, file);
      const recipes = await apiService.fetchRecipes();
      setRecipes(recipes);
      setIsOpen(false);
      setAnimationTriggered(true);
      setTimeout(() => {
        setAnimationTriggered(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to upload recipe:', error);
    } finally {
      setIsSubmitting(false);
      reset();
      setFile(null);
      setSelectedIngredients([]);
    }
  };

  const generateRecipe = async () => {
    if (selectedIngredients.length === 0) return;
    
    try {
      setIsSubmitting(true);
      
      const recipe = await apiService.fetchGeneratedRecipe(selectedIngredients);
      console.log('Generated Recipe:', recipe);

      // const data = await response.json();
      // if (data.recipe) {
      //   setValue('title', data.recipe.title);
      //   setValue('description', data.recipe.description);
      // }
    } catch (error) {
      console.error('Error generating recipe:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <ModalBackground>
      <ModalContainer theme={theme}>
        <CloseButton onClick={closeModal}>x</CloseButton>
        <FormTitle>Add a New Recipe</FormTitle>
        <FormWrapper>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Input
              {...register('title', { required: 'Title is required' })}
              placeholder="Recipe Title"
            />
            {errors.title && (
              <ErrorMessage>{errors?.title.message}</ErrorMessage>
            )}

            <TextArea
              {...register('description', {
                required: 'Description is required',
              })}
              placeholder="Recipe Description"
              rows={4}
            />
            {errors.description && (
              <ErrorMessage>{errors?.description.message}</ErrorMessage>
            )}

            <StyledSelect
              {...register('category', {
                required: 'Category is required',
              })}
              defaultValue=""
            >
              <option value="" disabled>
                Select a category
              </option>
              <option value="soups">Soups</option>
              <option value="desserts">Desserts</option>
              <option value="mainDishes">Main Dishes</option>
              <option value="salads">Salads</option>
              <option value="drinks">Drinks</option>
            </StyledSelect>
            {errors.category && (
              <ErrorMessage>{errors?.category.message}</ErrorMessage>
            )}

            <Controller
              name="ingredients"
              control={control}
              rules={{
                required: 'Ingredients are required',
                validate: (value) =>
                  value.length > 0 || 'Please select at least one ingredient',
              }}
              render={({ field }) => (
                <StyledSelectContainer>
                  <Select
                    {...field}
                    options={IngredientOptions}
                    isMulti
                    classNamePrefix="my-custom-select"
                    value={IngredientOptions.filter((option) =>
                      selectedIngredients.includes(option.value)
                    )}
                    onChange={(selectedOptions) => {
                      handleIngredientChange(
                        selectedOptions as {
                          value: string;
                          label: string;
                        }[]
                      );
                    }}
                    placeholder="Select ingredients..."
                  />
                </StyledSelectContainer>
              )}
            />
            {errors.ingredients && (
              <ErrorMessage>{errors?.ingredients.message}</ErrorMessage>
            )}

            <Input
              type="number"
              {...register('cooking_time', {
                required: 'Cooking time is required',
                min: {
                  value: 1,
                  message: 'Cooking time must be at least 1',
                },
                max: {
                  value: 240,
                  message: 'Cooking time must be less than 240',
                },
              })}
              placeholder="Cooking Time"
            />
            {errors.cooking_time && (
              <ErrorMessage>{errors.cooking_time.message}</ErrorMessage>
            )}

            <UploadButton onClick={generateRecipe} disabled={isSubmitting}>
              {isSubmitting ? 'Generating...' : 'Generate Recipe with AI'}
            </UploadButton>


            <FileInputWrapper>
              <HiddenInput
                {...register('image', {
                  required: 'Recipe image is required',
                })}
                type="file"
                accept="image/*"
                id="file-upload"
                onChange={handleFileChange}
              />
              <UploadButton
                type="button"
                theme={theme}
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                Upload Recipe Image
              </UploadButton>
            </FileInputWrapper>
            {errors.image && (
              <ErrorMessage>{errors?.image.message}</ErrorMessage>
            )}
            {uploadSuccess && (
              <SuccessMessage>Image uploaded successfully!</SuccessMessage>
            )}
            <SubmitButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? <SpinnerComponent /> : 'Add Recipe'}
            </SubmitButton>
          </Form>
        </FormWrapper>
      </ModalContainer>
    </ModalBackground>
  );
};

export default AddRecipeModal;
