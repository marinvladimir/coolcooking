import axios from 'axios';

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  const { ingredients } = JSON.parse(event.body || '{}');

  if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid ingredients' }),
    };
  }

  const prompt = `Generate a recipe using these ingredients: ${ingredients.join(', ')}`;

  try {
    // Using Axios to send the request
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/gpt2',
      {
        inputs: prompt,
        parameters: { max_length: 100 },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = response.data;
    console.log('Hugging Face Response:', data);

    const recipe = data[0]?.generated_text || 'No recipe generated';

    return {
      statusCode: 200,
      body: JSON.stringify({ recipe }),
    };
  } catch (error) {
    console.error('AI Recipe Generation Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to generate recipe' }),
    };
  }
};
