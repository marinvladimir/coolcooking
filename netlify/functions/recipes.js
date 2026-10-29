import supabase from '../lib/supabase.js';
import { json } from '../lib/http.js';

export const handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return json(405, { error: 'Method Not Allowed' });
  }

  try {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .order('id', { ascending: false });

    if (error) throw error;

    return json(200, data);
  } catch (err) {
    console.error('Error fetching recipes:', err);
    return json(500, { error: 'Error fetching recipes' });
  }
};
