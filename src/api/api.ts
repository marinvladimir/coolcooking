import axios, { AxiosError } from 'axios';
import {
  API_BASE_URL,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_UPLOAD_PRESET,
} from '../config';
import { AUTH_EXPIRED_EVENT, getToken } from '../states/authUtils';
import type { AuthUser, NewRecipe, Recipe } from '../types';

const api = axios.create({
  baseURL: `${API_BASE_URL}/.netlify/functions`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 20000,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(undefined, (error: AxiosError) => {
  if (error.response?.status === 401 && error.config?.headers?.Authorization) {
    window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
  }
  return Promise.reject(error);
});

/** Turns any thrown value into a message that is safe to show to the user. */
export const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return 'Cannot reach the server. Check your connection and try again.';
    }
    const data = error.response.data as { error?: string; message?: string };
    return data?.error || data?.message || fallback;
  }
  return error instanceof Error && error.message ? error.message : fallback;
};

const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  );
  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data.secure_url) {
    throw new Error('Image upload failed. Please try another image.');
  }
  return data.secure_url as string;
};

export const apiService = {
  login: async (data: { email: string; password: string }) => {
    const response = await api.post<{ token: string; user: AuthUser }>(
      '/login',
      data
    );
    return response.data;
  },

  register: async (data: {
    username: string;
    email: string;
    password: string;
  }) => {
    const response = await api.post<{ user: AuthUser }>('/register', data);
    return response.data;
  },

  fetchRecipes: async () => {
    const response = await api.get<Recipe[]>('/recipes');
    return response.data ?? [];
  },

  fetchFavorites: async () => {
    const response = await api.get<{ favorites: Recipe[] }>('/favorites');
    return response.data.favorites ?? [];
  },

  checkIfFavorite: async (recipeId: number) => {
    const response = await api.get<{ isFavorite: boolean }>('/favorite', {
      params: { recipeId },
    });
    return response.data.isFavorite;
  },

  /** Sets the favorite state and returns the new value. */
  setFavorite: async (recipeId: number, favorite: boolean) => {
    const config = { params: { recipeId } };
    if (favorite) {
      await api.post('/favorite', null, config);
    } else {
      await api.delete('/favorite', config);
    }
    return favorite;
  },

  uploadRecipe: async (recipe: NewRecipe, image: File) => {
    const imageUrl = await uploadImage(image);
    const response = await api.post<{ recipe: Recipe }>('/upload', {
      ...recipe,
      image_url: imageUrl,
    });
    return response.data.recipe;
  },
};
