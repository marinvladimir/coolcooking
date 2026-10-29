import supabase from '../lib/supabase.js';
import { getUserId, json, parseBody, unauthorized } from '../lib/http.js';

const CATEGORIES = ['soups', 'desserts', 'salads', 'mainDishes', 'drinks'];

const toIngredientList = (value) => {
  const list = Array.isArray(value) ? value : String(value ?? '').split(',');
  return list.map((item) => String(item).trim()).filter(Boolean);
};

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method Not Allowed' });
  }

  if (!getUserId(event)) return unauthorized();

  const body = parseBody(event);
  if (!body) {
    return json(400, { error: 'Invalid JSON in request body' });
  }

  const title = String(body.title ?? '').trim();
  const description = String(body.description ?? '').trim();
  const category = String(body.category ?? '');
  const ingredients = toIngredientList(body.ingredients);
  const cookingTime = Number(body.cooking_time);
  const imageUrl = String(body.image_url ?? '');

  if (!title || !description) {
    return json(400, { error: 'Title and description are required' });
  }
  if (!CATEGORIES.includes(category)) {
    return json(400, { error: 'Unknown recipe category' });
  }
  if (ingredients.length === 0) {
    return json(400, { error: 'Select at least one ingredient' });
  }
  if (!Number.isInteger(cookingTime) || cookingTime < 1 || cookingTime > 240) {
    return json(400, { error: 'Cooking time must be between 1 and 240 min' });
  }
  if (!imageUrl.startsWith('https://')) {
    return json(400, { error: 'A valid image URL is required' });
  }

  try {
    const { data, error } = await supabase
      .from('recipes')
      .insert([
        {
          title,
          description,
          category,
          ingredients,
          cooking_time: String(cookingTime),
          image: imageUrl,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return json(201, { recipe: data });
  } catch (err) {
    console.error('Error saving recipe:', err);
    return json(500, { error: 'Failed to save recipe' });
  }
};
