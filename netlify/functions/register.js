import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export const handler = async (event) => {
  const { username, email, password } = JSON.parse(event.body);

  try {
    const { user, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      throw new Error(authError.message);
    }

    if (!user) {
      throw new Error('User registration failed, no user data returned');
    }

    const { error: dbError } = await supabase
      .from('users')
      .insert([
        {
          id: user.id,
          username,
          email,
        },
      ]);

    if (dbError) {
      throw new Error(dbError.message);
    }

    return {
      statusCode: 201,
      body: JSON.stringify({ user: { id: user.id, username, email } }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Registration failed', message: err.message }),
    };
  }
};
