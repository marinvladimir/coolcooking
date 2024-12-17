import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export async function handler(event) {
  try {
    const { data, error } = await supabase.from('recipes').select('*');

    if (error) {
      throw error;
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err) {
    console.error('Error fetching recipes:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error fetching recipes' }),
    };
  }
}
