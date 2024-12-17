import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export const handler = async (event) => {
  const { username, email, password } = JSON.parse(event.body);

  try {
    const { data: existingUsers, error: fetchError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email);

    if (fetchError) {
      throw new Error(`Error checking existing email: ${fetchError.message}`);
    }

    if (existingUsers.length > 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Registration failed',
          message: 'Email already exists',
        }),
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error: dbError } = await supabase
      .from('users')
      .insert([
        {
          username,
          email,
          password: hashedPassword,
        },
      ])
      .select();

    if (dbError) {
      throw new Error(dbError.message);
    }

    if (!data || data.length === 0) {
      throw new Error('No data returned after insert');
    }

    return {
      statusCode: 201,
      body: JSON.stringify({
        user: {
          id: data[0].id,
          username,
          email,
        },
      }),
    };
  } catch (err) {
    console.error('Error registering user:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Registration failed',
        message: err.message,
      }),
    };
  }
};
