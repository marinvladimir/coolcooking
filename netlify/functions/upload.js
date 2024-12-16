import { createClient } from '@supabase/supabase-js';
import cloudinary from 'cloudinary';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const handler = async (event, context) => {
  const body = event.body;

  if (!body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'No data received' }),
    };
  }

  const form = new IncomingForm();

  form.parse(body, async (err, fields, files) => {
    if (err) {
      console.error('Error parsing form:', err);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Failed to process form data' }),
      };
    }

    const { title, description, category, ingredients, cooking_time } = fields;
    const imageFile = files.image ? files.image[0] : null;
    const parsedIngredients = typeof ingredients === 'string' ? ingredients.split(',').map(ingredient => ingredient.trim()) : [];

    if (!imageFile) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No image file provided' }),
      };
    }

    try {
      const cloudinaryResponse = await cloudinary.uploader.upload(imageFile.filepath, {
        folder: 'assets',
      });

      const imageUrl = cloudinaryResponse.secure_url;
      const { data, error: insertError } = await supabase
        .from('recipes')
        .insert([
          {
            title: title || '',
            description: description || '',
            category: category || '',
            ingredients: JSON.stringify(parsedIngredients),
            cooking_time: cooking_time || '',
            image_url: imageUrl,
          },
        ])
        .single();

      if (insertError) {
        return {
          statusCode: 500,
          body: JSON.stringify({ error: 'Failed to save recipe in database' }),
        };
      }

      return {
        statusCode: 201,
        body: JSON.stringify({ recipe: data }),
      };
    } catch (error) {
      console.error('Error uploading to Cloudinary or saving recipe:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to upload image or save recipe' }),
      };
    }
  });
};
