import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export const handler = async (event) => {
  const { recipeId } = event.queryStringParameters || {};
  const authHeader = event.headers['Authorization'] || event.headers['authorization'];
  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

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

  if (event.httpMethod === 'GET') {
    try {

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id; 

      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', userId)
        .eq('recipe_id', recipeId)
        .maybeSingle();  
        

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
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id; 
      
      const { data, error } = await supabase
      .from('favorites')
      .upsert([
        {
          user_id: userId,
          recipe_id: recipeId,
        },
      ], { onConflict: ['user_id', 'recipe_id'] }); 

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
