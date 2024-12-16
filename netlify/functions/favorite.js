import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export const handler = async (event) => {
  const { recipeId } = event.queryStringParameters || {};
  const authHeader = event.headers['Authorization'] || event.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!authHeader) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Authorization header missing' }),
    };
  }

  if (!recipeId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Recipe ID is required' }),
    };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    if (event.httpMethod === 'GET') {
      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', userId)
        .eq('recipe_id', recipeId)
        .maybeSingle(); 

      if (error) throw error;

      return {
        statusCode: 200,
        body: JSON.stringify({ isFavorite: data ? true : false }),
      };
    }

    else if (event.httpMethod === 'POST') {
      const { data, error } = await supabase
        .from('favorites')
        .upsert([
          {
            user_id: userId,
            recipe_id: recipeId,
          },
        ], { onConflict: ['user_id', 'recipe_id'] }); 

      if (error) throw error;

      return {
        statusCode: 201,
        body: JSON.stringify({ favorite: data }),
      };
    }

    else if (event.httpMethod === 'DELETE') {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', userId)
        .eq('recipe_id', recipeId);

      if (error) {
        console.error('Error removing from favorites:', error);
        return {
          statusCode: 500,
          body: JSON.stringify({ error: 'Failed to remove recipe from favorites' }),
        };
      }

      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Recipe removed from favorites' }),
      };
    }

    // Method not allowed
    else {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method Not Allowed' }),
      };
    }
  } catch (err) {
    console.error('JWT verification error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
