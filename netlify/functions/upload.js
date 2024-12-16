import cloudinary from 'cloudinary';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import multer from 'multer';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Use memory storage to avoid writing to disk (for serverless environments)
const upload = multer({ storage: multer.memoryStorage() });

export const handler = async (event, context) => {
  console.log('Event received:', JSON.stringify(event));

  // Use multer to parse the incoming request
  const formData = new Promise((resolve, reject) => {
    upload.single('image')(event, context, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(event);
      }
    });
  });

  try {
    const { title, description, category, ingredients, cooking_time } = formData.body;
    const file = formData.file;

    if (!file) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No image file provided' }),
      };
    }

    // Process ingredients if they are a string
    let ingredientList = [];
    if (typeof ingredients === 'string') {
      ingredientList = ingredients.split(',').map((ingredient) => ingredient.trim());
    }

    // Upload the file directly to Cloudinary from memory
    const cloudinaryResponse = await cloudinary.uploader.upload_stream(
      { folder: 'assets' }, // Specify Cloudinary folder
      (error, result) => {
        if (error) {
          throw new Error('Cloudinary upload failed');
        }
        return result;
      }
    );

    // Send the buffer to Cloudinary
    cloudinaryResponse.end(file.buffer);

    const imageUrl = cloudinaryResponse.secure_url;

    // Insert the recipe into Supabase
    const { data, error: dbError } = await supabase
      .from('recipes')
      .insert([
        {
          title: title || '',
          description: description || '',
          category: category || '',
          ingredients: ingredientList,
          cooking_time: cooking_time || '',
          image: imageUrl,
        },
      ])
      .single();

    if (dbError) {
      console.error('Error inserting into Supabase:', dbError);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to save recipe to database' }),
      };
    }

    return {
      statusCode: 201,
      body: JSON.stringify({ recipe: data }),
    };
  } catch (error) {
    console.error('Error processing request:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to process request' }),
    };
  }
};
