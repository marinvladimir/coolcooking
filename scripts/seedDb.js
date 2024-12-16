import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const seedDatabase = async () => {
  try {
    const { error: recipesError } = await supabase.rpc('create_recipes_table');
    const { error: usersError } = await supabase.rpc('create_users_table');
    const { error: favoritesError } = await supabase.rpc('create_favorites_table');

    if (recipesError || usersError || favoritesError) {
      throw new Error('Error creating tables');
    }

    const { data: countData, error: countError } = await supabase
      .from('recipes')
      .select('id', { count: 'exact' })
      .single();

    if (countError) {
      throw new Error('Error checking recipes count');
    }

    if (countData === 0) {
      const { error: insertError } = await supabase
        .from('recipes')
        .upsert([
          {
            title: 'Burrito and Cheese',
            description: 'A healthy burrito with cheese.',
            category: 'mainDishes',
            ingredients: ['Carrots', 'Potatoes', 'Onions'],
            cooking_time: '30',
            image: 'https://res.cloudinary.com/drvntbfxu/image/upload/v1734008941/assets/w7mw9q6ahf49hrg2kkuo.png',
          },
          {
            title: 'Meatball and Rice',
            description: 'A Meatball and Rice.',
            category: 'mainDishes',
            ingredients: ['Chicken', 'Carrots', 'Garlic'],
            cooking_time: '45',
            image: 'https://res.cloudinary.com/drvntbfxu/image/upload/v1734009311/assets/by39rhttfj5v9jcjxhee.png',
          },
        ]);

      if (insertError) {
        throw new Error('Error inserting seed data');
      }
      console.log('Database seeded successfully');
    } else {
      console.log('Database already populated');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

export const handler = async (event) => {
  await seedDatabase();
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Database seeded successfully' }),
  };
};
