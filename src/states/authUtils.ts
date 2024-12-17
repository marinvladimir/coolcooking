import { jwtDecode } from 'jwt-decode';

export const isTokenValid = (token: string | null): boolean => {
  if (!token) return false;

  try {
    const decodedToken: any = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decodedToken.exp > currentTime;
  } catch (error) {
    console.error('Invalid token:', error);
    return false;
  }
};

export const getToken = (): string | null => localStorage.getItem('token');

export const isAuthenticated = (): boolean => {
  const token = getToken();
  const valid = isTokenValid(token);
  if (!valid) {
    localStorage.removeItem('token');
  }
  return valid;
};

export const logout = () => {
  localStorage.removeItem('token');
};
