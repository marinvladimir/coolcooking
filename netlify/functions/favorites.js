import pool from './db';

export const handler = async (event) => {
  const { recipeId } = event.pathParameters;
  const userId = event.requestContext.authorizer.claims.sub;

  if (event.httpMethod === 'GET') {
    try {
      const result = await pool.query(
        'SELECT * FROM favorites WHERE user_id = $1 AND recipe_id = $2',
        [userId, recipeId]
      );

      if (result.rows.length > 0) {
        return {
          statusCode: 200,
          body: JSON.stringify({ isFavorite: true }),
        };
      } else {
        return {
          statusCode: 200,
          body: JSON.stringify({ isFavorite: false }),
        };
      }
    } catch (err) {
      console.error('Error checking favorite:', err);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Error checking favorite' }),
      };
    }
  } else if (event.httpMethod === 'POST') {
    try {
      const result = await pool.query(
        `INSERT INTO favorites (user_id, recipe_id) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *`,
        [userId, recipeId]
      );

      if (result.rowCount === 0) {
        return {
          statusCode: 409,
          body: JSON.stringify({ error: 'Recipe already in favorites' }),
        };
      }

      return {
        statusCode: 201,
        body: JSON.stringify({ favorite: result.rows[0] }),
      };
    } catch (err) {
      console.error('Error adding to favorites:', err);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to add recipe to favorites' }),
      };
    }
  }
};
