import { IncomingForm } from 'formidable';
import cloudinary from 'cloudinary';
import multer from 'multer';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Cloudinary setup
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Supabase setup
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Middleware to handle multipart form data
const storage = multer.memoryStorage(); // Store file in memory
const upload = multer({ storage }).single('image'); // 'image' is the field name for the file

export const handler = async (event, context) => {
  return new Promise((resolve, reject) => {
    // Manually handle body
    upload(event, context, async (err) => {
      if (err) {
        console.error('Multer upload error:', err);
        return resolve({
          statusCode: 500,
          body: JSON.stringify({ error: 'Failed to process the form' }),
        });
      }

      // Extract form data and file
      const { title, description, category, ingredients, cooking_time } = event.body;
      const file = event.file;

      if (!file) {
        return resolve({
          statusCode: 400,
          body: JSON.stringify({ error: 'No image file provided' }),
        });
      }

      // Parse ingredients into an array
      let ingredientList = [];
      if (typeof ingredients === 'string') {
        ingredientList = ingredients.split(',').map((ingredient) => ingredient.trim());
      }

      // Upload image to Cloudinary
      try {
        const cloudinaryResponse = await cloudinary.uploader.upload(file.path, {
          folder: 'assets',
        });

        const imageUrl = cloudinaryResponse.secure_url;

        // Insert recipe data into Supabase
        const { data, error: dbError } = await supabase.from('recipes').insert([
          {
            title: title || '',
            description: description || '',
            category: category || '',
            ingredients: ingredientList,
            cooking_time: cooking_time || '',
            image: imageUrl,
          },
        ]);

        if (dbError) {
          console.error('Error inserting into Supabase:', dbError);
          return resolve({
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to save recipe to database' }),
          });
        }

        return resolve({
          statusCode: 201,
          body: JSON.stringify({ recipe: data }),
        });
      } catch (uploadError) {
        console.error('Error uploading image to Cloudinary:', uploadError);
        return resolve({
          statusCode: 500,
          body: JSON.stringify({ error: 'Failed to upload image' }),
        });
      }
    });
  });
};
