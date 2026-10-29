// Empty by default: the Netlify functions are served from the same origin
// (both in production and with `netlify dev`).
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

export const CLOUDINARY_CLOUD_NAME =
  import.meta.env.VITE_CLOUDINARY_CLOUD_NAME ?? 'drvntbfxu';

export const CLOUDINARY_UPLOAD_PRESET =
  import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET ?? 'cooking';
