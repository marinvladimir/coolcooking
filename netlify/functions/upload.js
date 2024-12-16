import Busboy from 'busboy';
import cloudinary from 'cloudinary';
import { createClient } from '@supabase/supabase-js';
import { parse } from 'querystring';
import { Buffer } from 'buffer';
import fs from 'fs';
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

// Handling multipart data with Busboy
export const handler = async (event, context) => {
  const busboy = new Busboy({ headers: event.headers });

  const fields = {};
  let fileData = null;

  return new Promise((resolve, reject) => {
    busboy.on('field', (fieldname, val) => {
      fields[fieldname] = val;
    });

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
      const chunks = [];
      file.on('data', (chunk) => chunks.push(chunk));
      file.on('end', async () => {
        fileData = Buffer.concat(chunks);

        try {
          // Upload file to Cloudinary
          const cloudinaryResponse = await cloudinary.uploader.upload_stream(
            {
              folder: 'assets',
              resource_type: 'auto', // Automatically detect file type (image, video, etc.)
            },
            async (error, result) => {
              if (error) {
                return reject({ statusCode: 500, body: JSON.stringify({ error: 'Failed to upload image' }) });
              }

              const imageUrl = result.secure_url;

              // Process form data and insert into Supabase
              const { title, description, category, ingredients, cooking_time } = fields;

              if (typeof ingredients === 'string') {
                fields.ingredients = ingredients.split(',').map((ingredient) => ingredient.trim());
              }

              const { data, error: dbError } = await supabase.from('recipes').insert([
                {
                  title: title || '',
                  description: description || '',
                  category: category || '',
                  ingredients: fields.ingredients || [],
                  cooking_time: cooking_time || '',
                  image: imageUrl,
                },
              ]);

              if (dbError) {
                return reject({
                  statusCode: 500,
                  body: JSON.stringify({ error: 'Failed to save recipe to database' }),
                });
              }

              return resolve({
                statusCode: 201,
                body: JSON.stringify({ recipe: data }),
              });
            }
          );

          // Pipe the image data into Cloudinary
          const stream = fs.createReadStream(fileData);
          stream.pipe(cloudinaryResponse);
        } catch (error) {
          console.error('Error processing file upload:', error);
          reject({
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal server error' }),
          });
        }
      });
    });

    busboy.on('finish', () => {
      // This runs when parsing is done
    });

    busboy.end(event.body);
  });
};
