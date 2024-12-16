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
  console.log('Event received:', JSON.stringify(event));

  // Parse raw body if it's binary data (e.g., file upload)
  const body = event.isBase64Encoded ? Buffer.from(event.body, 'base64') : event.body;

  const form = new formidable.IncomingForm();
  form.keepExtensions = true; // Keep file extensions on upload
  form.uploadDir = '/tmp'; // Set the temporary directory to store the file (for AWS Lambda)

  try {
    // Using a promise-based approach for form parsing
    const parsedData = await new Promise((resolve, reject) => {
      form.parse(body, (err, fields, files) => {
        if (err) {
          reject(err);
        } else {
          resolve({ fields, files });
        }
      });
    });

    const { fields, files } = parsedData;
    const { title, description, category, ingredients, cooking_time } = fields;
    const file = files.file;

    if (!file) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No image file provided' }),
      };
    }

    console.log('Ingredients:', ingredients);
    console.log('File:', file);

    let ingredientList = [];
    if (typeof ingredients === 'string') {
      ingredientList = ingredients.split(',').map((ingredient) => ingredient.trim());
    }

    // Upload the file to Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(file.filepath, {
      folder: 'assets', // Specify Cloudinary folder
    });

    const imageUrl = cloudinaryResponse.secure_url;

    // Insert the recipe into Supabase
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
