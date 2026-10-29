import supabase from '../lib/supabase.js';
import { getUserId, json, unauthorized } from '../lib/http.js';

export const handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return json(405, { error: 'Method Not Allowed' });
  }

  const userId = getUserId(event);
  if (!userId) return unauthorized();

  try {
    const { data, error } = await supabase
      .from('favorites')
      .select('recipe_id')
      .eq('user_id', userId);

    if (error) throw error;

    if (data.length === 0) {
      return json(200, { favorites: [] });
    }

    const { data: recipes, error: recipesError } = await supabase
      .from('recipes')
      .select('*')
      .in(
        'id',
        data.map((fav) => fav.recipe_id)
      )
      .order('id', { ascending: false });

    if (recipesError) throw recipesError;

    return json(200, { favorites: recipes });
  } catch (err) {
    console.error('Error fetching favorites:', err);
    return json(500, { error: 'Error fetching favorites' });
  }
};
