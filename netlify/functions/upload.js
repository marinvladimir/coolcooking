import cloudinary from 'cloudinary';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import formidable from 'formidable';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export const handler = async (event, context) => {
  const form = new formidable.IncomingForm();
  
  form.parse(event.body, async (err, fields, files) => {
    if (err) {
      console.error('Error parsing form data:', err);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Failed to parse form data' }),
      };
    }

    const { title, description, category, ingredients, cooking_time } = fields;
    const file = files.file;

    if (!file) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No image file provided' }),
      };
    }

    let ingredientList = [];
    if (typeof ingredients === 'string') {
      ingredientList = ingredients.split(',').map((ingredient) => ingredient.trim());
    }

    try {
      const cloudinaryResponse = await cloudinary.uploader.upload(file.filepath, {
        folder: 'assets', 
      });

      const imageUrl = cloudinaryResponse.secure_url;

      const { data, error: dbError } = await supabase
        .from('recipes')
        .insert([
          {
            title,
            description,
            category,
            ingredients: ingredientList,
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
        body: JSON.stringify({ recipe: data }),
      };
    } catch (error) {
      console.error('Error saving recipe to database:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to save recipe' }),
      };
    }
  });
};
