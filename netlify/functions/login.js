import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export const handler = async (event, context) => {
  const { email, password } = JSON.parse(event.body);
  const errors = validationResult({ body: { email, password } });
  if (!errors.isEmpty()) {
    return {
      statusCode: 400,
      body: JSON.stringify({ errors: errors.array() }),
    };
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();  

    if (error || !data) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'User not found' }),
      };
    }

    const isPasswordValid = await bcrypt.compare(password, data.password);
    if (!isPasswordValid) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Invalid credentials' }),
      };
    }

    const token = jwt.sign({ id: data.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        token,
        user: { id: data.id, username: data.username, email: data.email },
      }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Login failed' }),
    };
  }
};
