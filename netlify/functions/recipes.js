import supabase from './db';

export async function handler(event) {
  try {
    const { data, error } = await supabase
      .from('recipes')
      .select('*'); // Fetch all records from the 'recipes' table

    if (error) {
      throw error; // If there is an error, it will be caught in the catch block
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data), // Return the fetched data as JSON
    };
  } catch (err) {
    console.error('Error fetching recipes:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error fetching recipes' }),
    };
  }
}
