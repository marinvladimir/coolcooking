import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export const handler = async (event) => {
  try {
    // Ensure the request is a POST
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method Not Allowed' }),
      };
    }

    // Parse the incoming JSON payload
    const body = JSON.parse(event.body);

    // Extract fields from the body
    const { title, description, category, ingredients, cooking_time, image_url } = body;

    // Validate required fields
    if (!image_url || !title) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields: title or image_url' }),
      };
    }

    // Insert data into the Supabase "recipes" table
    const { data, error } = await supabase
      .from('recipes')
      .insert([
        {
          title,
          description,
          category,
          ingredients: JSON.stringify(ingredients.split(',').map((item) => item.trim())),
          cooking_time,
          image_url,
        },
      ])
      .single();

    // Handle potential insertion errors
    if (error) {
      console.error('Supabase error:', error.message);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to save recipe in database' }),
      };
    }

    // Success response
    return {
      statusCode: 201,
      body: JSON.stringify({ recipe: data }),
    };
  } catch (err) {
    console.error('Error:', err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
