import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export const handler = async (event) => {
  const authHeader = event.headers.Authorization || '';
  const token = authHeader.split(' ')[1]; 
  
  if (!token) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Unauthorized' }),
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

    return {
      statusCode: 200,
      body: JSON.stringify({ favorites: data }),
    };
  } catch (err) {
    console.error('Error fetching favorites:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error fetching favorites' }),
    };
  }
};
