import pool from './db';

export async function handler(event) {
  try {
    const result = await pool.query('SELECT * FROM recipes');
    return {
      statusCode: 200,
      body: JSON.stringify(result.rows),
    };
  } catch (err) {
    console.error('Error fetching recipes:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error fetching recipes' }),
    };
  }
}
