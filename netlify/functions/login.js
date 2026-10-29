import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import supabase from '../lib/supabase.js';
import { escapeLike, json, parseBody } from '../lib/http.js';

const INVALID_CREDENTIALS = 'Invalid email or password';

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method Not Allowed' });
  }

  const body = parseBody(event);
  const email = String(body?.email ?? '')
    .trim()
    .toLowerCase();
  const password = String(body?.password ?? '');

  if (!email || !password) {
    return json(400, { error: 'Email and password are required' });
  }

  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .ilike('email', escapeLike(email))
      .limit(1);

    if (error) throw error;
    const user = users[0];

    // Same response for unknown email and wrong password, so the endpoint
    // does not reveal which emails are registered.
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return json(401, { error: INVALID_CREDENTIALS });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    return json(200, {
      token,
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (err) {
    console.error('Login error:', err);
    return json(500, { error: 'Login failed. Please try again later.' });
  }
};
