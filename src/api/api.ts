import axios from 'axios';
import {
  showErrorNotification,
  showSuccessNotification,
} from '../utils/notification';
import { API_BASE_URL } from '../config';

const BASE_URL = `${API_BASE_URL}/.netlify/functions/`;

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    if (config.url && config.url.startsWith('/favorites')) {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const apiService = {
  login: async (data: { email: string; password: string }) => {
    try {
      const response = await api.post('/login', data);
      showSuccessNotification('Login successful!');
      return response.data;
    } catch (error) {
      console.error('Error during login:', error);
      showErrorNotification('Login failed. Please check your credentials.');
      throw error;
    }
  },

  register: async (data: {
    username: string;
    email: string;
    password: string;
  }) => {
    try {
      const response = await api.post('/register', data);
      showSuccessNotification('Registration successful! Please log in.');
      return response.data;
    } catch (error) {
      console.error('Error during registration:', error);
      showErrorNotification('Registration failed. Please try again.');
      throw error;
    }
  },

  fetchRecipes: async () => {
    try {
      const response = await api.get('/recipes');
      showSuccessNotification('Successfully received recipes!');
      return response.data;
    } catch (error) {
      console.error('Error fetching recipes:', error);
      showErrorNotification('Failed to fetch recipes');
      throw error;
    }
  },

  checkIfFavorite: async (recipeId: number) => {
    try {
      const response = await api.get(`/favorites/${recipeId}`);
      return response.data;
    } catch (error) {
      console.error('Error checking if favorite:', error);
      throw error;
    }
  },

  toggleFavorite: async (recipeId: number, isFavorite: boolean) => {
    try {
      if (isFavorite) {
        const response = await api.delete(`/favorites/${recipeId}`);
        if (response.status === 200) {
          showSuccessNotification('Removed from favorites');
          return false;
        }
      } else {
        const response = await api.post(`/favorites/${recipeId}`);
        if (response.status === 200 || response.status === 201) {
          showSuccessNotification('Added to favorites');
          return true;
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      showErrorNotification('Error toggling favorite');
      throw error;
    }
  },

  uploadRecipe: async (data: Record<string, any>, file?: File | null) => {
    const formData = new FormData();

    if (file) {
      formData.append('image', file);
    }

    Object.keys(data).forEach((key) => {
      if (Array.isArray(data[key])) {
        formData.append(key, data[key].join(', '));
      } else {
        formData.append(key, String(data[key]));
      }
    });

    try {
      const response = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 200 || response.status === 201) {
        showSuccessNotification('Successfully submitted new recipe!');
        return response.data;
      } else {
        showErrorNotification('Error adding the recipe!');
        throw new Error('Error adding the recipe');
      }
    } catch (error) {
      showErrorNotification('Request failed for adding the new recipe!');
      console.error('Request failed', error);
      throw error;
    }
  },
};
