import React, { useEffect, useState } from 'react';
import Select, { StylesConfig } from 'react-select';
import styled, { useTheme } from 'styled-components';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import type { Recipe, RecipeCategory } from '../types';
import { apiService, getErrorMessage } from '../api/api';
import { CATEGORY_LABELS, RECIPE_CATEGORIES } from '../constants/categories';
import { IngredientEnum } from '../enums/ingredientEnum';
import { ImageIcon } from '../icons/icons';
import {
  Button,
  Field,
  FieldError,
  Hint,
  Input,
  Label,
  Select as NativeSelect,
  TextArea,
  visuallyHidden,
} from '../styles/ui';
import {
  showErrorNotification,
  showSuccessNotification,
} from '../utils/notification';
import Modal from './Modal';
import Spinner from './Spinner';

const MAX_IMAGE_MB = 8;

type Option = { value: string; label: string };

type RecipeFormInputs = {
  title: string;
  description: string;
  category: RecipeCategory | '';
  ingredients: string[];
  cooking_time: string;
  image: FileList;
};

const INGREDIENT_OPTIONS: Option[] = Object.values(IngredientEnum)
  .sort((a, b) => a.localeCompare(b))
  .map((ingredient) => ({ value: ingredient, label: ingredient }));

const Body = styled.div`
  padding: 2rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 1.5rem 1.25rem;
  }

  h2 {
    font-size: 1.75rem;
    margin-bottom: 0.35rem;
    padding-right: 3rem;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  margin-top: 1.5rem;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const DropZone = styled.label<{ $invalid: boolean }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 1.5px dashed
    ${({ $invalid, theme }) =>
      $invalid ? theme.colors.error : theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.surfaceAlt};
  cursor: pointer;
  transition: border-color 0.2s ease;

  &:hover,
  &:focus-within {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  input {
    ${visuallyHidden}
  }

  > span:first-of-type {
    display: grid;
    place-items: center;
    flex-shrink: 0;
    width: 72px;
    height: 72px;
    border-radius: ${({ theme }) => theme.radius.sm};
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.textMuted};
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  strong {
    display: block;
    color: ${({ theme }) => theme.colors.primaryDark};
  }

  small {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 0.5rem;
`;

interface AddRecipeModalProps {
  onClose: () => void;
  onCreated: (recipe: Recipe) => void;
}

