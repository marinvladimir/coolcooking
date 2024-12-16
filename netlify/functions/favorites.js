import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export const handler = async (event) => {
  const authHeader = event.headers['Authorization'] || event.headers['authorization'];

  if (!authHeader) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Authorization header missing' }),
    };
  }

  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Token missing or malformed' }),
    };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id; 

    const { data, error } = await supabase
      .from('favorites')
      .select('recipe_id')
      .eq('user_id', userId);

    if (error) {
      throw new Error(error.message);
    }

    if (data.length > 0) {
      const recipeIds = data.map((fav) => fav.recipe_id); 
      const { data: recipes, error: recipesError } = await supabase
        .from('recipes')
        .select('*')
        .in('id', recipeIds);

      if (recipesError) {
        throw new Error(recipesError.message);
      }

      return {
        statusCode: 200,
        body: JSON.stringify({ favorites: recipes }),
      };
    } else {
      return {
        statusCode: 200,
        body: JSON.stringify({ favorites: [] }),
      };
    }
  } catch (err) {
    console.error('Error fetching favorites:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error fetching favorites' }),
    };
  }
};
