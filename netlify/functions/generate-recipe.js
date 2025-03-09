const { OpenAI } = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const { ingredients } = JSON.parse(event.body || '{}');
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Invalid ingredients' }) };
    }

    const prompt = `Generate a recipe using these ingredients: ${ingredients.join(', ')}`;

    // Request to OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
    });

    console.log('OpenAI Response:', response); // Log full response for debugging

    // Ensure the response structure is correct
    const recipe = response?.choices?.[0]?.message?.content?.trim() || 'No recipe generated';

    return {
      statusCode: 200,
      body: JSON.stringify({ recipe }),
    };
  } catch (error) {
    console.error('AI Recipe Generation Error:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed to generate recipe' }) };
  }
};
