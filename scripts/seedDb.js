// Creates the tables (through Supabase RPC functions) and inserts two sample
// recipes when the recipes table is empty. Run manually: `npm run seed`.
import supabase from '../netlify/lib/supabase.js';

const SAMPLE_RECIPES = [
  {
    title: 'Burrito and Cheese',
    description: 'A healthy burrito with cheese.',
    category: 'mainDishes',
    ingredients: ['Carrots', 'Potatoes', 'Onions'],
    cooking_time: '30',
    image:
      'https://res.cloudinary.com/drvntbfxu/image/upload/v1734008941/assets/w7mw9q6ahf49hrg2kkuo.png',
  },
  {
    title: 'Meatball and Rice',
    description: 'A Meatball and Rice.',
    category: 'mainDishes',
    ingredients: ['Chicken', 'Carrots', 'Garlic'],
    cooking_time: '45',
    image:
      'https://res.cloudinary.com/drvntbfxu/image/upload/v1734009311/assets/by39rhttfj5v9jcjxhee.png',
  },
];

const callRpc = async (name) => {
  const { error } = await supabase.rpc(name);
  if (error) throw new Error(`${name} failed: ${error.message}`);
  console.log(`${name}: ok`);
};

const seedDatabase = async () => {
  await callRpc('create_recipes_table');
  await callRpc('create_users_table');
  await callRpc('create_favorites_table');

  const { count, error: countError } = await supabase
    .from('recipes')
    .select('id', { count: 'exact', head: true });

  if (countError) throw new Error('Error checking recipes count');

  if (count > 0) {
    console.log('Database already populated');
    return;
  }

  const { error: insertError } = await supabase
    .from('recipes')
    .insert(SAMPLE_RECIPES);

  if (insertError) throw new Error('Error inserting seed data');
  console.log('Database seeded successfully');
};

seedDatabase().catch((error) => {
  console.error('Error seeding database:', error);
  process.exit(1);
});
