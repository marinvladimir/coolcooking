import formidable from 'formidable';
import cloudinary from 'cloudinary';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export const handler = async (event, context) => {
  console.log('Event received:', JSON.stringify(event));

  const form = new formidable.IncomingForm();
  form.keepExtensions = true;

  const formData = new Promise((resolve, reject) => {
    form.parse(event, (err, fields, files) => {
      if (err) {
        reject(err);
      } else {
        resolve({ fields, files });
      }
    });
  });

  try {
    const { fields, files } = await formData;

    const { title, description, category, ingredients, cooking_time } = fields;
    const file = files.image;

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

    const cloudinaryResponse = await cloudinary.uploader.upload(file.path, {
      folder: 'assets',
    });

    const imageUrl = cloudinaryResponse.secure_url;

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
