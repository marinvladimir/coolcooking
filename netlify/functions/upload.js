import cloudinary from 'cloudinary';
import pool from './db';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const handler = async (event, context) => {
  const { title, description, category, ingredients, cooking_time } =
    JSON.parse(event.body);
  const file = event.body.file;

  if (!file) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'No image file provided' }),
    };
  }

  try {
    const cloudinaryResponse = await cloudinary.uploader.upload(file.path, {
      folder: 'assets',
    });

    const imageUrl = cloudinaryResponse.secure_url;

    const result = await pool.query(
      `INSERT INTO recipes (title, description, category, ingredients, cooking_time, image)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [title, description, category, ingredients, cooking_time, imageUrl]
    );

    return {
      statusCode: 201,
      body: JSON.stringify({ recipe: result.rows[0] }),
    };
  } catch (error) {
    console.error('Error saving recipe to database:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to save recipe' }),
    };
  }
};
