import { IncomingForm } from 'formidable';
import cloudinary from 'cloudinary';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_API_KEY);

// Initialize Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const handler = async (event, context) => {
  const form = new IncomingForm();
  form.parse(event.body, async (err, fields, files) => {
    if (err) {
      console.error('Error parsing form:', err);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Failed to process form data' }),
      };
    }

    const { title, description, category, ingredients, cooking_time } = fields;
    const imageFile = files.image[0];

    // Ensure ingredients are formatted properly
    const parsedIngredients = typeof ingredients === 'string' ? ingredients.split(',').map(ingredient => ingredient.trim()) : [];

    // Check if the required fields are present
    if (!imageFile) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No image file provided' }),
      };
    }

    try {
      // Upload image to Cloudinary
      const cloudinaryResponse = await cloudinary.uploader.upload(imageFile.filepath, {
        folder: 'assets',
      });

      const imageUrl = cloudinaryResponse.secure_url;

      // Insert the data into Supabase
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

      // Successfully saved the recipe
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

  // In serverless functions, you need to return an empty response initially while the form is being parsed.
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Processing request' }),
  };
};
