import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export const handler = async (event) => {
  const { username, email, password } = JSON.parse(event.body);

  try {
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
      .single(); 

    if (dbError) {
      throw new Error(dbError.message);
    }

    if (!data) {
      throw new Error('No data returned after insert');
    }

    return {
      statusCode: 201,
      body: JSON.stringify({ user: { id: data.id, username, email } }),
    };
  } catch (err) {
    console.error('Error registering user:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Registration failed', message: err.message }),
    };
  }
};