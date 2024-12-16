import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export const handler = async (event) => {
  const { recipeId } = event.queryStringParameters || {}; 

  if (!recipeId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Recipe ID is required' }),
    };
  }

  const userId = event.requestContext.authorizer.claims.sub;

  if (event.httpMethod === 'GET') {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', userId)
        .eq('recipe_id', recipeId)
        .single();  

      if (error) {
        throw error;
      }

      if (data) {
        return {
          statusCode: 200,
          body: JSON.stringify({ isFavorite: true }),
        };
      } else {
        return {
          statusCode: 200,
          body: JSON.stringify({ isFavorite: false }),
        };
      }
    } catch (err) {
      console.error('Error checking favorite:', err);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Error checking favorite' }),
      };
    }
  } else if (event.httpMethod === 'POST') {
    try {
      const { data, error, status } = await supabase
        .from('favorites')
        .upsert(
          [{ user_id: userId, recipe_id: recipeId }],
          { onConflict: ['user_id', 'recipe_id'] }
        )
        .single();

      if (error) {
        throw error;
      }

      if (status === 409) {
        return {
          statusCode: 409,
          body: JSON.stringify({ error: 'Recipe already in favorites' }),
        };
      }

      return {
        statusCode: 201,
        body: JSON.stringify({ favorite: data }),
      };
    } catch (err) {
      console.error('Error adding to favorites:', err);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to add recipe to favorites' }),
      };
    }
  }
};
