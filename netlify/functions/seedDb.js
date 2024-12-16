import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'cooking',
  password: 'postgres',
  port: 5432,
});

const seedDatabase = async () => {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS recipes (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255),
        description TEXT,
        category TEXT,
        ingredients TEXT[],
        cooking_time VARCHAR(50),
        image VARCHAR(255)
      );
    `;

    const createUsersTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
      );
    `;

    const favoritesQuery = `
      CREATE TABLE IF NOT EXISTS favorites (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        recipe_id INTEGER NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
        UNIQUE(user_id, recipe_id)
      );
    `;

    console.log('Creating recipes table...');
    await pool.query(createTableQuery);

    console.log('Creating users table...');
    await pool.query(createUsersTableQuery);

    console.log('Creating favorites table...');
    await pool.query(favoritesQuery);

    const checkDataQuery = 'SELECT COUNT(*) FROM recipes';
    const res = await pool.query(checkDataQuery);
    const count = parseInt(res.rows[0].count);

    if (count === 0) {
      const insertDataQuery = `
        INSERT INTO recipes (title, description, category, ingredients, cooking_time, image)
        VALUES
          ('Burrito and Cheese', 'A healthy burrito with cheese.', 'mainDishes', ARRAY['Carrots', 'Potatoes', 'Onions'], '30', 'https://res.cloudinary.com/drvntbfxu/image/upload/v1734008941/assets/w7mw9q6ahf49hrg2kkuo.png'),
          ('Meatball and Rice', 'A Meatball and Rice.', 'mainDishes', ARRAY['Chicken', 'Carrots', 'Garlic'], '45', 'https://res.cloudinary.com/drvntbfxu/image/upload/v1734009311/assets/by39rhttfj5v9jcjxhee.png');
      `;
      console.log('Inserting seed data into recipes table...');
      await pool.query(insertDataQuery);
      console.log('Database seeded successfully');
    } else {
      console.log('Database already populated');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    pool.end();
    process.exit(0);
  }
};

seedDatabase()
  .then(() => console.log('Seed script completed.'))
  .catch((err) => console.error('Error running seed script:', err));