const AddRecipeModal: React.FC<AddRecipeModalProps> = ({
  onClose,
  onCreated,
}) => {
  const theme = useTheme();
  const [preview, setPreview] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RecipeFormInputs>({
    defaultValues: { category: '', ingredients: [] },
  });

  const imageFile = watch('image')?.[0];

  useEffect(() => {
    if (!imageFile) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(imageFile);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const selectStyles: StylesConfig<Option, true> = {
    control: (base, state) => ({
      ...base,
      minHeight: 48,
      borderWidth: 1.5,
      borderRadius: 8,
      borderColor: errors.ingredients
        ? theme.colors.error
        : state.isFocused
          ? theme.colors.primary
          : theme.colors.border,
      boxShadow: state.isFocused
        ? `0 0 0 3px ${theme.colors.primarySoft}`
        : 'none',
      '&:hover': { borderColor: theme.colors.primary },
    }),
    placeholder: (base) => ({ ...base, color: theme.colors.textMuted }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: theme.colors.primarySoft,
      borderRadius: 999,
      paddingLeft: 4,
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: theme.colors.primaryDark,
      fontWeight: 600,
    }),
    multiValueRemove: (base) => ({
      ...base,
      borderRadius: 999,
      color: theme.colors.primaryDark,
      ':hover': { backgroundColor: theme.colors.primary, color: '#fff' },
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused
        ? theme.colors.primarySoft
        : 'transparent',
      color: theme.colors.text,
    }),
    menu: (base) => ({ ...base, zIndex: 5 }),
  };

  const onSubmit: SubmitHandler<RecipeFormInputs> = async (data) => {
    try {
      const recipe = await apiService.uploadRecipe(
        {
          title: data.title.trim(),
          description: data.description.trim(),
          category: data.category as RecipeCategory,
          ingredients: data.ingredients,
          cooking_time: Number(data.cooking_time),
        },
        data.image[0]
      );
      showSuccessNotification('Your recipe has been published!');
      onCreated(recipe);
    } catch (error) {
      showErrorNotification(getErrorMessage(error, 'Could not add the recipe'));
    }
  };

  return (
    <Modal onClose={onClose} labelledBy="add-recipe-title" width={640}>
      <Body>
        <h2 id="add-recipe-title">Share a recipe</h2>
        <Hint>Fill in the details below – all fields are required.</Hint>

        <Form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Field>
            <Label htmlFor="recipe-title">Title</Label>
            <Input
              id="recipe-title"
              placeholder="e.g. Creamy pumpkin soup"
              aria-invalid={Boolean(errors.title)}
              {...register('title', {
                required: 'Please give your recipe a title',
                maxLength: { value: 80, message: 'Max. 80 characters' },
              })}
            />
            {errors.title && <FieldError>{errors.title.message}</FieldError>}
          </Field>

          <Field>
            <Label htmlFor="recipe-description">Description</Label>
            <TextArea
              id="recipe-description"
              rows={4}
              placeholder="What makes this dish special? How is it prepared?"
              aria-invalid={Boolean(errors.description)}
              {...register('description', {
                required: 'Please add a short description',
              })}
            />
            {errors.description && (
              <FieldError>{errors.description.message}</FieldError>
            )}
          </Field>

          <Row>
            <Field>
              <Label htmlFor="recipe-category">Category</Label>
              <NativeSelect
                id="recipe-category"
                aria-invalid={Boolean(errors.category)}
                {...register('category', {
                  required: 'Please choose a category',
                })}
              >
                <option value="" disabled>
                  Choose a category
                </option>
                {RECIPE_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {CATEGORY_LABELS[category]}
                  </option>
                ))}
              </NativeSelect>
              {errors.category && (
                <FieldError>{errors.category.message}</FieldError>
              )}
            </Field>

            <Field>
              <Label htmlFor="recipe-time">Cooking time (minutes)</Label>
              <Input
                id="recipe-time"
                type="number"
                inputMode="numeric"
                min={1}
                max={240}
                placeholder="30"
                aria-invalid={Boolean(errors.cooking_time)}
                {...register('cooking_time', {
                  required: 'Please enter the cooking time',
                  min: { value: 1, message: 'At least 1 minute' },
                  max: { value: 240, message: 'At most 240 minutes' },
                  validate: (value) =>
                    Number.isInteger(Number(value)) || 'Use whole minutes',
                })}
              />
              {errors.cooking_time && (
                <FieldError>{errors.cooking_time.message}</FieldError>
              )}
            </Field>
          </Row>

          <Field>
            <Label id="recipe-ingredients-label">Ingredients</Label>
            <Controller
              name="ingredients"
              control={control}
              rules={{
                validate: (value) =>
                  value.length > 0 || 'Select at least one ingredient',
              }}
              render={({ field }) => (
                <Select<Option, true>
                  inputId="recipe-ingredients"
                  aria-labelledby="recipe-ingredients-label"
                  isMulti
                  options={INGREDIENT_OPTIONS}
                  styles={selectStyles}
                  placeholder="Search and select ingredients…"
                  value={INGREDIENT_OPTIONS.filter((option) =>
                    field.value.includes(option.value)
                  )}
                  onChange={(options) =>
                    field.onChange(options.map((option) => option.value))
                  }
                  onBlur={field.onBlur}
                />
              )}
            />
            {errors.ingredients && (
              <FieldError>{errors.ingredients.message}</FieldError>
            )}
          </Field>

          <Field>
            <Label as="span">Photo</Label>
            <DropZone $invalid={Boolean(errors.image)}>
              <span>
                {preview ? <img src={preview} alt="" /> : <ImageIcon />}
              </span>
              <span>
                <strong>
                  {imageFile ? imageFile.name : 'Choose an image'}
                </strong>
                <small>JPG, PNG or WebP, up to {MAX_IMAGE_MB} MB</small>
              </span>
              <input
                type="file"
                accept="image/*"
                {...register('image', {
                  validate: (files) => {
                    const file = files?.[0];
                    if (!file) return 'Please add a photo of your dish';
                    if (!file.type.startsWith('image/'))
                      return 'The file must be an image';
                    if (file.size > MAX_IMAGE_MB * 1024 * 1024)
                      return `The image must be smaller than ${MAX_IMAGE_MB} MB`;
                    return true;
                  },
                })}
              />
            </DropZone>
            {errors.image && <FieldError>{errors.image.message}</FieldError>}
          </Field>

          <Footer>
            <Button type="button" $variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Spinner />}
              {isSubmitting ? 'Publishing…' : 'Publish recipe'}
            </Button>
          </Footer>
        </Form>
      </Body>
    </Modal>
  );
};

export default AddRecipeModal;
