import express from 'express';
import pkg from 'pg';
const { Pool } = pkg;
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import cors from 'cors';
import multer from 'multer';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';

dotenv.config();

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
});

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({ dest: 'assets/' });

app.get('/recipes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM recipes');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching recipes:', err);
    res.status(500).json({ message: 'Error fetching recipes' });
  }
});

app.post('/upload', upload.single('image'), async (req, res) => {
  let { title, description, category, ingredients, cooking_time } = req.body;

  if (typeof ingredients === 'string') {
    ingredients = ingredients.split(',').map((ingredient) => ingredient.trim());
  }

  title = title && typeof title === 'string' ? title : '';
  category = category && typeof category === 'string' ? category : '';
  description =
    description && typeof description === 'string' ? description : '';
  cooking_time =
    cooking_time && typeof cooking_time === 'string' ? cooking_time : '';

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const cloudinaryResponse = await cloudinary.uploader.upload(req.file.path, {
      folder: 'assets',
    });

    const imageUrl = cloudinaryResponse.secure_url;

    const result = await pool.query(
      `INSERT INTO recipes (title, description, category, ingredients, cooking_time, image)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [title, description, category, ingredients, cooking_time, imageUrl]
    );

    res.status(201).json({ recipe: result.rows[0] });
  } catch (error) {
    console.error('Error saving recipe to database:', error);
    res.status(500).json({ error: 'Failed to save recipe' });
  }
});

app.post(
  '/register',
  [
    body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Invalid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await pool.query(
        `INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email`,
        [username, email, hashedPassword]
      );

      res.status(201).json({ user: result.rows[0] });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Registration failed' });
    }
  }
);

app.post(
  '/login',
  [
    body('email').isEmail().withMessage('Invalid email'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [
        email,
      ]);
      const user = result.rows[0];

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });
      res.json({
        token,
        user: { id: user.id, username: user.username, email: user.email },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Login failed' });
    }
  }
);

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token)
    return res.status(401).json({ error: 'Authorization token required' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid or expired token' });
  }
};

app.get('/favorites/:recipeId', authenticate, async (req, res) => {
  const { recipeId } = req.params;
  const userId = req.user.id;

  try {
    const result = await pool.query(
      'SELECT * FROM favorites WHERE user_id = $1 AND recipe_id = $2',
      [userId, recipeId]
    );

    if (result.rows.length > 0) {
      return res.json({ isFavorite: true });
    } else {
      return res.json({ isFavorite: false });
    }
  } catch (err) {
    console.error('Error checking favorite:', err);
    res.status(500).json({ error: 'Error checking favorite' });
  }
});

app.post('/favorites/:recipeId', authenticate, async (req, res) => {
  const { recipeId } = req.params;
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `INSERT INTO favorites (user_id, recipe_id) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *`,
      [userId, recipeId]
    );

    if (result.rowCount === 0) {
      return res.status(409).json({ error: 'Recipe already in favorites' });
    }

    res.status(201).json({ favorite: result.rows[0] });
  } catch (err) {
    console.error('Error adding to favorites:', err);
    res.status(500).json({ error: 'Failed to add recipe to favorites' });
  }
});

app.delete('/favorites/:recipeId', authenticate, async (req, res) => {
  const { recipeId } = req.params;
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `DELETE FROM favorites WHERE user_id = $1 AND recipe_id = $2 RETURNING *`,
      [userId, recipeId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Favorite not found' });
    }

    res.json({ message: 'Removed from favorites' });
  } catch (err) {
    console.error('Error removing from favorites:', err);
    res.status(500).json({ error: 'Failed to remove recipe from favorites' });
  }
});

app.get('/favorites', authenticate, async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `SELECT r.* FROM recipes r
       JOIN favorites f ON r.id = f.recipe_id
       WHERE f.user_id = $1`,
      [userId]
    );

    res.json({ favorites: result.rows });
  } catch (err) {
    console.error('Error fetching favorites:', err);
    res.status(500).json({ error: 'Failed to fetch favorite recipes' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
