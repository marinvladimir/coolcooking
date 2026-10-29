import supabase from '../lib/supabase.js';
import { getUserId, json, unauthorized } from '../lib/http.js';

export const handler = async (event) => {
  const userId = getUserId(event);
  if (!userId) return unauthorized();

  const recipeId = Number(event.queryStringParameters?.recipeId);
  if (!Number.isInteger(recipeId) || recipeId <= 0) {
    return json(400, { error: 'A valid recipe ID is required' });
  }

  try {
    switch (event.httpMethod) {
      case 'GET': {
        const { data, error } = await supabase
          .from('favorites')
          .select('recipe_id')
          .eq('user_id', userId)
          .eq('recipe_id', recipeId)
          .maybeSingle();

        if (error) throw error;
        return json(200, { isFavorite: Boolean(data) });
      }

      case 'POST': {
        const { error } = await supabase
          .from('favorites')
          .upsert([{ user_id: userId, recipe_id: recipeId }], {
            onConflict: 'user_id,recipe_id',
          });

        if (error) throw error;
        return json(201, { isFavorite: true });
      }

      case 'DELETE': {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', userId)
          .eq('recipe_id', recipeId);

        if (error) throw error;
        return json(200, { isFavorite: false });
      }

      default:
        return json(405, { error: 'Method Not Allowed' });
    }
  } catch (err) {
    console.error('Error updating favorite:', err);
    return json(500, { error: 'Could not update favorites' });
  }
};
