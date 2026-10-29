import jwt from 'jsonwebtoken';

const headers = { 'Content-Type': 'application/json' };

export const json = (statusCode, body) => ({
  statusCode,
  headers,
  body: JSON.stringify(body),
});

export const parseBody = (event) => {
  try {
    return JSON.parse(event.body || '{}');
  } catch {
    return null;
  }
};

// Returns the user id from a valid "Authorization: Bearer <jwt>" header,
// or null when the header is missing, malformed or the token has expired.
export const getUserId = (event) => {
  const authHeader =
    event.headers?.authorization || event.headers?.Authorization || '';
  if (!authHeader.startsWith('Bearer ')) return null;

  try {
    const decoded = jwt.verify(authHeader.slice(7), process.env.JWT_SECRET);
    return decoded.id ?? null;
  } catch {
    return null;
  }
};

export const unauthorized = () =>
  json(401, { error: 'Your session has expired. Please log in again.' });

// Escapes the LIKE wildcards so an email can be matched case-insensitively
// with `ilike` without "_" or "%" in the address acting as patterns.
export const escapeLike = (value) => value.replace(/[\\%_]/g, '\\$&');
