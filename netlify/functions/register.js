import bcrypt from 'bcrypt';
import supabase from '../lib/supabase.js';
import { escapeLike, json, parseBody } from '../lib/http.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method Not Allowed' });
  }

  const body = parseBody(event);
  const username = String(body?.username ?? '').trim();
  const email = String(body?.email ?? '')
    .trim()
    .toLowerCase();
  const password = String(body?.password ?? '');

  if (username.length < 2 || username.length > 40) {
    return json(400, { error: 'Username must be 2–40 characters long' });
  }
  if (!EMAIL_PATTERN.test(email)) {
    return json(400, { error: 'Please enter a valid email address' });
  }
  if (password.length < 6) {
    return json(400, { error: 'Password must be at least 6 characters' });
  }

  try {
    const { data: existingUsers, error: fetchError } = await supabase
      .from('users')
      .select('id')
      .ilike('email', escapeLike(email));

    if (fetchError) throw fetchError;

    if (existingUsers.length > 0) {
      return json(409, { error: 'An account with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error: dbError } = await supabase
      .from('users')
      .insert([{ username, email, password: hashedPassword }])
      .select('id, username, email')
      .single();

    if (dbError) throw dbError;

    return json(201, { user: data });
  } catch (err) {
    console.error('Error registering user:', err);
    return json(500, { error: 'Registration failed. Please try again later.' });
  }
};
