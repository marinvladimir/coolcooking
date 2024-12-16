import pool from './db';
import bcrypt from 'bcrypt';

export const handler = async (event) => {
  const { username, email, password } = JSON.parse(event.body);

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email`,
      [username, email, hashedPassword]
    );

    return {
      statusCode: 201,
      body: JSON.stringify({ user: result.rows[0] }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Registration failed' }),
    };
  }
};
