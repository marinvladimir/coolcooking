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

  // Make sure to pass the raw body to formidable
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(event.rawBody, (err, fields, files) => {
    if (err) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to process the form data' }),
      };
    }

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

    // Upload the file to Cloudinary
    cloudinary.uploader.upload(file.path, { folder: 'assets' })
      .then((cloudinaryResponse) => {
        const imageUrl = cloudinaryResponse.secure_url;

        // Insert recipe data into Supabase
        supabase
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
          .then(({ data, error: dbError }) => {
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
          })
          .catch((error) => {
            console.error('Error saving to Supabase:', error);
            return {
              statusCode: 500,
              body: JSON.stringify({ error: 'Failed to save recipe' }),
            };
          });
      })
      .catch((uploadError) => {
        console.error('Error uploading image to Cloudinary:', uploadError);
        return {
          statusCode: 500,
          body: JSON.stringify({ error: 'Failed to upload image' }),
        };
      });
  });
};
