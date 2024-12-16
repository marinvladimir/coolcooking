import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export const handler = async (event, context) => {
  const { title, description, category, ingredients, cooking_time } = JSON.parse(event.body);
  const file = event.body.file;

  if (!file) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'No image file provided' }),
    };
  }

  try {
    const { data, error: uploadError } = await supabase.storage
      .from('assets')
      .upload(`recipes/${file.filename}`, file, {
        contentType: file.mimetype,
      });

    if (uploadError) {
      throw uploadError;
    }

    const imageUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/${data.path}`;

    const { data: recipeData, error: dbError } = await supabase
      .from('recipes')
      .insert([
        {
          title,
          description,
          category,
          ingredients,
          cooking_time,
          image: imageUrl,
        },
      ])
      .single();

    if (dbError) {
      throw dbError;
    }

    return {
      statusCode: 201,
      body: JSON.stringify({ recipe: recipeData }),
    };
  } catch (error) {
    console.error('Error saving recipe to database:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to save recipe' }),
    };
  }
};
