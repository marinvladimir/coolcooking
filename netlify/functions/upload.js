import { IncomingForm } from 'formidable';
import cloudinary from 'cloudinary';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const handler = async (event, context) => {
  const form = new IncomingForm();
  const body = event.body; // Ensure the body is passed as raw data

  // If the body is already in raw format, parse it directly as a stream
  const parsedData = await new Promise((resolve, reject) => {
    form.parse(body, (err, fields, files) => {
      if (err) {
        reject(err);
      }
      resolve({ fields, files });
    });
  });

  const { fields, files } = parsedData;

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
};
