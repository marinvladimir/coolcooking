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
    if (config.url && (config.url.startsWith('/favorites') || config.url.startsWith('/favorite'))) {
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

  fetchFavorites: async () => {
    try {
      const response = await api.get('/favorites');
      return response.data.favorites;
    } catch (error) {
      console.error('Error fetching favorites:', error);
      showErrorNotification('Failed to fetch favorites');
      throw error;
    }
  },

checkIfFavorite: async (recipeId: number) => {
  try {
    const response = await api.get(`/favorite?recipeId=${recipeId}`);
    return response.data;
  } catch (error) {
    console.error('Error checking if favorite:', error);
    throw error;
  }
},

toggleFavorite: async (recipeId: number, isFavorite: boolean) => {
  try {
    const url = `/favorite?recipeId=${recipeId}`;  

    if (isFavorite) {
      const response = await api.delete(url); 
      if (response.status === 200) {
        showSuccessNotification('Removed from favorites');
        return false;
      }
    } else {
      const response = await api.post(url); 
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
  if (!file) {
    showErrorNotification('No image file provided!');
    throw new Error('No image file provided!');
  }

  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'cooking'); 

    const response = await fetch('https://api.cloudinary.com/v1_1/drvntbfxu/image/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    return data.secure_url; 
  };

  try {
    const imageUrl = await uploadToCloudinary(file);
    const formData = new FormData();
    formData.append('image_url', imageUrl);
    formData.delete('image');

    Object.keys(data).forEach((key) => {
      if (Array.isArray(data[key])) {
        formData.append(key, data[key].join(', '));
      } else {
        formData.append(key, String(data[key]));
      }
    });
    const response = await api.post('/upload', formData, {
      headers: { 'Content-Type': 'application/json' }, 
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
}

};
