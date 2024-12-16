import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export const handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method Not Allowed' }),
      };
    }
    let body;
    try {
      body = JSON.parse(event.body);
    } catch (error) {
      console.error('Invalid JSON in request:', error.message);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid JSON in request body' }),
      };
    }
    const { title, description, category, ingredients, cooking_time, image_url } = body;
    if (!title || !image_url) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields: title or image_url' }),
      };
    }
    let ingredientsArray = [];
    if (ingredients && typeof ingredients === 'string') {
      ingredientsArray = ingredients.split(',').map((item) => item.trim());
    }
    const { data, error } = await supabase
      .from('recipes')
      .insert([
        {
          title,
          description,
          category,
          ingredients: ingredientsArray,
          cooking_time,
          image: image_url,
        },
      ])
      .single();
    if (error) {
      console.error('Supabase error:', error.message);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to save recipe in database' }),
      };
    }
    return {
      statusCode: 201,
      body: JSON.stringify({ recipe: data }),
    };
  } catch (err) {
    console.error('Unexpected error:', err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
